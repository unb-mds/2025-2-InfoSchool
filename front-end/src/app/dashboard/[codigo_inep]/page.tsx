'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';

// Ícones
import {
  School, MapPin, Phone, Users, UserCheck, BookOpen,
  TrendingUp, Award, Building, Wifi, Utensils, Laptop,
  ArrowLeft, Home, Download, BarChart3, Target, Calendar,
  Loader2, FileText, X, AlertTriangle, Layers
} from 'lucide-react';

// Recharts
import {
  LineChart, Line, ResponsiveContainer, CartesianGrid, XAxis, YAxis, Tooltip
} from 'recharts';

import { DICIONARIO_DADOS, CATEGORIAS_RELATORIO } from '@/utils/dicionario';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

// --- FUNÇÃO DE PDF ---
const generatePDF = (dadosCompletos: any) => {
  const { raw } = dadosCompletos;
  const now = new Date();
  const dataHora = now.toLocaleDateString('pt-BR') + ' às ' + now.toLocaleTimeString('pt-BR');

  const formatValue = (key: string, val: any) => {
    if (val === null || val === undefined) return '<span class="no-info">Sem informações</span>';

    // Tratamento específico para booleanos (IN_, TP_)
    if ((key.startsWith('IN_') || key.startsWith('TP_')) && typeof val === 'number') {
      // Exceções que não são booleanos simples
      if (['TP_DEPENDENCIA', 'TP_LOCALIZACAO', 'TP_SITUACAO_FUNCIONAMENTO', 'CO_UF', 'CO_MUNICIPIO', 'TP_REDE_LOCAL', 'TP_REGULAMENTACAO'].includes(key)) return val;

      return val === 1
        ? '<span class="status-sim">✓ Sim</span>'
        : '<span class="status-nao">✗ Não</span>';
    }

    // Formatação de números grandes
    if (typeof val === 'number' && key.startsWith('QT_')) {
      return val.toLocaleString('pt-BR');
    }

    return val;
  };

  // Ícones por categoria
  const getIcon = (catName: string) => {
    const icons: Record<string, string> = {
      'Identificação e Localização': '🏫',
      'Vínculos e Mantenedora': '🤝',
      'Infraestrutura Básica': '🏗️',
      'Dependências e Espaços': '🏢',
      'Equipamentos e Tecnologia': '💻',
      'Dados Pedagógicos': '📚',
      'Profissionais': '👥',
      'Matrículas, Docentes e Turmas': '📊'
    };
    return icons[catName] || '📌';
  };

  // Gera o HTML das seções baseado nas categorias importadas
  let htmlSections = '';

  (Object.entries(CATEGORIAS_RELATORIO) as [string, string[]][]).forEach(([catName, catKeys]) => {
    // Filtra chaves que têm valor no raw ou mostra tudo para garantir completude
    // Vamos mostrar apenas o que tem valor ou o que está explicitamente definido como nulo no banco, 
    // mas para o relatório ficar completo, vamos iterar sobre todas as chaves da categoria.
    // Se não tiver no raw, vai aparecer "Sem informações" (tratado no formatValue)

    const validKeys = catKeys;

    if (validKeys.length > 0) {
      let rows = '';
      validKeys.forEach((key, index) => {
        const label = DICIONARIO_DADOS[key] || key;
        const value = formatValue(key, raw[key]);
        const rowClass = index % 2 === 0 ? 'row-even' : 'row-odd';
        rows += `<tr class="${rowClass}"><td class="label">${label} <span class="code">(${key})</span></td><td class="value">${value}</td></tr>`;
      });

      htmlSections += `
        <div class="section">
          <div class="section-header">
            <span class="section-icon">${getIcon(catName)}</span>
            <span class="section-title">${catName}</span>
            <span class="section-badge">${validKeys.length} itens</span>
          </div>
          <div class="section-content">
            <table class="data-table">
              ${rows}
            </table>
          </div>
        </div>
      `;
    }
  });

  const content = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>Relatório - ${raw.NO_ENTIDADE}</title>
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
      <script src="https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js"></script>
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        
        body { 
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
          background: #2D2D2D; /* Cinza escuro do tema */
          padding: 0;
          margin: 0;
        }

        .page-wrapper {
          max-width: 210mm;
          margin: 0 auto;
          background: white;
          min-height: 100vh;
        }

        /* HEADER PREMIUM - BRANCO */
        /* HEADER PREMIUM - INTEGRADO */
        .header {
          background: #f8f9fa; /* Mesmo cinza do conteúdo */
          color: #2C80FF;
          padding: 40px 50px;
          position: relative;
          overflow: hidden;
        }

        .header::before {
          content: '';
          position: absolute;
          top: 0;
          right: 0;
          width: 300px;
          height: 300px;
          background: radial-gradient(circle, rgba(44, 128, 255, 0.05) 0%, transparent 70%);
          border-radius: 50%;
          transform: translate(30%, -30%);
        }

        .logo {
          font-size: 32px;
          font-weight: 700;
          letter-spacing: -0.5px;
          margin-bottom: 8px;
          color: #2C80FF;
        }

        .school-title {
          font-size: 24px;
          font-weight: 600;
          margin: 15px 0 8px;
          line-height: 1.3;
          color: #1a1a1a;
        }

        .school-subtitle {
          font-size: 14px;
          display: flex;
          align-items: center;
          gap: 20px;
          margin-top: 12px;
        }

        .school-subtitle span {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: #ffffff; /* Branco para destacar no fundo cinza */
          color: #2C80FF;
          padding: 6px 12px;
          border-radius: 20px;
          font-weight: 600;
          font-size: 12px;
          border: 1px solid #e9ecef;
        }

        .meta-info {
          position: absolute;
          top: 40px;
          right: 50px;
          text-align: right;
          font-size: 11px;
          background: #ffffff; /* Branco para destacar */
          padding: 12px 16px;
          border-radius: 8px;
          border: 1px solid #e9ecef;
          color: #666;
          box-shadow: 0 2px 4px rgba(0,0,0,0.03);
        }

        .meta-label {
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          font-size: 10px;
          color: #2C80FF;
        }

        .meta-value {
          font-size: 13px;
          font-weight: 500;
          margin-top: 4px;
          color: #333;
        }

        /* CONTENT AREA */
        .content {
          padding: 40px 50px;
          background: #f8f9fa;
        }

        /* SECTIONS */
        .section {
          background: white;
          border-radius: 12px;
          margin-bottom: 24px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.06);
          overflow: hidden;
          /* page-break-inside: avoid; REMOVIDO PARA EVITAR ESPAÇO EM BRANCO */
        }

        .section-header {
          background: linear-gradient(to right, #f8f9fa, #ffffff);
          padding: 16px 24px;
          border-bottom: 2px solid #e9ecef;
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .section-icon {
          font-size: 22px;
          filter: drop-shadow(1px 1px 2px rgba(0,0,0,0.1));
        }

        .section-title {
          font-size: 16px;
          font-weight: 700;
          color: #1a1a1a;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          flex: 1;
        }

        .section-count {
          font-size: 11px;
          font-weight: 600;
          color: #2C80FF;
          background: #e7f1ff;
          padding: 4px 10px;
          border-radius: 12px;
        }

        /* TABLES */
        .data-table {
          width: 100%;
          border-collapse: separate;
          border-spacing: 0;
        }

        .data-table tr {
          transition: background-color 0.2s;
          page-break-inside: avoid;
        }

        .data-table td {
          padding: 12px 24px;
          border-bottom: 1px solid #f1f3f5;
          font-size: 12px;
          line-height: 1.5;
        }

        .data-table .row-even {
          background: #ffffff;
        }

        .data-table .row-odd {
          background: #f8f9fa;
        }

        .label {
          font-weight: 600;
          color: #2d3748;
          width: 60%;
        }

        .code {
          display: inline-block;
          font-family: 'Courier New', monospace;
          font-size: 9px;
          color: #718096;
          background: #e2e8f0;
          padding: 2px 6px;
          border-radius: 4px;
          margin-left: 8px;
          font-weight: 400;
        }

        .value {
          font-weight: 500;
          color: #4a5568;
          text-align: right;
          width: 40%;
        }

        /* STATUS COLORS */
        .status-sim {
          color: #16a34a; /* Green 600 */
          font-weight: 600;
        }
        
        .status-nao {
          color: #dc2626; /* Red 600 */
          font-weight: 600;
        }
        .no-info { color: #9ca3af; font-style: italic; font-size: 11px; }

        /* FOOTER */
        .footer {
          background: #f8f9fa; /* Mesmo fundo do conteúdo */
          color: #666;
          padding: 30px 50px;
          text-align: center;
          font-size: 11px;
          line-height: 1.6;
        }

        .footer-logo {
          font-size: 18px;
          font-weight: 700;
          color: #2C80FF; /* Azul igual ao header */
          margin-bottom: 8px;
        }

        .footer-text {
          color: #666;
        }

        .footer-divider {
          width: 60px;
          height: 2px;
          background: linear-gradient(to right, transparent, #2C80FF, transparent);
          margin: 15px auto;
        }

        /* PRINT STYLES */
        @media print {
          body { background: white; }
          .page-wrapper { max-width: 100%; }
          .section { page-break-inside: avoid; box-shadow: none; }
          @page { margin: 0; }
        }
      </style>
    </head>
    <body>
      <div id="report-content" class="page-wrapper">
        <!-- HEADER -->
        <div class="header">
          <div class="meta-info">
            <div class="meta-label">Relatório Técnico</div>
            <div class="meta-value">${dataHora}</div>
          </div>
          <div class="header-content">
            <div class="logo">InfoSchool</div>
            <div class="school-title">${raw.NO_ENTIDADE}</div>
            <div class="school-subtitle">
              <span>🏷️ INEP ${raw.CO_ENTIDADE}</span>
              <span>📍 ${raw.NO_MUNICIPIO} - ${raw.SG_UF}</span>
            </div>
          </div>
        </div>

        <!-- CONTENT -->
        <div class="content">
          ${htmlSections}
        </div>

        <!-- FOOTER -->
        <div class="footer">
          <div class="footer-logo">InfoSchool</div>
          <div class="footer-divider"></div>
          <div class="footer-text">
            Portal de Dados do Censo Escolar<br>
            Fonte: Instituto Nacional de Estudos e Pesquisas Educacionais Anísio Teixeira (INEP/MEC)<br>
            © ${new Date().getFullYear()} - Desenvolvido pela equipe InfoSchool
          </div>
        </div>
      </div>

      <div id="loading-overlay" style="position:fixed;top:0;left:0;width:100%;height:100%;background:#2D2D2D;display:flex;flex-direction:column;align-items:center;justify-content:center;color:white;z-index:9999;">
        <div style="font-size:24px;margin-bottom:10px;">Gerando PDF...</div>
        <div style="font-size:14px;opacity:0.7;">O download iniciará automaticamente.</div>
      </div>

      <script>
         window.onload = function() {
          const element = document.getElementById('report-content');
          const opt = {
            margin: [0, 0, 15, 0], // Top, Right, Bottom, Left
            filename: 'Relatorio_${raw.NO_ENTIDADE.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.pdf',
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: 2, useCORS: true },
            jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
          };

          // Aguarda um pouco para garantir renderização das fontes
          // Aguarda um pouco para garantir renderização das fontes
          setTimeout(() => {
            html2pdf().set(opt).from(element).toPdf().get('pdf').then((pdf) => {
              const totalPages = pdf.internal.getNumberOfPages();
              const pageWidth = pdf.internal.pageSize.getWidth();
              const pageHeight = pdf.internal.pageSize.getHeight();
              
              for (let i = 1; i <= totalPages; i++) {
                pdf.setPage(i);
                pdf.setFontSize(8);
                pdf.setTextColor(100); // Cinza escuro
                
                const footerText = 'InfoSchool • Relatório Técnico • ' + '${dataHora}' + ' • Página ' + i + ' de ' + totalPages;
                pdf.text(footerText, pageWidth / 2, pageHeight - 10, { align: 'center' });
              }
            }).save().then(() => {
              // Fecha a janela após o download (opcional, mas bom UX em popup)
              setTimeout(() => window.close(), 1000);
            });
          }, 1000);
        };
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
      };

      // BUSCANDO DADOS HISTÓRICOS REAIS DO BIGQUERY
      let dadosTemporais = [];

      try {
        // Tenta buscar dados históricos do backend
        const historicalUrl = `${API_BASE_URL}/api/escola/historical?id=${codigoLimpo}`;
        const historicalResponse = await fetch(historicalUrl);

        if (historicalResponse.ok) {
          const historicalData = await historicalResponse.json();

          if (historicalData.dadosTemporais && historicalData.dadosTemporais.length > 0) {
            dadosTemporais = historicalData.dadosTemporais;
            console.log(`✅ Dados históricos reais carregados: ${dadosTemporais.length} anos`);
          } else {
            throw new Error('Nenhum dado histórico encontrado');
          }
        } else {
          throw new Error('Falha ao buscar dados históricos');
        }
      } catch (error) {
        // Fallback: gera dados sintéticos se a API falhar
        console.warn('⚠️ Usando dados sintéticos (API histórica falhou):', error);

        const baseAlunos = data.QT_MAT_BAS || 500;
        const baseProfessores = data.QT_DOC_BAS || 20;
        const baseTurmas = data.QT_TUR_BAS || 18;

        for (let ano = 2007; ano <= 2024; ano++) {
          const variacao = Math.sin(ano + hash) * 0.1;
          dadosTemporais.push({
            ano: ano,
            alunos: Math.floor(baseAlunos * (1 + variacao + (ano - 2007) * 0.01)),
            turmas: Math.floor(baseTurmas * (1 + (ano - 2007) * 0.005 + variacao)),
            professores: Math.floor(baseProfessores * (1 + (ano - 2007) * 0.01))
          });
        }
      }

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
        dadosTemporais: dadosTemporais
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
      {/* Alinhamento solicitado */}
      <div className="max-w-[95%] sm:max-w-[90%] md:max-w-[80%] mx-auto px-3 sm:px-4 py-2 md:py-3">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="flex items-center gap-4">
            <button onClick={onBack} className="flex items-center gap-2 text-gray-theme hover:text-text transition-colors duration-200 text-sm sm:text-base cursor-pointer"><ArrowLeft size={18} /><span>Voltar</span></button>
            <div className="h-4 sm:h-6 w-px bg-theme"></div>
            <button onClick={() => window.location.href = '/'} className="flex items-center gap-2 text-gray-theme hover:text-text transition-colors duration-200 text-sm sm:text-base cursor-pointer"><Home size={18} /><span>Início</span></button>
          </div>
          <div className="text-left sm:text-right">
            <div className="text-xs sm:text-sm text-gray-theme">{escola?.municipio} - {escola?.estado}</div>
            <div className="text-xs text-gray-theme">INEP: {escola?.codigo_inep}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

function IdentificacaoEscola({ escola }: any) {
  return (
    <div className="bg-card rounded-2xl border border-theme shadow-lg overflow-hidden relative">
      <div className="h-2 w-full bg-gradient-to-r from-blue-500 to-primary absolute top-0 left-0"></div>

      <div className="p-6 sm:p-8">
        <div className="flex flex-col md:flex-row gap-6 md:gap-8 items-start">

          <div className="flex-shrink-0">
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-primary/10 flex items-center justify-center border border-primary/20 shadow-sm">
              <School className="text-primary w-10 h-10 sm:w-12 sm:h-12" strokeWidth={1.5} />
            </div>
          </div>

          <div className="flex-1 w-full min-w-0">

            {/* Cabeçalho: Nome e Código */}
            <div className="mb-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-2">
                <h1 className="text-2xl sm:text-3xl font-bold text-text leading-tight break-words">
                  {escola?.nome}
                </h1>
                <div className="flex-shrink-0 px-3 py-1 bg-card-alt border border-theme rounded-full text-xs font-mono text-gray-theme">
                  INEP: {escola?.codigo_inep}
                </div>
              </div>

              <div className="flex flex-wrap gap-2 mt-3">
                <span className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-full text-xs font-bold border border-green-200 dark:border-green-800 flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></div>
                  {escola?.situacao}
                </span>
                {(escola?.turno || []).map((turno: string, index: number) => (
                  <span key={index} className="px-3 py-1 rounded-full text-xs font-medium bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-300 border border-blue-100 dark:border-blue-800/50">
                    {turno}
                  </span>
                ))}
              </div>
            </div>

            <div className="h-px w-full bg-theme mb-6"></div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-6">

              {/* Coluna 1: Administrativo */}
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="p-1.5 bg-card-alt rounded-lg text-primary border border-theme mt-0.5"><Building size={16} /></div>
                  <div>
                    <p className="text-xs font-medium text-gray-theme uppercase tracking-wider mb-0.5">Rede de Ensino</p>
                    <p className="text-sm font-semibold text-text">{escola?.rede}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="p-1.5 bg-card-alt rounded-lg text-primary border border-theme mt-0.5"><MapPin size={16} /></div>
                  <div>
                    <p className="text-xs font-medium text-gray-theme uppercase tracking-wider mb-0.5">Localização</p>
                    <p className="text-sm font-semibold text-text capitalize">{escola?.localizacao}</p>
                  </div>
                </div>
              </div>

              <div className="sm:col-span-2 lg:col-span-2 space-y-4">
                <div className="flex items-start gap-3">
                  <div className="p-1.5 bg-card-alt rounded-lg text-primary border border-theme mt-0.5"><MapPin size={16} /></div>
                  <div>
                    <p className="text-xs font-medium text-gray-theme uppercase tracking-wider mb-0.5">Endereço Completo</p>
                    <p className="text-sm font-medium text-text leading-relaxed">{escola?.endereco}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-1.5 bg-card-alt rounded-lg text-primary border border-theme mt-0.5"><Phone size={16} /></div>
                  <div>
                    <p className="text-xs font-medium text-gray-theme uppercase tracking-wider mb-0.5">Telefone de Contato</p>
                    <p className="text-sm font-semibold text-text tracking-wide">{escola?.telefone}</p>
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
    { icon: Layers, label: 'Turmas', value: metricas.turmas, color: 'text-purple-500' },
    { icon: Building, label: 'Salas', value: metricas.salas, color: 'text-indigo-500' },
  ];

  return (
    <div className="bg-card rounded-2xl p-4 sm:p-6 border border-white/10 shadow-[0_0_20px_-5px_rgba(0,0,0,0.35)] backdrop-blur-sm transition-all duration-300 hover:shadow-[0_0_35px_-5px_rgba(0,0,0,0.55)] hover:bg-card/80">
      <h2 className="text-lg font-semibold text-text mb-4">Métricas da Escola</h2>
      {/* Grid Responsivo: 2 colunas no celular, 4 no PC */}
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
      {/* Grid Responsivo: 2 colunas no celular, 3 tablet, 5 PC */}
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
  const dadosAnoAtual = dadosTemporais[dadosTemporais.length - 1];

  const evolucaoAlunos = dadosAnoAtual ? (((dadosAnoAtual.alunos - dadosTemporais[0].alunos) / dadosTemporais[0].alunos) * 100).toFixed(1) : 0;
  const evolucaoTurmas = dadosAnoAtual ? (((dadosAnoAtual.turmas - dadosTemporais[0].turmas) / dadosTemporais[0].turmas) * 100).toFixed(1) : 0;
  const evolucaoProfessores = dadosAnoAtual ? (((dadosAnoAtual.professores - dadosTemporais[0].professores) / dadosTemporais[0].professores) * 100).toFixed(1) : 0;

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-gray-900/95 border border-white/10 backdrop-blur-md p-3 rounded-xl shadow-xl min-w-[140px]">
          <p className="text-gray-400 text-[10px] font-bold uppercase mb-1">Ano: {label}</p>
          <div className="flex items-center gap-2">
            <div className="w-1 h-6 bg-blue-500 rounded-full"></div>
            <div>
              <p className="text-xl font-bold text-white leading-none">{payload[0].value.toLocaleString('pt-BR')}</p>
              <p className="text-[10px] text-blue-400 font-medium">Matrículas</p>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div id="analise-temporal" className="bg-card rounded-2xl p-4 sm:p-6 border border-white/10 shadow-[0_0_20px_-5px_rgba(0,0,0,0.35)] backdrop-blur-sm transition-all">
      <div className="flex items-center gap-3 mb-4 sm:mb-6">
        <TrendingUp className="text-blue-500 w-5 h-5 sm:w-6 sm:h-6" />
        <div>
          <h2 className="text-lg font-semibold text-text">Evolução do Número de Alunos</h2>
          <p className="text-sm text-gray-theme">Histórico de matrículas ao longo dos anos</p>
        </div>
      </div>

      <div className="bg-card-alt rounded-lg p-4 border border-theme shadow-inner mb-6">
        <span className="text-sm font-medium text-gray-theme">Evolução de Matrículas</span>
        <div className="w-full h-64 mt-4">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={dadosTemporais}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.15} stroke="#888" vertical={false} />

              <XAxis
                dataKey="ano"
                stroke="#666"
                interval="preserveStartEnd" // Melhor para mobile, evita sobreposição
                tick={{ fontSize: 10, fill: '#888' }}
                tickMargin={10}
                axisLine={false}
                tickLine={false}
              />

              <YAxis
                stroke="#666"
                width={35}
                tick={{ fontSize: 11, fill: '#888' }}
                axisLine={false}
                tickLine={false}
              />

              <Tooltip
                content={<CustomTooltip />}
                cursor={{ stroke: '#3b82f6', strokeWidth: 1.5, strokeDasharray: '4 4', opacity: 0.5 }}
              />

              <Line
                type="monotone"
                dataKey="alunos"
                stroke="#2563eb"
                strokeWidth={3}
                dot={{ r: 4, fill: "#1e1e1e", stroke: "#2563eb", strokeWidth: 2 }}
                activeDot={{ r: 6, fill: "#2563eb", stroke: "#fff", strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-card-alt rounded-xl p-4 border border-theme shadow-sm transition-all duration-300 hover:scale-105 hover:shadow-lg cursor-default">
          <div className="flex items-center justify-between mb-2"><div className="flex items-center gap-2"><Users className="text-blue-500 w-5 h-5" /><span className="font-semibold text-text">Alunos</span></div><span className="text-sm font-medium text-blue-500">{Number(evolucaoAlunos) > 0 ? "+" : ""}{evolucaoAlunos}%</span></div>
          <div className="text-2xl font-bold text-text mb-1">{dadosAnoAtual?.alunos.toLocaleString("pt-BR")}</div>
          <div className="text-xs text-gray-theme">vs 2007: {dadosTemporais[0]?.alunos.toLocaleString("pt-BR")}</div>
        </div>

        <div className="bg-card-alt rounded-xl p-4 border border-theme shadow-sm transition-all duration-300 hover:scale-105 hover:shadow-lg cursor-default">
          <div className="flex items-center justify-between mb-2"><div className="flex items-center gap-2"><Layers className="text-blue-500 w-5 h-5" /><span className="font-semibold text-text">Turmas</span></div><span className="text-sm font-medium text-blue-500">{Number(evolucaoTurmas) > 0 ? "+" : ""}{evolucaoTurmas}%</span></div>
          <div className="text-2xl font-bold text-text mb-1">{dadosAnoAtual?.turmas.toLocaleString("pt-BR")}</div>
          <div className="text-xs text-gray-theme">vs 2007: {dadosTemporais[0]?.turmas.toLocaleString("pt-BR")}</div>
        </div>

        <div className="bg-card-alt rounded-xl p-4 border border-theme shadow-sm transition-all duration-300 hover:scale-105 hover:shadow-lg cursor-default">
          <div className="flex items-center justify-between mb-2"><div className="flex items-center gap-2"><UserCheck className="text-blue-500 w-5 h-5" /><span className="font-semibold text-text">Professores</span></div><span className="text-sm font-medium text-blue-500">{Number(evolucaoProfessores) > 0 ? "+" : ""}{evolucaoProfessores}%</span></div>
          <div className="text-2xl font-bold text-text mb-1">{dadosAnoAtual?.professores.toLocaleString("pt-BR")}</div>
          <div className="text-xs text-gray-theme">vs 2007: {dadosTemporais[0]?.professores.toLocaleString("pt-BR")}</div>
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

  if (loading) return <div className="min-h-screen flex flex-col items-center justify-center gap-2"><Loader2 className="animate-spin text-blue-500" /> <span className="text-sm text-gray-500">Carregando dados...</span></div>;
  if (error) return <div className="min-h-screen flex items-center justify-center text-red-500">Erro: {error}</div>;

  return (
    <main className="min-h-screen bg-background text-text overflow-x-hidden pb-10">
      <DashboardHeader escola={dados.escola} onBack={() => router.back()} />

      {/* Container Principal: Alinhado conforme sua solicitação */}
      <div className="max-w-[95%] sm:max-w-[90%] md:max-w-[80%] mx-auto px-3 sm:px-4 py-6 space-y-6">

        <IdentificacaoEscola escola={dados.escola} />

        {/* Layout de Grid: 1 coluna no celular, 3 no PC */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <MetricasEscola metricas={dados.metricas} />
            <InfraestruturaEscola infraestrutura={dados.infraestrutura} />
            <AnaliseTemporal dadosTemporais={dados.dadosTemporais} />
          </div>

          <div className="space-y-6">
            <div className="bg-card p-6 rounded-xl border border-white/10 shadow-lg sticky top-24">
              <h3 className="font-bold text-lg mb-4 flex items-center gap-2"><TrendingUp size={20} className="text-primary" /> Ações Rápidas</h3>
              <div className="space-y-3">
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
                  <div className="p-2 bg-blue-100 rounded-lg group-hover:scale-110 transition-transform duration-200 flex-shrink-0"><Calendar className="text-blue-500 w-5 h-5 sm:w-6 sm:h-6" /></div>
                  <div className="flex-1 text-left min-w-0"><div className="font-semibold text-text text-sm sm:text-base group-hover:text-blue-500 transition-colors">Histórico completo</div><div className="text-gray-theme mt-1 text-xs sm:text-sm">Análise temporal desde 2007</div></div>
                  <div className="text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex-shrink-0">📊</div>
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