import { PDFDocument, rgb, StandardFonts } from "pdf-lib";

// Common color scheme: Teal
const PRIMARY_COLOR = rgb(13 / 255, 148 / 255, 136 / 255); // Teal-600
const DARK_GRAY = rgb(55 / 255, 65 / 255, 81 / 255); // Gray-700
const LIGHT_GRAY = rgb(243 / 255, 244 / 255, 246 / 255); // Gray-100
const BORDER_COLOR = rgb(209 / 255, 213 / 255, 219 / 255); // Gray-300

// Clean helper to truncate text or structure layout safely
function drawHeader(page: any, fontBold: any, fontReg: any, title: string) {
  // Top Banner
  page.drawRectangle({
    x: 0,
    y: 770,
    width: 595.275,
    height: 72,
    color: PRIMARY_COLOR,
  });

  // Main Header Text
  page.drawText("Apoio Enfermagem — Bruno T. Prates", {
    x: 35,
    y: 815,
    size: 16,
    font: fontBold,
    color: rgb(1, 1, 1),
  });

  page.drawText(title, {
    x: 35,
    y: 795,
    size: 11,
    font: fontReg,
    color: rgb(0.9, 0.9, 0.9),
  });

  // Fetch active user profile
  let profName = "Enfermeiro Bruno T. Prates";
  let profDetails = "COREN-MG 994720";

  try {
    const saved = localStorage.getItem("user_profile");
    if (saved) {
      const profile = JSON.parse(saved);
      if (profile && profile.name) {
        if (profile.type === "Acadêmico") {
          profName = `Acadêmico(a): ${profile.name}`;
          profDetails = profile.institution ? `Inst: ${profile.institution}` : "Estudante de Enfermagem";
        } else {
          profName = `Enfermeiro(a): ${profile.name}`;
          profDetails = profile.coren ? `COREN ${profile.coren}` : "Enfermeiro(a) Cadastrado(a)";
        }
      }
    }
  } catch (e) {
    console.error("Erro ao ler perfil no pdfGenerator", e);
  }

  // Draw stamp (Dynamic size adjustment based on text length)
  const isLongName = profName.length > 25;
  const fontSizeName = isLongName ? 8 : 10;
  
  page.drawText(profName, {
    x: 380,
    y: 815,
    size: fontSizeName,
    font: fontBold,
    color: rgb(1, 1, 1),
  });

  page.drawText(profDetails, {
    x: 380,
    y: 798,
    size: 8,
    font: fontReg,
    color: rgb(0.9, 0.9, 0.9),
  });
}

function drawFooter(page: any, fontReg: any, pageNum: number, totalPages: number) {
  const footerY = 25;
  page.drawLine({
    start: { x: 35, y: footerY + 15 },
    end: { x: 560, y: footerY + 15 },
    thickness: 0.5,
    color: BORDER_COLOR,
  });

  page.drawText("Documento gerado offline de apoio à enfermagem. Uso estritamente profissional.", {
    x: 35,
    y: footerY,
    size: 7,
    font: fontReg,
    color: rgb(0.5, 0.5, 0.5),
  });

  page.drawText(`Página ${pageNum} de ${totalPages}`, {
    x: 500,
    y: footerY,
    size: 8,
    font: fontReg,
    color: rgb(0.4, 0.4, 0.4),
  });
}

function drawSignatureAndStamp(
  page: any,
  fontBold: any,
  fontReg: any,
  yPosLine: number = 100,
  yPosStamp: number = 45,
  isLandscape: boolean = false
) {
  const includeStamp = localStorage.getItem("include_stamp_signature") !== "false";
  if (!includeStamp) return;

  let name = "Bruno Teixeira Prates";
  let corenOrInstitution = "994720";
  let isAcademic = false;

  try {
    const saved = localStorage.getItem("user_profile");
    if (saved) {
      const profile = JSON.parse(saved);
      if (profile) {
        if (profile.name) name = profile.name;
        isAcademic = profile.type === "Acadêmico";
        corenOrInstitution = isAcademic ? (profile.institution || "") : (profile.coren || "");
      }
    }
  } catch (e) {
    console.error("Erro ao ler perfil para carimbo", e);
  }

  const roleText = isAcademic ? "Acadêmico de Enfermagem" : "Enfermeiro";
  const corenClean = isAcademic
    ? (corenOrInstitution ? `Inst: ${corenOrInstitution}` : "Estudante de Enfermagem")
    : (corenOrInstitution.toUpperCase().includes("COREN") ? corenOrInstitution : `COREN-MG ${corenOrInstitution}`);

  if (isLandscape) {
    const lineX = 580;
    const stampX = 330;
    
    // Draw signature line on the right
    page.drawLine({
      start: { x: lineX, y: yPosLine },
      end: { x: lineX + 220, y: yPosLine },
      thickness: 0.5,
      color: DARK_GRAY,
    });
    page.drawText(name, {
      x: lineX,
      y: yPosLine - 12,
      size: 9,
      font: fontBold,
      color: DARK_GRAY,
    });
    page.drawText(roleText, {
      x: lineX,
      y: yPosLine - 22,
      size: 8,
      font: fontReg,
      color: DARK_GRAY,
    });

    // Draw stamp on the left (or next to it)
    page.drawRectangle({
      x: stampX,
      y: yPosStamp - 5,
      width: 220,
      height: 50,
      borderColor: PRIMARY_COLOR,
      borderWidth: 1.5,
      color: rgb(1, 1, 1),
    });

    page.drawText(name, {
      x: stampX + 12,
      y: yPosStamp + 29,
      size: 9,
      font: fontBold,
      color: DARK_GRAY,
    });
    page.drawText(corenClean, {
      x: stampX + 12,
      y: yPosStamp + 17,
      size: 8,
      font: fontReg,
      color: DARK_GRAY,
    });
    page.drawText(roleText, {
      x: stampX + 12,
      y: yPosStamp + 5,
      size: 8,
      font: fontBold,
      color: DARK_GRAY,
    });
  } else {
    const lineX = 35;
    const stampX = 340;

    // Draw signature line on the left
    page.drawLine({
      start: { x: lineX, y: yPosLine },
      end: { x: lineX + 220, y: yPosLine },
      thickness: 0.5,
      color: DARK_GRAY,
    });
    page.drawText(name, {
      x: lineX,
      y: yPosLine - 12,
      size: 9,
      font: fontBold,
      color: DARK_GRAY,
    });
    page.drawText(isAcademic ? "Acadêmico(a) de Enfermagem" : "Enfermeiro(a) Assistencial", {
      x: lineX,
      y: yPosLine - 22,
      size: 8,
      font: fontReg,
      color: DARK_GRAY,
    });

    // Draw stamp box on the right
    page.drawRectangle({
      x: stampX,
      y: yPosStamp,
      width: 215,
      height: 50,
      borderColor: PRIMARY_COLOR,
      borderWidth: 1.5,
      color: rgb(1, 1, 1),
    });

    page.drawText(name, {
      x: stampX + 12,
      y: yPosStamp + 34,
      size: 9,
      font: fontBold,
      color: DARK_GRAY,
    });
    page.drawText(corenClean, {
      x: stampX + 12,
      y: yPosStamp + 22,
      size: 8,
      font: fontReg,
      color: DARK_GRAY,
    });
    page.drawText(roleText, {
      x: stampX + 12,
      y: yPosStamp + 10,
      size: 8,
      font: fontBold,
      color: DARK_GRAY,
    });
  }
}

export async function generateEvolutionPDF(
  patient: { name: string; age: string; bed: string; diagnosis: string; comorbidity: string },
  evolution: { date: string; aiEvolution: string; aiSae: string; aiCarePlan: string; recommendedScales: string[] }
) {
  const pdfDoc = await PDFDocument.create();
  const fontReg = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const form = pdfDoc.getForm();

  // Page 1: Metadata + Re-written Evolution
  const page1 = pdfDoc.addPage([595.275, 841.89]); // A4 size
  drawHeader(page1, fontBold, fontReg, "RELATÓRIO DE EVOLUÇÃO E S.A.E.");

  // Section 1: Paciente Information Block
  page1.drawRectangle({
    x: 35,
    y: 645,
    width: 525,
    height: 110,
    color: LIGHT_GRAY,
    borderColor: BORDER_COLOR,
    borderWidth: 1,
  });

  page1.drawText("IDENTIFICAÇÃO DO PACIENTE", {
    x: 45,
    y: 738,
    size: 9,
    font: fontBold,
    color: PRIMARY_COLOR,
  });

  // Labels and standard inputs (we can make patient info fields editable too!)
  const addEditableField = (
    formObj: any,
    name: string,
    val: string,
    pg: any,
    x: number,
    y: number,
    w: number,
    h: number
  ) => {
    const fld = formObj.createTextField(name);
    fld.setText(val);
    fld.addToPage(pg, {
      x,
      y,
      width: w,
      height: h,
      textColor: DARK_GRAY,
      backgroundColor: rgb(1, 1, 1),
      borderColor: BORDER_COLOR,
      borderWidth: 0.5,
    });
    fld.setFontSize(9);
  };

  // Draw Patient Meta Labels
  page1.drawText("Nome:", { x: 45, y: 715, size: 8, font: fontBold, color: DARK_GRAY });
  addEditableField(form, "paciente_nome", patient.name || "N/A", page1, 80, 710, 220, 15);

  page1.drawText("Leito/End:", { x: 310, y: 715, size: 8, font: fontBold, color: DARK_GRAY });
  addEditableField(form, "paciente_leito", patient.bed || "N/A", page1, 360, 710, 185, 15);

  page1.drawText("Idade:", { x: 45, y: 695, size: 8, font: fontBold, color: DARK_GRAY });
  addEditableField(form, "paciente_idade", patient.age ? `${patient.age} anos` : "N/A", page1, 80, 690, 60, 15);

  page1.drawText("Data/Hora:", { x: 160, y: 695, size: 8, font: fontBold, color: DARK_GRAY });
  addEditableField(form, "evol_data", new Date(evolution.date).toLocaleString("pt-BR"), page1, 215, 690, 120, 15);

  page1.drawText("Comorbidades:", { x: 350, y: 695, size: 8, font: fontBold, color: DARK_GRAY });
  addEditableField(form, "paciente_comorbidades", patient.comorbidity || "Nenhuma relatada", page1, 420, 690, 125, 15);

  page1.drawText("Diagnóstico Clínico Principal:", { x: 45, y: 670, size: 8, font: fontBold, color: DARK_GRAY });
  addEditableField(form, "paciente_diag_clinico", patient.diagnosis || "N/A", page1, 175, 663, 370, 16);

  // Section 2: Evolution Text Area (AcroForm)
  page1.drawText("1. EVOLUÇÃO DE ENFERMAGEM REESCRITA (EDITÁVEL)", {
    x: 35,
    y: 620,
    size: 11,
    font: fontBold,
    color: PRIMARY_COLOR,
  });

  const evolutionField = form.createTextField("evolucao_texto");
  evolutionField.setText(evolution.aiEvolution);
  evolutionField.enableMultiline();
  evolutionField.addToPage(page1, {
    x: 35,
    y: 60,
    width: 525,
    height: 545,
    textColor: DARK_GRAY,
    backgroundColor: rgb(1, 1, 1),
    borderColor: BORDER_COLOR,
    borderWidth: 1,
  });
  evolutionField.setFontSize(10);

  drawFooter(page1, fontReg, 1, 2);

  // Page 2: SAE / NANDA & Plano de Cuidados & Escalas
  const page2 = pdfDoc.addPage([595.275, 841.89]);
  drawHeader(page2, fontBold, fontReg, "SISTEMATIZAÇÃO DA ASSISTÊNCIA E CONDUTAS");

  // Section 3: SAE (Taxonomia NANDA-I, NOC, NIC)
  page2.drawText("2. SISTEMATIZAÇÃO DA ASSISTÊNCIA DE ENFERMAGEM (SAE)", {
    x: 35,
    y: 740,
    size: 11,
    font: fontBold,
    color: PRIMARY_COLOR,
  });

  const saeField = form.createTextField("sae_texto");
  saeField.setText(evolution.aiSae);
  saeField.enableMultiline();
  saeField.addToPage(page2, {
    x: 35,
    y: 450,
    width: 525,
    height: 275,
    textColor: DARK_GRAY,
    backgroundColor: rgb(1, 1, 1),
    borderColor: BORDER_COLOR,
    borderWidth: 1,
  });
  saeField.setFontSize(9);

  // Section 4: Plano de Cuidados
  page2.drawText("3. PLANO DE CUIDADOS E INTERVENÇÕES DIÁRIAS", {
    x: 35,
    y: 425,
    size: 11,
    font: fontBold,
    color: PRIMARY_COLOR,
  });

  const carePlanField = form.createTextField("care_plan_texto");
  carePlanField.setText(evolution.aiCarePlan);
  carePlanField.enableMultiline();
  carePlanField.addToPage(page2, {
    x: 35,
    y: 220,
    width: 525,
    height: 190,
    textColor: DARK_GRAY,
    backgroundColor: rgb(1, 1, 1),
    borderColor: BORDER_COLOR,
    borderWidth: 1,
  });
  carePlanField.setFontSize(9);

  // Section 5: Recommended Scales
  page2.drawText("4. ESCALAS CLÍNICAS RECOMENDADAS PARA ACOMPANHAMENTO", {
    x: 35,
    y: 195,
    size: 10,
    font: fontBold,
    color: PRIMARY_COLOR,
  });

  const scalesField = form.createTextField("escalas_recomendadas");
  scalesField.setText(evolution.recommendedScales.join("\n"));
  scalesField.enableMultiline();
  scalesField.addToPage(page2, {
    x: 35,
    y: 105,
    width: 525,
    height: 75,
    textColor: DARK_GRAY,
    backgroundColor: rgb(1, 1, 1),
    borderColor: BORDER_COLOR,
    borderWidth: 1,
  });
  scalesField.setFontSize(9);

  // Professional stamp & Signature line on second page footer area
  drawSignatureAndStamp(page2, fontBold, fontReg, 95, 45, false);

  drawFooter(page2, fontReg, 2, 2);

  // Save and download PDF
  const pdfBytes = await pdfDoc.save();
  const blob = new Blob([pdfBytes], { type: "application/pdf" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `Evolucao_SAE_${patient.name.replace(/\s+/g, "_")}_${new Date(evolution.date).toISOString().split("T")[0]}.pdf`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// 2. Generate PDF of Clinical Scale Applied
export async function generateScalePDF(
  patient: { name: string; age: string; bed: string },
  scale: { scaleType: string; scaleName: string; date: string; score: number; result: string; answers: Record<string, any> }
) {
  const pdfDoc = await PDFDocument.create();
  const fontReg = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const form = pdfDoc.getForm();

  const page = pdfDoc.addPage([595.275, 841.89]);
  drawHeader(page, fontBold, fontReg, `AVALIAÇÃO CLÍNICA: ${scale.scaleName.toUpperCase()}`);

  // Identification Block
  page.drawRectangle({
    x: 35,
    y: 660,
    width: 525,
    height: 90,
    color: LIGHT_GRAY,
    borderColor: BORDER_COLOR,
    borderWidth: 1,
  });

  page.drawText("IDENTIFICAÇÃO DO PACIENTE", {
    x: 45,
    y: 735,
    size: 9,
    font: fontBold,
    color: PRIMARY_COLOR,
  });

  page.drawText(`Nome: ${patient.name || "Não informado"}`, { x: 45, y: 715, size: 10, font: fontReg, color: DARK_GRAY });
  page.drawText(`Leito/End: ${patient.bed || "N/A"}`, { x: 320, y: 715, size: 10, font: fontReg, color: DARK_GRAY });
  page.drawText(`Idade: ${patient.age ? `${patient.age} anos` : "N/A"}`, { x: 45, y: 695, size: 10, font: fontReg, color: DARK_GRAY });
  page.drawText(`Data de Aplicação: ${new Date(scale.date).toLocaleString("pt-BR")}`, { x: 320, y: 695, size: 10, font: fontReg, color: DARK_GRAY });

  // Scale Result Title
  page.drawText(`RESULTADO DA ESCALA DE ${scale.scaleName.toUpperCase()}`, {
    x: 35,
    y: 630,
    size: 11,
    font: fontBold,
    color: PRIMARY_COLOR,
  });

  // Score Box
  page.drawRectangle({
    x: 35,
    y: 530,
    width: 525,
    height: 80,
    color: rgb(240 / 255, 253 / 255, 250 / 255), // Teal light bg
    borderColor: PRIMARY_COLOR,
    borderWidth: 1,
  });

  page.drawText(`Escore Obtido: ${scale.score} pontos`, {
    x: 55,
    y: 580,
    size: 14,
    font: fontBold,
    color: PRIMARY_COLOR,
  });

  page.drawText(`Classificação de Risco / Resultado:`, {
    x: 55,
    y: 560,
    size: 9,
    font: fontReg,
    color: DARK_GRAY,
  });

  page.drawText(scale.result, {
    x: 55,
    y: 542,
    size: 12,
    font: fontBold,
    color: DARK_GRAY,
  });

  // Answers Section (AcroForm field for additional observation)
  page.drawText("DETALHES DA AVALIAÇÃO / RESPOSTAS", {
    x: 35,
    y: 500,
    size: 11,
    font: fontBold,
    color: PRIMARY_COLOR,
  });

  // Compile responses text
  let answersText = "";
  Object.entries(scale.answers).forEach(([key, val]) => {
    answersText += `• ${key}: ${val}\n`;
  });

  const answersField = form.createTextField("respostas_escala");
  answersField.setText(answersText + "\nObservações Clínicas Adicionais:\n");
  answersField.enableMultiline();
  answersField.addToPage(page, {
    x: 35,
    y: 150,
    width: 525,
    height: 330,
    textColor: DARK_GRAY,
    backgroundColor: rgb(1, 1, 1),
    borderColor: BORDER_COLOR,
    borderWidth: 1,
  });
  answersField.setFontSize(10);

  // Signature
  drawSignatureAndStamp(page, fontBold, fontReg, 110, 60, false);

  drawFooter(page, fontReg, 1, 1);

  // Download PDF
  const pdfBytes = await pdfDoc.save();
  const blob = new Blob([pdfBytes], { type: "application/pdf" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `Escala_${scale.scaleType}_${patient.name.replace(/\s+/g, "_")}.pdf`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// 3. Generate PDF of Nurse Shift Schedule
export async function generatePlantaoPDF(plantao: { month: string; professionals: any[]; schedule: Record<string, any> }) {
  const pdfDoc = await PDFDocument.create();
  const fontReg = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const form = pdfDoc.getForm();

  const page = pdfDoc.addPage([841.89, 595.275]); // Landscape A4 is perfect for grids
  
  // Custom Header for Landscape
  page.drawRectangle({
    x: 0,
    y: 520,
    width: 841.89,
    height: 75,
    color: PRIMARY_COLOR,
  });

  page.drawText("Apoio Enfermagem — Bruno T. Prates", {
    x: 35,
    y: 560,
    size: 18,
    font: fontBold,
    color: rgb(1, 1, 1),
  });

  const [year, month] = plantao.month.split("-");
  page.drawText(`ESCALA DE PLANTÕES E EQUIPE — MÊS: ${month}/${year}`, {
    x: 35,
    y: 538,
    size: 11,
    font: fontReg,
    color: rgb(0.9, 0.9, 0.9),
  });

  page.drawText("Enfermeiro Bruno T. Prates — COREN-MG 994720", {
    x: 550,
    y: 555,
    size: 10,
    font: fontBold,
    color: rgb(1, 1, 1),
  });

  // Table header labels
  page.drawText("Colaborador (Cargo)", { x: 35, y: 480, size: 9, font: fontBold, color: DARK_GRAY });
  page.drawText("Carga Horária", { x: 180, y: 480, size: 9, font: fontBold, color: DARK_GRAY });
  page.drawText("Escala de Trabalho Diária (Plantões do Mês)", { x: 260, y: 480, size: 9, font: fontBold, color: PRIMARY_COLOR });

  // Let's create an elegant, multi-line editable text grid
  let scheduleText = "";
  plantao.professionals.forEach((prof) => {
    scheduleText += `${prof.name} (${prof.role}) [H: ${prof.hours}h]\n`;
    
    // Days representation
    const daysArr: string[] = [];
    const daysInMonth = new Date(parseInt(year), parseInt(month), 0).getDate();
    for (let d = 1; d <= daysInMonth; d++) {
      const dayStr = String(d).padStart(2, "0");
      const shift = plantao.schedule[prof.id]?.[dayStr] || "-";
      daysArr.push(`${d}:${shift}`);
    }
    scheduleText += `Plantões: ${daysArr.join(" | ")}\n\n`;
  });

  const gridField = form.createTextField("grid_escala_plantao");
  gridField.setText(scheduleText);
  gridField.enableMultiline();
  gridField.addToPage(page, {
    x: 35,
    y: 100,
    width: 770,
    height: 360,
    textColor: DARK_GRAY,
    backgroundColor: rgb(1, 1, 1),
    borderColor: BORDER_COLOR,
    borderWidth: 1,
  });
  gridField.setFontSize(9);

  // Footer for landscape
  page.drawText("Legenda: D = Diurno (12h) | N = Noturno (12h) | M = Manhã (6h) | T = Tarde (6h) | F = Folga | - = Não escala", {
    x: 35,
    y: 45,
    size: 8,
    font: fontReg,
    color: DARK_GRAY,
  });

  drawSignatureAndStamp(page, fontBold, fontReg, 95, 45, true);

  const footerY = 20;
  page.drawText("Escala mensal de serviço da equipe de enfermagem elaborada profissionalmente.", {
    x: 35,
    y: footerY,
    size: 7,
    font: fontReg,
    color: rgb(0.5, 0.5, 0.5),
  });

  // Download PDF
  const pdfBytes = await pdfDoc.save();
  const blob = new Blob([pdfBytes], { type: "application/pdf" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `Escala_Mensal_${plantao.month}.pdf`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// 4. Generate PDF of Free Document
export async function generateFreeDocPDF(doc: { title: string; content: string; date: string }) {
  const pdfDoc = await PDFDocument.create();
  const fontReg = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const form = pdfDoc.getForm();

  const page = pdfDoc.addPage([595.275, 841.89]);
  drawHeader(page, fontBold, fontReg, `DOCUMENTO AVULSO / PARECER`);

  // Document Title
  page.drawText(doc.title.toUpperCase(), {
    x: 35,
    y: 720,
    size: 12,
    font: fontBold,
    color: PRIMARY_COLOR,
  });

  page.drawText(`Data de Emissão: ${new Date(doc.date).toLocaleDateString("pt-BR")}`, {
    x: 35,
    y: 705,
    size: 9,
    font: fontReg,
    color: DARK_GRAY,
  });

  // Main editable document contents
  const documentField = form.createTextField("documento_livre_conteudo");
  documentField.setText(doc.content);
  documentField.enableMultiline();
  documentField.addToPage(page, {
    x: 35,
    y: 150,
    width: 525,
    height: 540,
    textColor: DARK_GRAY,
    backgroundColor: rgb(1, 1, 1),
    borderColor: BORDER_COLOR,
    borderWidth: 1,
  });
  documentField.setFontSize(10);

  // Signature block
  drawSignatureAndStamp(page, fontBold, fontReg, 110, 60, false);

  drawFooter(page, fontReg, 1, 1);

  // Download PDF
  const pdfBytes = await pdfDoc.save();
  const blob = new Blob([pdfBytes], { type: "application/pdf" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `Documento_${doc.title.replace(/\s+/g, "_")}.pdf`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// 5. Generate PDF of Rapid Shift Note (Anotação de Plantão)
export async function generateAnotacaoPDF(
  patient: { name: string; age: string; bed: string },
  note: { date: string; originalText: string; revisedText?: string }
) {
  const pdfDoc = await PDFDocument.create();
  const fontReg = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const form = pdfDoc.getForm();

  const page = pdfDoc.addPage([595.275, 841.89]);
  drawHeader(page, fontBold, fontReg, "ANOTAÇÃO RÁPIDA DE PLANTÃO");

  // Patient block
  page.drawRectangle({
    x: 35,
    y: 660,
    width: 525,
    height: 90,
    color: LIGHT_GRAY,
    borderColor: BORDER_COLOR,
    borderWidth: 1,
  });

  page.drawText("IDENTIFICAÇÃO DO PACIENTE", {
    x: 45,
    y: 735,
    size: 9,
    font: fontBold,
    color: PRIMARY_COLOR,
  });

  page.drawText(`Nome: ${patient.name || "Não informado"}`, { x: 45, y: 715, size: 10, font: fontReg, color: DARK_GRAY });
  page.drawText(`Leito/End: ${patient.bed || "N/A"}`, { x: 320, y: 715, size: 10, font: fontReg, color: DARK_GRAY });
  page.drawText(`Idade: ${patient.age ? `${patient.age} anos` : "N/A"}`, { x: 45, y: 695, size: 10, font: fontReg, color: DARK_GRAY });
  page.drawText(`Data/Hora: ${new Date(note.date).toLocaleString("pt-BR")}`, { x: 320, y: 695, size: 10, font: fontReg, color: DARK_GRAY });

  // Original Narrative
  page.drawText("RELATO DE ENTRADA (RÁPIDO / TEXTO LIVRE)", {
    x: 35,
    y: 630,
    size: 10,
    font: fontBold,
    color: PRIMARY_COLOR,
  });

  const originalField = form.createTextField("original_anotacao");
  originalField.setText(note.originalText);
  originalField.enableMultiline();
  originalField.addToPage(page, {
    x: 35,
    y: 410,
    width: 525,
    height: 205,
    textColor: DARK_GRAY,
    backgroundColor: rgb(1, 1, 1),
    borderColor: BORDER_COLOR,
    borderWidth: 1,
  });
  originalField.setFontSize(9);

  // Polished technical note
  page.drawText("ANOTAÇÃO TÉCNICA E CIENTÍFICA DE ENFERMAGEM (REVISADA POR IA)", {
    x: 35,
    y: 380,
    size: 10,
    font: fontBold,
    color: PRIMARY_COLOR,
  });

  const revisedField = form.createTextField("revisada_anotacao");
  revisedField.setText(note.revisedText || "Anotação ainda não revisada com IA online.");
  revisedField.enableMultiline();
  revisedField.addToPage(page, {
    x: 35,
    y: 150,
    width: 525,
    height: 215,
    textColor: DARK_GRAY,
    backgroundColor: rgb(1, 1, 1),
    borderColor: BORDER_COLOR,
    borderWidth: 1,
  });
  revisedField.setFontSize(9);

  // Signature line
  drawSignatureAndStamp(page, fontBold, fontReg, 110, 60, false);

  drawFooter(page, fontReg, 1, 1);

  const pdfBytes = await pdfDoc.save();
  const blob = new Blob([pdfBytes], { type: "application/pdf" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `Anotacao_Plantao_${patient.name.replace(/\s+/g, "_")}.pdf`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// 6. Generate PDF of Wound / Lesion Assessment (Módulo de Lesões)
export async function generateLesaoPDF(
  patient: { name: string; age: string; bed: string },
  lesao: {
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
  }
) {
  const pdfDoc = await PDFDocument.create();
  const fontReg = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const form = pdfDoc.getForm();

  const page = pdfDoc.addPage([595.275, 841.89]);
  drawHeader(page, fontBold, fontReg, "FICHA DE AVALIAÇÃO DE FERIDAS / LESÕES");

  // Patient block
  page.drawRectangle({
    x: 35,
    y: 670,
    width: 525,
    height: 80,
    color: LIGHT_GRAY,
    borderColor: BORDER_COLOR,
    borderWidth: 1,
  });

  page.drawText("IDENTIFICAÇÃO DO PACIENTE", {
    x: 45,
    y: 735,
    size: 9,
    font: fontBold,
    color: PRIMARY_COLOR,
  });

  page.drawText(`Nome: ${patient.name || "Não informado"}`, { x: 45, y: 715, size: 10, font: fontReg, color: DARK_GRAY });
  page.drawText(`Leito/End: ${patient.bed || "N/A"}`, { x: 320, y: 715, size: 10, font: fontReg, color: DARK_GRAY });
  page.drawText(`Idade: ${patient.age ? `${patient.age} anos` : "N/A"}`, { x: 45, y: 695, size: 10, font: fontReg, color: DARK_GRAY });
  page.drawText(`Data Registro: ${new Date(lesao.date).toLocaleDateString("pt-BR")}`, { x: 320, y: 695, size: 10, font: fontReg, color: DARK_GRAY });

  // Lesion details title
  page.drawText("EXAME FÍSICO DA LESÃO E CARACTERÍSTICAS", {
    x: 35,
    y: 645,
    size: 11,
    font: fontBold,
    color: PRIMARY_COLOR,
  });

  // Table-like structure with editable form fields
  let yPos = 615;
  const drawLabelAndField = (label: string, value: string, fieldName: string, w: number) => {
    page.drawText(label, { x: 35, y: yPos + 4, size: 9, font: fontBold, color: DARK_GRAY });
    const fld = form.createTextField(fieldName);
    fld.setText(value);
    fld.addToPage(page, {
      x: 180,
      y: yPos,
      width: w,
      height: 18,
      textColor: DARK_GRAY,
      backgroundColor: rgb(1, 1, 1),
      borderColor: BORDER_COLOR,
      borderWidth: 0.5,
    });
    fld.setFontSize(9);
    yPos -= 23;
  };

  drawLabelAndField("Localização Anatômica:", lesao.location, "lesao_anatomica", 380);
  drawLabelAndField("Tipo de Ferida/Lesão:", lesao.type, "lesao_tipo", 380);
  if (lesao.stage) {
    drawLabelAndField("Estágio de Gravidade (LPP):", lesao.stage, "lesao_estagio", 380);
  }
  drawLabelAndField("Tecido Predominante:", lesao.tissueType, "lesao_tecido", 380);
  drawLabelAndField("Volume de Exsudato:", lesao.exudate, "lesao_exsudato", 380);
  drawLabelAndField("Aspecto das Bordas:", lesao.edges, "lesao_bordas", 380);
  drawLabelAndField("Sinais de Infecção presentes:", lesao.signsOfInfection.join(", ") || "Nenhum detectado", "lesao_infeccao", 380);
  drawLabelAndField("Dimensões (Comprimento x Largura):", `${lesao.sizeLength} cm x ${lesao.sizeWidth} cm`, "lesao_dimensao", 380);

  yPos -= 10;
  // Conducts and Coverings
  page.drawText("CONDUTAS TERAPÊUTICAS & COBERTURAS APLICADAS", {
    x: 35,
    y: yPos,
    size: 10,
    font: fontBold,
    color: PRIMARY_COLOR,
  });

  yPos -= 75;
  const conductsField = form.createTextField("lesao_condutas");
  conductsField.setText(lesao.conducts);
  conductsField.enableMultiline();
  conductsField.addToPage(page, {
    x: 35,
    y: yPos,
    width: 525,
    height: 65,
    textColor: DARK_GRAY,
    backgroundColor: rgb(1, 1, 1),
    borderColor: BORDER_COLOR,
    borderWidth: 1,
  });
  conductsField.setFontSize(9);

  yPos -= 25;
  // Evolution Narrative
  page.drawText("EVOLUÇÃO CLÍNICA DA FERIDA (DETALHADA)", {
    x: 35,
    y: yPos,
    size: 10,
    font: fontBold,
    color: PRIMARY_COLOR,
  });

  yPos -= 115;
  const evolNoteField = form.createTextField("lesao_evol_narrativa");
  evolNoteField.setText(lesao.evolutionNote || "Sem anotações de evolução adicionais.");
  evolNoteField.enableMultiline();
  evolNoteField.addToPage(page, {
    x: 35,
    y: yPos,
    width: 525,
    height: 105,
    textColor: DARK_GRAY,
    backgroundColor: rgb(1, 1, 1),
    borderColor: BORDER_COLOR,
    borderWidth: 1,
  });
  evolNoteField.setFontSize(9);

  drawFooter(page, fontReg, 1, 2);

  // Page 2: Pathophysiology, AI care guidelines and medications
  const page2 = pdfDoc.addPage([595.275, 841.89]);
  drawHeader(page2, fontBold, fontReg, "DIRETRIZES TERAPÊUTICAS & FISIOPATOLOGIA DA LESÃO");

  // Section 1: Fisiopatologia
  page2.drawText("1. FISIOPATOLOGIA DA LESÃO (POR QUE OCORRE / PROCESSOS NO TECIDO)", {
    x: 35,
    y: 740,
    size: 10,
    font: fontBold,
    color: PRIMARY_COLOR,
  });

  const fisioField = form.createTextField("lesao_fisiopatologia");
  fisioField.setText(lesao.fisiopatologia || "Informação não registrada.");
  fisioField.enableMultiline();
  fisioField.addToPage(page2, {
    x: 35,
    y: 655,
    width: 525,
    height: 75,
    textColor: DARK_GRAY,
    backgroundColor: rgb(1, 1, 1),
    borderColor: BORDER_COLOR,
    borderWidth: 1,
  });
  fisioField.setFontSize(9);

  // Section 2: Plano de Tratamento e Coberturas recomendadas
  page2.drawText("2. PLANO DE TRATAMENTO & COBERTURAS RECOMENDADAS (COM JUSTIFICATIVAS)", {
    x: 35,
    y: 630,
    size: 10,
    font: fontBold,
    color: PRIMARY_COLOR,
  });

  const planoField = form.createTextField("lesao_plano_curativo");
  planoField.setText(
    `PLANO DE TRATAMENTO RECOMENDADO:\n${lesao.planoTratamento || "N/A"}\n\n` +
    `COBERTURAS RECOMENDADAS & MECANISMOS DE AÇÃO:\n${lesao.coberturasRecomendadas || "N/A"}`
  );
  planoField.enableMultiline();
  planoField.addToPage(page2, {
    x: 35,
    y: 445,
    width: 525,
    height: 175,
    textColor: DARK_GRAY,
    backgroundColor: rgb(1, 1, 1),
    borderColor: BORDER_COLOR,
    borderWidth: 1,
  });
  planoField.setFontSize(9);

  // Section 3: Tratamento Passo a Passo
  page2.drawText("3. TRATAMENTO PASSO A PASSO INDICADO (LIMPEZA, APLICAÇÃO E FREQUÊNCIA)", {
    x: 35,
    y: 420,
    size: 10,
    font: fontBold,
    color: PRIMARY_COLOR,
  });

  const passoField = form.createTextField("lesao_passo_passo");
  passoField.setText(lesao.tratamentoPasso || "Informação não registrada.");
  passoField.enableMultiline();
  passoField.addToPage(page2, {
    x: 35,
    y: 335,
    width: 525,
    height: 75,
    textColor: DARK_GRAY,
    backgroundColor: rgb(1, 1, 1),
    borderColor: BORDER_COLOR,
    borderWidth: 1,
  });
  passoField.setFontSize(9);

  // Section 4: Medicamentos Tópicos e Contraindicações
  page2.drawText("4. MEDICAMENTOS TÓPICOS FREQUENTES, INDICAÇÕES & CONTRAINDICAÇÕES", {
    x: 35,
    y: 310,
    size: 10,
    font: fontBold,
    color: PRIMARY_COLOR,
  });

  const medsField = form.createTextField("lesao_meds_contraindica");
  medsField.setText(
    `MEDICAMENTOS TÓPICOS E EFEITOS ESPERADOS:\n${lesao.medicamentosTopicos || "N/A"}\n\n` +
    `INDICAÇÕES E CONTRAINDICAÇÕES ESPECÍFICAS:\n${lesao.indicacoesContraindicacoes || "N/A"}`
  );
  medsField.enableMultiline();
  medsField.addToPage(page2, {
    x: 35,
    y: 155,
    width: 525,
    height: 145,
    textColor: DARK_GRAY,
    backgroundColor: rgb(1, 1, 1),
    borderColor: BORDER_COLOR,
    borderWidth: 1,
  });
  medsField.setFontSize(9);

  // Signatures on Page 2
  drawSignatureAndStamp(page2, fontBold, fontReg, 110, 60, false);

  drawFooter(page2, fontReg, 2, 2);

  const pdfBytes = await pdfDoc.save();
  const blob = new Blob([pdfBytes], { type: "application/pdf" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `Ficha_Lesao_${lesao.location.replace(/\s+/g, "_")}.pdf`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// 7. Generate PDF of Patient Vaccination Card (Carteira de Vacinação)
export async function generateVacinasPDF(
  patient: { name: string; age: string; bed: string },
  vacinas: any[]
) {
  const pdfDoc = await PDFDocument.create();
  const fontReg = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const form = pdfDoc.getForm();

  const page = pdfDoc.addPage([595.275, 841.89]);
  drawHeader(page, fontBold, fontReg, "CARTÃO DE VACINAÇÃO DO PACIENTE (P.N.I.)");

  // Patient block
  page.drawRectangle({
    x: 35,
    y: 670,
    width: 525,
    height: 80,
    color: LIGHT_GRAY,
    borderColor: BORDER_COLOR,
    borderWidth: 1,
  });

  page.drawText("IDENTIFICAÇÃO DO PACIENTE", {
    x: 45,
    y: 735,
    size: 9,
    font: fontBold,
    color: PRIMARY_COLOR,
  });

  page.drawText(`Nome: ${patient.name || "Não informado"}`, { x: 45, y: 715, size: 10, font: fontReg, color: DARK_GRAY });
  page.drawText(`Leito/End: ${patient.bed || "N/A"}`, { x: 320, y: 715, size: 10, font: fontReg, color: DARK_GRAY });
  page.drawText(`Idade: ${patient.age ? `${patient.age} anos` : "N/A"}`, { x: 45, y: 695, size: 10, font: fontReg, color: DARK_GRAY });
  page.drawText(`Data de Emissão: ${new Date().toLocaleDateString("pt-BR")}`, { x: 320, y: 695, size: 10, font: fontReg, color: DARK_GRAY });

  // Table heading
  page.drawText("VACINAS ADMINISTRADAS / HISTÓRICO", {
    x: 35,
    y: 635,
    size: 11,
    font: fontBold,
    color: PRIMARY_COLOR,
  });

  // Let's print out the table inside a big multiline text box to make it editable!
  let tableText = "VACINA               | DOSE        | DATA       | LOTE       | PROFISSIONAL\n";
  tableText += "---------------------|-------------|------------|------------|----------------------\n";

  if (vacinas.length === 0) {
    tableText += "Nenhuma vacina cadastrada no registro do paciente.\n";
  } else {
    vacinas.forEach((vac) => {
      const name = (vac.vaccineName || "").padEnd(20).substring(0, 20);
      const dose = (vac.dose || "").padEnd(11).substring(0, 11);
      const date = new Date(vac.date).toLocaleDateString("pt-BR").padEnd(10);
      const batch = (vac.batch || "").padEnd(10).substring(0, 10);
      const app = (vac.applicator || "").substring(0, 22);
      tableText += `${name} | ${dose} | ${date} | ${batch} | ${app}\n`;
    });
  }

  const vacTableField = form.createTextField("carteira_vacinas");
  vacTableField.setText(tableText + "\n\nObservações e Próximos Agendamentos de Vacinas:\n");
  vacTableField.enableMultiline();
  vacTableField.addToPage(page, {
    x: 35,
    y: 150,
    width: 525,
    height: 470,
    textColor: DARK_GRAY,
    backgroundColor: rgb(1, 1, 1),
    borderColor: BORDER_COLOR,
    borderWidth: 1,
  });
  vacTableField.setFontSize(9);

  // Signatures
  drawSignatureAndStamp(page, fontBold, fontReg, 110, 60, false);

  drawFooter(page, fontReg, 1, 1);

  const pdfBytes = await pdfDoc.save();
  const blob = new Blob([pdfBytes], { type: "application/pdf" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `Cartao_Vacinas_${patient.name.replace(/\s+/g, "_")}.pdf`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export async function generatePranchetaPDF(
  isBlank: boolean,
  type: "hospitalar" | "domiciliar",
  patient: { name: string; age: string; bed: string; diagnosis: string; comorbidity: string; alergias?: string; caregiver?: string; relationship?: string },
  data: {
    pa: string; fc: string; fr: string; temp: string; spo2: string; glicemia: string; dor: string;
    estadoGeral: string; neurologico: string; respiratorio: string; digestivo: string; urinario: string; pele: string;
    intercorrencias: string; condutas: string; caregiverBurden?: string;
  }
) {
  const pdfDoc = await PDFDocument.create();
  const fontReg = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const form = pdfDoc.getForm();

  const page = pdfDoc.addPage([595.275, 841.89]); // A4 size

  const title = `PRANCHETA ${type === "hospitalar" ? "HOSPITALAR DE BEIRA-LEITO" : "DOMICILIAR DE VISITA"}`;
  drawHeader(page, fontBold, fontReg, title);

  // Helper to add form text fields
  const addEditableField = (
    name: string,
    val: string,
    x: number,
    y: number,
    w: number,
    h: number,
    multiline = false
  ) => {
    const fld = form.createTextField(name);
    fld.setText(isBlank ? "" : val);
    if (multiline) fld.enableMultiline();
    fld.addToPage(page, {
      x,
      y,
      width: w,
      height: h,
      textColor: DARK_GRAY,
      backgroundColor: rgb(1, 1, 1),
      borderColor: BORDER_COLOR,
      borderWidth: 0.5,
    });
    fld.setFontSize(multiline ? 8 : 9);
  };

  // Section 1: Identification (LIGHT_GRAY block)
  page.drawRectangle({
    x: 35,
    y: 595,
    width: 525,
    height: 160,
    color: LIGHT_GRAY,
    borderColor: BORDER_COLOR,
    borderWidth: 1,
  });

  page.drawText("IDENTIFICAÇÃO", {
    x: 45,
    y: 742,
    size: 9,
    font: fontBold,
    color: PRIMARY_COLOR,
  });

  page.drawText("Nome do Paciente:", { x: 45, y: 720, size: 8, font: fontBold, color: DARK_GRAY });
  addEditableField("p_nome", patient.name, 130, 715, 230, 15);

  page.drawText("Idade:", { x: 370, y: 720, size: 8, font: fontBold, color: DARK_GRAY });
  addEditableField("p_idade", patient.age, 410, 715, 50, 15);

  page.drawText(type === "hospitalar" ? "Leito/Ala:" : "Endereço:", { x: 45, y: 700, size: 8, font: fontBold, color: DARK_GRAY });
  addEditableField("p_bed_or_address", patient.bed, 130, 695, 330, 15);

  page.drawText("Diagnóstico Principal:", { x: 45, y: 680, size: 8, font: fontBold, color: DARK_GRAY });
  addEditableField("p_diagnosis", patient.diagnosis, 130, 675, 330, 15);

  page.drawText("Comorbidades:", { x: 45, y: 660, size: 8, font: fontBold, color: DARK_GRAY });
  addEditableField("p_comorb", patient.comorbidity, 130, 655, 330, 15);

  page.drawText("Alergias:", { x: 45, y: 640, size: 8, font: fontBold, color: DARK_GRAY });
  addEditableField("p_alergias", patient.alergias || "Nenhuma relatada", 130, 635, 330, 15);

  if (type === "domiciliar") {
    page.drawText("Cuidador:", { x: 45, y: 620, size: 8, font: fontBold, color: DARK_GRAY });
    addEditableField("p_caregiver", patient.caregiver || "", 130, 615, 170, 15);

    page.drawText("Parentesco:", { x: 310, y: 620, size: 8, font: fontBold, color: DARK_GRAY });
    addEditableField("p_relat", patient.relationship || "", 370, 615, 90, 15);
  }

  // Section 2: Sinais Vitais (S/V)
  page.drawRectangle({
    x: 35,
    y: 520,
    width: 525,
    height: 65,
    color: LIGHT_GRAY,
    borderColor: BORDER_COLOR,
    borderWidth: 1,
  });

  page.drawText("SINAIS VITAIS", {
    x: 45,
    y: 572,
    size: 9,
    font: fontBold,
    color: PRIMARY_COLOR,
  });

  page.drawText("PA:", { x: 45, y: 545, size: 8, font: fontBold, color: DARK_GRAY });
  addEditableField("sv_pa", data.pa, 65, 540, 35, 15);

  page.drawText("FC:", { x: 110, y: 545, size: 8, font: fontBold, color: DARK_GRAY });
  addEditableField("sv_fc", data.fc, 130, 540, 30, 15);

  page.drawText("FR:", { x: 170, y: 545, size: 8, font: fontBold, color: DARK_GRAY });
  addEditableField("sv_fr", data.fr, 190, 540, 30, 15);

  page.drawText("Temp:", { x: 230, y: 545, size: 8, font: fontBold, color: DARK_GRAY });
  addEditableField("sv_temp", data.temp, 260, 540, 30, 15);

  page.drawText("SpO2:", { x: 300, y: 545, size: 8, font: fontBold, color: DARK_GRAY });
  addEditableField("sv_spo2", data.spo2, 330, 540, 30, 15);

  page.drawText("Glicemia:", { x: 370, y: 545, size: 8, font: fontBold, color: DARK_GRAY });
  addEditableField("sv_glicemia", data.glicemia, 415, 540, 35, 15);

  page.drawText("Dor (0-10):", { x: 460, y: 545, size: 8, font: fontBold, color: DARK_GRAY });
  addEditableField("sv_dor", data.dor, 515, 540, 35, 15);

  // Section 3: Avaliação de Sistemas e Condutas
  page.drawText("AVALIAÇÃO DE ENFERMAGEM CLÍNICA E CONDUTAS", {
    x: 35,
    y: 498,
    size: 10,
    font: fontBold,
    color: PRIMARY_COLOR,
  });

  const rowHeight = 40;
  let currentY = 460;

  const addSystemRow = (label: string, fieldName: string, value: string) => {
    page.drawText(label, { x: 35, y: currentY + 12, size: 8, font: fontBold, color: DARK_GRAY });
    addEditableField(fieldName, value, 180, currentY, 380, 25, true);
    currentY -= rowHeight;
  };

  addSystemRow("1. Estado Geral:", "sys_geral", data.estadoGeral);
  addSystemRow("2. Neurológico:", "sys_neuro", data.neurologico);
  addSystemRow("3. Respiratório:", "sys_resp", data.respiratorio);
  addSystemRow("4. Digestivo/Nutrição:", "sys_digest", data.digestivo);
  addSystemRow("5. Urinário/Eliminação:", "sys_urina", data.urinario);
  addSystemRow("6. Pele/Mobilidade/Curativos:", "sys_pele", data.pele);

  if (type === "hospitalar") {
    addSystemRow("7. Intercorrências:", "sys_interc", data.intercorrencias);
    addSystemRow("8. Condutas tomadas:", "sys_condutas", data.condutas);
  } else {
    addSystemRow("7. Sobrecarga Cuidador:", "sys_sobrecarga", data.caregiverBurden || "");
    addSystemRow("8. Orientações/Próx. Visita:", "sys_condutas_dom", data.condutas);
  }

  // Active user profile signature
  let profNameSign = "Enfermeiro Bruno T. Prates";
  let profDetailsSign = "COREN-MG 994720";

  try {
    const saved = localStorage.getItem("user_profile");
    if (saved) {
      const profile = JSON.parse(saved);
      if (profile && profile.name) {
        if (profile.type === "Acadêmico") {
          profNameSign = `Acadêmico(a) de Enfermagem: ${profile.name}`;
          profDetailsSign = profile.institution ? `Instituição: ${profile.institution}` : "Estudante de Enfermagem";
        } else {
          profNameSign = `Enfermeiro(a): ${profile.name}`;
          profDetailsSign = profile.coren ? `COREN ${profile.coren}` : "Enfermeiro(a) Cadastrado(a)";
        }
      }
    }
  } catch (e) {
    console.error(e);
  }

  // Draw Signatures
  drawSignatureAndStamp(page, fontBold, fontReg, 95, 45, false);

  drawFooter(page, fontReg, 1, 1);

  // Trigger download
  const pdfBytes = await pdfDoc.save();
  const blob = new Blob([pdfBytes], { type: "application/pdf" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `Prancheta_${type === "hospitalar" ? "Hospitalar" : "Domiciliar"}_${isBlank ? "EmBranco" : patient.name.replace(/\s+/g, "_")}.pdf`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

