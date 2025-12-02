'use client';

import { useState, useEffect, useRef } from 'react';
import { useParams } from 'next/navigation';
import { Loader2, Download, Printer, ArrowLeft } from 'lucide-react';
import { DICIONARIO_DADOS, CATEGORIAS_RELATORIO } from '@/utils/dicionario';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export default function RelatorioPage() {
    const params = useParams();
    const codigo_inep = params?.codigo_inep as string;
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const contentRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!codigo_inep) return;

        const fetchData = async () => {
            try {
                const codigoLimpo = codigo_inep.replace(/[^0-9]/g, '');
                // Busca dados completos
                const response = await fetch(`${API_BASE_URL}/api/escola/details?id=${codigoLimpo}&full=true`);

                if (!response.ok) throw new Error('Falha ao carregar dados');

                const result = await response.json();
                setData({ raw: result });
            } catch (err) {
                console.error(err);
                setError('Erro ao carregar dados da escola.');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [codigo_inep]);

    const handleDownloadPDF = async () => {
        if (!contentRef.current || typeof window === 'undefined') return;

        // Carrega html2pdf dinamicamente se não estiver carregado
        if (!(window as any).html2pdf) {
            const script = document.createElement('script');
            script.src = 'https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js';
            script.onload = generatePDF;
            document.head.appendChild(script);
        } else {
            generatePDF();
        }
    };

    const generatePDF = () => {
        const element = contentRef.current;
        const opt = {
            margin: [0, 0, 15, 0], // Top, Right, Bottom, Left
            filename: `Relatorio_Escola_${codigo_inep}.pdf`,
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: 2, useCORS: true, letterRendering: true },
            jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
        };

        (window as any).html2pdf().set(opt).from(element).toPdf().get('pdf').then((pdf: any) => {
            const totalPages = pdf.internal.getNumberOfPages();
            const pageWidth = pdf.internal.pageSize.getWidth();
            const pageHeight = pdf.internal.pageSize.getHeight();

            for (let i = 1; i <= totalPages; i++) {
                pdf.setPage(i);
                pdf.setFontSize(8);
                pdf.setTextColor(100); // Cinza escuro

                const footerText = `InfoSchool • Relatório Técnico • ${dataHora} • Página ${i} de ${totalPages}`;
                pdf.text(footerText, pageWidth / 2, pageHeight - 10, { align: 'center' });
            }
        }).save();
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-100">
                <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
                <span className="ml-2 text-gray-600">Gerando relatório...</span>
            </div>
        );
    }

    if (error || !data) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 text-red-600">
                <p>{error || 'Dados não encontrados'}</p>
                <button onClick={() => window.history.back()} className="mt-4 px-4 py-2 bg-white rounded shadow text-gray-800 hover:bg-gray-50">
                    Voltar
                </button>
            </div>
        );
    }

    const { raw } = data;
    const now = new Date();
    const dataHora = now.toLocaleDateString('pt-BR') + ' às ' + now.toLocaleTimeString('pt-BR');

    const formatValue = (key: string, val: any) => {
        if (val === null || val === undefined) return <span className="text-gray-400 italic">Sem informações</span>;

        if ((key.startsWith('IN_') || key.startsWith('TP_')) && typeof val === 'number') {
            if (['TP_DEPENDENCIA', 'TP_LOCALIZACAO', 'TP_SITUACAO_FUNCIONAMENTO', 'CO_UF', 'CO_MUNICIPIO', 'TP_REDE_LOCAL', 'TP_REGULAMENTACAO'].includes(key)) return val;

            return val === 1
                ? <span className="text-green-600 font-medium flex items-center gap-1">✓ Sim</span>
                : <span className="text-red-500 font-medium flex items-center gap-1">✗ Não</span>;
        }

        if (typeof val === 'number' && key.startsWith('QT_')) {
            return val.toLocaleString('pt-BR');
        }

        return val;
    };

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

    return (
        <div className="min-h-screen bg-gray-800 py-8 px-4">
            {/* Toolbar Flutuante */}
            <div className="fixed top-4 right-4 z-50 flex gap-2">
                <button
                    onClick={() => window.history.back()}
                    className="bg-white/90 backdrop-blur p-2 rounded-full shadow-lg hover:bg-white transition-all text-gray-700"
                    title="Voltar"
                >
                    <ArrowLeft size={20} />
                </button>
                <button
                    onClick={() => window.print()}
                    className="bg-white/90 backdrop-blur p-2 rounded-full shadow-lg hover:bg-white transition-all text-blue-600"
                    title="Imprimir"
                >
                    <Printer size={20} />
                </button>
                <button
                    onClick={handleDownloadPDF}
                    className="bg-blue-600 p-2 rounded-full shadow-lg hover:bg-blue-700 transition-all text-white"
                    title="Baixar PDF"
                >
                    <Download size={20} />
                </button>
            </div>

            {/* Área do Relatório (A4) */}
            <div className="flex justify-center">
                <div
                    ref={contentRef}
                    className="bg-white w-[210mm] min-h-[297mm] p-[10mm] shadow-2xl relative"
                    style={{ fontFamily: "'Inter', sans-serif" }}
                >
                    {/* Cabeçalho */}
                    <div className="bg-gray-50 p-8 rounded-xl mb-8 relative overflow-hidden border border-gray-100">
                        <div className="relative z-10">
                            <div className="text-3xl font-bold text-blue-600 mb-2 tracking-tight">InfoSchool</div>
                            <h1 className="text-2xl font-bold text-gray-900 mb-4 leading-tight">{raw.NO_ENTIDADE}</h1>

                            <div className="flex flex-wrap gap-3 mt-4">
                                <span className="bg-white px-3 py-1.5 rounded-full text-xs font-semibold text-blue-600 border border-gray-200 shadow-sm">
                                    INEP: {raw.CO_ENTIDADE}
                                </span>
                                <span className="bg-white px-3 py-1.5 rounded-full text-xs font-semibold text-blue-600 border border-gray-200 shadow-sm">
                                    {raw.NO_MUNICIPIO} - {raw.SG_UF}
                                </span>
                            </div>

                            <div className="absolute top-8 right-8 text-right bg-white p-3 rounded-lg border border-gray-200 shadow-sm">
                                <div className="text-[10px] font-bold text-blue-600 uppercase tracking-wider mb-1">Relatório Técnico</div>
                                <div className="text-xs font-medium text-gray-700">{dataHora}</div>
                            </div>
                        </div>

                        {/* Elemento decorativo de fundo */}
                        <div className="absolute -top-20 -right-20 w-64 h-64 bg-blue-50 rounded-full opacity-50 blur-3xl pointer-events-none"></div>
                    </div>

                    {/* Conteúdo */}
                    <div className="space-y-6">
                        {(Object.entries(CATEGORIAS_RELATORIO) as [string, string[]][]).map(([catName, catKeys]) => {
                            // Filtra chaves válidas (opcional, aqui mostra todas)
                            const validKeys = catKeys;
                            if (validKeys.length === 0) return null;

                            return (
                                <div key={catName} className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm mb-6">
                                    <div className="bg-gray-50 px-6 py-3 border-b border-gray-200 flex items-center gap-3">
                                        <span className="text-xl filter drop-shadow-sm">{getIcon(catName)}</span>
                                        <h2 className="text-sm font-bold text-gray-800 uppercase tracking-wide flex-1">{catName}</h2>
                                        <span className="text-[10px] font-semibold text-gray-500 bg-white px-2 py-1 rounded border border-gray-200">
                                            {validKeys.length} itens
                                        </span>
                                    </div>

                                    <div className="p-0">
                                        <table className="w-full text-sm text-left">
                                            <tbody>
                                                {validKeys.map((key, index) => (
                                                    <tr key={key} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}>
                                                        <td className="px-6 py-2.5 border-b border-gray-100 w-[60%] text-gray-600 font-medium">
                                                            {DICIONARIO_DADOS[key] || key}
                                                            <span className="ml-2 text-[9px] text-gray-400 font-normal">({key})</span>
                                                        </td>
                                                        <td className="px-6 py-2.5 border-b border-gray-100 text-gray-900">
                                                            {formatValue(key, raw[key])}
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Rodapé */}
                    <div className="mt-12 pt-6 border-t border-gray-200 text-center">
                        <p className="text-[10px] text-gray-400">
                            Relatório gerado via InfoSchool • Fonte de dados: INEP/MEC (Censo Escolar)
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
