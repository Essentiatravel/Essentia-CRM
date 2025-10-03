import { NextRequest, NextResponse } from 'next/server';
import { randomUUID } from 'crypto';
import { fileTypeFromBuffer } from 'file-type';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

export async function POST(request: NextRequest) {
  try {
    console.log('📤 Upload - Iniciando upload para Supabase Storage');
    
    // Criar cliente Supabase com service role para autenticação server-side
    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    });

    // Pegar token do header Authorization ou cookies
    const authHeader = request.headers.get('authorization');
    const cookies = request.cookies;
    const accessToken = authHeader?.replace('Bearer ', '') || 
                       cookies.get('sb-access-token')?.value || 
                       cookies.get('supabase-auth-token')?.value;

    console.log('🔐 Upload - Validando autenticação');
    console.log('🔍 Headers:', {
      hasAuthHeader: !!authHeader,
      hasCookie1: !!cookies.get('sb-access-token'),
      hasCookie2: !!cookies.get('supabase-auth-token'),
      hasToken: !!accessToken,
      tokenPrefix: accessToken ? accessToken.substring(0, 20) + '...' : 'none'
    });

    if (!accessToken) {
      console.log('❌ Upload - Token não encontrado');
      return NextResponse.json(
        { error: 'Token de autenticação não encontrado. Faça login novamente.' },
        { status: 401 }
      );
    }

    // Criar cliente com token do usuário para validação
    const supabaseUser = createClient(supabaseUrl, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, {
      global: {
        headers: { Authorization: `Bearer ${accessToken}` }
      }
    });

    const { data: { user }, error: userError } = await supabaseUser.auth.getUser();

    if (userError || !user) {
      console.log('❌ Upload - Não autenticado:', { 
        error: userError?.message,
        hasUser: !!user 
      });
      return NextResponse.json(
        { error: 'Acesso negado. Faça login para fazer upload de imagens.' },
        { status: 401 }
      );
    }

    const userType = user.user_metadata?.userType;
    const userEmail = user.email;
    
    console.log('👤 Upload - Usuário:', userEmail, 'Tipo:', userType, 'Metadata:', user.user_metadata);

    // Verificar se é admin: por userType ou por email
    const isAdmin = userType === 'admin' || 
                    userEmail === 'admin@turguide.com' ||
                    userEmail?.endsWith('@admin.com');

    if (!isAdmin) {
      console.log('❌ Upload - Não é admin:', { userType, userEmail });
      return NextResponse.json(
        { error: 'Apenas administradores podem enviar imagens.' },
        { status: 403 }
      );
    }

    console.log('✅ Upload - Autenticação OK');

    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json(
        { error: 'Nenhum arquivo foi enviado' },
        { status: 400 }
      );
    }

    const allowedMimeTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    const allowedExtensions = ['.jpg', '.jpeg', '.png', '.webp'];

    if (!file.type || !allowedMimeTypes.includes(file.type.toLowerCase())) {
      return NextResponse.json(
        { error: 'Tipo de arquivo não permitido. Use apenas JPG, PNG ou WebP.' },
        { status: 400 }
      );
    }

    const fileExt = `.${file.name.split('.').pop()?.toLowerCase() || ''}`;
    if (!allowedExtensions.includes(fileExt)) {
      return NextResponse.json(
        { error: 'Extensão de arquivo não permitida. Use apenas .jpg, .jpeg, .png ou .webp.' },
        { status: 400 }
      );
    }

    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        { error: 'Arquivo muito grande. Máximo 5MB permitido.' },
        { status: 400 }
      );
    }

    if (file.size === 0) {
      return NextResponse.json(
        { error: 'Arquivo vazio não é permitido.' },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const detectedType = await fileTypeFromBuffer(buffer);
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];

    if (!detectedType || !allowedTypes.includes(detectedType.mime)) {
      return NextResponse.json(
        { error: 'Arquivo não é uma imagem válida.' },
        { status: 400 }
      );
    }

    const fileExtension = file.name.split('.').pop()?.toLowerCase() || 'jpg';
    const fileName = `${randomUUID()}.${fileExtension}`;

    if (!/^[a-f0-9-]+\.(jpg|jpeg|png|webp)$/.test(fileName)) {
      return NextResponse.json(
        { error: 'Nome de arquivo inválido gerado.' },
        { status: 500 }
      );
    }

    console.log('📁 Upload - Enviando para Supabase Storage:', fileName);

    // Upload para Supabase Storage usando service role (admin)
    const { data: uploadData, error: uploadError } = await supabaseAdmin.storage
      .from('cards turs')
      .upload(`passeios/${fileName}`, buffer, {
        contentType: detectedType.mime,
        cacheControl: '3600',
        upsert: false
      });

    if (uploadError) {
      console.error('❌ Erro no upload para Supabase:', uploadError);
      return NextResponse.json(
        { error: `Erro ao fazer upload: ${uploadError.message}` },
        { status: 500 }
      );
    }

    // Obter URL pública da imagem
    const { data: { publicUrl } } = supabaseAdmin.storage
      .from('cards turs')
      .getPublicUrl(`passeios/${fileName}`);

    console.log('✅ Upload - Sucesso:', { fileName, publicUrl });

    return NextResponse.json({
      success: true,
      url: publicUrl,
      fileName,
      path: `passeios/${fileName}`
    });
  } catch (error) {
    console.error('❌ Erro no upload:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
