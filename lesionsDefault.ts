export interface LesionDefaultInfo {
  fisiopatologia: string;
  planoTratamento: string;
  tratamentoPasso: string;
  indicacoesContraindicacoes: string;
  coberturasRecomendadas: string;
  medicamentosTopicos: string;
}

export const lesionsDefaultData: Record<string, LesionDefaultInfo> = {
  "Lesão por Pressão (LPP) - Estágio I": {
    fisiopatologia: "Isquemia tecidual superficial decorrente de pressão prolongada sobre proeminências ósseas, resultando em eritema que não empalidece após alívio da pressão. Epiderme e derme continuam íntegras.",
    planoTratamento: "Foco no alívio total da pressão, hidratação profunda e proteção da barreira cutânea. Evitar fricção e cisalhamento.",
    tratamentoPasso: "1. Limpar a região delicadamente com sabonete neutro ou soro fisiológico.\n2. Secar sem esfregar.\n3. Aplicar Ácidos Graxos Essenciais (AGE) ou loção hidratante protetora.\n4. Realizar mudança de decúbito a cada 2 horas.\n5. Utilizar superfícies de suporte (colchão pneumático/caixa de ovo).",
    indicacoesContraindicacoes: "Indicado: Pacientes acamados com eritema reativo. Contraindicado: Massagear a proeminência óssea (pode aumentar o dano tecidual profundo).",
    coberturasRecomendadas: "Película Protetora sem ardor (cria barreira contra umidade) ou Placa de Hidrocoloide Extra Fino (protege contra fricção).",
    medicamentosTopicos: "Ácidos Graxos Essenciais (AGE) / Dersani: promovem quimiotaxia, angiogênese e protegem a barreira lipídica."
  },
  "Lesão por Pressão (LPP) - Estágio II": {
    fisiopatologia: "Perda parcial da espessura da derme, apresentando-se como uma úlcera superficial com leito de coloração vermelho-rosa, sem esfacelo. Pode se apresentar também como uma bolha (flictena) intacta ou rompida.",
    planoTratamento: "Manutenção do leito úmido para favorecer a migração epitelial, prevenção de infecção local e proteção contra traumas secundários.",
    tratamentoPasso: "1. Limpar com jato de Soro Fisiológico 0,9% morno para remover detritos sem traumatizar.\n2. Secar apenas a pele perilesional.\n3. Aplicar cobertura adequada conforme volume de exsudato.\n4. Fixar com adesivo hipoalergênico.\n5. Monitorar sinais flogísticos diariamente.",
    indicacoesContraindicacoes: "Indicado: Feridas superficiais com perda de derme. Contraindicado: Uso de anti-sépticos citotóxicos (ex: PVPI, clorexidina degermante) no leito da ferida.",
    coberturasRecomendadas: "Hidrocoloide Placa Regular (absorve leve exsudato e mantém meio úmido), ou Curativo de Espuma/Foam (se exsudato moderado).",
    medicamentosTopicos: "Ácidos Graxos Essenciais (AGE) ou Hidrogel com alginato (ajuda na cicatrização e hidratação do leito)."
  },
  "Lesão por Pressão (LPP) - Estágio III": {
    fisiopatologia: "Perda total da espessura tecidual. O tecido subcutâneo (gordura) pode estar visível, mas ossos, tendões ou músculos não estão expostos. Pode apresentar esfacelo e/ou necrose, além de descolamento de bordas.",
    planoTratamento: "Remoção de tecidos inviáveis (desbridamento de esfacelo), controle de carga bacteriana, controle do exsudato e preenchimento de espaço morto.",
    tratamentoPasso: "1. Irrigar sob pressão com SF 0,9% morno.\n2. Avaliar presença de esfacelo e realizar desbridamento se necessário.\n3. Aplicar produto para desbridamento químico ou cobertura absorvente.\n4. Preencher cavidades levemente se houver descolamento.\n5. Ocluir com cobertura secundária absorvente.",
    indicacoesContraindicacoes: "Indicado: Feridas profundas cavitárias sem exposição de estruturas nobres. Contraindicado: Permitir o ressecamento do leito da ferida.",
    coberturasRecomendadas: "Alginato de Cálcio (absorve moderado/alto exsudato e faz hemostasia), Hidrogel com Alginato (para desbridamento autolítico) ou Papaína (para desbridamento químico).",
    medicamentosTopicos: "Pomada de Papaína (2% a 10%) para digestão enzimática do esfacelo, ou Colagenase para remoção de pontes de colágeno desnaturado."
  },
  "Lesão por Pressão (LPP) - Estágio IV": {
    fisiopatologia: "Perda total de tecido com exposição de ossos, tendões, fáscias ou músculos. Geralmente acompanhada de esfacelo, necrose de coagulação, descolamento, túneis e fístulas. Alto risco de osteomielite.",
    planoTratamento: "Preservação de estruturas nobres, desbridamento agressivo de tecidos inviáveis, preenchimento de cavidades profundas, controle rigoroso de exsudato e infecção.",
    tratamentoPasso: "1. Limpar rigorosamente com jatos de SF 0,9% ou solução antisséptica estéril (PHMB).\n2. Realizar desbridamento autolítico, enzimático ou instrumental.\n3. Preencher espaço morto e cavidades com curativo absorvente/antimicrobiano.\n4. Cobrir com placa de espuma ou gaze estéril e fixador impermeável.\n5. Posicionar o paciente evitando peso sobre o local.",
    indicacoesContraindicacoes: "Indicado: Feridas com perda tecidual total extrema. Contraindicado: Fechamento de bordas sem preenchimento do fundo (risco de abscesso de espaço morto).",
    coberturasRecomendadas: "Alginato com Prata (ação antimicrobiana e alta absorção), Curativo de PHMB em gaze ou espuma (antimicrobiano de amplo espectro), ou Terapia por Pressão Negativa (TPN/Vácuo).",
    medicamentosTopicos: "Sulfadiazina de Prata 1% ou Hidrogel com Prata para controle de carga bacteriana."
  },
  "Lesão por Pressão (LPP) - Não Classificável": {
    fisiopatologia: "Perda total da espessura tecidual, na qual a profundidade real da úlcera está completamente obstruída por esfacelo (amarelo, bronze, cinza, verde ou marrom) e/ou escara (marrom, preta ou preta) no leito da ferida.",
    planoTratamento: "Remover a escara/esfacelo para permitir a visualização do leito e classificação da lesão. Nota: escaras secas e aderidas nos calcâneos não devem ser desbridadas se estiverem estáveis.",
    tratamentoPasso: "1. Limpar a ferida com SF 0,9%.\n2. Aplicar agente desbridante enzimático ou químico diretamente na escara dura (pode escarificar a placa para favorecer penetração).\n3. Proteger a pele perilesional para evitar maceração.\n4. Cobrir com curativo secundário oclusivo.\n5. Trocar conforme saturação.",
    indicacoesContraindicacoes: "Indicado: Remoção de barreira de necrose para cicatrização. Contraindicado: Desbridar escara de calcâneo preta, seca, sem flutuação, sem rubor e sem exsudato (serve como barreira biológica).",
    coberturasRecomendadas: "Papaína 10% (desbridante químico potente), Colagenase ou Hidrogel (amolece a escara seca por hidratação).",
    medicamentosTopicos: "Papaína ou Hidrogel sob oclusão para desbridamento autolítico e enzimático rápido."
  },
  "Lesão por Pressão (LPP) - Tecidual Profunda": {
    fisiopatologia: "Área localizada de pele intacta de coloração púrpura, vermelha escura ou marrom, ou bolha cheia de sangue, devido a dano no tecido mole subjacente decorrente de pressão e/ou cisalhamento.",
    planoTratamento: "Proteção contra ruptura epidermal, monitoramento evolutivo de necrose subjacente, alívio absoluto da pressão mecânica.",
    tratamentoPasso: "1. Higienizar a pele intacta com suavidade.\n2. Aplicar hidratante ou película de silicone protetora.\n3. Proteger com coxins e colchão de redistribuição de fluxo.\n4. Realizar vigilância fotográfica e clínica constante do diâmetro.\n5. Orientar equipe sobre fragilidade extrema da área.",
    indicacoesContraindicacoes: "Indicado: Áreas purpúreas fechadas de alta pressão. Contraindicado: Realizar qualquer pressão física ou fricção sobre a região afetada.",
    coberturasRecomendadas: "Placa de Espuma de Silicone Multicamadas (redistribui pressão e reduz forças de cisalhamento/fricção).",
    medicamentosTopicos: "Ácidos Graxos Essenciais (AGE) para fortalecimento lipídico periférico."
  },
  "Úlcera Venosa": {
    fisiopatologia: "Hipertensão venosa crônica decorrente de incompetência valvular e/ou obstrução venosa profunda, provocando extravasamento de hemácias, deposição de hemossiderina (mancha ocre), edema peri-maleolar e hipóxia tecidual.",
    planoTratamento: "Controle do edema, melhora do retorno venoso (terapia compressiva), controle de exsudato abundante e manutenção do leito limpo.",
    tratamentoPasso: "1. Lavar abundantemente (pode-se usar banho de balde ou ducha de SF).\n2. Tratar leito com antimicrobianos/absorventes se exsudativa.\n3. Aplicar creme protetor de óxido de zinco na pele perilesional para evitar dermatite.\n4. Aplicar Bota de Unna ou Sistema de Compressão Multicamadas.\n5. Estimular repouso com membros inferiores elevados.",
    indicacoesContraindicacoes: "Indicado: Pacientes com insuficiência venosa e ITB (Índice Tornozelo-Braço) > 0,8. Contraindicado: Terapia compressiva em pacientes com insuficiência arterial grave concomitante (ITB < 0,5).",
    coberturasRecomendadas: "Bota de Unna (compressão inelástica), Curativos de Alginato ou Espuma de Poliuretano com Prata (para absorver exsudato abundante e combater biofilme).",
    medicamentosTopicos: "Óxido de Zinco com Óleo de Amêndoas (pele ao redor) e Hidrogel com Prata no leito se houver sinais inflamatórios."
  },
  "Úlcera Arterial": {
    fisiopatologia: "Insuficiência arterial crônica (isquemia periférica) causada por aterosclerose, resultando em fluxo sanguíneo inadequado para nutrir o tecido periférico. As úlceras são dolorosas, com bordas bem definidas, profundas, geralmente localizadas em dedos ou maléolo lateral.",
    planoTratamento: "Manutenção da ferida limpa e seca (se necrose seca) ou meio úmido controlado (sem oclusão estrita), alívio da dor isquêmica intensa, encaminhamento para revascularização.",
    tratamentoPasso: "1. Limpar de forma asséptica e sem fricção.\n2. Se necrose seca, manter seca com álcool 70% ou iodopovidona alcoólico para evitar infecção.\n3. Se úmida, aplicar curativo não aderente de baixa umidade.\n4. Controlar rigidez das bordas.\n5. Evitar compressão e elevação de membros inferiores (piora isquemia).",
    indicacoesContraindicacoes: "Indicado: Proteção seca em membros com isquemia crítica. Contraindicado: Terapia de compressão elástica ou elevação do membro acima do nível do coração.",
    coberturasRecomendadas: "Curativos não aderentes, gaze de rayon impregnada com ácidos graxos, ou coberturas de carvão ativo se houver odor.",
    medicamentosTopicos: "Soluções antissépticas locais e pomadas que favoreçam microcirculação local se autorizado por equipe médica."
  },
  "Pé Diabético": {
    fisiopatologia: "Neuropatia periférica (perda de sensibilidade protetora), microangiopatia e deformidades ortopédicas em pacientes com Diabetes Mellitus, levando a calosidades, rachaduras, traumas despercebidos, infecções profundas e osteomielite.",
    planoTratamento: "Descarga total da pressão na úlcera (offloading), desbridamento frequente de calosidades, controle rígido de infecções bacterianas e controle glicêmico.",
    tratamentoPasso: "1. Lavar com SF 0,9% sob pressão controlada.\n2. Avaliar presença de túneis e fístulas com sonda estéril.\n3. Aplicar cobertura antimicrobiana e absorvente.\n4. Proteger bordas contra maceração.\n5. Orientar uso de calçados de descarga terapêutica.",
    indicacoesContraindicacoes: "Indicado: Lesões neuropáticas plantares. Contraindicado: Permitir que o paciente ande descalço ou apoie o peso corporal diretamente sobre o pé afetado.",
    coberturasRecomendadas: "Alginato de Cálcio com Prata ou Curativos de Fibra de Carboximetilcelulose com Prata (alta absorção e controle microbiano).",
    medicamentosTopicos: "Cremes hidratantes com uréia na pele íntegra (evitando os vãos digitais) e antimicrobianos tópicos no leito se colonizado."
  },
  "Ferida Cirúrgica (Deiscência)": {
    fisiopatologia: "Separação acidental das bordas de uma incisão cirúrgica previamente suturada. Pode ocorrer por infecção, aumento da pressão intra-abdominal, desnutrição, tabagismo ou técnica cirúrgica inadequada.",
    planoTratamento: "Preenchimento de espaço morto, controle de exsudato seroso/purulento, aceleração do tecido de granulação e aproximação gradual de bordas.",
    tratamentoPasso: "1. Limpar com SF 0,9% estéril por irrigação.\n2. Avaliar integridade de planos profundos.\n3. Aplicar preenchimento cavitário de forma frouxa.\n4. Proteger a pele perilesional contra fitas adesivas repetitivas.\n5. Promover suporte nutricional hiperproteico.",
    indicacoesContraindicacoes: "Indicado: Deiscências de planos superficiais. Contraindicado: Uso de curativos oclusivos se houver suspeita de fístulas intestinais ou de órgãos profundos sem dreno.",
    coberturasRecomendadas: "Hidrogel com Alginato (mantém umidade), Gaze de PHMB (evita proliferação bacteriana), ou Espuma de Poliuretano Cavitária.",
    medicamentosTopicos: "Ácidos Graxos Essenciais (AGE) para estimular cicatrização periférica rápida."
  },
  "Ferida Traumática": {
    fisiopatologia: "Lesão tecidual aguda produzida por forças mecânicas externas (abrasão, laceração, avulsão ou punção), com risco aumentado de contaminação bacteriana por sujidade e corpos estranhos.",
    planoTratamento: "Limpeza mecânica rigorosa para remoção de detritos, profilaxia antitetânica, controle de infecções secundárias e fechamento tecidual.",
    tratamentoPasso: "1. Lavar abundantemente com SF 0,9% ou água corrente limpa sob pressão para remoção de sujidades físicas.\n2. Realizar desinfecção cuidadosa com sabão antisséptico ou PHMB.\n3. Remover corpos estranhos soltos.\n4. Aplicar cobertura de proteção ou suturar/aproximar bordas se limpa.\n5. Avaliar vacinação para Tétano.",
    indicacoesContraindicacoes: "Indicado: Lesões agudas traumáticas. Contraindicado: Fechar primariamente feridas altamente contaminadas ou mordeduras de animais (alto risco de abscesso gasoso).",
    coberturasRecomendadas: "Curativos não aderentes (Rayon), Gaze com Vaselina ou PHMB Solução para limpeza contínua.",
    medicamentosTopicos: "Pomada de Neomicina + Bacitracina ou Colagenase se houver restos necróticos traumáticos."
  },
  "Queimadura": {
    fisiopatologia: "Destruição térmica, química ou elétrica das camadas da pele, causando desnaturação de proteínas celulares, dor extrema devido à exposição de terminações nervosas e extravasamento maciço de plasma sanguíneo.",
    planoTratamento: "Alívio da dor, prevenção de infecção secundária (leito propício devido à perda de barreira epidérmica), controle de perda líquida e facilitação da epitelização.",
    tratamentoPasso: "1. Resfriar imediatamente com água corrente limpa (se trauma recente).\n2. Higienizar delicadamente com soro fisiológico ou água morna.\n3. Manter flictenas (bolhas) intactas sempre que possível para proteção biológica.\n4. Aplicar pomada protetora antimicrobiana em camada generosa.\n5. Ocluir levemente sem compressão apertada.",
    indicacoesContraindicacoes: "Indicado: Queimaduras de 1º e 2º graus. Contraindicado: Aplicar substâncias caseiras (pasta de dente, manteiga, pó de café) que contaminam e aprofundam a lesão.",
    coberturasRecomendadas: "Gaze de Rayon impregnada com AGE, Membranas de Biocelulose, ou Curativo de Prata Nanocristalina.",
    medicamentosTopicos: "Sulfadiazina de Prata 1% (padrão ouro antibacteriano para queimados) ou Hidrogel com Prata."
  },
  "Outra Lesão Cutânea": {
    fisiopatologia: "Danos na integridade da pele decorrentes de causas diversas como radiodermite, farmacodermias, dermatites associadas à incontinência (DAI) ou vasculites.",
    planoTratamento: "Tratamento individualizado com base na etiologia primária, alívio de sintomas inflamatórios, restauração da barreira lipídica da pele e proteção contra umidade.",
    tratamentoPasso: "1. Limpar a pele afetada com suavidade extrema.\n2. Aplicar cremes barreira ou loções hidratantes conforme indicação clínica.\n3. Evitar uso de fitas adesivas agressivas.\n4. Promover ventilação e controle de umidade.\n5. Ajustar conduta em conjunto com equipe médica.",
    indicacoesContraindicacoes: "Indicado: Lesões gerais não classificadas em outras categorias. Contraindicado: Uso de substâncias sensibilizantes ou perfumes na área lesionada.",
    coberturasRecomendadas: "Creme Barreira Repelente de Umidade (para DAI), Placas de Silicone ou compressas não aderentes.",
    medicamentosTopicos: "Ácidos Graxos Essenciais, Cremes à base de Calêndula ou Óxido de Zinco."
  }
};
