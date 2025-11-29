'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation'; // DESCOMENTE NO SEU PROJETO REAL

// Ícones
import { 
  School, MapPin, Phone, Users, UserCheck, BookOpen, 
  TrendingUp, Award, Building, Wifi, Utensils, Laptop, 
  ArrowLeft, Home, Download, BarChart3, Target, Calendar,
  Loader2, FileText, X, AlertTriangle
} from 'lucide-react';

// Recharts
import {
  LineChart, Line, ResponsiveContainer, CartesianGrid, XAxis, YAxis, Tooltip
} from 'recharts';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

// --- DICIONARIO DE DADOS ---
const DICIONARIO_DADOS: Record<string, string> = {
  // IDENTIFICAÇÃO
  "NU_ANO_CENSO": "Ano do Censo",
  "NO_REGIAO": "Nome da Região",
  "CO_REGIAO": "Código da Região",
  "NO_UF": "Nome da UF",
  "SG_UF": "Sigla da UF",
  "CO_UF": "Código da UF",
  "NO_MUNICIPIO": "Nome do Município",
  "CO_MUNICIPIO": "Código do Município",
  "NO_REGIAO_GEOG_INTERM": "Região Geográfica Intermediária",
  "CO_REGIAO_GEOG_INTERM": "Cód. Região Geográfica Intermediária",
  "NO_REGIAO_GEOG_IMED": "Região Geográfica Imediata",
  "CO_REGIAO_GEOG_IMED": "Cód. Região Geográfica Imediata",
  "NO_MESORREGIAO": "Mesorregião",
  "CO_MESORREGIAO": "Cód. Mesorregião",
  "NO_MICRORREGIAO": "Microrregião",
  "CO_MICRORREGIAO": "Cód. Microrregião",
  "NO_DISTRITO": "Distrito",
  "CO_DISTRITO": "Cód. Distrito",
  "NO_ENTIDADE": "Nome da Escola",
  "CO_ENTIDADE": "Código INEP (Escola)",
  "TP_DEPENDENCIA": "Dependência Administrativa (Rede)",
  "TP_CATEGORIA_ESCOLA_PRIVADA": "Categoria Escola Privada",
  "TP_LOCALIZACAO": "Localização (Zona)",
  "TP_LOCALIZACAO_DIFERENCIADA": "Localização Diferenciada",
  "DS_ENDERECO": "Endereço",
  "NU_ENDERECO": "Número",
  "DS_COMPLEMENTO": "Complemento",
  "NO_BAIRRO": "Bairro",
  "CO_CEP": "CEP",
  "NU_DDD": "DDD",
  "NU_TELEFONE": "Telefone",
  "TP_SITUACAO_FUNCIONAMENTO": "Situação de Funcionamento",
  "CO_ORGAO_REGIONAL": "Cód. Órgão Regional",
  "DT_ANO_LETIVO_INICIO": "Início Ano Letivo",
  "DT_ANO_LETIVO_TERMINO": "Fim Ano Letivo",

  // VINCULOS E CONVENIOS
  "IN_VINCULO_SECRETARIA_EDUCACAO": "Vínculo Secretaria Educação",
  "IN_VINCULO_SEGURANCA_PUBLICA": "Vínculo Segurança Pública",
  "IN_VINCULO_SECRETARIA_SAUDE": "Vínculo Secretaria Saúde",
  "IN_VINCULO_OUTRO_ORGAO": "Vínculo Outro Órgão",
  "IN_PODER_PUBLICO_PARCERIA": "Parceria Poder Público",
  "TP_PODER_PUBLICO_PARCERIA": "Tipo Parceria Poder Público",
  "IN_FORMA_CONT_TERMO_COLABORA": "Termo de Colaboração",
  "IN_FORMA_CONT_TERMO_FOMENTO": "Termo de Fomento",
  "IN_FORMA_CONT_ACORDO_COOP": "Acordo de Cooperação",
  "IN_FORMA_CONT_PRESTACAO_SERV": "Contrato Prestação Serviço",
  "IN_FORMA_CONT_COOP_TEC_FIN": "Cooperação Téc. Financeira",
  "IN_FORMA_CONT_CONSORCIO_PUB": "Consórcio Público",
  
  // INFRAESTRUTURA PREDIO
  "IN_LOCAL_FUNC_PREDIO_ESCOLAR": "Funciona em Prédio Escolar",
  "TP_OCUPACAO_PREDIO_ESCOLAR": "Tipo Ocupação Prédio",
  "IN_LOCAL_FUNC_SOCIOEDUCATIVO": "Funciona em Unid. Socioeducativa",
  "IN_LOCAL_FUNC_UNID_PRISIONAL": "Funciona em Unid. Prisional",
  "IN_LOCAL_FUNC_PRISIONAL_SOCIO": "Funciona em Prisional/Socio",
  "IN_LOCAL_FUNC_GALPAO": "Funciona em Galpão",
  "TP_OCUPACAO_GALPAO": "Tipo Ocupação Galpão",
  "IN_LOCAL_FUNC_SALAS_OUTRA_ESC": "Funciona em Salas Outra Escola",
  "IN_LOCAL_FUNC_OUTROS": "Funciona em Outros Locais",
  "IN_PREDIO_COMPARTILHADO": "Prédio Compartilhado",
  "QT_SALAS_UTILIZADAS_DENTRO": "Qtd. Salas Dentro Prédio",
  "QT_SALAS_UTILIZADAS_FORA": "Qtd. Salas Fora Prédio",
  "QT_SALAS_UTILIZADAS": "Total Salas Utilizadas",
  "QT_SALAS_UTILIZA_CLIMATIZADAS": "Qtd. Salas Climatizadas",
  "QT_SALAS_UTILIZADAS_ACESSIVEIS": "Qtd. Salas Acessíveis",

  // INFRAESTRUTURA SERVICOS
  "IN_AGUA_POTAVEL": "Água Potável",
  "IN_AGUA_REDE_PUBLICA": "Água Rede Pública",
  "IN_AGUA_POCO_ARTESIANO": "Água Poço Artesiano",
  "IN_AGUA_CACIMBA": "Água Cacimba",
  "IN_AGUA_FONTE_RIO": "Água Fonte/Rio",
  "IN_AGUA_INEXISTENTE": "Sem Água",
  "IN_AGUA_CARRO_PIPA": "Água Carro Pipa",
  "IN_ENERGIA_REDE_PUBLICA": "Energia Rede Pública",
  "IN_ENERGIA_GERADOR_FOSSIL": "Energia Gerador",
  "IN_ENERGIA_RENOVAVEL": "Energia Renovável",
  "IN_ENERGIA_INEXISTENTE": "Sem Energia",
  "IN_ESGOTO_REDE_PUBLICA": "Esgoto Rede Pública",
  "IN_ESGOTO_FOSSA_SEPTICA": "Esgoto Fossa Séptica",
  "IN_ESGOTO_FOSSA_COMUM": "Esgoto Fossa Comum",
  "IN_ESGOTO_FOSSA": "Esgoto Fossa",
  "IN_ESGOTO_INEXISTENTE": "Sem Esgoto",
  "IN_LIXO_SERVICO_COLETA": "Coleta de Lixo",
  "IN_LIXO_QUEIMA": "Queima Lixo",
  "IN_LIXO_ENTERRA": "Enterra Lixo",
  "IN_LIXO_DESTINO_FINAL_PUBLICO": "Lixo Destino Público",
  "IN_LIXO_DESCARTA_OUTRA_AREA": "Descarta Lixo Outra Área",
  "IN_TRATAMENTO_LIXO_SEPARACAO": "Separação de Lixo",
  "IN_TRATAMENTO_LIXO_REUTILIZA": "Reutilização de Lixo",
  "IN_TRATAMENTO_LIXO_RECICLAGEM": "Reciclagem de Lixo",
  "IN_TRATAMENTO_LIXO_INEXISTENTE": "Sem Tratamento Lixo",

  // DEPENDENCIAS
  "IN_ALMOXARIFADO": "Almoxarifado",
  "IN_AREA_VERDE": "Área Verde",
  "IN_AREA_PLANTIO": "Área de Plantio",
  "IN_AUDITORIO": "Auditório",
  "IN_BANHEIRO": "Banheiro",
  "IN_BANHEIRO_EI": "Banheiro Educação Infantil",
  "IN_BANHEIRO_PNE": "Banheiro PNE (Acessível)",
  "IN_BANHEIRO_FUNCIONARIOS": "Banheiro Funcionários",
  "IN_BANHEIRO_CHUVEIRO": "Banheiro com Chuveiro",
  "IN_BIBLIOTECA": "Biblioteca",
  "IN_BIBLIOTECA_SALA_LEITURA": "Sala de Leitura",
  "IN_COZINHA": "Cozinha",
  "IN_DESPENSA": "Despensa",
  "IN_DORMITORIO_ALUNO": "Dormitório Aluno",
  "IN_DORMITORIO_PROFESSOR": "Dormitório Professor",
  "IN_LABORATORIO_CIENCIAS": "Lab. Ciências",
  "IN_LABORATORIO_INFORMATICA": "Lab. Informática",
  "IN_LABORATORIO_EDUC_PROF": "Lab. Educação Profissional",
  "IN_PATIO_COBERTO": "Pátio Coberto",
  "IN_PATIO_DESCOBERTO": "Pátio Descoberto",
  "IN_PARQUE_INFANTIL": "Parque Infantil",
  "IN_PISCINA": "Piscina",
  "IN_QUADRA_ESPORTES": "Quadra Esportes",
  "IN_QUADRA_ESPORTES_COBERTA": "Quadra Coberta",
  "IN_QUADRA_ESPORTES_DESCOBERTA": "Quadra Descoberta",
  "IN_REFEITORIO": "Refeitório",
  "IN_SALA_ATELIE_ARTES": "Sala/Ateliê Artes",
  "IN_SALA_MUSICA_CORAL": "Sala Música/Coral",
  "IN_SALA_ESTUDIO_DANCA": "Estúdio Dança",
  "IN_SALA_MULTIUSO": "Sala Multiuso",
  "IN_SALA_ESTUDIO_GRAVACAO": "Estúdio Gravação",
  "IN_SALA_OFICINAS_EDUC_PROF": "Oficinas Educ. Profissional",
  "IN_SALA_DIRETORIA": "Sala Diretoria",
  "IN_SALA_LEITURA": "Sala Leitura",
  "IN_SALA_PROFESSOR": "Sala Professores",
  "IN_SALA_REPOUSO_ALUNO": "Sala Repouso Aluno",
  "IN_SECRETARIA": "Secretaria",
  "IN_SALA_ATENDIMENTO_ESPECIAL": "Sala Atendimento Especial (AEE)",
  "IN_TERREIRAO": "Terreirão",
  "IN_VIVEIRO": "Viveiro",
  "IN_DEPENDENCIAS_OUTRAS": "Outras Dependências",

  // ACESSIBILIDADE
  "IN_ACESSIBILIDADE_CORRIMAO": "Acessibilidade: Corrimão",
  "IN_ACESSIBILIDADE_ELEVADOR": "Acessibilidade: Elevador",
  "IN_ACESSIBILIDADE_PISOS_TATEIS": "Acessibilidade: Pisos Táteis",
  "IN_ACESSIBILIDADE_VAO_LIVRE": "Acessibilidade: Vão Livre",
  "IN_ACESSIBILIDADE_RAMPAS": "Acessibilidade: Rampas",
  "IN_ACESSIBILIDADE_SINAL_SONORO": "Acessibilidade: Sinal Sonoro",
  "IN_ACESSIBILIDADE_SINAL_TATIL": "Acessibilidade: Sinal Tátil",
  "IN_ACESSIBILIDADE_SINAL_VISUAL": "Acessibilidade: Sinal Visual",
  "IN_ACESSIBILIDADE_INEXISTENTE": "Sem Acessibilidade",
  "IN_ACESSIBILIDADE_SINALIZACAO": "Acessibilidade: Sinalização",

  // EQUIPAMENTOS
  "IN_EQUIP_PARABOLICA": "Antena Parabólica",
  "IN_COMPUTADOR": "Computadores",
  "IN_EQUIP_COPIADORA": "Copiadora",
  "IN_EQUIP_IMPRESSORA": "Impressora",
  "IN_EQUIP_IMPRESSORA_MULT": "Impressora Multifuncional",
  "IN_EQUIP_SCANNER": "Scanner",
  "IN_EQUIP_NENHUM": "Nenhum Equipamento",
  "IN_EQUIP_DVD": "DVD",
  "QT_EQUIP_DVD": "Qtd. DVDs",
  "IN_EQUIP_SOM": "Aparelho de Som",
  "QT_EQUIP_SOM": "Qtd. Sons",
  "IN_EQUIP_TV": "TV",
  "QT_EQUIP_TV": "Qtd. TVs",
  "IN_EQUIP_LOUSA_DIGITAL": "Lousa Digital",
  "QT_EQUIP_LOUSA_DIGITAL": "Qtd. Lousas Digitais",
  "IN_EQUIP_MULTIMIDIA": "Projetor Multimídia",
  "QT_EQUIP_MULTIMIDIA": "Qtd. Projetores",
  "IN_DESKTOP_ALUNO": "Desktop para Aluno",
  "QT_DESKTOP_ALUNO": "Qtd. Desktops Aluno",
  "IN_COMP_PORTATIL_ALUNO": "Notebook para Aluno",
  "QT_COMP_PORTATIL_ALUNO": "Qtd. Notebooks Aluno",
  "IN_TABLET_ALUNO": "Tablet para Aluno",
  "QT_TABLET_ALUNO": "Qtd. Tablets Aluno",
  "IN_INTERNET": "Possui Internet",
  "IN_INTERNET_ALUNOS": "Internet para Alunos",
  "IN_INTERNET_ADMINISTRATIVO": "Internet Administrativa",
  "IN_INTERNET_APRENDIZAGEM": "Internet Aprendizagem",
  "IN_INTERNET_COMUNIDADE": "Internet Comunidade",
  "IN_ACESSO_INTERNET_COMPUTADOR": "Acesso via Computador",
  "IN_ACES_INTERNET_DISP_PESSOAIS": "Acesso via Disp. Pessoais",
  "TP_REDE_LOCAL": "Tipo Rede Local",
  "IN_BANDA_LARGA": "Banda Larga",

  // EQUIPE
  "IN_PROF_ADMINISTRATIVOS": "Prof. Administrativos",
  "QT_PROF_ADMINISTRATIVOS": "Qtd. Prof. Administrativos",
  "IN_PROF_SERVICOS_GERAIS": "Prof. Serviços Gerais",
  "QT_PROF_SERVICOS_GERAIS": "Qtd. Prof. Serviços Gerais",
  "IN_PROF_BIBLIOTECARIO": "Bibliotecário",
  "QT_PROF_BIBLIOTECARIO": "Qtd. Bibliotecários",
  "IN_PROF_SAUDE": "Prof. Saúde",
  "QT_PROF_SAUDE": "Qtd. Prof. Saúde",
  "IN_PROF_COORDENADOR": "Coordenador",
  "QT_PROF_COORDENADOR": "Qtd. Coordenadores",
  "IN_PROF_FONAUDIOLOGO": "Fonoaudiólogo",
  "QT_PROF_FONAUDIOLOGO": "Qtd. Fonoaudiólogos",
  "IN_PROF_NUTRICIONISTA": "Nutricionista",
  "QT_PROF_NUTRICIONISTA": "Qtd. Nutricionistas",
  "IN_PROF_PSICOLOGO": "Psicólogo",
  "QT_PROF_PSICOLOGO": "Qtd. Psicólogos",
  "IN_PROF_ALIMENTACAO": "Merendeira/Cozinheiro",
  "QT_PROF_ALIMENTACAO": "Qtd. Merendeiras",
  "IN_PROF_PEDAGOGIA": "Pedagogo",
  "QT_PROF_PEDAGOGIA": "Qtd. Pedagogos",
  "IN_PROF_SECRETARIO": "Secretário Escolar",
  "QT_PROF_SECRETARIO": "Qtd. Secretários",
  "IN_PROF_SEGURANCA": "Segurança",
  "QT_PROF_SEGURANCA": "Qtd. Seguranças",
  "IN_PROF_MONITORES": "Monitores",
  "QT_PROF_MONITORES": "Qtd. Monitores",
  "IN_PROF_GESTAO": "Gestão Escolar",
  "QT_PROF_GESTAO": "Qtd. Gestão",
  "IN_PROF_ASSIST_SOCIAL": "Assistente Social",
  "QT_PROF_ASSIST_SOCIAL": "Qtd. Assist. Social",
  "IN_PROF_TRAD_LIBRAS": "Tradutor Libras",
  "QT_PROF_TRAD_LIBRAS": "Qtd. Tradutor Libras",
  "IN_PROF_AGRICOLA": "Prof. Agrícola",
  "QT_PROF_AGRICOLA": "Qtd. Prof. Agrícola",
  "IN_PROF_REVISOR_BRAILLE": "Revisor Braille",
  "QT_PROF_REVISOR_BRAILLE": "Qtd. Revisores Braille",

  // PEDAGOGICO
  "IN_ALIMENTACAO": "Fornece Alimentação",
  "IN_MATERIAL_PED_MULTIMIDIA": "Mat. Pedagógico Multimídia",
  "IN_MATERIAL_PED_INFANTIL": "Mat. Pedagógico Infantil",
  "IN_MATERIAL_PED_CIENTIFICO": "Mat. Pedagógico Científico",
  "IN_MATERIAL_PED_DIFUSAO": "Mat. Difusão (Som)",
  "IN_MATERIAL_PED_MUSICAL": "Mat. Musical",
  "IN_MATERIAL_PED_JOGOS": "Jogos Educativos",
  "IN_MATERIAL_PED_ARTISTICAS": "Mat. Artístico",
  "IN_MATERIAL_PED_PROFISSIONAL": "Mat. Ed. Profissional",
  "IN_MATERIAL_PED_DESPORTIVA": "Mat. Esportivo",
  "IN_MATERIAL_PED_INDIGENA": "Mat. Indígena",
  "IN_MATERIAL_PED_ETNICO": "Mat. Étnico-Racial",
  "IN_MATERIAL_PED_CAMPO": "Mat. Educação do Campo",
  "IN_MATERIAL_PED_BIL_SURDOS": "Mat. Bilíngue Surdos",
  "IN_MATERIAL_PED_AGRICOLA": "Mat. Agrícola",
  "IN_MATERIAL_PED_QUILOMBOLA": "Mat. Quilombola",
  "IN_MATERIAL_PED_EDU_ESP": "Mat. Educação Especial",
  "IN_MATERIAL_PED_NENHUM": "Nenhum Material",
  "IN_EDUCACAO_INDIGENA": "Educação Indígena",

  // RESERVAS
  "IN_EXAME_SELECAO": "Exame de Seleção",
  "IN_RESERVA_PPI": "Cotas PPI",
  "IN_RESERVA_RENDA": "Cotas Renda",
  "IN_RESERVA_PUBLICA": "Cotas Escola Pública",
  "IN_RESERVA_PCD": "Cotas PCD",
  "IN_RESERVA_OUTROS": "Cotas Outros",
  "IN_RESERVA_NENHUMA": "Sem Cotas",
  "IN_REDES_SOCIAIS": "Possui Redes Sociais",
  "IN_ESPACO_ATIVIDADE": "Compartilha Espaço",
  "IN_ESPACO_EQUIPAMENTO": "Usa Espaço Entorno",
  "IN_ORGAO_ASS_PAIS": "Assoc. Pais",
  "IN_ORGAO_ASS_PAIS_MESTRES": "Assoc. Pais e Mestres",
  "IN_ORGAO_CONSELHO_ESCOLAR": "Conselho Escolar",
  "IN_ORGAO_GREMIO_ESTUDANTIL": "Grêmio Estudantil",

  // PROPOSTA
  "TP_PROPOSTA_PEDAGOGICA": "Proposta Pedagógica Atualizada",
  "IN_EDUC_AMBIENTAL": "Educação Ambiental",
  "TP_AEE": "Tipo AEE",
  "TP_ATIVIDADE_COMPLEMENTAR": "Atividade Complementar",
  "IN_MEDIACAO_PRESENCIAL": "Ensino Presencial",
  "IN_MEDIACAO_SEMIPRESENCIAL": "Ensino Semipresencial",
  "IN_MEDIACAO_EAD": "Ensino EAD",
  "IN_REGULAR": "Ensino Regular",
  "IN_DIURNO": "Turno Diurno",
  "IN_NOTURNO": "Turno Noturno",
  "IN_EAD": "Turno EAD",

  // QUANTITATIVOS
  "QT_MAT_BAS": "Total Matrículas Básica",
  "QT_MAT_INF": "Matrículas Infantil",
  "QT_MAT_FUND": "Matrículas Fundamental",
  "QT_MAT_MED": "Matrículas Médio",
  "QT_MAT_PROF": "Matrículas Profissional",
  "QT_MAT_EJA": "Matrículas EJA",
  "QT_MAT_ESP": "Matrículas Educação Especial",
  "QT_DOC_BAS": "Total Docentes",
  "QT_TUR_BAS": "Total Turmas"
};

// --- FUNÇÃO DE PDF ---
const generatePDF = (dadosCompletos: any) => {
  const { raw } = dadosCompletos;
  const now = new Date();
  const dataHora = now.toLocaleDateString('pt-BR') + ' às ' + now.toLocaleTimeString('pt-BR');

  const formatValue = (key: string, val: any) => {
    if (val === null || val === undefined) return '-';
    if ((key.startsWith('IN_') || key.startsWith('TP_')) && typeof val === 'number') {
       if (['TP_DEPENDENCIA', 'TP_LOCALIZACAO', 'TP_SITUACAO_FUNCIONAMENTO', 'CO_UF', 'CO_MUNICIPIO', 'TP_REDE_LOCAL'].includes(key)) return val;
       return val === 1 ? 'Sim' : 'Não';
    }
    return val;
  };

  const keys = Object.keys(raw).sort();
  const categories = {
    'Identificação': keys.filter(k => ['NO_ENTIDADE', 'CO_ENTIDADE', 'NO_MUNICIPIO', 'SG_UF', 'TP_DEPENDENCIA', 'TP_LOCALIZACAO'].includes(k)),
    'Infraestrutura': keys.filter(k => k.startsWith('IN_') && !k.startsWith('IN_EQUIP') && !k.startsWith('IN_RESERVA') && !['IN_DIURNO', 'IN_NOTURNO', 'IN_EJA'].includes(k)),
    'Equipamentos': keys.filter(k => k.startsWith('IN_EQUIP') || k.startsWith('QT_EQUIP') || k.startsWith('QT_COMP') || k.startsWith('QT_DESK') || k.startsWith('QT_TAB') || k.startsWith('IN_COMP')),
    'Métricas': keys.filter(k => k.startsWith('QT_') && !k.startsWith('QT_COMP') && !k.startsWith('QT_DESK') && !k.startsWith('QT_TAB') && !k.startsWith('QT_EQUIP')),
    'Turnos': keys.filter(k => ['IN_DIURNO', 'IN_NOTURNO', 'IN_EJA'].includes(k)),
    'Políticas': keys.filter(k => k.startsWith('IN_RESERVA')),
    'Outros': keys.filter(k => !k.startsWith('IN_') && !k.startsWith('QT_') && DICIONARIO_DADOS[k] && !['NO_ENTIDADE', 'CO_ENTIDADE', 'NO_MUNICIPIO', 'SG_UF', 'TP_DEPENDENCIA', 'TP_LOCALIZACAO'].includes(k))
  };

  let htmlSections = '';
  for (const [catName, catKeys] of Object.entries(categories)) {
    if (catKeys.length === 0) continue;
    let rows = '';
    catKeys.forEach(key => {
      const label = DICIONARIO_DADOS[key] || key;
      const value = formatValue(key, raw[key]);
      rows += `<tr><td class="label">${label} <span class="code">(${key})</span></td><td class="value">${value}</td></tr>`;
    });
    htmlSections += `<div class="section"><div class="section-title">${catName}</div><table>${rows}</table></div>`;
  }

  const content = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>Relatório - ${raw.NO_ENTIDADE}</title>
      <style>
        body { font-family: Arial, sans-serif; margin: 40px; color: #333; font-size: 11px; }
        .header { border-bottom: 3px solid #2C80FF; padding-bottom: 15px; margin-bottom: 25px; }
        .logo { font-size: 24px; font-weight: bold; color: #2C80FF; }
        .school-title { font-size: 18px; font-weight: bold; margin-top: 5px; }
        .meta { font-size: 10px; color: #666; text-align: right; }
        .section { margin-bottom: 20px; page-break-inside: avoid; }
        .section-title { background: #f0f0f0; color: #333; padding: 5px 10px; font-weight: bold; font-size: 12px; border-left: 4px solid #2C80FF; margin-bottom: 5px; text-transform: uppercase; }
        table { width: 100%; border-collapse: collapse; }
        td { border-bottom: 1px solid #eee; padding: 4px 8px; vertical-align: top; }
        tr:nth-child(even) { background-color: #f9f9f9; }
        .label { width: 60%; font-weight: bold; color: #555; }
        .code { font-size: 9px; color: #999; font-weight: normal; }
        .footer { margin-top: 40px; border-top: 1px solid #ccc; padding-top: 10px; text-align: center; color: #999; font-size: 10px; }
      </style>
    </head>
    <body>
      <div class="header">
        <div style="float:left"><div class="logo">InfoSchool</div><div class="school-title">${raw.NO_ENTIDADE}</div><div>INEP: ${raw.CO_ENTIDADE}</div></div>
        <div class="meta">RELATÓRIO TÉCNICO<br>Gerado em: ${dataHora}</div>
        <div style="clear:both"></div>
      </div>
      ${htmlSections}
      <div class="footer">Relatório gerado via InfoSchool. Fonte: INEP/MEC.</div>
      <script>
         setTimeout(() => { window.print(); }, 800);
      </script>
    </body>
    </html>
  `;

  const win = window.open('', '_blank');
  if (win) { 
    win.document.write(content); 
    win.document.close(); 
  }
};

const DashboardService = {
  getDadosEscola: async (codigo_inep: string, fullReport = false) => {
    try {
      const codigoLimpo = codigo_inep.replace(/\D/g, '');
      const url = `${API_BASE_URL}/api/escola/details?id=${codigoLimpo}${fullReport ? '&full=true' : ''}`;
      
      const response = await fetch(url);
      if (!response.ok) throw new Error('Escola não encontrada no banco de dados.');
      
      const data = await response.json();

      let hash = 0;
      for (let i = 0; i < codigoLimpo.length; i++) hash = ((hash << 5) - hash) + codigoLimpo.charCodeAt(i);
      hash = Math.abs(hash);

      const metricasReais = {
        alunos: data.QT_MAT_BAS || 0,
        professores: data.QT_DOC_BAS || 0,
        turmas: data.QT_TUR_BAS || 0,
        salas: data.QT_SALAS_UTILIZADAS || 0,
        ideb_simulado: 5.5 + (hash % 30) / 10, 
      };

      return {
        raw: data,
        escola: {
          codigo_inep: data.codigo_inep_str || data.CO_ENTIDADE,
          nome: data.NO_ENTIDADE,
          rede: data.rede_txt || 'Pública',
          localizacao: data.localizacao_txt || 'Urbana',
          endereco: data.endereco_formatado,
          telefone: data.telefone_formatado,
          email: `escola${data.CO_ENTIDADE}@edu.gov.br`,
          situacao: data.situacao_txt || 'Em atividade',
          turno: data.turnos_ui || ['Não informado'],
          municipio: data.NO_MUNICIPIO,
          estado: data.SG_UF,
        },
        metricas: metricasReais,
        infraestrutura: {
          laboratorios: data.IN_LABORATORIO_INFORMATICA === 1 || data.IN_LABORATORIO_CIENCIAS === 1,
          biblioteca: data.tem_biblioteca_ui,
          quadra: data.IN_QUADRA_ESPORTES === 1,
          computadores: (data.qtd_computadores_total || 0),
          internet: data.IN_INTERNET === 1,
          alimentacao: data.IN_ALIMENTACAO === 1,
          acessibilidade: data.tem_acessibilidade_ui,
          auditorio: data.IN_AUDITORIO === 1,
          cotas: {
            ppi: data.IN_RESERVA_PPI === 1,
            renda: data.IN_RESERVA_RENDA === 1,
            pcd: data.IN_RESERVA_PCD === 1
          }
        },
        dadosTemporais: [
          { ano: 2019, alunos: Math.floor((data.QT_MAT_BAS || 500) * 0.9), ideb: 5.0, professores: 20 },
          { ano: 2020, alunos: Math.floor((data.QT_MAT_BAS || 500) * 0.95), ideb: 5.2, professores: 22 },
          { ano: 2021, alunos: Math.floor((data.QT_MAT_BAS || 500) * 0.98), ideb: 5.3, professores: 23 },
          { ano: 2022, alunos: data.QT_MAT_BAS || 500, ideb: 5.4, professores: 24 },
          { ano: 2023, alunos: data.QT_MAT_BAS || 500, ideb: 5.5, professores: 25 }
        ]
      };
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
};

function DashboardHeader({ escola, onBack }: any) {
  return (
    <div className="bg-card border-b border-theme">
      <div className="max-w-[95%] sm:max-w-[90%] md:max-w-[80%] mx-auto px-3 sm:px-4 py-2 md:py-3">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="flex items-center gap-4">
            <button onClick={onBack} className="flex items-center gap-2 text-gray-theme hover:text-text transition-colors duration-200 text-sm sm:text-base cursor-pointer"><ArrowLeft size={18} /><span>Voltar</span></button>
            <div className="h-4 sm:h-6 w-px bg-theme"></div>
            <button onClick={() => window.location.href = '/'} className="flex items-center gap-2 text-gray-theme hover:text-text transition-colors duration-200 text-sm sm:text-base cursor-pointer"><Home size={18} /><span>Início</span></button>
          </div>
          <div className="text-right">
            <div className="text-xs sm:text-sm text-gray-theme">{escola.municipio} - {escola.estado}</div>
            <div className="text-xs text-gray-theme">INEP: {escola.codigo_inep}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

function IdentificacaoEscola({ escola }: any) {
  return (
    <div className="bg-card rounded-2xl border border-theme shadow-lg overflow-hidden relative group">
      {/* Detalhe decorativo no topo */}
      <div className="h-2 w-full bg-gradient-to-r from-blue-500 to-primary absolute top-0 left-0"></div>
      
      <div className="p-6 sm:p-8">
        <div className="flex flex-col md:flex-row gap-6 md:gap-8 items-start">
          
          {/* 1. Ícone da Escola (Estilo Logo) */}
          <div className="flex-shrink-0">
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-primary/10 flex items-center justify-center border border-primary/20 shadow-sm group-hover:scale-105 transition-transform duration-300">
              <School className="text-primary w-10 h-10 sm:w-12 sm:h-12" strokeWidth={1.5} />
            </div>
          </div>

          {/* 2. Conteúdo Principal */}
          <div className="flex-1 w-full min-w-0">
            
            {/* Cabeçalho: Nome e Código */}
            <div className="mb-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-2">
                <h1 className="text-2xl sm:text-3xl font-bold text-text leading-tight break-words">
                  {escola.nome}
                </h1>
                <div className="flex-shrink-0 px-3 py-1 bg-card-alt border border-theme rounded-full text-xs font-mono text-gray-theme">
                  INEP: {escola.codigo_inep}
                </div>
              </div>
              
              {/* Badges de Status e Turno */}
              <div className="flex flex-wrap gap-2 mt-3">
                <span className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-full text-xs font-bold border border-green-200 dark:border-green-800 flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></div>
                  {escola.situacao}
                </span>
                {(escola.turno || []).map((turno: string, index: number) => (
                  <span key={index} className="px-3 py-1 rounded-full text-xs font-medium bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-300 border border-blue-100 dark:border-blue-800/50">
                    {turno}
                  </span>
                ))}
              </div>
            </div>

            {/* Separador */}
            <div className="h-px w-full bg-theme mb-6"></div>

            {/* Grid de Informações Detalhadas */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-6">
              
              {/* Coluna 1: Administrativo */}
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="p-1.5 bg-card-alt rounded-lg text-primary border border-theme mt-0.5"><Building size={16} /></div>
                  <div>
                    <p className="text-xs font-medium text-gray-theme uppercase tracking-wider mb-0.5">Rede de Ensino</p>
                    <p className="text-sm font-semibold text-text">{escola.rede}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="p-1.5 bg-card-alt rounded-lg text-primary border border-theme mt-0.5"><MapPin size={16} /></div>
                  <div>
                    <p className="text-xs font-medium text-gray-theme uppercase tracking-wider mb-0.5">Localização</p>
                    <p className="text-sm font-semibold text-text capitalize">{escola.localizacao}</p>
                  </div>
                </div>
              </div>

              {/* Coluna 2: Endereço */}
              <div className="sm:col-span-2 lg:col-span-2 space-y-4">
                 <div className="flex items-start gap-3">
                  <div className="p-1.5 bg-card-alt rounded-lg text-primary border border-theme mt-0.5"><MapPin size={16} /></div>
                  <div>
                    <p className="text-xs font-medium text-gray-theme uppercase tracking-wider mb-0.5">Endereço Completo</p>
                    <p className="text-sm font-medium text-text leading-relaxed">{escola.endereco}</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="p-1.5 bg-card-alt rounded-lg text-primary border border-theme mt-0.5"><Phone size={16} /></div>
                  <div>
                    <p className="text-xs font-medium text-gray-theme uppercase tracking-wider mb-0.5">Telefone de Contato</p>
                    <p className="text-sm font-semibold text-text tracking-wide">{escola.telefone}</p>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function MetricasEscola({ metricas }: { metricas: any }) {
  const cards = [
    { icon: Users, label: 'Alunos', value: metricas.alunos, color: 'text-blue-500' },
    { icon: UserCheck, label: 'Professores', value: metricas.professores, color: 'text-green-500' },
    { icon: BookOpen, label: 'Turmas', value: metricas.turmas, color: 'text-purple-500' },
    { icon: Building, label: 'Salas', value: metricas.salas, color: 'text-indigo-500' },
  ];

  return (
    <div className="bg-card rounded-2xl p-4 sm:p-6 border border-white/10 shadow-[0_0_20px_-5px_rgba(0,0,0,0.35)] backdrop-blur-sm transition-all duration-300 hover:shadow-[0_0_35px_-5px_rgba(0,0,0,0.55)] hover:bg-card/80">
      <h2 className="text-lg font-semibold text-text mb-4">Métricas da Escola</h2>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        {cards.map(({ icon: Icon, label, value, color }, index) => (
          <div key={index} className={`text-center p-3 sm:p-4 rounded-lg border transition-all duration-300 hover:scale-[1.05] hover:shadow-lg bg-card-alt border-theme hover:bg-card`}>
            <Icon className={`mx-auto mb-1 sm:mb-2 ${color} w-5 h-5 sm:w-6 sm:h-6`} />
            <div className={`text-lg sm:text-xl lg:text-2xl font-bold text-text`}>{typeof value === 'number' ? value.toLocaleString('pt-BR') : value}</div>
            <div className={`text-xs sm:text-sm mt-1 text-gray-theme`}>{label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function InfraestruturaEscola({ infraestrutura }: { infraestrutura: any }) {
  const itens = [
    { icon: Laptop, label: "Laboratórios", disponivel: infraestrutura.laboratorios },
    { icon: BookOpen, label: "Biblioteca", disponivel: infraestrutura.biblioteca },
    { icon: Building, label: "Quadra", disponivel: infraestrutura.quadra },
    { icon: Wifi, label: "Internet", disponivel: infraestrutura.internet },
    { icon: Utensils, label: "Alimentação", disponivel: infraestrutura.alimentacao }
  ];

  const possuiCotas = infraestrutura.cotas.ppi || infraestrutura.cotas.renda || infraestrutura.cotas.pcd;

  return (
    <div className="bg-card rounded-2xl p-4 sm:p-6 border border-white/10 shadow-[0_0_20px_-5px_rgba(0,0,0,0.35)] backdrop-blur-sm transition-all duration-300 hover:shadow-[0_0_35px_-5px_rgba(0,0,0,0.55)] hover:bg-card/80">
      <h2 className="text-lg font-semibold text-text mb-4">Infraestrutura</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
        {itens.map(({ icon: Icon, label, disponivel }, index) => (
          <div key={index} className="text-center p-3 sm:p-4 bg-card-alt rounded-lg border border-theme transition-all duration-300 hover:bg-card hover:shadow-md">
            <Icon className={`mx-auto mb-1 sm:mb-2 ${disponivel ? "text-green-500" : "text-red-400"} w-5 h-5 sm:w-6 sm:h-6`} />
            <div className={`text-xs sm:text-sm font-medium ${disponivel ? "text-text" : "text-gray-theme"}`}>{label}</div>
            
            <div className={`text-xs ${disponivel ? "text-green-500" : "text-red-400"}`}>
              {label === "Alimentação" 
                ? (disponivel ? "Gratuita" : "Paga / Não possui") 
                : (disponivel ? "Disponível" : "Indisponível")
              }
            </div>
          </div>
        ))}
      </div>
      <div className="mt-4 p-3 sm:p-4 bg-card-alt rounded-lg border border-theme transition-all duration-300 hover:bg-card hover:shadow-md">
        <div className="flex flex-col xs:flex-row xs:items-center xs:justify-between gap-2">
          <div className="flex items-center gap-2"><Laptop className="text-blue-500 w-5 h-5" /><span className="text-sm font-medium text-text">Computadores para alunos</span></div>
          <span className="text-lg font-bold text-text">{infraestrutura.computadores.toLocaleString("pt-BR")}</span>
        </div>
      </div>
      <div className="mt-4 p-4 bg-card-alt rounded-lg border border-theme shadow-sm hover:bg-black/5 dark:hover:bg-white/5 transition-all">
        <div className="flex items-center gap-2 mb-3"><Target className="text-purple-500 w-5 h-5" /><h3 className="text-md font-semibold text-text">Sistema de Cotas</h3></div>
        <div className="flex flex-wrap gap-2">
          {infraestrutura.cotas.ppi && <span className="px-3 py-1 rounded-full text-xs font-medium bg-purple-500/10 text-purple-400 border border-purple-500/20">PPI</span>}
          {infraestrutura.cotas.renda && <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-500/10 text-blue-400 border border-blue-500/20">Renda</span>}
          {infraestrutura.cotas.pcd && <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-500/10 text-green-400 border border-green-500/20">PCD</span>}
          
          {!possuiCotas && (
            <span className="text-sm text-gray-500 italic flex items-center gap-1">
              Não possui sistema de cotas
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

function AnaliseTemporal({ dadosTemporais }: { dadosTemporais: any[] }) {
  const [anoSelecionado, setAnoSelecionado] = useState(2023);
  const anos = dadosTemporais.map((d) => d.ano);
  const dadosAnoAtual = dadosTemporais.find((d) => d.ano === anoSelecionado);

  const evolucaoAlunos = dadosAnoAtual ? (((dadosAnoAtual.alunos - dadosTemporais[0].alunos) / dadosTemporais[0].alunos) * 100).toFixed(1) : 0;
  const evolucaoIDEB = dadosAnoAtual ? (dadosAnoAtual.ideb - dadosTemporais[0].ideb).toFixed(1) : 0;
  const evolucaoProfessores = dadosAnoAtual ? (((dadosAnoAtual.professores - dadosTemporais[0].professores) / dadosTemporais[0].professores) * 100).toFixed(1) : 0;

  return (
    <div id="analise-temporal" className="bg-purple-50 rounded-xl p-4 sm:p-6 border border-purple-200 shadow-md transition-all">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 sm:mb-6 gap-3">
        <div className="flex items-center gap-3"><TrendingUp className="text-purple-600 w-5 h-5 sm:w-6 sm:h-6" /><div><h2 className="text-lg font-semibold text-purple-900">Análise Temporal (Simulado)</h2><p className="text-sm text-purple-600">Evolução dos Indicadores 2019-2023</p></div></div>
        <select value={anoSelecionado} onChange={(e) => setAnoSelecionado(Number(e.target.value))} className="bg-white border border-purple-300 text-purple-800 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 transition-colors w-full sm:w-auto">
          {anos.map((ano) => <option key={ano} value={ano}>{ano}</option>)}
        </select>
      </div>
      <div className="bg-white rounded-lg p-4 border border-purple-100 shadow-inner mb-6">
        <span className="text-sm font-medium text-purple-800">Evolução do IDEB (Simulado)</span>
        <div className="w-full h-64 mt-4">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={dadosTemporais}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.2} stroke="#a855f7" />
              <XAxis dataKey="ano" stroke="#a855f7" />
              <YAxis stroke="#a855f7" domain={[0, 10]} />
              <Tooltip wrapperStyle={{ background: "#fff", border: "1px solid #a855f7", borderRadius: "8px", color: "#6b21a8" }} />
              <Line type="monotone" dataKey="ideb" stroke="#9333ea" strokeWidth={3} dot={{ r: 5, fill: "#9333ea" }} activeDot={{ r: 7 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Adicionado hover:scale-105 e hover:shadow-lg nos cards abaixo */}
        <div className="bg-white rounded-xl p-4 border border-purple-200 shadow-sm transition-all duration-300 hover:scale-105 hover:shadow-lg cursor-default">
          <div className="flex items-center justify-between mb-2"><div className="flex items-center gap-2"><Users className="text-purple-500 w-5 h-5" /><span className="font-semibold text-purple-900">Alunos (Hist.)</span></div><span className="text-sm font-medium text-purple-600">{Number(evolucaoAlunos) > 0 ? "+" : ""}{evolucaoAlunos}%</span></div>
          <div className="text-2xl font-bold text-purple-800 mb-1">{dadosAnoAtual?.alunos.toLocaleString("pt-BR")}</div>
          <div className="text-xs text-purple-600">vs 2019: {dadosTemporais[0]?.alunos.toLocaleString("pt-BR")}</div>
        </div>
        <div className="bg-white rounded-xl p-4 border border-purple-200 shadow-sm transition-all duration-300 hover:scale-105 hover:shadow-lg cursor-default">
          <div className="flex items-center justify-between mb-2"><div className="flex items-center gap-2"><TrendingUp className="text-purple-500 w-5 h-5" /><span className="font-semibold text-purple-900">IDEB</span></div><span className="text-sm font-medium text-purple-600">{Number(evolucaoIDEB) > 0 ? "+" : ""}{evolucaoIDEB} pts</span></div>
          <div className="text-2xl font-bold text-purple-800 mb-1">{dadosAnoAtual?.ideb.toFixed(1)}</div>
          <div className="text-xs text-purple-600">vs 2019: {dadosTemporais[0]?.ideb.toFixed(1)}</div>
        </div>
        <div className="bg-white rounded-xl p-4 border border-purple-200 shadow-sm transition-all duration-300 hover:scale-105 hover:shadow-lg cursor-default">
          <div className="flex items-center justify-between mb-2"><div className="flex items-center gap-2"><UserCheck className="text-purple-500 w-5 h-5" /><span className="font-semibold text-purple-900">Professores</span></div><span className="text-sm font-medium text-purple-600">{Number(evolucaoProfessores) > 0 ? "+" : ""}{evolucaoProfessores}%</span></div>
          <div className="text-2xl font-bold text-purple-800 mb-1">{dadosAnoAtual?.professores.toLocaleString("pt-BR")}</div>
          <div className="text-xs text-purple-600">vs 2019: {dadosTemporais[0]?.professores.toLocaleString("pt-BR")}</div>
        </div>
      </div>
    </div>
  );
}

function ConfirmationModal({ isOpen, onClose, onConfirm, isLoading }: any) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-card rounded-2xl shadow-2xl max-w-md w-full p-6 border border-theme transform scale-100 animate-in zoom-in-95 duration-200">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-blue-500/10 rounded-full flex-shrink-0">
            <FileText className="w-6 h-6 text-blue-500" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-bold text-text">
              Exportar Relatório PDF
            </h3>
            <p className="mt-2 text-sm text-gray-theme">
              O relatório completo desta escola será gerado e baixado automaticamente.
            </p>
            <div className="mt-3 text-xs text-gray-theme bg-card-alt p-2 rounded border border-theme">
              Inclui: Infraestrutura, Docentes, Matrículas e Histórico.
            </div>
          </div>
          <button onClick={onClose} disabled={isLoading} className="text-gray-theme hover:text-text transition-colors">
            <X size={20} />
          </button>
        </div>
        
        <div className="mt-6 flex justify-end gap-3">
          <button 
            onClick={onClose}
            disabled={isLoading}
            className="px-4 py-2 text-sm font-medium text-text bg-transparent border border-theme rounded-lg hover:bg-black/5 dark:hover:bg-white/5 transition-colors focus:outline-none disabled:opacity-50"
          >
            Cancelar
          </button>
          <button 
            onClick={onConfirm}
            disabled={isLoading}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 shadow-md focus:outline-none disabled:opacity-70 disabled:cursor-not-allowed transition-all"
          >
            {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
            {isLoading ? "Gerando..." : "Confirmar Download"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function DashboardEscola() {
  const params = useParams();
  const codigo_inep = (params.id as string) || (params.codigo_inep as string);
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [dados, setDados] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [gerandoPDF, setGerandoPDF] = useState(false);
  
  const [showConfirmation, setShowConfirmation] = useState(false);

  useEffect(() => {
    async function carregarDadosIniciais() {
      try {
        setLoading(true);
        setError(null);
        if (!codigo_inep) throw new Error("Código INEP inválido");
        
        const dadosEscola = await DashboardService.getDadosEscola(codigo_inep, false);
        setDados(dadosEscola);
      } catch (err: any) { setError(err.message); } 
      finally { setLoading(false); }
    }
    if (codigo_inep) carregarDadosIniciais();
  }, [codigo_inep]);

  const handleExportClick = () => {
    setShowConfirmation(true);
  };

  const handleConfirmExport = async () => {
    if (!dados) return;
    setGerandoPDF(true);
    try {
      const dadosCompletos = await DashboardService.getDadosEscola(codigo_inep, true);
      generatePDF(dadosCompletos);
      setShowConfirmation(false);
    } catch (e) {
      alert("Erro ao gerar PDF.");
    } finally {
      setGerandoPDF(false);
      setShowConfirmation(false);
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center"><Loader2 className="animate-spin" /> Carregando...</div>;
  if (error) return <div className="min-h-screen flex items-center justify-center text-red-500">Erro: {error}</div>;

  return (
    <main className="min-h-screen bg-background text-text overflow-x-hidden relative">
      <DashboardHeader escola={dados.escola} onBack={() => router.back()} />
      <div className="max-w-[95%] sm:max-w-[90%] md:max-w-[80%] mx-auto px-3 sm:px-4 py-6 sm:py-8">
        <div className="mb-6 sm:mb-8"><IdentificacaoEscola escola={dados.escola} /></div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
          <div className="lg:col-span-2 space-y-6 sm:space-y-8">
            <MetricasEscola metricas={dados.metricas} />
            <InfraestruturaEscola infraestrutura={dados.infraestrutura} />
            <AnaliseTemporal dadosTemporais={dados.dadosTemporais} />
          </div>
          <div className="space-y-6 sm:space-y-8">
            <div className="bg-card p-6 rounded-xl border border-white/10 shadow-lg">
              <h3 className="font-bold text-lg mb-4 flex items-center gap-2"><TrendingUp size={20} className="text-primary"/> Ações Rápidas</h3>
              <div className="space-y-3">
                {/* Adicionado hover:scale-[1.03] e hover:shadow-lg nos botões abaixo */}
                <button onClick={handleExportClick} disabled={gerandoPDF} className="w-full flex items-center gap-3 sm:gap-4 p-3 sm:p-4 cursor-pointer bg-card-alt rounded-xl border border-theme transition-all duration-300 hover:scale-[1.03] hover:bg-black/10 dark:hover:bg-white/10 hover:shadow-lg group disabled:opacity-50">
                  <div className="p-2 bg-green-100 rounded-lg group-hover:scale-110 transition-transform duration-200 flex-shrink-0">
                    <Download className="text-green-500 w-5 h-5 sm:w-6 sm:h-6" />
                  </div>
                  <div className="flex-1 text-left min-w-0">
                    <div className="font-semibold text-text text-sm sm:text-base group-hover:text-green-500 transition-colors">Exportar relatório</div>
                    <div className="text-gray-theme mt-1 text-xs sm:text-sm">PDF completo com todos os dados</div>
                  </div>
                  <div className="text-green-500 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex-shrink-0">📄</div>
                </button>

                <button onClick={() => document.getElementById("analise-temporal")?.scrollIntoView({ behavior: "smooth" })} className="w-full flex items-center gap-3 sm:gap-4 p-3 sm:p-4 cursor-pointer bg-card-alt rounded-xl border border-theme transition-all duration-300 hover:scale-[1.03] hover:bg-black/10 dark:hover:bg-white/10 hover:shadow-lg group">
                  <div className="p-2 bg-purple-100 rounded-lg group-hover:scale-110 transition-transform duration-200 flex-shrink-0"><Calendar className="text-purple-500 w-5 h-5 sm:w-6 sm:h-6" /></div>
                  <div className="flex-1 text-left min-w-0"><div className="font-semibold text-text text-sm sm:text-base group-hover:text-purple-500 transition-colors">Histórico completo</div><div className="text-gray-theme mt-1 text-xs sm:text-sm">Análise temporal desde 2018</div></div>
                  <div className="text-purple-500 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex-shrink-0">📊</div>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <ConfirmationModal 
        isOpen={showConfirmation}
        onClose={() => !gerandoPDF && setShowConfirmation(false)}
        onConfirm={handleConfirmExport}
        isLoading={gerandoPDF}
      />
    </main>
  );
}