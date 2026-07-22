import express from "express";
import path from "path";
import dotenv from "dotenv";
import { GoogleGenAI, Type } from "@google/genai";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// CORS and PWA headers middleware for manifest and service worker
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  next();
});

// Explicit route for manifest.json with CORS and correct mime-type
app.get("/manifest.json", (req, res) => {
  res.setHeader("Content-Type", "application/manifest+json");
  const filePath = process.env.NODE_ENV === "production"
    ? path.join(process.cwd(), "dist", "manifest.json")
    : path.join(process.cwd(), "public", "manifest.json");
  res.sendFile(filePath, (err) => {
    if (err) {
      // Fallback to public if dist isn't built yet
      res.sendFile(path.join(process.cwd(), "public", "manifest.json"));
    }
  });
});

// Explicit route for sw.js with CORS and Service-Worker-Allowed header
app.get("/sw.js", (req, res) => {
  res.setHeader("Service-Worker-Allowed", "/");
  res.setHeader("Content-Type", "application/javascript");
  const filePath = process.env.NODE_ENV === "production"
    ? path.join(process.cwd(), "dist", "sw.js")
    : path.join(process.cwd(), "public", "sw.js");
  res.sendFile(filePath, (err) => {
    if (err) {
      // Fallback to public if dist isn't built yet
      res.sendFile(path.join(process.cwd(), "public", "sw.js"));
    }
  });
});

// Lazy-loaded Gemini AI client to handle keys gracefully
let aiClient: GoogleGenAI | null = null;

function getGeminiClient(): GoogleGenAI {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("A chave GEMINI_API_KEY não está configurada nos Secrets do AI Studio.");
    }
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiClient;
}

// Helper to generate content with fallback to gemini-3.1-flash-lite if gemini-3.5-flash is overloaded (e.g. 503)
async function generateContentWithFallback(
  ai: GoogleGenAI,
  model: string,
  contents: any,
  config?: any
) {
  try {
    console.log(`Tentando gerar conteúdo com o modelo: ${model}...`);
    return await ai.models.generateContent({
      model,
      contents,
      config,
    });
  } catch (error: any) {
    console.warn(`Erro com o modelo ${model}:`, error.message || error);
    
    const errStr = JSON.stringify(error);
    const isOverloaded = 
      errStr.includes("503") || 
      errStr.includes("UNAVAILABLE") || 
      errStr.includes("high demand") || 
      errStr.includes("ResourceExhausted") ||
      (error.message && (
        error.message.includes("503") || 
        error.message.includes("UNAVAILABLE") || 
        error.message.includes("high demand") ||
        error.message.includes("ResourceExhausted")
      ));

    if (isOverloaded && model === "gemini-3.5-flash") {
      console.log("Serviço do gemini-3.5-flash sobrecarregado/indisponível. Tentando fallback para gemini-3.1-flash-lite...");
      try {
        return await ai.models.generateContent({
          model: "gemini-3.1-flash-lite",
          contents,
          config,
        });
      } catch (fallbackError: any) {
        console.error("Erro fatal no fallback gemini-3.1-flash-lite:", fallbackError.message || fallbackError);
        throw fallbackError;
      }
    }
    throw error;
  }
}

// API: Check server health and Gemini API key status
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    hasApiKey: !!process.env.GEMINI_API_KEY,
    time: new Date().toISOString(),
  });
});

// API: Process clinical narrative to generate evolution, SAE, care plan and scales recommendations
app.post("/api/gemini/evoluir", async (req, res) => {
  try {
    const { patientName, narrative, patientAge, diagnosis, comorbidity, templateData } = req.body;

    if (!narrative && !templateData) {
      return res.status(400).json({ error: "É necessário fornecer um relato de evolução ou checklist estruturado." });
    }

    const ai = getGeminiClient();

    let textPrompt = `Você é um assistente de inteligência artificial especializado em enfermagem clínica no Brasil. 
Sua tarefa é analisar o relato de evolução clínica de um paciente e gerar uma evolução reescrita profissional, a SAE (Sistematização da Assistência de Enfermagem), um Plano de Cuidados e as Escalas Clínicas recomendadas.

DADOS DO PACIENTE:
- Nome: ${patientName || "Não informado"}
- Idade: ${patientAge || "Não informada"} anos
- Diagnóstico Principal: ${diagnosis || "Não informado"}
- Comorbidades: ${comorbidity || "Não informadas"}`;

    if (templateData) {
      textPrompt += `\n\nCHECKLIST E SINAIS VITAIS DO PACIENTE:
- Estado Geral: ${templateData.estadoGeral || "N/A"}
- Neurológico: ${templateData.neurologico || "N/A"}
- Respiratório: ${templateData.respiratorio || "N/A"}
- Cardiovascular/Sinais Vitais: PA: ${templateData.pa || "N/A"} mmHg, FC: ${templateData.fc || "N/A"} bpm, FR: ${templateData.fr || "N/A"} irpm, Temp: ${templateData.temp || "N/A"} °C, SpO2: ${templateData.spo2 || "N/A"} %
- Digestivo/Nutrição: ${templateData.digestivo || "N/A"}
- Urinário: ${templateData.urinario || "N/A"}
- Pele/Mobilidade: ${templateData.pele || "N/A"}
- Intercorrências/Condutas: ${templateData.intercorrencias || "N/A"}`;
    }

    if (narrative) {
      textPrompt += `\n\nRELATO ADICIONAL EM TEXTO LIVRE:
"${narrative}"`;
    }

    textPrompt += `\n\nREQUISITOS DE RETORNO:
1. evolution: Escreva a evolução reescrita em linguagem técnica de enfermagem, profissional, de forma contínua ou estruturada em SOAP (Subjetivo, Objetivo, Avaliação, Plano), sem inventar nenhuma informação não contida no relato ou sinais vitais, mas enriquecendo-a com a terminologia técnica correta (ex: normocárdico, taquipneico, eupneico, afebril, etc.).
2. sae: Elabore diagnósticos de enfermagem usando a taxonomia oficial NANDA-I, contendo o título do diagnóstico, fatores relacionados/risco e características definidoras. Inclua resultados esperados (NOC) e intervenções de enfermagem (NIC).
3. carePlan: Crie um plano de cuidados objetivo com intervenções práticas que a equipe técnica ou o próprio enfermeiro deve realizar.
4. recommendedScales: Recomende as escalas clínicas que fazem sentido aplicar para esse quadro específico (escolha entre: Braden, Morse, Glasgow, Barthel, Katz, EVA, Zarit) explicando brevemente por que cada uma é recomendada.`;

    const response = await generateContentWithFallback(
      ai,
      "gemini-3.5-flash",
      textPrompt,
      {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            evolution: {
              type: Type.STRING,
              description: "Evolução reescrita em português técnico profissional de enfermagem.",
            },
            sae: {
              type: Type.STRING,
              description: "Sistematização da Assistência de Enfermagem baseada em NANDA, NOC, NIC.",
            },
            carePlan: {
              type: Type.STRING,
              description: "Plano de cuidados objetivo para o paciente.",
            },
            recommendedScales: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "Lista de strings, cada uma representando uma escala recomendada com sua respectiva justificativa clínica.",
            },
          },
          required: ["evolution", "sae", "carePlan", "recommendedScales"],
        },
      }
    );

    const resultText = response.text;
    if (!resultText) {
      throw new Error("Nenhuma resposta obtida da inteligência artificial.");
    }

    // Safely parse JSON in case it is wrapped in markdown formatting backticks
    const cleanedText = resultText.replace(/^```json\s*/i, "").replace(/```$/, "").trim();
    const parsedResponse = JSON.parse(cleanedText);
    res.json(parsedResponse);
  } catch (error: any) {
    console.error("Erro na rota Gemini:", error);
    res.status(500).json({ error: error.message || "Ocorreu um erro ao processar a requisição." });
  }
});

// API: Process quick shift note to correct spelling/improve nursing jargon
app.post("/api/gemini/anotar", async (req, res) => {
  try {
    const { patientName, patientAge, diagnosis, shiftNote } = req.body;

    if (!shiftNote) {
      return res.status(400).json({ error: "É necessário fornecer a anotação de plantão." });
    }

    const ai = getGeminiClient();

    const textPrompt = `Você é um assistente de inteligência artificial especializado em enfermagem clínica no Brasil.
Sua tarefa é analisar uma anotação de plantão rápida (texto simples de passagem de plantão) de um paciente e reescrevê-la, corrigindo a ortografia, melhorando a redação e tornando-a tecnicamente adequada para os padrões de enfermagem brasileiros, sem alterar os fatos reais ou clínicos relatados. Use termos técnicos apropriados (ex: eupneico, normocárdico, eliminações fisiológicas presentes, etc.), mantendo a fidelidade absoluta ao relato.

DADOS DO PACIENTE:
- Nome: ${patientName || "Não informado"}
- Idade: ${patientAge || "Não informada"} anos
- Diagnóstico Principal: ${diagnosis || "Não informado"}

ANOTAÇÃO DE PLANTÃO RÁPIDA:
"${shiftNote}"

RETORNE APENAS um objeto JSON no formato:
{
  "correctedNote": "Texto da anotação corrigida e melhorada em português técnico profissional de enfermagem."
}`;

    const response = await generateContentWithFallback(
      ai,
      "gemini-3.5-flash",
      textPrompt,
      {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            correctedNote: {
              type: Type.STRING,
              description: "Anotação de enfermagem de plantão reescrita de forma técnica, limpa e profissional.",
            }
          },
          required: ["correctedNote"]
        }
      }
    );

    const resultText = response.text;
    if (!resultText) {
      throw new Error("Nenhuma resposta obtida da inteligência artificial.");
    }

    const cleanedText = resultText.replace(/^```json\s*/i, "").replace(/```$/, "").trim();
    const parsedResponse = JSON.parse(cleanedText);
    res.json(parsedResponse);
  } catch (error: any) {
    console.error("Erro na rota Gemini Anotar:", error);
    res.status(500).json({ error: error.message || "Ocorreu um erro ao processar a anotação." });
  }
});

// API: Process wound information to generate specialized pathophysiology, therapy plan and products
app.post("/api/gemini/lesao", async (req, res) => {
  try {
    const { 
      patientName, location, type, stage, tissueType, exudate, edges, 
      signsOfInfection, sizeLength, sizeWidth, conducts, evolutionNote 
    } = req.body;

    if (!type || !location) {
      return res.status(400).json({ error: "É necessário fornecer o tipo de lesão e localização." });
    }

    const ai = getGeminiClient();

    const textPrompt = `Você é um enfermeiro estomaterapeuta altamente especializado em cicatrização e tratamento de feridas no Brasil.
Análise a lesão relatada e forneça uma base científica e de enfermagem completa sobre a patologia e as coberturas indicadas.

DADOS DA LESÃO DO PACIENTE:
- Paciente: ${patientName || "Não informado"}
- Localização: ${location}
- Tipo: ${type} ${stage ? `(${stage})` : ""}
- Tecido Predominante: ${tissueType}
- Exsudato: ${exudate}
- Aspecto das Bordas: ${edges}
- Sinais Clínicos de Infecção: ${signsOfInfection && signsOfInfection.length > 0 ? signsOfInfection.join(", ") : "Ausentes"}
- Dimensões: ${sizeLength || "N/A"} cm x ${sizeWidth || "N/A"} cm
- Condutas Relatadas: ${conducts || "N/A"}
- Notas Clínicas de Evolução: ${evolutionNote || "N/A"}

REQUISITOS DE RETORNO:
1. fisiopatologia: Descreva brevemente a fisiopatologia resumida dessa lesão (por que ocorre, o que está acontecendo no tecido).
2. planoTratamento: Monte um plano de tratamento indicando quais coberturas (curativos) e quais medicações tópicas utilizar, explicando detalhadamente o porquê de cada escolha (mecanismo de ação e motivo clínico daquela cobertura/medicação ser indicada para esse tipo, grau, estágio ou fase da lesão).
3. tratamentoPasso: Escreva o tratamento indicado passo a passo (limpeza, aplicação, fixação, frequência de troca).
4. indicacoesContraindicacoes: Liste indicações e contraindicações específicas de cada conduta, técnica ou produto recomendado.
5. coberturasRecomendadas: Apresente coberturas recomendadas relevantes para o caso (ex.: hidrocoloide, alginato de cálcio, poliuretano, hidrogel, carvão ativado, papaína, colagenase, AGE), explicando o mecanismo de ação de cada uma e quando usá-las.
6. medicamentosTopicos: Descreva os medicamentos tópicos (pomadas, cremes, soluções) frequentemente usados para esse quadro, com seus respectivos efeitos esperados.

As respostas devem ser completas, clínicas, profissionais, em português brasileiro e adequadas para a prática de enfermagem no COREN.`;

    const response = await generateContentWithFallback(
      ai,
      "gemini-3.5-flash",
      textPrompt,
      {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            fisiopatologia: {
              type: Type.STRING,
              description: "Fisiopatologia resumida da lesão.",
            },
            planoTratamento: {
              type: Type.STRING,
              description: "Plano de tratamento gerado por IA com justificativas e mecanismo de ação.",
            },
            tratamentoPasso: {
              type: Type.STRING,
              description: "Tratamento passo a passo.",
            },
            indicacoesContraindicacoes: {
              type: Type.STRING,
              description: "Indicações e contraindicações das condutas recomendadas.",
            },
            coberturasRecomendadas: {
              type: Type.STRING,
              description: "Coberturas recomendadas com seus respectivos mecanismos de ação e indicações.",
            },
            medicamentosTopicos: {
              type: Type.STRING,
              description: "Medicamentos tópicos e seus efeitos esperados.",
            },
          },
          required: [
            "fisiopatologia", "planoTratamento", "tratamentoPasso", 
            "indicacoesContraindicacoes", "coberturasRecomendadas", "medicamentosTopicos"
          ],
        },
      }
    );

    const resultText = response.text;
    if (!resultText) {
      throw new Error("Nenhuma resposta obtida da inteligência artificial.");
    }

    const cleanedText = resultText.replace(/^```json\s*/i, "").replace(/```$/, "").trim();
    const parsedResponse = JSON.parse(cleanedText);
    res.json(parsedResponse);
  } catch (error: any) {
    console.error("Erro na rota Gemini Lesão:", error);
    res.status(500).json({ error: error.message || "Ocorreu um erro ao processar o plano de tratamento da lesão." });
  }
});

// Vite middleware for development or serving compiled assets for production
const startServer = async () => {
  if (process.env.NODE_ENV !== "production") {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[Server] rodando em http://localhost:${PORT}`);
  });
};

startServer().catch((err) => {
  console.error("Erro ao iniciar o servidor Express:", err);
});
