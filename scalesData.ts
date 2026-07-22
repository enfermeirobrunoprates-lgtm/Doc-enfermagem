export interface ScaleOption {
  label: string;
  value: number;
}

export interface ScaleQuestion {
  id: string;
  label: string;
  options: ScaleOption[];
}

export interface ScaleDefinition {
  id: string;
  name: string;
  category: "Pele (LPP)" | "Quedas" | "Consciência & Sedação" | "Dor" | "Independência & Funcional" | "Nutrição" | "Instabilidade & Gravidade" | "Carga de Trabalho" | "Cognição & Família" | "Outros Riscos";
  description: string;
  questions: ScaleQuestion[];
  interpret: (score: number, answers?: Record<string, any>) => string;
}

export const clinicalScalesList: ScaleDefinition[] = [
  // 1. PELE
  {
    id: "braden",
    name: "Braden (Risco de Lesão por Pressão)",
    category: "Pele (LPP)",
    description: "Avaliação do risco de desenvolvimento de lesão por pressão (LPP).",
    questions: [
      {
        id: "sensorial",
        label: "Percepção Sensorial (reagir à pressão dolorosa)",
        options: [
          { label: "1 - Totalmente Limitado", value: 1 },
          { label: "2 - Muito Limitado", value: 2 },
          { label: "3 - Pouco Limitado", value: 3 },
          { label: "4 - Sem Limitação", value: 4 },
        ]
      },
      {
        id: "umidade",
        label: "Umidade da Pele",
        options: [
          { label: "1 - Completamente Úmida", value: 1 },
          { label: "2 - Muito Úmida", value: 2 },
          { label: "3 - Ocasionalmente Úmida", value: 3 },
          { label: "4 - Raramente Úmida", value: 4 },
        ]
      },
      {
        id: "atividade",
        label: "Atividade Física",
        options: [
          { label: "1 - Acamado", value: 1 },
          { label: "2 - Na Cadeira", value: 2 },
          { label: "3 - Deambula Ocasionalmente", value: 3 },
          { label: "4 - Deambula Frequentemente", value: 4 },
        ]
      },
      {
        id: "mobilidade",
        label: "Mobilidade (mudar a posição do corpo)",
        options: [
          { label: "1 - Totalmente Imóvel", value: 1 },
          { label: "2 - Muito Limitada", value: 2 },
          { label: "3 - Pouco Limitada", value: 3 },
          { label: "4 - Sem Limitação", value: 4 },
        ]
      },
      {
        id: "nutricao",
        label: "Padrão de Nutrição",
        options: [
          { label: "1 - Muito Pobre (nunca come refeição completa)", value: 1 },
          { label: "2 - Provavelmente Inadequada (come metade)", value: 2 },
          { label: "3 - Adequada (come mais da metade)", value: 3 },
          { label: "4 - Excelente (ingere a maioria das refeições)", value: 4 },
        ]
      },
      {
        id: "friccao",
        label: "Fricção e Cisalhamento",
        options: [
          { label: "1 - Problema (requer assistência máxima)", value: 1 },
          { label: "2 - Problema Potencial (move-se fracamente)", value: 2 },
          { label: "3 - Sem Problema Aparente (move-se bem)", value: 3 },
        ]
      }
    ],
    interpret: (score) => {
      if (score >= 19) return "Sem Risco de Lesão por Pressão";
      if (score >= 15) return "Baixo Risco de Lesão por Pressão";
      if (score >= 13) return "Risco Moderado de Lesão por Pressão";
      if (score >= 10) return "Alto Risco de Lesão por Pressão";
      return "Risco Elevadíssimo de Lesão por Pressão";
    }
  },
  {
    id: "braden_q",
    name: "Braden Q (LPP Pediátrica)",
    category: "Pele (LPP)",
    description: "Avaliação do risco de lesão por pressão em pacientes pediátricos (menores de 8 anos).",
    questions: [
      {
        id: "sensorial",
        label: "Percepção Sensorial",
        options: [
          { label: "1 - Totalmente Limitado", value: 1 },
          { label: "2 - Muito Limitado", value: 2 },
          { label: "3 - Pouco Limitado", value: 3 },
          { label: "4 - Sem Limitação", value: 4 }
        ]
      },
      {
        id: "umidade",
        label: "Umidade da Pele",
        options: [
          { label: "1 - Completamente Úmida", value: 1 },
          { label: "2 - Muito Úmida", value: 2 },
          { label: "3 - Ocasionalmente Úmida", value: 3 },
          { label: "4 - Raramente Úmida", value: 4 }
        ]
      },
      {
        id: "atividade",
        label: "Atividade",
        options: [
          { label: "1 - Acamado", value: 1 },
          { label: "2 - Na Cadeira", value: 2 },
          { label: "3 - Deambula Ocasionalmente", value: 3 },
          { label: "4 - Deambula Frequentemente", value: 4 }
        ]
      },
      {
        id: "mobilidade",
        label: "Mobilidade",
        options: [
          { label: "1 - Totalmente Imóvel", value: 1 },
          { label: "2 - Muito Limitada", value: 2 },
          { label: "3 - Pouco Limitada", value: 3 },
          { label: "4 - Sem Limitação", value: 4 }
        ]
      },
      {
        id: "nutricao",
        label: "Nutrição",
        options: [
          { label: "1 - Muito Pobre", value: 1 },
          { label: "2 - Inadequada", value: 2 },
          { label: "3 - Adequada", value: 3 },
          { label: "4 - Excelente", value: 4 }
        ]
      },
      {
        id: "friccao",
        label: "Fricção e Cisalhamento",
        options: [
          { label: "1 - Problema Ativo", value: 1 },
          { label: "2 - Problema Potencial", value: 2 },
          { label: "3 - Sem Problema", value: 3 }
        ]
      },
      {
        id: "perfusao",
        label: "Perfusão Tecidual e Oxigenação",
        options: [
          { label: "1 - Extremamente Comprometida", value: 1 },
          { label: "2 - Comprometida", value: 2 },
          { label: "3 - Adequada", value: 3 },
          { label: "4 - Excelente", value: 4 }
        ]
      }
    ],
    interpret: (score) => {
      if (score <= 16) return "Risco de LPP Pediátrico Alto (Escore <= 16)";
      return "Baixo Risco de LPP Pediátrico";
    }
  },
  {
    id: "waterlow",
    name: "Waterlow (Risco de LPP Alternativo)",
    category: "Pele (LPP)",
    description: "Escala clínica inglesa para estimativa detalhada de risco de úlceras por pressão.",
    questions: [
      {
        id: "imc",
        label: "Relação Peso / Altura (IMC)",
        options: [
          { label: "0 - IMC Médio (20-24.9)", value: 0 },
          { label: "1 - IMC Acima da média (25-29.9)", value: 1 },
          { label: "2 - Obeso (>= 30)", value: 2 },
          { label: "3 - Abaixo do Peso (< 20)", value: 3 }
        ]
      },
      {
        id: "continencia",
        label: "Continência Esfincteriana",
        options: [
          { label: "0 - Completa / Sondado", value: 0 },
          { label: "1 - Incontinência Ocasional / Cateter", value: 1 },
          { label: "2 - Incontinência Urinária", value: 2 },
          { label: "3 - Incontinência Dupla (Fecal e Urinária)", value: 3 }
        ]
      },
      {
        id: "pele_tipo",
        label: "Tipo de Pele nas áreas de risco",
        options: [
          { label: "0 - Saudável / Íntegra", value: 0 },
          { label: "1 - Fina / Papel", value: 1 },
          { label: "2 - Seca / Descamativa", value: 2 },
          { label: "3 - Úmida / Edemaciada", value: 3 },
          { label: "4 - Alteração de coloração / Estágio 1", value: 4 }
        ]
      },
      {
        id: "mobilidade",
        label: "Mobilidade Clínica",
        options: [
          { label: "0 - Ativo", value: 0 },
          { label: "1 - Inquieto / Apático", value: 1 },
          { label: "2 - Restrito à cadeira", value: 2 },
          { label: "3 - Totalmente acamado", value: 3 },
          { label: "4 - Totalmente imóvel / Tração", value: 4 }
        ]
      },
      {
        id: "apetite",
        label: "Apetite / Padrão Alimentar",
        options: [
          { label: "0 - Médio / Normal", value: 0 },
          { label: "1 - Pobre / Líquida", value: 1 },
          { label: "2 - Sonda Enteral / GTT", value: 2 },
          { label: "3 - NPO / Jejum / Anoréxico", value: 3 }
        ]
      }
    ],
    interpret: (score) => {
      if (score >= 20) return "Risco Altíssimo de LPP (Pontos >= 20)";
      if (score >= 15) return "Risco Alto de LPP (Pontos 15-19)";
      if (score >= 10) return "Em Risco de LPP (Pontos 10-14)";
      return "Baixo Risco / Sem risco evidente";
    }
  },
  {
    id: "norton",
    name: "Norton (Risco de LPP Simples)",
    category: "Pele (LPP)",
    description: "A escala pioneira de avaliação de risco para lesão por pressão.",
    questions: [
      {
        id: "estado_fisico",
        label: "Estado Físico Geral",
        options: [
          { label: "4 - Bom", value: 4 },
          { label: "3 - Regular", value: 3 },
          { label: "2 - Ruim", value: 2 },
          { label: "1 - Muito Ruim", value: 1 }
        ]
      },
      {
        id: "estado_mental",
        label: "Estado Mental / Consciência",
        options: [
          { label: "4 - Lúcido", value: 4 },
          { label: "3 - Apático", value: 3 },
          { label: "2 - Confuso", value: 2 },
          { label: "1 - Estuporoso / Comatoso", value: 1 }
        ]
      },
      {
        id: "atividade",
        label: "Atividade",
        options: [
          { label: "4 - Ambulante (deambula)", value: 4 },
          { label: "3 - Anda com ajuda", value: 3 },
          { label: "2 - Sentado na cadeira", value: 2 },
          { label: "1 - Acamado permanente", value: 1 }
        ]
      },
      {
        id: "mobilidade",
        label: "Mobilidade motora",
        options: [
          { label: "4 - Total", value: 4 },
          { label: "3 - Pouco limitada", value: 3 },
          { label: "2 - Muito limitada", value: 2 },
          { label: "1 - Imóvel", value: 1 }
        ]
      },
      {
        id: "incontinencia",
        label: "Incontinência de eliminação",
        options: [
          { label: "4 - Ausente (continente)", value: 4 },
          { label: "3 - Ocasional", value: 3 },
          { label: "2 - Geralmente urinária", value: 2 },
          { label: "1 - Dupla (urinária e fecal)", value: 1 }
        ]
      }
    ],
    interpret: (score) => {
      if (score <= 12) return "Alto Risco de LPP (Norton <= 12)";
      if (score <= 14) return "Risco Moderado de LPP (Norton 13-14)";
      return "Baixo Risco / Sem Risco Especial";
    }
  },

  // 2. QUEDAS
  {
    id: "morse",
    name: "Morse Fall Scale (Risco de Queda)",
    category: "Quedas",
    description: "Método para avaliação do risco de queda em pacientes internados.",
    questions: [
      {
        id: "historico",
        label: "Histórico de Quedas Recentes (últimos 3 meses)",
        options: [
          { label: "Não (0 pontos)", value: 0 },
          { label: "Sim (25 pontos)", value: 25 }
        ]
      },
      {
        id: "diagnostico",
        label: "Diagnóstico Secundário (múltiplos diagnósticos médicos)",
        options: [
          { label: "Não (0 pontos)", value: 0 },
          { label: "Sim (15 pontos)", value: 15 }
        ]
      },
      {
        id: "auxilio",
        label: "Auxílio na Deambulação",
        options: [
          { label: "Nenhum / Acamado / Cadeira de rodas / Apoio de enfermagem (0 pontos)", value: 0 },
          { label: "Muletas, bengala ou andador (15 pontos)", value: 15 },
          { label: "Apoia-se em móveis ou paredes para caminhar (30 pontos)", value: 30 }
        ]
      },
      {
        id: "terapia_iv",
        label: "Terapia Intravenosa / Dispositivo IV Salinizado",
        options: [
          { label: "Não (0 pontos)", value: 0 },
          { label: "Sim (20 pontos)", value: 20 }
        ]
      },
      {
        id: "marcha",
        label: "Marcha / Locomoção",
        options: [
          { label: "Normal / Sem deambulação (0 pontos)", value: 0 },
          { label: "Fraca (anda curvado, passos curtos) (10 pontos)", value: 10 },
          { label: "Comprometida / Cambaleante (instável) (20 pontos)", value: 20 }
        ]
      },
      {
        id: "mental",
        label: "Estado Mental / Orientação Espacial",
        options: [
          { label: "Orientado e consciente das próprias limitações (0 pontos)", value: 0 },
          { label: "Superestima capacidades / Confuso / Esquece limitações (15 pontos)", value: 15 }
        ]
      }
    ],
    interpret: (score) => {
      if (score >= 51) return "Alto Risco de Queda (Pontos >= 51). Requer sinalização de risco e protocolo rígido.";
      if (score >= 25) return "Risco Moderado de Queda (Pontos 25-50).";
      return "Baixo Risco de Queda (Pontos 0-24).";
    }
  },
  {
    id: "humpty_dumpty",
    name: "Humpty Dumpty (Quedas Pediátrica)",
    category: "Quedas",
    description: "Avaliação do risco de quedas em enfermagem pediátrica hospitalar.",
    questions: [
      {
        id: "idade",
        label: "Idade da criança",
        options: [
          { label: "4 - Menor de 3 anos", value: 4 },
          { label: "3 - 3 a 7 anos", value: 3 },
          { label: "2 - 8 a 12 anos", value: 2 },
          { label: "1 - 13 anos ou mais", value: 1 }
        ]
      },
      {
        id: "genero",
        label: "Gênero",
        options: [
          { label: "2 - Masculino", value: 2 },
          { label: "1 - Feminino", value: 1 }
        ]
      },
      {
        id: "diagnostico",
        label: "Diagnóstico Clínico",
        options: [
          { label: "4 - Alterações neurológicas importantes", value: 4 },
          { label: "3 - Desidratação / Respiratório com hipóxia", value: 3 },
          { label: "2 - Psiquiátrico / Comportamental", value: 2 },
          { label: "1 - Outros diagnósticos normais", value: 1 }
        ]
      },
      {
        id: "cognicao",
        label: "Fatores Cognitivos / Neuromotores",
        options: [
          { label: "3 - Não consciente de limitações", value: 3 },
          { label: "2 - Esquece limitações sob estresse", value: 2 },
          { label: "1 - Orientado no espaço e tempo", value: 1 }
        ]
      },
      {
        id: "ambiente",
        label: "Fatores Ambientais",
        options: [
          { label: "4 - Histórico de quedas prévias", value: 4 },
          { label: "3 - Uso de dispositivos auxiliares / Berço", value: 3 },
          { label: "2 - Criança em cama comum fora do berço", value: 2 },
          { label: "1 - Ambulatório / Triagem rápida", value: 1 }
        ]
      }
    ],
    interpret: (score) => {
      if (score >= 12) return "Alto Risco de Queda Pediátrico (Humpty Dumpty >= 12)";
      return "Baixo Risco de Queda Pediátrico";
    }
  },

  // 3. CONSCIÊNCIA & SEDAÇÃO
  {
    id: "glasgow",
    name: "Glasgow (Escala de Coma de Glasgow)",
    category: "Consciência & Sedação",
    description: "Avaliação objetiva do nível de consciência de pacientes com trauma craniano ou críticos.",
    questions: [
      {
        id: "ocular",
        label: "Abertura Ocular",
        options: [
          { label: "4 - Espontânea", value: 4 },
          { label: "3 - Ao estímulo sonoro (chamado)", value: 3 },
          { label: "2 - Ao estímulo doloroso (pressão)", value: 2 },
          { label: "1 - Ausente", value: 1 }
        ]
      },
      {
        id: "verbal",
        label: "Resposta Verbal",
        options: [
          { label: "5 - Orientada", value: 5 },
          { label: "4 - Confusa", value: 4 },
          { label: "3 - Palavras inapropriadas", value: 3 },
          { label: "2 - Sons incompreensíveis (gemidos)", value: 2 },
          { label: "1 - Ausente", value: 1 }
        ]
      },
      {
        id: "motor",
        label: "Melhor Resposta Motora",
        options: [
          { label: "6 - Obedece a comandos", value: 6 },
          { label: "5 - Localiza estímulo doloroso", value: 5 },
          { label: "4 - Flexão normal / Retirada à dor", value: 4 },
          { label: "3 - Decorticação (flexão anormal)", value: 3 },
          { label: "2 - Descerebração (extensão anormal)", value: 2 },
          { label: "1 - Ausente", value: 1 }
        ]
      }
    ],
    interpret: (score) => {
      if (score >= 13) return "Nível de Consciência Leve / Normal (Escore 13-15)";
      if (score >= 9) return "Traumatismo Cranioencefálico / Disfunção Moderada (Escore 9-12)";
      return "Disfunção Neurológica Grave (Escore <= 8). Alto risco, indicação de via aérea artificial.";
    }
  },
  {
    id: "glasgow_pupils",
    name: "Glasgow-Pupils (GCS-P)",
    category: "Consciência & Sedação",
    description: "GCS acrescida da avaliação de reatividade pupilar para prognóstico aprimorado.",
    questions: [
      {
        id: "ocular",
        label: "Abertura Ocular (GCS)",
        options: [
          { label: "4 - Espontânea", value: 4 },
          { label: "3 - À voz", value: 3 },
          { label: "2 - À pressão / dor", value: 2 },
          { label: "1 - Ausente", value: 1 }
        ]
      },
      {
        id: "verbal",
        label: "Resposta Verbal (GCS)",
        options: [
          { label: "5 - Orientado", value: 5 },
          { label: "4 - Confuso", value: 4 },
          { label: "3 - Palavras soltas", value: 3 },
          { label: "2 - Sons apenas", value: 2 },
          { label: "1 - Ausente", value: 1 }
        ]
      },
      {
        id: "motor",
        label: "Resposta Motora (GCS)",
        options: [
          { label: "6 - Obedece comandos", value: 6 },
          { label: "5 - Localiza dor", value: 5 },
          { label: "4 - Flexão normal", value: 4 },
          { label: "3 - Flexão anormal (decorticação)", value: 3 },
          { label: "2 - Extensão anormal (descerebração)", value: 2 },
          { label: "1 - Sem resposta", value: 1 }
        ]
      },
      {
        id: "pupilas",
        label: "Reatividade Pupilar (A subtrair do score da GCS)",
        options: [
          { label: "0 - Ambas pupilas reagem à luz (-0)", value: 0 },
          { label: "1 - Apenas uma pupila reage à luz (-1)", value: -1 },
          { label: "2 - Nenhuma pupila reage à luz (-2)", value: -2 }
        ]
      }
    ],
    interpret: (score) => {
      // Note: in our form, GCS-P will calculate: GCS_SUM + PUPIL_VAL (which is negative)
      if (score >= 13) return "Nível de Consciência Preservado (GCS-P >= 13)";
      if (score >= 9) return "Comprometimento Neurológico Moderado";
      return "Traumatismo Grave / Comprometimento Neurológico Severo (GCS-P <= 8)";
    }
  },
  {
    id: "rass",
    name: "RASS ( Richmond Agitation-Sedation Scale )",
    category: "Consciência & Sedação",
    description: "Avaliação do nível de agitação ou sedação de pacientes em terapia intensiva.",
    questions: [
      {
        id: "nivel",
        label: "Grau de Agitação ou Sedação Atual",
        options: [
          { label: "+4 - Combativo (violento, perigo imediato)", value: 4 },
          { label: "+3 - Muito agitado (tenta arrancar cateteres)", value: 3 },
          { label: "+2 - Agitado (movimentos frequentes não coordenados)", value: 2 },
          { label: "+1 - Ansioso / Inquieto (apreensivo, mas sem agitação motora)", value: 1 },
          { label: " 0 - Alerta e Calmo", value: 0 },
          { label: "-1 - Sonolento (desperta ao chamado, contato visual > 10s)", value: -1 },
          { label: "-2 - Sedação leve (desperta ao chamado, contato visual < 10s)", value: -2 },
          { label: "-3 - Sedação moderada (movimenta-se ao chamado, sem contato visual)", value: -3 },
          { label: "-4 - Sedação profunda (sem resposta à voz, abre olhos à dor)", value: -4 },
          { label: "-5 - Sedação muito profunda (sem resposta à voz ou dor física)", value: -5 }
        ]
      }
    ],
    interpret: (score) => {
      if (score === 0) return "Paciente estável (Alerta e Calmo — Escore 0)";
      if (score > 0) return `Agitação Clínica Nível: +${score}`;
      return `Nível de Sedação Farmacológica/Clínica: ${score}`;
    }
  },
  {
    id: "ramsay",
    name: "Ramsay (Nível de Sedação)",
    category: "Consciência & Sedação",
    description: "Avaliação qualitativa simplificada de sedação em leitos de UTI.",
    questions: [
      {
        id: "nivel_ramsay",
        label: "Estado clínico do paciente",
        options: [
          { label: "1 - Paciente ansioso, agitado ou inquieto", value: 1 },
          { label: "2 - Paciente cooperativo, orientado e tranquilo", value: 2 },
          { label: "3 - Paciente respondendo apenas a comandos verbais", value: 3 },
          { label: "4 - Resposta rápida à estimulação sonora intensa", value: 4 },
          { label: "5 - Resposta lenta / esboçada ao estímulo sonoro", value: 5 },
          { label: "6 - Nenhuma resposta a estímulos sonoros ou dolorosos", value: 6 }
        ]
      }
    ],
    interpret: (score) => {
      if (score === 2) return "Nível de sedação ideal (Ramsay 2 — Cooperativo e tranquilo)";
      if (score === 1) return "Sedação insuficiente (Agitação clínica)";
      if (score >= 5) return "Sedação profunda / excessiva (Avaliar necessidade clínica)";
      return `Sedação moderada/estável (Ramsay ${score})`;
    }
  },

  // 4. DOR
  {
    id: "eva",
    name: "EVA (Escala Visual Analógica de Dor)",
    category: "Dor",
    description: "Mensuração unidimensional e subjetiva da intensidade dolorosa autorrelatada pelo paciente.",
    questions: [
      {
        id: "dor_nivel",
        label: "Intensidade da dor (0 a 10)",
        options: [
          { label: "0 - Sem Dor", value: 0 },
          { label: "1 - Dor Muito Leve", value: 1 },
          { label: "2 - Dor Leve", value: 2 },
          { label: "3 - Dor Moderada Suave", value: 3 },
          { label: "4 - Dor Moderada", value: 4 },
          { label: "5 - Dor Moderada Incômoda", value: 5 },
          { label: "6 - Dor Forte Tolerável", value: 6 },
          { label: "7 - Dor Forte", value: 7 },
          { label: "8 - Dor Intensa", value: 8 },
          { label: "9 - Dor Muito Intensa", value: 9 },
          { label: "10 - Dor Máxima (Insuportável)", value: 10 }
        ]
      }
    ],
    interpret: (score) => {
      if (score === 0) return "Ausência de Dor (Escore 0)";
      if (score <= 2) return "Dor de Intensidade Leve (Escore 1-2)";
      if (score <= 7) return "Dor de Intensidade Moderada (Escore 3-7). Requer atenção analgésica terapêutica.";
      return "Dor Severa / Dor Intensa Insuportável (Escore 8-10). Requer conduta analgésica emergencial imediata.";
    }
  },
  {
    id: "wong_baker",
    name: "Wong-Baker (Escala de Dor com Faces)",
    category: "Dor",
    description: "Adequada para crianças, idosos ou pacientes com barreiras de fala/cognição.",
    questions: [
      {
        id: "face",
        label: "Selecione a face que melhor representa a expressão do paciente",
        options: [
          { label: "0 - Sorrindo (Sem Dor)", value: 0 },
          { label: "2 - Expressão neutra (Dói um pouco)", value: 2 },
          { label: "4 - Expressão levemente triste (Dói um pouco mais)", value: 4 },
          { label: "6 - Expressão triste (Dói ainda mais)", value: 6 },
          { label: "8 - Expressão com careta (Dói muito)", value: 8 },
          { label: "10 - Chorando / Rosto retorcido (Dói o máximo possível)", value: 10 }
        ]
      }
    ],
    interpret: (score) => {
      if (score === 0) return "Ausência de Dor (Sem dor)";
      if (score <= 4) return "Dor Moderada / Leve";
      return "Dor Intensa / Máxima. Indicação clínica de administração de analgésicos.";
    }
  },
  {
    id: "flacc",
    name: "FLACC (Dor em Não-Verbais/Pediátrica)",
    category: "Dor",
    description: "Método observacional de avaliação de dor em crianças pequenas e pacientes incapazes de verbalizar.",
    questions: [
      {
        id: "face",
        label: "Face (Expressão Facial)",
        options: [
          { label: "0 - Sem expressão particular, sorriso", value: 0 },
          { label: "1 - Careta ocasional, testa franzida, desinteresse", value: 1 },
          { label: "2 - Queixo tremendo, caretas constantes, choro mudo", value: 2 }
        ]
      },
      {
        id: "legs",
        label: "Pernas (Legs)",
        options: [
          { label: "0 - Posição normal ou relaxada", value: 0 },
          { label: "1 - Inquietas, tensas, agitadas", value: 1 },
          { label: "2 - Chutes, pernas flexionadas contra o abdômen", value: 2 }
        ]
      },
      {
        id: "activity",
        label: "Atividade Física",
        options: [
          { label: "0 - Deitada tranquilamente, move-se fácil", value: 0 },
          { label: "1 - Contorce-se, move-se de um lado para o outro", value: 1 },
          { label: "2 - Arqueada, rígida ou movimentos espásticos", value: 2 }
        ]
      },
      {
        id: "cry",
        label: "Choro (Cry)",
        options: [
          { label: "0 - Sem choro / Sem vocalizações de dor", value: 0 },
          { label: "1 - Gemidos, suspiros, choro ocasional", value: 1 },
          { label: "2 - Choro constante, gritos, soluços", value: 2 }
        ]
      },
      {
        id: "consolabilidade",
        label: "Consolabilidade",
        options: [
          { label: "0 - Calma, relaxada, não necessita consolo", value: 0 },
          { label: "1 - Consolada por toque ocasional ou abraço", value: 1 },
          { label: "2 - Difícil de consolar ou acalmar", value: 2 }
        ]
      }
    ],
    interpret: (score) => {
      if (score === 0) return "Paciente confortável / Sem dor aparente";
      if (score <= 3) return "Dor leve de comportamento";
      if (score <= 6) return "Dor moderada de comportamento";
      return "Dor severa / extrema de comportamento. Ação imediata requerida.";
    }
  },
  {
    id: "nips",
    name: "NIPS (Dor Neonatal)",
    category: "Dor",
    description: "Neonatal Infant Pain Scale. Mensuração de dor em recém-nascidos e lactentes.",
    questions: [
      {
        id: "expressao",
        label: "Expressão Facial",
        options: [
          { label: "0 - Relaxado / Neutro", value: 0 },
          { label: "1 - Expressão contraída / Careta", value: 1 }
        ]
      },
      {
        id: "choro",
        label: "Choro do neonato",
        options: [
          { label: "0 - Ausente / Sem som", value: 0 },
          { label: "1 - Choro fraco / Resmungos", value: 1 },
          { label: "2 - Choro forte / Vigoroso", value: 2 }
        ]
      },
      {
        id: "respiracao",
        label: "Padrão de Respiração",
        options: [
          { label: "0 - Relaxado / Padrão normal", value: 0 },
          { label: "1 - Taquipneia / Ritmo irregular", value: 1 }
        ]
      },
      {
        id: "bracos",
        label: "Membros Superiores (Braços)",
        options: [
          { label: "0 - Relaxados / Flexão natural", value: 0 },
          { label: "1 - Rígidos, esticados ou fletidos com força", value: 1 }
        ]
      },
      {
        id: "pernas",
        label: "Membros Inferiores (Pernas)",
        options: [
          { label: "0 - Relaxadas", value: 0 },
          { label: "1 - Rígidas, esticadas ou chutes constantes", value: 1 }
        ]
      },
      {
        id: "alerta",
        label: "Estado de Alerta",
        options: [
          { label: "0 - Dormindo / Alerta calmo", value: 0 },
          { label: "1 - Agitado / Desconfortável", value: 1 }
        ]
      }
    ],
    interpret: (score) => {
      if (score <= 2) return "Ausência de Dor neonatal";
      if (score <= 4) return "Dor leve a moderada. Fazer medidas não-farmacológicas (conforto, sucção não-nutritiva).";
      return "Dor severa no neonato. Medidas terapêuticas e analgesia indicadas.";
    }
  },
  {
    id: "bps",
    name: "Behavioral Pain Scale (BPS — Dor em UTI)",
    category: "Dor",
    description: "Dor em pacientes de UTI sob ventilação mecânica e sedados.",
    questions: [
      {
        id: "expressao_facial",
        label: "Expressão Facial do Paciente",
        options: [
          { label: "1 - Relaxada", value: 1 },
          { label: "2 - Parcialmente contraída (testa franzida)", value: 2 },
          { label: "3 - Totalmente contraída (olhos fechados, careta)", value: 3 },
          { label: "4 - Careta severa ou esgarço permanente", value: 4 }
        ]
      },
      {
        id: "movimentos_membros",
        label: "Movimentação de Membros Superiores",
        options: [
          { label: "1 - Nenhum movimento", value: 1 },
          { label: "2 - Parcialmente fletidos", value: 2 },
          { label: "3 - Totalmente fletidos com flexão de dedos", value: 3 },
          { label: "4 - Retração muscular permanente ou espasticidade", value: 4 }
        ]
      },
      {
        id: "ventilacao",
        label: "Tolerância à Ventilação Mecânica (Conformidade com respirador)",
        options: [
          { label: "1 - Tolera bem os parâmetros (ventilação calma)", value: 1 },
          { label: "2 - Tosse ocasional mas tolera o respirador", value: 2 },
          { label: "3 - Luta contra o respirador / Dessincronia", value: 3 },
          { label: "4 - Incapaz de controlar a respiração / Resistência total", value: 4 }
        ]
      }
    ],
    interpret: (score) => {
      if (score <= 3) return "Sem Dor (Escore de 3)";
      if (score <= 5) return "Dor leve a moderada";
      return "Dor severa / intolerável no respirador mecânico (Escore de 6 a 12). Ajustar sedoanalgesia.";
    }
  },

  // 5. INDEPENDÊNCIA & FUNCIONAL
  {
    id: "barthel",
    name: "Índice de Barthel (Independência Funcional)",
    category: "Independência & Funcional",
    description: "Mede o grau de independência do paciente para a realização de 10 Atividades Básicas de Vida Diária (AVD).",
    questions: [
      {
        id: "alimentacao",
        label: "Alimentação",
        options: [
          { label: "10 - Independente (capaz de usar talheres)", value: 10 },
          { label: "5 - Necessita de alguma ajuda (cortar carne, passar manteiga)", value: 5 },
          { label: "0 - Totalmente dependente", value: 0 }
        ]
      },
      {
        id: "banho",
        label: "Banho / Higiene Corporal",
        options: [
          { label: "5 - Independente (entra, sai e lava-se sozinho)", value: 5 },
          { label: "0 - Dependente de auxílio", value: 0 }
        ]
      },
      {
        id: "atividade_vestir",
        label: "Atividade de Vestir-se",
        options: [
          { label: "10 - Independente (pega roupas, calça sapatos e fecha botões)", value: 10 },
          { label: "5 - Necessita de ajuda parcial", value: 5 },
          { label: "0 - Totalmente dependente", value: 0 }
        ]
      },
      {
        id: "higiene_pessoal",
        label: "Higiene Pessoal (barbear-se, escovar dentes, pentear)",
        options: [
          { label: "5 - Independente (prepara e faz sozinho)", value: 5 },
          { label: "0 - Necessita de ajuda", value: 0 }
        ]
      },
      {
        id: "eliminacao_intestinal",
        label: "Eliminação Intestinal (continência fecal)",
        options: [
          { label: "10 - Continente (sem episódios de perda ou acidente)", value: 10 },
          { label: "5 - Incontinência ocasional (um acidente por semana)", value: 5 },
          { label: "0 - Incontinente ou dependente de enema", value: 0 }
        ]
      },
      {
        id: "eliminacao_urinaria",
        label: "Eliminação Urinária (continência urinária)",
        options: [
          { label: "10 - Continente ou cuida da SVD sozinho", value: 10 },
          { label: "5 - Incontinência urinária ocasional (um acidente em 24h)", value: 5 },
          { label: "0 - Incontinente permanente", value: 0 }
        ]
      },
      {
        id: "uso_sanitario",
        label: "Uso do Banheiro (Sanitário)",
        options: [
          { label: "10 - Independente para sentar, limpar-se e dar descarga", value: 10 },
          { label: "5 - Necessita de ajuda para equilíbrio ou vestuário", value: 5 },
          { label: "0 - Dependente de comadre/papagaio ou total", value: 0 }
        ]
      },
      {
        id: "transferencia",
        label: "Transferência (Cama para Cadeira e vice-versa)",
        options: [
          { label: "15 - Independente (sem ajuda física)", value: 15 },
          { label: "10 - Mínimo auxílio verbal ou de equilíbrio", value: 10 },
          { label: "5 - Capaz de sentar-se mas precisa de ajuda física forte de 1 pessoa", value: 5 },
          { label: "0 - Totalmente dependente / Necessita guincho ou 2 pessoas", value: 0 }
        ]
      },
      {
        id: "mobilidade_deambular",
        label: "Mobilidade (Deambulação em superfície plana)",
        options: [
          { label: "15 - Independente por mais de 50 metros sem andador", value: 15 },
          { label: "10 - Anda com andador ou auxílio de 1 pessoa por 50 metros", value: 10 },
          { label: "5 - Independente apenas em cadeira de rodas", value: 5 },
          { label: "0 - Imóvel ou restrito ao leito permanente", value: 0 }
        ]
      },
      {
        id: "escadas",
        label: "Subir e Descer Escadas",
        options: [
          { label: "10 - Independente com segurança", value: 10 },
          { label: "5 - Precisa de ajuda física ou supervisão", value: 5 },
          { label: "0 - Incapaz / Dependente", value: 0 }
        ]
      }
    ],
    interpret: (score) => {
      if (score === 100) return "Independência Funcional Total (100 pontos)";
      if (score >= 60) return "Dependência Leve (Escore 60-95)";
      if (score >= 40) return "Dependência Moderada (Escore 40-55)";
      if (score >= 20) return "Dependência Severa / Grave (Escore 20-35)";
      return "Dependência Total / Completa (Escore 0-15)";
    }
  },
  {
    id: "katz",
    name: "Escala de Katz (Atividades Básicas da Vida)",
    category: "Independência & Funcional",
    description: "Mede o grau de independência ou dependência em Atividades Básicas de Vida Diária (AVD) de forma binária.",
    questions: [
      {
        id: "banho",
        label: "Banho",
        options: [
          { label: "1 - Independente (lava o corpo todo sozinho)", value: 1 },
          { label: "0 - Dependente (precisa de ajuda para mais de uma parte do corpo)", value: 0 }
        ]
      },
      {
        id: "vestir",
        label: "Vestir-se",
        options: [
          { label: "1 - Independente (pega as roupas no armário e se veste sem ajuda)", value: 1 },
          { label: "0 - Dependente (não se veste sozinho ou precisa de ajuda)", value: 0 }
        ]
      },
      {
        id: "uso_sanitario",
        label: "Uso do Banheiro (Higiene)",
        options: [
          { label: "1 - Independente (vai ao banheiro, usa o vaso, se limpa e se veste)", value: 1 },
          { label: "0 - Dependente (precisa de comadre ou auxílio para higiene intima)", value: 0 }
        ]
      },
      {
        id: "transferencia",
        label: "Transferência",
        options: [
          { label: "1 - Independente (deita e levanta da cama e cadeira sozinhos)", value: 1 },
          { label: "0 - Dependente (necessita de auxílio físico para mover-se)", value: 0 }
        ]
      },
      {
        id: "continencia",
        label: "Continência",
        options: [
          { label: "1 - Independente (controle completo de fezes e urina)", value: 1 },
          { label: "0 - Dependente (incontinência parcial/total ou uso de fraldas)", value: 0 }
        ]
      },
      {
        id: "alimentacao",
        label: "Alimentação",
        options: [
          { label: "1 - Independente (coloca a comida na boca sozinho)", value: 1 },
          { label: "0 - Dependente (precisa de ajuda para comer ou enteral/Parenteral)", value: 0 }
        ]
      }
    ],
    interpret: (score) => {
      if (score === 6) return "Independência total para atividades de vida diária (AVD)";
      if (score >= 4) return "Dependência moderada para atividades de vida diária (AVD)";
      return "Dependência grave / dependência total para atividades de vida diária (AVD)";
    }
  },
  {
    id: "lawton",
    name: "Lawton & Brody (Atividades Instrumentais)",
    category: "Independência & Funcional",
    description: "Avalia a capacidade funcional do idoso para Atividades Instrumentais da Vida Diária (AIVD).",
    questions: [
      {
        id: "telefone",
        label: "Uso do Telefone",
        options: [
          { label: "3 - Usa por iniciativa própria, disca números conhecidos", value: 3 },
          { label: "2 - Atende chamadas ou disca apenas com ajuda", value: 2 },
          { label: "1 - Não utiliza o telefone", value: 1 }
        ]
      },
      {
        id: "compras",
        label: "Fazer Compras",
        options: [
          { label: "3 - Cuida de todas as compras de forma independente", value: 3 },
          { label: "2 - Necessita de companhia ou auxílio para comprar", value: 2 },
          { label: "1 - Totalmente incapaz de comprar sozinho", value: 1 }
        ]
      },
      {
        id: "cozinha",
        label: "Preparação de Alimentos (Cozinhar)",
        options: [
          { label: "3 - Planeja, prepara e serve as refeições com segurança", value: 3 },
          { label: "2 - Prepara se os ingredientes forem fornecidos", value: 2 },
          { label: "1 - Precisa de refeições preparadas e servidas", value: 1 }
        ]
      },
      {
        id: "casa_limpeza",
        label: "Trabalhos Domésticos (Limpeza)",
        options: [
          { label: "3 - Mantém a casa organizada e limpa de forma pesada", value: 3 },
          { label: "2 - Faz tarefas leves (lavar louça, arrumar camas)", value: 2 },
          { label: "1 - Não participa de nenhuma tarefa doméstica", value: 1 }
        ]
      },
      {
        id: "medicamentos",
        label: "Uso de Medicamentos (Prescrições)",
        options: [
          { label: "3 - Toma as medicações na dose e horários corretos de forma autônoma", value: 3 },
          { label: "2 - Toma se as doses forem previamente separadas", value: 2 },
          { label: "1 - Incapaz de administrar os próprios remédios", value: 1 }
        ]
      },
      {
        id: "financas",
        label: "Manuseio de Dinheiro (Finanças)",
        options: [
          { label: "3 - Controla contas, faz pagamentos, vai ao banco", value: 3 },
          { label: "2 - Faz pequenas compras diárias mas precisa de ajuda com contas", value: 2 },
          { label: "1 - Incapaz de manejar dinheiro", value: 1 }
        ]
      }
    ],
    interpret: (score) => {
      if (score >= 15) return "Independência total para Atividades Instrumentais da Vida Diária (AIVD)";
      if (score >= 10) return "Dependência parcial para Atividades Instrumentais (AIVD)";
      return "Dependência grave / total para atividades instrumentais (AIVD)";
    }
  },
  {
    id: "mif",
    name: "Medida de Independência Funcional (MIF)",
    category: "Independência & Funcional",
    description: "Avaliação do grau de dependência funcional de reabilitação motora e cognitiva.",
    questions: [
      {
        id: "alimentacao",
        label: "Auto-cuidado: Alimentação",
        options: [
          { label: "7 - Independência Completa", value: 7 },
          { label: "6 - Independência Modificada (Dispositivo auxiliar)", value: 6 },
          { label: "5 - Supervisão / Preparação", value: 5 },
          { label: "4 - Ajuda Mínima (Paciente realiza 75%+)", value: 4 },
          { label: "3 - Ajuda Moderada (Paciente realiza 50%+)", value: 3 },
          { label: "2 - Ajuda Máxima (Paciente realiza 25%+)", value: 2 },
          { label: "1 - Assistência Total (Paciente <25%)", value: 1 }
        ]
      },
      {
        id: "higiene",
        label: "Auto-cuidado: Higiene Pessoal",
        options: [
          { label: "7 - Independência Completa", value: 7 },
          { label: "5 - Supervisão ou ajuda parcial", value: 5 },
          { label: "3 - Ajuda moderada", value: 3 },
          { label: "1 - Assistência total", value: 1 }
        ]
      },
      {
        id: "continencia_urina",
        label: "Controle Esfincteriano: Bexiga",
        options: [
          { label: "7 - Sem acidentes (Independente)", value: 7 },
          { label: "5 - Acidentes ocasionais / Fracionado", value: 5 },
          { label: "3 - Usa fraldas com ajuda para troca", value: 3 },
          { label: "1 - Incontinente absoluto", value: 1 }
        ]
      },
      {
        id: "mobilidade",
        label: "Locomoção: Caminhar / Cadeira de Rodas",
        options: [
          { label: "7 - Anda sem dificuldades", value: 7 },
          { label: "5 - Anda com andador ou órtese", value: 5 },
          { label: "3 - Requer ajuda física de 1 pessoa", value: 3 },
          { label: "1 - Restrito ao leito (Incapaz)", value: 1 }
        ]
      },
      {
        id: "comunicacao",
        label: "Cognição: Compreensão auditiva/visual",
        options: [
          { label: "7 - Compreende perfeitamente", value: 7 },
          { label: "5 - Compreende a maior parte (Supervisão)", value: 5 },
          { label: "3 - Compreende apenas frases simples", value: 3 },
          { label: "1 - Não compreende", value: 1 }
        ]
      }
    ],
    interpret: (score) => {
      if (score >= 30) return "Independência funcional excelente (Score MIF alto)";
      if (score >= 15) return "Dependência funcional moderada";
      return "Dependência total / severa (Escore MIF baixo)";
    }
  },

  // 6. NUTRIÇÃO
  {
    id: "man_mna",
    name: "MAN / MNA (Mini Avaliação Nutricional)",
    category: "Nutrição",
    description: "Método padrão ouro para triagem e avaliação do estado nutricional em idosos.",
    questions: [
      {
        id: "apetite",
        label: "A ingesta alimentar diminuiu nos últimos 3 meses por perda de apetite, problemas digestivos ou mastigação?",
        options: [
          { label: "0 - Diminuição severa da ingesta", value: 0 },
          { label: "1 - Diminuição moderada", value: 1 },
          { label: "2 - Sem alteração na alimentação", value: 2 }
        ]
      },
      {
        id: "peso_perda",
        label: "Perda de peso involuntária nos últimos 3 meses",
        options: [
          { label: "0 - Perda de peso superior a 3 kg", value: 0 },
          { label: "1 - Não sabe informar", value: 1 },
          { label: "2 - Perda de peso entre 1 e 3 kg", value: 2 },
          { label: "3 - Sem perda de peso", value: 3 }
        ]
      },
      {
        id: "mobilidade",
        label: "Mobilidade do paciente",
        options: [
          { label: "0 - Restrito ao leito ou cadeira de rodas", value: 0 },
          { label: "1 - Capaz de sair do leito mas não sai de casa", value: 1 },
          { label: "2 - Deambula sem restrições fora de casa", value: 2 }
        ]
      },
      {
        id: "estresse",
        label: "Passou por estresse psicológico ou doença aguda nos últimos 3 meses?",
        options: [
          { label: "0 - Sim", value: 0 },
          { label: "2 - Não", value: 2 }
        ]
      },
      {
        id: "neuro",
        label: "Problemas neuropsicológicos",
        options: [
          { label: "0 - Demência grave ou depressão severa", value: 0 },
          { label: "1 - Demência moderada ou confusão leve", value: 1 },
          { label: "2 - Sem problemas neurológicos", value: 2 }
        ]
      }
    ],
    interpret: (score) => {
      if (score >= 12) return "Estado Nutricional Normal / Sem Risco (MAN >= 12)";
      if (score >= 8) return "Sob Risco de Desnutrição (MAN 8-11). Requer acompanhamento dietoterápico.";
      return "Desnutrição Estabelecida (MAN <= 7). Requer intervenção nutricional enteral/suplementação.";
    }
  },
  {
    id: "nrs_2002",
    name: "NRS-2002 (Nutritional Risk Screening)",
    category: "Nutrição",
    description: "Triagem de risco nutricional indicada para pacientes hospitalizados.",
    questions: [
      {
        id: "estado_nutricional",
        label: "Comprometimento do Estado Nutricional",
        options: [
          { label: "0 - Ausente / Normal", value: 0 },
          { label: "1 - Leve (Perda de peso >5% em 3 meses ou ingesta 50-75% da semana anterior)", value: 1 },
          { label: "2 - Moderado (Perda peso >5% em 2 meses, IMC 18.5-20.5 ou ingesta 25-50%)", value: 2 },
          { label: "3 - Grave (Perda peso >5% em 1 mês, IMC <18.5 ou ingesta 0-25%)", value: 3 }
        ]
      },
      {
        id: "gravidade_doenca",
        label: "Gravidade da Doença (Estresse metabólico)",
        options: [
          { label: "0 - Ausente / Normal", value: 0 },
          { label: "1 - Leve (Fratura de fêmur, DPOC, cirurgia programada)", value: 1 },
          { label: "2 - Moderada (Grande cirurgia abdominal, AVC, pneumonia grave)", value: 2 },
          { label: "3 - Grave (TCE, transplante, paciente em ventilação mecânica/crítico)", value: 3 }
        ]
      },
      {
        id: "idade_limite",
        label: "Idade do Paciente",
        options: [
          { label: "0 - Menor de 70 anos", value: 0 },
          { label: "1 - 70 anos ou mais (+1 ponto)", value: 1 }
        ]
      }
    ],
    interpret: (score) => {
      if (score >= 3) return "Paciente sob Risco Nutricional (Escore >= 3). Indicação de plano nutricional formal.";
      return "Sem risco nutricional no momento (Escore < 3). Reavaliar semanalmente.";
    }
  },

  // 7. INSTABILIDADE & GRAVIDADE CLÍNICA
  {
    id: "news2",
    name: "NEWS2 (National Early Warning Score)",
    category: "Instabilidade & Gravidade",
    description: "Determinação de deterioração clínica aguda e ativação de equipe de resposta rápida.",
    questions: [
      {
        id: "fr",
        label: "Frequência Respiratória (irpm)",
        options: [
          { label: "3 - Menor ou igual a 8 irpm", value: 3 },
          { label: "1 - 9 a 11 irpm", value: 1 },
          { label: "0 - 12 a 20 irpm", value: 0 },
          { label: "1 - 21 a 24 irpm", value: 1 },
          { label: "3 - Maior ou igual a 25 irpm", value: 3 }
        ]
      },
      {
        id: "spo2",
        label: "Saturação de Oxigênio (SpO2) — Escala 1 para geral",
        options: [
          { label: "3 - Menor de 92%", value: 3 },
          { label: "2 - 92-93%", value: 2 },
          { label: "1 - 94-95%", value: 1 },
          { label: "0 - Maior ou igual a 96%", value: 0 }
        ]
      },
      {
        id: "oxigenio",
        label: "Suplementação de Oxigênio (Inalação / Cateter)",
        options: [
          { label: "0 - Não (Ar Ambiente)", value: 0 },
          { label: "2 - Sim (Uso de O2 artificial)", value: 2 }
        ]
      },
      {
        id: "pa",
        label: "Pressão Arterial Sistólica (PAS mmHg)",
        options: [
          { label: "3 - Menor ou igual a 90 mmHg", value: 3 },
          { label: "2 - 91 a 100 mmHg", value: 2 },
          { label: "1 - 101 a 110 mmHg", value: 1 },
          { label: "0 - 111 a 219 mmHg", value: 0 },
          { label: "3 - Maior ou igual a 220 mmHg", value: 3 }
        ]
      },
      {
        id: "fc",
        label: "Frequência Cardíaca (bpm)",
        options: [
          { label: "3 - Menor ou igual a 40 bpm", value: 3 },
          { label: "1 - 41 a 50 bpm", value: 1 },
          { label: "0 - 51 a 90 bpm", value: 0 },
          { label: "1 - 91 a 110 bpm", value: 1 },
          { label: "2 - 111 a 130 bpm", value: 2 },
          { label: "3 - Maior ou igual a 131 bpm", value: 3 }
        ]
      },
      {
        id: "consciencia",
        label: "Estado de Consciência",
        options: [
          { label: "0 - Alerta / Lúcido", value: 0 },
          { label: "3 - Reação a Voz, Dor ou Totalmente Não Responsivo (VPU)", value: 3 }
        ]
      },
      {
        id: "temperatura",
        label: "Temperatura Corporal (°C)",
        options: [
          { label: "3 - Menor ou igual a 35.0 °C", value: 3 },
          { label: "1 - 35.1 a 36.0 °C", value: 1 },
          { label: "0 - 36.1 a 38.0 °C", value: 0 },
          { label: "1 - 38.1 a 39.0 °C", value: 1 },
          { label: "2 - Maior ou igual a 39.1 °C", value: 2 }
        ]
      }
    ],
    interpret: (score) => {
      if (score >= 7) return "NEWS2 Crítico (Pontuação >= 7). Risco gravíssimo de deterioração. Acionar imediatamente médico assistente / Equipe de Resposta Rápida.";
      if (score >= 5) return "NEWS2 Moderado (Pontuação 5-6). Alerta clínico. Aumentar monitorização para 1/1h.";
      return "NEWS2 Baixo (Pontuação 0-4). Monitoração de rotina normal.";
    }
  },
  {
    id: "mews",
    name: "MEWS (Modified Early Warning Score)",
    category: "Instabilidade & Gravidade",
    description: "Versão modificada rápida de sinais de alerta clínico para enfermarias.",
    questions: [
      {
        id: "pa_sistolica",
        label: "Pressão Arterial Sistólica (PAS)",
        options: [
          { label: "3 - Menor que 70 mmHg", value: 3 },
          { label: "2 - 71-80 mmHg", value: 2 },
          { label: "1 - 81-100 mmHg", value: 1 },
          { label: "0 - 101-199 mmHg", value: 0 },
          { label: "2 - Maior ou igual a 200 mmHg", value: 2 }
        ]
      },
      {
        id: "fc",
        label: "Frequência Cardíaca (bpm)",
        options: [
          { label: "2 - Menor de 40 bpm", value: 2 },
          { label: "1 - 41-50 bpm", value: 1 },
          { label: "0 - 51-100 bpm", value: 0 },
          { label: "1 - 101-110 bpm", value: 1 },
          { label: "2 - 111-129 bpm", value: 2 },
          { label: "3 - Maior ou igual a 130 bpm", value: 3 }
        ]
      },
      {
        id: "fr",
        label: "Frequência Respiratória (irpm)",
        options: [
          { label: "2 - Menor que 9 irpm", value: 2 },
          { label: "0 - 9-14 irpm", value: 0 },
          { label: "1 - 15-20 irpm", value: 1 },
          { label: "2 - 21-29 irpm", value: 2 },
          { label: "3 - Maior que 30 irpm", value: 3 }
        ]
      },
      {
        id: "temp",
        label: "Temperatura Corporal (°C)",
        options: [
          { label: "2 - Menor que 35.0 °C", value: 2 },
          { label: "0 - 35.0 - 38.4 °C", value: 0 },
          { label: "2 - Maior que 38.5 °C", value: 2 }
        ]
      },
      {
        id: "consciencia",
        label: "Nível de Consciência AVPU",
        options: [
          { label: "0 - Alerta (A)", value: 0 },
          { label: "1 - Confusão / Responde à voz (V)", value: 1 },
          { label: "2 - Responde à dor (P)", value: 2 },
          { label: "3 - Não responsivo (U)", value: 3 }
        ]
      }
    ],
    interpret: (score) => {
      if (score >= 5) return "MEWS Crítico (>= 5). Risco grave. Solicitar intervenção médica urgente.";
      if (score >= 3) return "Alerta MEWS Moderado (3-4). Monitorar de 2 em 2 horas.";
      return "MEWS Baixo (0-2). Paciente estável.";
    }
  },
  {
    id: "apache_ii",
    name: "APACHE II (Gravidade em UTI Resumido)",
    category: "Instabilidade & Gravidade",
    description: "Score de prognóstico em terapia intensiva baseado em dados fisiológicos fundamentais.",
    questions: [
      {
        id: "temperatura",
        label: "Temperatura Corporal Retal/Axilar",
        options: [
          { label: "0 - 36.0 a 38.4 °C (Normal)", value: 0 },
          { label: "1 - 38.5 a 38.9 °C", value: 1 },
          { label: "2 - 39.0 a 40.9 °C ou 32.0 a 34.9 °C", value: 2 },
          { label: "3 - Maior que 41 °C ou menor que 30.0 °C", value: 3 }
        ]
      },
      {
        id: "pam",
        label: "Pressão Arterial Média (PAM mmHg)",
        options: [
          { label: "0 - 70 a 109 mmHg (Normal)", value: 0 },
          { label: "1 - 110 a 129 mmHg ou 50 a 69 mmHg", value: 1 },
          { label: "2 - 130 a 159 mmHg", value: 2 },
          { label: "3 - Maior que 160 mmHg ou menor que 49 mmHg", value: 3 }
        ]
      },
      {
        id: "fc",
        label: "Frequência Cardíaca",
        options: [
          { label: "0 - 70 a 109 bpm (Normal)", value: 0 },
          { label: "1 - 110 a 139 bpm ou 55 a 69 bpm", value: 1 },
          { label: "2 - 140 a 179 bpm ou 40 a 54 bpm", value: 2 },
          { label: "3 - Maior que 180 bpm ou menor que 39 bpm", value: 3 }
        ]
      },
      {
        id: "glasgow",
        label: "Neurológico: Glasgow Coma Scale (Subtrair score de 15)",
        options: [
          { label: "0 - GCS 15 (Sem alteração)", value: 0 },
          { label: "2 - GCS 13-14", value: 2 },
          { label: "5 - GCS 10-12", value: 5 },
          { label: "10 - GCS 6-9", value: 10 },
          { label: "12 - GCS <= 5 (Gravíssimo)", value: 12 }
        ]
      }
    ],
    interpret: (score) => {
      if (score >= 25) return "APACHE II Elevadíssimo (Score >= 25). Taxa estimada de mortalidade hospitalar superior a 50%.";
      if (score >= 15) return "APACHE II Grave (Score 15-24). Monitoramento intensivo estrito.";
      return "APACHE II Leve / Moderado (< 15).";
    }
  },

  // 8. CARGA DE TRABALHO
  {
    id: "fugulin",
    name: "Fugulin / Perroca (Classificação de Pacientes)",
    category: "Carga de Trabalho",
    description: "Classificação de pacientes conforme o grau de dependência da equipe de enfermagem para dimensionamento de pessoal.",
    questions: [
      {
        id: "estado_mental",
        label: "Estado Mental",
        options: [
          { label: "1 - Orientado no tempo e no espaço", value: 1 },
          { label: "2 - Períodos de desorientação controlada", value: 2 },
          { label: "3 - Desorientado crônico ou agudo", value: 3 },
          { label: "4 - Inconsciente / Comatoso", value: 4 }
        ]
      },
      {
        id: "oxigenacao",
        label: "Oxigenação",
        options: [
          { label: "1 - Não depende de terapia de oxigênio", value: 1 },
          { label: "2 - Uso de cateter / máscara de oxigênio de forma intermitente", value: 2 },
          { label: "3 - Oxigenoterapia contínua", value: 3 },
          { label: "4 - Assistência ventilatória mecânica / respirador", value: 4 }
        ]
      },
      {
        id: "sinais_vitais",
        label: "Sinais Vitais (Monitorização)",
        options: [
          { label: "1 - Controle de rotina diária", value: 1 },
          { label: "2 - Controle a cada 6 ou 8 horas", value: 2 },
          { label: "3 - Controle a cada 4 horas ou cardioscopia", value: 3 },
          { label: "4 - Controle contínuo (UTI / DVA)", value: 4 }
        ]
      },
      {
        id: "motricidade",
        label: "Motricidade / Locomoção",
        options: [
          { label: "1 - Deambula sozinho com segurança", value: 1 },
          { label: "2 - Necessita de ajuda para locomoção (cadeira)", value: 2 },
          { label: "3 - Restrito ao leito / ajuda total", value: 3 },
          { label: "4 - Paralisia / Tração ortopédica total", value: 4 }
        ]
      },
      {
        id: "alimentacao",
        label: "Alimentação",
        options: [
          { label: "1 - Alimenta-se sozinho", value: 1 },
          { label: "2 - Necessita de ajuda parcial para cortar/colocar", value: 2 },
          { label: "3 - Alimentação por via enteral (SNG, SNE, GTT)", value: 3 },
          { label: "4 - Nutrição Parenteral Total ou NPO rígido", value: 4 }
        ]
      },
      {
        id: "cuidados_corporais",
        label: "Cuidados Corporais (Higiene)",
        options: [
          { label: "1 - Banho de chuveiro independente", value: 1 },
          { label: "2 - Auxílio parcial no chuveiro", value: 2 },
          { label: "3 - Banho no leito realizado por 1 profissional", value: 3 },
          { label: "4 - Banho no leito complexo realizado por 2 profissionais", value: 4 }
        ]
      },
      {
        id: "eliminacao",
        label: "Eliminações Fisiológicas",
        options: [
          { label: "1 - Usa o banheiro de forma independente", value: 1 },
          { label: "2 - Uso de comadre / papagaio com ajuda", value: 2 },
          { label: "3 - Controle por sonda vesical (SVD) ou dreno", value: 3 },
          { label: "4 - Incontinente total / uso de fraldas", value: 4 }
        ]
      },
      {
        id: "terapeutica",
        label: "Terapêutica / Medicamentos",
        options: [
          { label: "1 - Via oral ou sem medicamentos", value: 1 },
          { label: "2 - Via intramuscular / subcutânea intermitente", value: 2 },
          { label: "3 - Via endovenosa contínua / soroterapia", value: 3 },
          { label: "4 - Drogas vasoativas contínuas / Quimioterapia complexa", value: 4 }
        ]
      }
    ],
    interpret: (score) => {
      if (score >= 25) return "Cuidados Intensivos (Dependência Máxima - Fugulin >= 25)";
      if (score >= 21) return "Cuidados Semi-Intensivos (Fugulin 21-24)";
      if (score >= 15) return "Cuidados de Alta Dependência (Fugulin 15-20)";
      if (score >= 10) return "Cuidados Intermediários (Fugulin 10-14)";
      return "Cuidados Mínimos / Auto-cuidado (Fugulin 8-9)";
    }
  },
  {
    id: "nas",
    name: "NAS (Nursing Activities Score)",
    category: "Carga de Trabalho",
    description: "Determinação de tempo real de enfermagem gasto por turno com paciente crítico (UTI).",
    questions: [
      {
        id: "atividades",
        label: "Monitorização e Controles Clínicos",
        options: [
          { label: "4.5% - Monitorização padrão horária", value: 45 }, // we store 45 as representation of 4.5
          { label: "12.1% - Presença constante à beira do leito por 2h ou mais", value: 121 },
          { label: "19.6% - Presença intensiva por 4h ou mais por turno", value: 196 }
        ]
      },
      {
        id: "procedimentos",
        label: "Procedimentos de Higiene e Conforto",
        options: [
          { label: "4.1% - Higiene padrão diária", value: 41 },
          { label: "16.5% - Execução de procedimentos de higiene complexos (>3 profissionais)", value: 165 }
        ]
      },
      {
        id: "mobilizacao",
        label: "Mobilização e Posicionamento",
        options: [
          { label: "5.5% - Mudança de decúbito rotineira de 2/2h", value: 55 },
          { label: "12.4% - Mobilização complexa com 3+ profissionais", value: 124 }
        ]
      },
      {
        id: "medicamentos",
        label: "Suporte Vasoativo / Medicamentoso",
        options: [
          { label: "1.2% - Uso de medicamentos padrão", value: 12 },
          { label: "8.3% - Infusão de múltiplas drogas vasoativas concomitantes", value: 83 }
        ]
      }
    ],
    interpret: (score) => {
      const realScore = score / 10;
      return `O paciente requer aproximadamente ${realScore}% do tempo de trabalho de um enfermeiro por turno de 12 horas.`;
    }
  },

  // 9. COGNIÇÃO & FAMÍLIA
  {
    id: "meem",
    name: "Mini Exame do Estado Mental (MEEM)",
    category: "Cognição & Família",
    description: "Avaliação rápida de funções cognitivas, memória, atenção e orientação espacial/temporal.",
    questions: [
      {
        id: "orientacao_tempo",
        label: "Orientação Temporal (Sabe o ano, mês, dia, dia da semana e estação?)",
        options: [
          { label: "5 - Acertou todos os 5 itens", value: 5 },
          { label: "4 - Acertou 4 itens", value: 4 },
          { label: "3 - Acertou 3 itens", value: 3 },
          { label: "2 - Acertou 2 itens", value: 2 },
          { label: "1 - Acertou 1 item", value: 1 },
          { label: "0 - Errou todos", value: 0 }
        ]
      },
      {
        id: "orientacao_espaco",
        label: "Orientação Espacial (Sabe o estado, cidade, bairro, hospital e andar?)",
        options: [
          { label: "5 - Acertou todos os 5 itens", value: 5 },
          { label: "4 - Acertou 4 itens", value: 4 },
          { label: "3 - Acertou 3 itens", value: 3 },
          { label: "2 - Acertou 2 itens", value: 2 },
          { label: "1 - Acertou 1 item", value: 1 },
          { label: "0 - Errou todos", value: 0 }
        ]
      },
      {
        id: "memoria_imediata",
        label: "Memória Imediata (Repetir 3 palavras simples: ex: Carro, Vaso, Tijolo)",
        options: [
          { label: "3 - Lembrou as 3 palavras imediatamente", value: 3 },
          { label: "2 - Lembrou 2 palavras", value: 2 },
          { label: "1 - Lembrou 1 palavra", value: 1 },
          { label: "0 - Nenhuma", value: 0 }
        ]
      },
      {
        id: "atencao_calculo",
        label: "Atenção e Cálculo (Subtrair 7 de 100 consecutivamente 5 vezes: 93, 86, 79...)",
        options: [
          { label: "5 - Acertou todos os 5 cálculos", value: 5 },
          { label: "4 - Acertou 4 cálculos", value: 4 },
          { label: "3 - Acertou 3 cálculos", value: 3 },
          { label: "2 - Acertou 2 cálculos", value: 2 },
          { label: "1 - Acertou 1 cálculo", value: 1 },
          { label: "0 - Errou tudo / Não cooperativo", value: 0 }
        ]
      },
      {
        id: "evocacao",
        label: "Evocação de Memória (Lembrar das 3 palavras anteriores após 5 minutos)",
        options: [
          { label: "3 - Lembrou as 3 palavras", value: 3 },
          { label: "2 - Lembrou 2 palavras", value: 2 },
          { label: "1 - Lembrou 1 palavra", value: 1 },
          { label: "0 - Nenhuma", value: 0 }
        ]
      }
    ],
    interpret: (score, answers) => {
      // Custom warning based on schooling but general cutoff is 24 points
      if (score >= 24) return "Cognição Preservada / Ausência de demência evidente (Escore >= 24)";
      if (score >= 18) return "Déficit Cognitivo Moderado (Escore 18-23). Possível quadro de demência ou delirium.";
      return "Déficit Cognitivo Grave / Demência Avançada (Escore < 18).";
    }
  },
  {
    id: "zarit",
    name: "Zarit Burden Interview (Sobrecarga do Cuidador)",
    category: "Cognição & Família",
    description: "Avalia a sobrecarga emocional e física vivenciada pelo cuidador familiar principal do paciente.",
    questions: [
      {
        id: "tempo",
        label: "Sente que seu familiar exige mais tempo do que você dispõe?",
        options: [
          { label: "4 - Quase sempre", value: 4 },
          { label: "3 - Frequentemente", value: 3 },
          { label: "2 - Às vezes", value: 2 },
          { label: "1 - Raramente", value: 1 },
          { label: "0 - Nunca", value: 0 }
        ]
      },
      {
        id: "estresse",
        label: "Sente-se estressado entre cuidar do paciente e suas outras responsabilidades?",
        options: [
          { label: "4 - Quase sempre", value: 4 },
          { label: "3 - Frequentemente", value: 3 },
          { label: "2 - Às vezes", value: 2 },
          { label: "1 - Raramente", value: 1 },
          { label: "0 - Nunca", value: 0 }
        ]
      },
      {
        id: "privacidade",
        label: "Sente que perdeu o controle de sua vida particular após a doença dele?",
        options: [
          { label: "4 - Quase sempre", value: 4 },
          { label: "3 - Frequentemente", value: 3 },
          { label: "2 - Às vezes", value: 2 },
          { label: "1 - Raramente", value: 1 },
          { label: "0 - Nunca", value: 0 }
        ]
      },
      {
        id: "financeiro",
        label: "Acha que cuidar do seu familiar gerou prejuízo financeiro pessoal?",
        options: [
          { label: "4 - Quase sempre", value: 4 },
          { label: "3 - Frequentemente", value: 3 },
          { label: "2 - Às vezes", value: 2 },
          { label: "1 - Raramente", value: 1 },
          { label: "0 - Nunca", value: 0 }
        ]
      }
    ],
    interpret: (score) => {
      if (score >= 12) return "Sobrecarga Intensa / Severa do Cuidador Familiar. Requer apoio social e rodízio de cuidados.";
      if (score >= 6) return "Sobrecarga Leve a Moderada.";
      return "Ausência de sobrecarga expressiva detectada no cuidador.";
    }
  },

  // 10. OUTROS RISCOS (CAPRINI)
  {
    id: "caprini",
    name: "Escala de Caprini (Risco de TEV)",
    category: "Outros Riscos",
    description: "Estimativa do risco de Tromboembolismo Venoso (TEV) e indicação de profilaxia.",
    questions: [
      {
        id: "fatores_1",
        label: "Idade do paciente",
        options: [
          { label: "0 - Menor de 40 anos", value: 0 },
          { label: "1 - Idade entre 41 e 60 anos (+1)", value: 1 },
          { label: "2 - Idade entre 61 e 74 anos (+2)", value: 2 },
          { label: "3 - Idade igual ou superior a 75 anos (+3)", value: 3 }
        ]
      },
      {
        id: "tipo_cirurgia",
        label: "Fator cirúrgico / imobilidade recente",
        options: [
          { label: "0 - Nenhuma", value: 0 },
          { label: "1 - Pequena cirurgia planejada", value: 1 },
          { label: "2 - Grande cirurgia aberta (>45 min) ou gesso", value: 2 },
          { label: "5 - Artroplastia de quadril/joelho ou trauma grave recente", value: 5 }
        ]
      },
      {
        id: "historico_tev",
        label: "Histórico pessoal ou familiar de Trombose (TVP / TEP)",
        options: [
          { label: "0 - Não", value: 0 },
          { label: "3 - Sim (Histórico positivo de TEV) (+3)", value: 3 }
        ]
      }
    ],
    interpret: (score) => {
      if (score >= 5) return "Risco Altíssimo de TEV (Caprini >= 5). Profilaxia química e mecânica fortemente recomendadas.";
      if (score >= 3) return "Risco Alto de TEV (Caprini 3-4). Recomenda-se deambulação precoce e meias de compressão.";
      if (score >= 1) return "Risco Baixo a Moderado (Caprini 1-2).";
      return "Risco Ínfimo de TEV (Caprini 0).";
    }
  }
];
