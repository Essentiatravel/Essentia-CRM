import { useState } from 'react';
import { supabase, getAccessToken } from '@/lib/supabase';

export function useImageUpload() {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const uploadImage = async (file: File): Promise<string | null> => {
    setUploading(true);
    setError(null);

    try {
      // Validar arquivo
      if (!file) {
        throw new Error('Nenhum arquivo selecionado');
      }

      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
      if (!allowedTypes.includes(file.type)) {
        throw new Error('Tipo de arquivo não permitido. Use JPG, PNG ou WebP.');
      }

      if (file.size > 5 * 1024 * 1024) {
        throw new Error('Arquivo muito grande. Máximo 5MB permitido.');
      }

      // Obter token de acesso
      const accessToken = await getAccessToken();
      
      console.log('🔍 Verificando token:', { 
        hasToken: !!accessToken,
        tokenPrefix: accessToken ? accessToken.substring(0, 20) + '...' : 'none'
      });

      if (!accessToken) {
        console.error('❌ Token não encontrado');
        throw new Error('Sessão não encontrada. Faça login novamente.');
      }

      // Preparar dados para upload
      const formData = new FormData();
      formData.append('file', file);

      console.log('📤 Enviando para API com token:', accessToken.substring(0, 20) + '...');

      // Fazer upload
      const response = await fetch('/api/upload', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`
        },
        body: formData,
      });

      const result = await response.json();

      console.log('📥 Resposta da API:', { 
        status: response.status, 
        success: result.success,
        error: result.error 
      });

      if (!response.ok || !result.success) {
        throw new Error(result.error || 'Erro no upload da imagem');
      }

      return result.url;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido no upload';
      setError(errorMessage);
      console.error('❌ Erro no upload:', err);
      return null;
    } finally {
      setUploading(false);
    }
  };

  return {
    uploadImage,
    uploading,
    error,
    clearError: () => setError(null)
  };
}
