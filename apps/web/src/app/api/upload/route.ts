import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { randomUUID } from 'crypto';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json(
        { error: 'Nenhum arquivo foi enviado' },
        { status: 400 }
      );
    }

    // Verificar tipo de arquivo
    if (!file.type.startsWith('image/')) {
      return NextResponse.json(
        { error: 'Apenas arquivos de imagem são permitidos' },
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

    // Converter para buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Gerar nome único para o arquivo
    const fileExtension = file.name.split('.').pop();
    const fileName = `${randomUUID()}.${fileExtension}`;
    
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