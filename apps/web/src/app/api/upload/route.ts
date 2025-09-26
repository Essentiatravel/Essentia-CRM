import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { randomUUID } from 'crypto';
import { getUserByEmail } from '@/lib/database';
import { fileTypeFromBuffer } from 'file-type';

export async function POST(request: NextRequest) {
  try {
    // Verificar autenticação usando sistema existente mas com validação server-side
    const sessionCookie = request.cookies.get('auth-session');
    
    if (!sessionCookie) {
      return NextResponse.json(
        { error: 'Acesso negado. Faça login para fazer upload de imagens.' },
        { status: 401 }
      );
    }

    // Validar dados da sessão
    let sessionData;
    try {
      sessionData = JSON.parse(sessionCookie.value);
    } catch (error) {
      return NextResponse.json(
        { error: 'Sessão inválida. Faça login novamente.' },
        { status: 401 }
      );
    }

    // Verificar se a sessão não expirou
    const now = Math.floor(Date.now() / 1000);
    if (sessionData.expires_at && now > sessionData.expires_at) {
      return NextResponse.json(
        { error: 'Sessão expirada. Faça login novamente.' },
        { status: 401 }
      );
    }

    // VALIDAÇÃO CRÍTICA: Verificar usuário real no banco de dados
    const userEmail = sessionData.user?.email;
    if (!userEmail) {
      return NextResponse.json(
        { error: 'Dados de usuário inválidos na sessão.' },
        { status: 401 }
      );
    }

    const dbUser = await getUserByEmail(userEmail);
    if (!dbUser) {
      return NextResponse.json(
        { error: 'Usuário não encontrado no banco de dados.' },
        { status: 401 }
      );
    }

    // Verificar se o usuário é admin no banco (não no cookie)
    if (dbUser.userType !== 'admin') {
      return NextResponse.json(
        { error: 'Acesso negado. Apenas administradores podem fazer upload de imagens.' },
        { status: 403 }
      );
    }

    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json(
        { error: 'Nenhum arquivo foi enviado' },
        { status: 400 }
      );
    }

    // Verificar tipo de arquivo (validação dupla - MIME type e extensão)
    const allowedMimeTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    const allowedExtensions = ['.jpg', '.jpeg', '.png', '.webp'];
    
    if (!file.type || !allowedMimeTypes.includes(file.type.toLowerCase())) {
      return NextResponse.json(
        { error: 'Tipo de arquivo não permitido. Use apenas JPG, PNG ou WebP.' },
        { status: 400 }
      );
    }

    // Verificar extensão do arquivo
    const fileExt = `.${file.name.split('.').pop()?.toLowerCase() || ''}`;
    if (!allowedExtensions.includes(fileExt)) {
      return NextResponse.json(
        { error: 'Extensão de arquivo não permitida. Use apenas .jpg, .jpeg, .png ou .webp.' },
        { status: 400 }
      );
    }

    // Verificar tamanho do arquivo (5MB máximo)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        { error: 'Arquivo muito grande. Máximo 5MB permitido.' },
        { status: 400 }
      );
    }

    // Verificar se o arquivo não está vazio
    if (file.size === 0) {
      return NextResponse.json(
        { error: 'Arquivo vazio não é permitido.' },
        { status: 400 }
      );
    }

    // Converter para buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Verificar tipo de arquivo usando magic bytes (segurança real)
    const detectedType = await fileTypeFromBuffer(buffer);
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
    
    if (!detectedType || !allowedTypes.includes(detectedType.mime)) {
      return NextResponse.json(
        { error: 'Arquivo não é uma imagem válida. Detectado através de assinatura binária.' },
        { status: 400 }
      );
    }

    // Gerar nome único para o arquivo (sanitizar extensão)
    const fileExtension = file.name.split('.').pop()?.toLowerCase() || 'jpg';
    const fileName = `${randomUUID()}.${fileExtension}`;
    
    // Validar que o nome do arquivo gerado é seguro
    if (!/^[a-f0-9-]+\.(jpg|jpeg|png|webp)$/.test(fileName)) {
      return NextResponse.json(
        { error: 'Nome de arquivo inválido gerado.' },
        { status: 500 }
      );
    }
    
    // Criar diretório se não existir
    const uploadsDir = join(process.cwd(), 'public', 'uploads', 'passeios');
    await mkdir(uploadsDir, { recursive: true });

    // Salvar arquivo
    const filePath = join(uploadsDir, fileName);
    await writeFile(filePath, buffer);

    // Retornar URL pública
    const publicUrl = `/uploads/passeios/${fileName}`;

    return NextResponse.json({
      success: true,
      url: publicUrl,
      fileName: fileName
    });

  } catch (error) {
    console.error('Erro no upload:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}