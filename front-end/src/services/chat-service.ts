export interface ChatResponse {
    success: boolean;
    resposta: string;
    intent?: string;
    sources?: any[];
    statistics?: any;
    filters?: any;
    timestamp?: string;
    error?: string;
    details?: string;
    structuredData?: any[];
}

export const sendMessageToRAG = async (message: string, page: number = 1): Promise<ChatResponse> => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'; // Fallback to localhost if env not set

    try {
        const response = await fetch(`${apiUrl}/rag/chat/query`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ pergunta: message, page }),
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.error || `Erro na requisição: ${response.status}`);
        }

        return await response.json();
    } catch (error: any) {
        console.error('Erro ao enviar mensagem para o RAG:', error);
        throw error;
    }
};
