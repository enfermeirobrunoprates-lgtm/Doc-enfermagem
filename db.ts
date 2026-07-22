import { auth, db as firestoreDb, doc, setDoc, deleteDoc, collection, getDocs, query } from "./firebase";

export interface Patient {
  id?: number;
  name: string;
  bed: string; // Bed or address
  age: string;
  diagnosis: string;
  comorbidity: string;
  createdAt: string;
}

export interface Evolution {
  id?: number;
  patientId: number;
  date: string;
  narrative: string;
  templateData?: {
    estadoGeral: string;
    neurologico: string;
    respiratorio: string;
    pa: string;
    fc: string;
    fr: string;
    temp: string;
    spo2: string;
    digestivo: string;
    urinario: string;
    pele: string;
    intercorrencias: string;
  };
  aiEvolution: string;
  aiSae: string;
  aiCarePlan: string;
  recommendedScales: string[];
  isPrancheta?: boolean;
  pranchetaType?: "hospitalar" | "domiciliar";
  pranchetaData?: any;
  manualPatientData?: any;
}

export interface EscalaClinica {
  id?: number;
  patientId: number;
  scaleType: string;
  scaleName: string;
  date: string;
  score: number;
  result: string;
  answers: Record<string, any>;
  manualPatientData?: any;
}

export interface Plantao {
  id?: number;
  month: string; // "YYYY-MM"
  professionals: { id: string; name: string; role: string; hours: number }[];
  schedule: Record<string, Record<string, string>>; // Record<profId, Record<day, shiftName>>
  createdAt: string;
}

export interface DocumentoLivre {
  id?: number;
  title: string;
  content: string;
  date: string;
  content_json?: string;
  mind_maps?: string;
  canvas_layers?: string;
  template_origin?: string;
  version_history?: string;
  updated_at?: string;
}

export interface AnotacaoPlantao {
  id?: number;
  patientId: number;
  date: string;
  originalText: string;
  revisedText?: string;
  isRevised: boolean;
  manualPatientData?: any;
}

export interface LesaoFerida {
  id?: number;
  patientId: number;
  date: string;
  location: string;
  type: string;
  stage?: string;
  tissueType: string;
  exudate: string;
  edges: string;
  signsOfInfection: string[];
  sizeLength: string;
  sizeWidth: string;
  conducts: string;
  evolutionNote: string;
  fisiopatologia?: string;
  planoTratamento?: string;
  tratamentoPasso?: string;
  indicacoesContraindicacoes?: string;
  coberturasRecomendadas?: string;
  medicamentosTopicos?: string;
  manualPatientData?: any;
}

export interface RegistroVacina {
  id?: number;
  patientId: number;
  date: string;
  vaccineName: string;
  dose: string;
  batch: string;
  applicator: string;
  manualPatientData?: any;
}

import { onAuthStateChanged } from "firebase/auth";

export type SyncStatusType = "synchronized" | "syncing" | "offline" | "pending";

export interface SyncQueueItem {
  id?: number;
  collectionName: string;
  action: "set" | "delete";
  recordId: number;
  data?: any;
  timestamp: number;
}

const DB_NAME = "apoio_enfermagem_db_v2";
const DB_VERSION = 2;

let currentSyncStatus: SyncStatusType = typeof navigator !== "undefined" && navigator.onLine ? "synchronized" : "offline";
const syncStatusListeners = new Set<(status: SyncStatusType) => void>();

export function getSyncStatus(): SyncStatusType {
  return currentSyncStatus;
}

export function subscribeToSyncStatus(listener: (status: SyncStatusType) => void): () => void {
  syncStatusListeners.add(listener);
  listener(currentSyncStatus);
  return () => {
    syncStatusListeners.delete(listener);
  };
}

function triggerSyncStatusChange(status: SyncStatusType) {
  currentSyncStatus = status;
  syncStatusListeners.forEach(l => l(status));
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent("sync-status-changed", { detail: status }));
  }
}

let isFlushing = false;

export async function flushSyncQueue(): Promise<void> {
  if (isFlushing) return;
  const user = auth.currentUser;
  if (!user) {
    triggerSyncStatusChange(typeof navigator !== "undefined" && navigator.onLine ? "synchronized" : "offline");
    return;
  }
  if (typeof navigator !== "undefined" && !navigator.onLine) {
    triggerSyncStatusChange("offline");
    return;
  }

  isFlushing = true;
  triggerSyncStatusChange("syncing");

  try {
    const db = await openDatabase();
    
    // Read all items from the sync queue
    const queueItems = await new Promise<SyncQueueItem[]>((resolve, reject) => {
      const transaction = db.transaction("sync_queue", "readonly");
      const store = transaction.objectStore("sync_queue");
      const request = store.getAll();
      request.onsuccess = () => resolve(request.result || []);
      request.onerror = () => reject(request.error);
    });

    if (queueItems.length === 0) {
      triggerSyncStatusChange("synchronized");
      isFlushing = false;
      return;
    }

    // Process each queue item in order
    for (const item of queueItems) {
      try {
        const { collectionName, action, recordId, data } = item;
        const docRef = doc(firestoreDb, "users", user.uid, collectionName, String(recordId));

        if (action === "delete") {
          await deleteDoc(docRef);
        } else if (action === "set") {
          let shouldWrite = true;
          try {
            const { getDoc } = await import("firebase/firestore");
            const serverDocSnap = await getDoc(docRef);
            if (serverDocSnap.exists()) {
              const serverData = serverDocSnap.data();
              const serverUpdatedAt = serverData?.updatedAt || serverData?.createdAt || 0;
              const localUpdatedAt = data?.updatedAt || data?.createdAt || item.timestamp;

              const serverTime = typeof serverUpdatedAt === "string" ? new Date(serverUpdatedAt).getTime() : Number(serverUpdatedAt);
              const localTime = typeof localUpdatedAt === "string" ? new Date(localUpdatedAt).getTime() : Number(localUpdatedAt);

              if (serverTime > localTime) {
                console.log(`Conflito detectado para ${collectionName} ID ${recordId}. Servidor mais recente. Preservando ambos.`);
                
                // Duplicate local edits under conflict name to prevent data loss
                const duplicatedLocalData = { ...data };
                delete duplicatedLocalData.id;
                if (duplicatedLocalData.name) duplicatedLocalData.name += " (Conflito Offline)";
                if (duplicatedLocalData.title) duplicatedLocalData.title += " (Conflito Offline)";
                
                const transactionDup = db.transaction(collectionName, "readwrite");
                const storeDup = transactionDup.objectStore(collectionName);
                await new Promise<void>((resolve, reject) => {
                  const req = storeDup.add(duplicatedLocalData);
                  req.onsuccess = () => resolve();
                  req.onerror = () => reject(req.error);
                });

                // Overwrite original ID local with server data
                await new Promise<void>((resolve, reject) => {
                  const transactionOverwrite = db.transaction(collectionName, "readwrite");
                  const storeOverwrite = transactionOverwrite.objectStore(collectionName);
                  const req = storeOverwrite.put({ ...serverData, id: recordId });
                  req.onsuccess = () => resolve();
                  req.onerror = () => reject(req.error);
                });

                shouldWrite = false;
              }
            }
          } catch (err) {
            console.warn("Erro ao ler documento do servidor para checar conflitos:", err);
          }

          if (shouldWrite) {
            await setDoc(docRef, { ...data, id: recordId, userId: user.uid });
          }
        }

        // Successfully synced! Delete from IndexedDB sync_queue
        await new Promise<void>((resolve, reject) => {
          const transactionDel = db.transaction("sync_queue", "readwrite");
          const storeDel = transactionDel.objectStore("sync_queue");
          const requestDel = storeDel.delete(item.id!);
          requestDel.onsuccess = () => resolve();
          requestDel.onerror = () => reject(requestDel.error);
        });

      } catch (err) {
        console.error(`Erro ao processar item do sync queue:`, err);
        break;
      }
    }

    const remainingCount = await new Promise<number>((resolve, reject) => {
      const transaction = db.transaction("sync_queue", "readonly");
      const store = transaction.objectStore("sync_queue");
      const request = store.count();
      request.onsuccess = () => resolve(request.result || 0);
      request.onerror = () => reject(request.error);
    });

    if (remainingCount === 0) {
      triggerSyncStatusChange("synchronized");
    } else {
      triggerSyncStatusChange("pending");
    }

  } catch (error) {
    console.error("Erro ao descarregar fila de sincronização:", error);
    triggerSyncStatusChange("pending");
  } finally {
    isFlushing = false;
  }
}

export function openDatabase(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);

    request.onupgradeneeded = (event: any) => {
      const db = request.result;

      if (!db.objectStoreNames.contains("patients")) {
        db.createObjectStore("patients", { keyPath: "id", autoIncrement: true });
      }
      if (!db.objectStoreNames.contains("evolutions")) {
        const store = db.createObjectStore("evolutions", { keyPath: "id", autoIncrement: true });
        store.createIndex("patientId", "patientId", { unique: false });
      }
      if (!db.objectStoreNames.contains("escalas")) {
        const store = db.createObjectStore("escalas", { keyPath: "id", autoIncrement: true });
        store.createIndex("patientId", "patientId", { unique: false });
      }
      if (!db.objectStoreNames.contains("plantoes")) {
        db.createObjectStore("plantoes", { keyPath: "id", autoIncrement: true });
      }
      if (!db.objectStoreNames.contains("documentos")) {
        db.createObjectStore("documentos", { keyPath: "id", autoIncrement: true });
      }
      if (!db.objectStoreNames.contains("anotacoes_plantao")) {
        const store = db.createObjectStore("anotacoes_plantao", { keyPath: "id", autoIncrement: true });
        store.createIndex("patientId", "patientId", { unique: false });
      }
      if (!db.objectStoreNames.contains("lesoes")) {
        const store = db.createObjectStore("lesoes", { keyPath: "id", autoIncrement: true });
        store.createIndex("patientId", "patientId", { unique: false });
      }
      if (!db.objectStoreNames.contains("vacinas")) {
        const store = db.createObjectStore("vacinas", { keyPath: "id", autoIncrement: true });
        store.createIndex("patientId", "patientId", { unique: false });
      }
      if (!db.objectStoreNames.contains("sync_queue")) {
        db.createObjectStore("sync_queue", { keyPath: "id", autoIncrement: true });
      }
    };
  });
}

// Automatically listen to auth changes to start syncing!
onAuthStateChanged(auth, (user) => {
  if (user) {
    flushSyncQueue().catch(console.error);
  }
});

if (typeof window !== "undefined") {
  window.addEventListener("online", () => {
    triggerSyncStatusChange("syncing");
    flushSyncQueue().catch(console.error);
  });
  window.addEventListener("offline", () => {
    triggerSyncStatusChange("offline");
  });
}

async function queueSyncOperation(collectionName: string, action: "set" | "delete", recordId: number, data?: any) {
  const db = await openDatabase();
  const syncItem: SyncQueueItem = {
    collectionName,
    action,
    recordId,
    data: data ? JSON.parse(JSON.stringify(data)) : null,
    timestamp: Date.now()
  };
  
  await new Promise<void>((resolve, reject) => {
    const transaction = db.transaction("sync_queue", "readwrite");
    const store = transaction.objectStore("sync_queue");
    const request = store.add(syncItem);
    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });

  if (typeof navigator !== "undefined" && !navigator.onLine) {
    triggerSyncStatusChange("offline");
  } else {
    triggerSyncStatusChange("pending");
    flushSyncQueue().catch(console.error);
  }
}

// PATIENTS API
export async function dbAddPatient(patient: Patient): Promise<number> {
  const db = await openDatabase();
  const id = await new Promise<number>((resolve, reject) => {
    const transaction = db.transaction("patients", "readwrite");
    const store = transaction.objectStore("patients");
    const request = store.add(patient);
    request.onsuccess = () => resolve(request.result as number);
    request.onerror = () => reject(request.error);
  });
  await queueSyncOperation("patients", "set", id, { ...patient, id, updatedAt: Date.now() });
  return id;
}

export async function dbGetPatients(): Promise<Patient[]> {
  const db = await openDatabase();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction("patients", "readonly");
    const store = transaction.objectStore("patients");
    const request = store.getAll();
    request.onsuccess = () => resolve(request.result || []);
    request.onerror = () => reject(request.error);
  });
}

export async function dbUpdatePatient(patient: Patient): Promise<void> {
  const db = await openDatabase();
  await new Promise<void>((resolve, reject) => {
    const transaction = db.transaction("patients", "readwrite");
    const store = transaction.objectStore("patients");
    const request = store.put(patient);
    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
  if (patient.id) {
    await queueSyncOperation("patients", "set", patient.id, { ...patient, updatedAt: Date.now() });
  }
}

export async function dbDeletePatient(id: number): Promise<void> {
  const db = await openDatabase();
  
  // List of items to delete from Firestore (cascade)
  // We can query them or just let the local transaction handle IndexedDB,
  // and we also delete them from Firestore if we can find their IDs.
  // To keep it simple and ultra-robust, let's fetch IDs we are about to cascade delete so we can also delete them from Firestore!
  const evIds: number[] = [];
  const esIds: number[] = [];
  const anIds: number[] = [];
  const leIds: number[] = [];
  const vaIds: number[] = [];

  const evs = await dbGetEvolutions(id);
  const esc = await dbGetEscalas(id);
  const ans = await dbGetAnotacoesPlantao(id);
  const les = await dbGetLesoes(id);
  const vac = await dbGetVacinas(id);

  evs.forEach(e => e.id && evIds.push(e.id));
  esc.forEach(e => e.id && esIds.push(e.id));
  ans.forEach(e => e.id && anIds.push(e.id));
  les.forEach(e => e.id && leIds.push(e.id));
  vac.forEach(e => e.id && vaIds.push(e.id));

  await new Promise<void>((resolve, reject) => {
    const transaction = db.transaction(
      ["patients", "evolutions", "escalas", "anotacoes_plantao", "lesoes", "vacinas"], 
      "readwrite"
    );
    
    // Delete patient
    transaction.objectStore("patients").delete(id);
    
    // Cascade delete evolutions
    const evolutionsStore = transaction.objectStore("evolutions");
    const evIndex = evolutionsStore.index("patientId");
    const evRequest = evIndex.openCursor(IDBKeyRange.only(id));
    evRequest.onsuccess = (event: any) => {
      const cursor = event.target.result;
      if (cursor) {
        cursor.delete();
        cursor.continue();
      }
    };

    // Cascade delete scales
    const escalasStore = transaction.objectStore("escalas");
    const esIndex = escalasStore.index("patientId");
    const esRequest = esIndex.openCursor(IDBKeyRange.only(id));
    esRequest.onsuccess = (event: any) => {
      const cursor = event.target.result;
      if (cursor) {
        cursor.delete();
        cursor.continue();
      }
    };

    // Cascade delete anotacoes
    const anotacoesStore = transaction.objectStore("anotacoes_plantao");
    const anIndex = anotacoesStore.index("patientId");
    const anRequest = anIndex.openCursor(IDBKeyRange.only(id));
    anRequest.onsuccess = (event: any) => {
      const cursor = event.target.result;
      if (cursor) {
        cursor.delete();
        cursor.continue();
      }
    };

    // Cascade delete lesoes
    const lesoesStore = transaction.objectStore("lesoes");
    const leIndex = lesoesStore.index("patientId");
    const leRequest = leIndex.openCursor(IDBKeyRange.only(id));
    leRequest.onsuccess = (event: any) => {
      const cursor = event.target.result;
      if (cursor) {
        cursor.delete();
        cursor.continue();
      }
    };

    // Cascade delete vacinas
    const vacinasStore = transaction.objectStore("vacinas");
    const vaIndex = vacinasStore.index("patientId");
    const vaRequest = vaIndex.openCursor(IDBKeyRange.only(id));
    vaRequest.onsuccess = (event: any) => {
      const cursor = event.target.result;
      if (cursor) {
        cursor.delete();
        cursor.continue();
      }
    };

    transaction.oncomplete = () => resolve();
    transaction.onerror = () => reject(transaction.error);
  });

  // Cloud deletes
  await queueSyncOperation("patients", "delete", id);
  for (const evId of evIds) await queueSyncOperation("evolutions", "delete", evId);
  for (const esId of esIds) await queueSyncOperation("escalas", "delete", esId);
  for (const anId of anIds) await queueSyncOperation("anotacoes_plantao", "delete", anId);
  for (const leId of leIds) await queueSyncOperation("lesoes", "delete", leId);
  for (const vaId of vaIds) await queueSyncOperation("vacinas", "delete", vaId);
}

// EVOLUTIONS API
export async function dbAddEvolution(evolution: Evolution): Promise<number> {
  const db = await openDatabase();
  const id = await new Promise<number>((resolve, reject) => {
    const transaction = db.transaction("evolutions", "readwrite");
    const store = transaction.objectStore("evolutions");
    const request = store.add(evolution);
    request.onsuccess = () => resolve(request.result as number);
    request.onerror = () => reject(request.error);
  });
  await queueSyncOperation("evolutions", "set", id, { ...evolution, id, updatedAt: Date.now() });
  return id;
}

export async function dbGetEvolutions(patientId: number): Promise<Evolution[]> {
  const db = await openDatabase();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction("evolutions", "readonly");
    const store = transaction.objectStore("evolutions");
    const index = store.index("patientId");
    const request = index.getAll(IDBKeyRange.only(patientId));
    request.onsuccess = () => {
      const list = request.result || [];
      list.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      resolve(list);
    };
    request.onerror = () => reject(request.error);
  });
}

export async function dbGetAllEvolutions(): Promise<Evolution[]> {
  const db = await openDatabase();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction("evolutions", "readonly");
    const store = transaction.objectStore("evolutions");
    const request = store.getAll();
    request.onsuccess = () => {
      const list = request.result || [];
      list.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      resolve(list);
    };
    request.onerror = () => reject(request.error);
  });
}

export async function dbDeleteEvolution(id: number): Promise<void> {
  const db = await openDatabase();
  await new Promise<void>((resolve, reject) => {
    const transaction = db.transaction("evolutions", "readwrite");
    const store = transaction.objectStore("evolutions");
    const request = store.delete(id);
    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
  await queueSyncOperation("evolutions", "delete", id);
}

// CLINICAL SCALES API
export async function dbAddEscala(escala: EscalaClinica): Promise<number> {
  const db = await openDatabase();
  const id = await new Promise<number>((resolve, reject) => {
    const transaction = db.transaction("escalas", "readwrite");
    const store = transaction.objectStore("escalas");
    const request = store.add(escala);
    request.onsuccess = () => resolve(request.result as number);
    request.onerror = () => reject(request.error);
  });
  await queueSyncOperation("escalas", "set", id, { ...escala, id, updatedAt: Date.now() });
  return id;
}

export async function dbGetEscalas(patientId: number): Promise<EscalaClinica[]> {
  const db = await openDatabase();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction("escalas", "readonly");
    const store = transaction.objectStore("escalas");
    const index = store.index("patientId");
    const request = index.getAll(IDBKeyRange.only(patientId));
    request.onsuccess = () => {
      const list = request.result || [];
      list.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      resolve(list);
    };
    request.onerror = () => reject(request.error);
  });
}

export async function dbDeleteEscala(id: number): Promise<void> {
  const db = await openDatabase();
  await new Promise<void>((resolve, reject) => {
    const transaction = db.transaction("escalas", "readwrite");
    const store = transaction.objectStore("escalas");
    const request = store.delete(id);
    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
  await queueSyncOperation("escalas", "delete", id);
}

// WORK SCHEDULES (PLANTAO) API
export async function dbSavePlantao(plantao: Plantao): Promise<number> {
  const db = await openDatabase();
  const id = await new Promise<number>((resolve, reject) => {
    const transaction = db.transaction("plantoes", "readwrite");
    const store = transaction.objectStore("plantoes");
    const request = store.put(plantao);
    request.onsuccess = () => resolve(request.result as number);
    request.onerror = () => reject(request.error);
  });
  await queueSyncOperation("plantoes", "set", id, { ...plantao, id, updatedAt: Date.now() });
  return id;
}

export async function dbGetPlantoes(): Promise<Plantao[]> {
  const db = await openDatabase();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction("plantoes", "readonly");
    const store = transaction.objectStore("plantoes");
    const request = store.getAll();
    request.onsuccess = () => {
      const list = request.result || [];
      list.sort((a, b) => b.month.localeCompare(a.month));
      resolve(list);
    };
    request.onerror = () => reject(request.error);
  });
}

export async function dbDeletePlantao(id: number): Promise<void> {
  const db = await openDatabase();
  await new Promise<void>((resolve, reject) => {
    const transaction = db.transaction("plantoes", "readwrite");
    const store = transaction.objectStore("plantoes");
    const request = store.delete(id);
    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
  await queueSyncOperation("plantoes", "delete", id);
}

// FREE DOCUMENTS API
export async function dbSaveDocumento(docData: DocumentoLivre): Promise<number> {
  const db = await openDatabase();
  const id = await new Promise<number>((resolve, reject) => {
    const transaction = db.transaction("documentos", "readwrite");
    const store = transaction.objectStore("documentos");
    const request = store.put(docData);
    request.onsuccess = () => resolve(request.result as number);
    request.onerror = () => reject(request.error);
  });
  await queueSyncOperation("documentos", "set", id, { ...docData, id, updatedAt: Date.now() });
  return id;
}

export async function dbGetDocumentos(): Promise<DocumentoLivre[]> {
  const db = await openDatabase();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction("documentos", "readonly");
    const store = transaction.objectStore("documentos");
    const request = store.getAll();
    request.onsuccess = () => {
      const list = request.result || [];
      list.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      resolve(list);
    };
    request.onerror = () => reject(request.error);
  });
}

export async function dbDeleteDocumento(id: number): Promise<void> {
  const db = await openDatabase();
  await new Promise<void>((resolve, reject) => {
    const transaction = db.transaction("documentos", "readwrite");
    const store = transaction.objectStore("documentos");
    const request = store.delete(id);
    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
  await queueSyncOperation("documentos", "delete", id);
}

// ANOTAÇÕES DE PLANTÃO
export async function dbAddAnotacaoPlantao(anotacao: AnotacaoPlantao): Promise<number> {
  const db = await openDatabase();
  const id = await new Promise<number>((resolve, reject) => {
    const transaction = db.transaction("anotacoes_plantao", "readwrite");
    const store = transaction.objectStore("anotacoes_plantao");
    const request = store.add(anotacao);
    request.onsuccess = () => resolve(request.result as number);
    request.onerror = () => reject(request.error);
  });
  await queueSyncOperation("anotacoes_plantao", "set", id, { ...anotacao, id, updatedAt: Date.now() });
  return id;
}

export async function dbGetAnotacoesPlantao(patientId: number): Promise<AnotacaoPlantao[]> {
  const db = await openDatabase();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction("anotacoes_plantao", "readonly");
    const store = transaction.objectStore("anotacoes_plantao");
    const index = store.index("patientId");
    const request = index.getAll(IDBKeyRange.only(patientId));
    request.onsuccess = () => {
      const list = request.result || [];
      list.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      resolve(list);
    };
    request.onerror = () => reject(request.error);
  });
}

export async function dbDeleteAnotacaoPlantao(id: number): Promise<void> {
  const db = await openDatabase();
  await new Promise<void>((resolve, reject) => {
    const transaction = db.transaction("anotacoes_plantao", "readwrite");
    const store = transaction.objectStore("anotacoes_plantao");
    const request = store.delete(id);
    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
  await queueSyncOperation("anotacoes_plantao", "delete", id);
}

// LESÕES (FERIDAS)
export async function dbAddLesao(lesao: LesaoFerida): Promise<number> {
  const db = await openDatabase();
  const id = await new Promise<number>((resolve, reject) => {
    const transaction = db.transaction("lesoes", "readwrite");
    const store = transaction.objectStore("lesoes");
    const request = store.add(lesao);
    request.onsuccess = () => resolve(request.result as number);
    request.onerror = () => reject(request.error);
  });
  await queueSyncOperation("lesoes", "set", id, { ...lesao, id, updatedAt: Date.now() });
  return id;
}

export async function dbGetLesoes(patientId: number): Promise<LesaoFerida[]> {
  const db = await openDatabase();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction("lesoes", "readonly");
    const store = transaction.objectStore("lesoes");
    const index = store.index("patientId");
    const request = index.getAll(IDBKeyRange.only(patientId));
    request.onsuccess = () => {
      const list = request.result || [];
      list.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      resolve(list);
    };
    request.onerror = () => reject(request.error);
  });
}

export async function dbDeleteLesao(id: number): Promise<void> {
  const db = await openDatabase();
  await new Promise<void>((resolve, reject) => {
    const transaction = db.transaction("lesoes", "readwrite");
    const store = transaction.objectStore("lesoes");
    const request = store.delete(id);
    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
  await queueSyncOperation("lesoes", "delete", id);
}

// VACINAS
export async function dbAddVacina(vacina: RegistroVacina): Promise<number> {
  const db = await openDatabase();
  const id = await new Promise<number>((resolve, reject) => {
    const transaction = db.transaction("vacinas", "readwrite");
    const store = transaction.objectStore("vacinas");
    const request = store.add(vacina);
    request.onsuccess = () => resolve(request.result as number);
    request.onerror = () => reject(request.error);
  });
  await queueSyncOperation("vacinas", "set", id, { ...vacina, id, updatedAt: Date.now() });
  return id;
}

export async function dbGetVacinas(patientId: number): Promise<RegistroVacina[]> {
  const db = await openDatabase();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction("vacinas", "readonly");
    const store = transaction.objectStore("vacinas");
    const index = store.index("patientId");
    const request = index.getAll(IDBKeyRange.only(patientId));
    request.onsuccess = () => {
      const list = request.result || [];
      list.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      resolve(list);
    };
    request.onerror = () => reject(request.error);
  });
}

export async function dbDeleteVacina(id: number): Promise<void> {
  const db = await openDatabase();
  await new Promise<void>((resolve, reject) => {
    const transaction = db.transaction("vacinas", "readwrite");
    const store = transaction.objectStore("vacinas");
    const request = store.delete(id);
    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
  await queueSyncOperation("vacinas", "delete", id);
}

// BULK OFFLINE TO CLOUD UPLOAD & CLOUD TO OFFLINE DOWNLOAD
export async function dbUploadAllLocalToCloud(userId: string): Promise<void> {
  const collections = [
    { name: "patients", storeName: "patients" },
    { name: "evolutions", storeName: "evolutions" },
    { name: "escalas", storeName: "escalas" },
    { name: "plantoes", storeName: "plantoes" },
    { name: "documentos", storeName: "documentos" },
    { name: "anotacoes_plantao", storeName: "anotacoes_plantao" },
    { name: "lesoes", storeName: "lesoes" },
    { name: "vacinas", storeName: "vacinas" }
  ];

  const db = await openDatabase();

  for (const coll of collections) {
    const records = await new Promise<any[]>((resolve, reject) => {
      const transaction = db.transaction(coll.storeName, "readonly");
      const store = transaction.objectStore(coll.storeName);
      const request = store.getAll();
      request.onsuccess = () => resolve(request.result || []);
      request.onerror = () => reject(request.error);
    });

    for (const record of records) {
      if (record && record.id) {
        const docRef = doc(firestoreDb, "users", userId, coll.name, String(record.id));
        await setDoc(docRef, { ...record, userId });
      }
    }
  }
}

export async function dbSyncAllFromCloud(userId: string): Promise<void> {
  const collections = [
    { name: "patients", storeName: "patients" },
    { name: "evolutions", storeName: "evolutions" },
    { name: "escalas", storeName: "escalas" },
    { name: "plantoes", storeName: "plantoes" },
    { name: "documentos", storeName: "documentos" },
    { name: "anotacoes_plantao", storeName: "anotacoes_plantao" },
    { name: "lesoes", storeName: "lesoes" },
    { name: "vacinas", storeName: "vacinas" }
  ];

  const db = await openDatabase();

  for (const coll of collections) {
    const q = query(collection(firestoreDb, "users", userId, coll.name));
    const snapshot = await getDocs(q);

    if (!snapshot.empty) {
      const transaction = db.transaction(coll.storeName, "readwrite");
      const store = transaction.objectStore(coll.storeName);

      for (const docSnap of snapshot.docs) {
        const data = docSnap.data();
        if (data) {
          store.put(data);
        }
      }

      await new Promise<void>((resolve, reject) => {
        transaction.oncomplete = () => resolve();
        transaction.onerror = () => reject(transaction.error);
      });
    }
  }
}
