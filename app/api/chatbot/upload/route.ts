import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir, readFile } from 'fs/promises';
import { join } from 'path';
import prisma from '@/lib/prisma';
import pdf from 'pdf-parse';
import OpenAI from 'openai';

async function extractText(buffer: Buffer, fileType: string, filename: string): Promise<string> {
  const ext = filename.toLowerCase().split('.').pop();
  
  if (ext === 'pdf') {
    try {
      const data = await pdf(buffer);
      return data.text || "";
    } catch (err) {
      console.error('PDF extraction error:', err);
      return "[Error extracting text from PDF]";
    }
  }
  
  if (fileType.startsWith('image/') || ['jpg', 'jpeg', 'png', 'webp'].includes(ext || "")) {
    try {
      const openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY || 'dummy_key',
      });
      
      if (!process.env.OPENAI_API_KEY) return "[Image: API Key missing for Vision]";

      const base64Image = buffer.toString('base64');
      const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          {
            role: "user",
            content: [
              { type: "text", text: "Transcribe any text or numbers visible in this image. Focus on tax or ZRA details like TPIN, names, amounts." },
              {
                type: "image_url",
                image_url: {
                  url: `data:${fileType};base64,${base64Image}`
                }
              }
            ]
          }
        ],
        max_tokens: 500
      });
      return response.choices[0].message.content || "";
    } catch (err) {
      console.error('Vision API error:', err);
      return "[Image content could not be processed]";
    }
  }

  if (fileType.startsWith('text/') || ['txt', 'md', 'csv', 'json'].includes(ext || "")) {
    return buffer.toString('utf-8');
  }

  if (['doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx'].includes(ext || "")) {
    return `[File: ${filename} is a complex document type (${ext}) that requires specialized parsing. Content is visible to human staff but not yet fully indexed for AI analysis.]`;
  }

  return "";
}

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const files = formData.getAll('files') as File[];
    const sessionId = formData.get('session_id') as string || 'anonymous';
    const senderType = formData.get('sender_type') as string || 'user';

    if (files.length === 0) {
      return NextResponse.json({ error: 'No files uploaded' }, { status: 400 });
    }

    const uploadDir = join(process.cwd(), 'public', 'uploads');
    try {
      await mkdir(uploadDir, { recursive: true });
    } catch (err) {}

    const activeSession = await prisma.activeChatSession.findFirst({
      where: { sessionId, status: { in: ['active', 'pending'] } }
    });

    let realTimeMsg = null;
    if (activeSession) {
      realTimeMsg = await prisma.realTimeChatMessage.create({
        data: {
          chatSessionId: activeSession.id,
          senderType: senderType === 'user' ? 'user' : 'staff',
          senderId: senderType === 'user' ? sessionId : 'staff',
          message: `${senderType === 'user' ? 'User' : 'Staff'} uploaded ${files.length} file(s): ${files.map(f => f.name).join(', ')}`
        }
      });
    }

    let latestChatMessage = null;
    if (!activeSession) {
      latestChatMessage = await prisma.chatMessage.findFirst({
        where: { sessionId },
        orderBy: { timestamp: 'desc' }
      });

      if (!latestChatMessage) {
        latestChatMessage = await prisma.chatMessage.create({
          data: {
            sessionId,
            message: `${senderType === 'user' ? 'User' : 'Staff'} uploaded file(s)`,
            response: "File processing...",
            responseTime: 0.1
          }
        });
      }
    }

    const uploadedFilesData = [];

    for (const file of files) {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      const uniqueFilename = `${Date.now()}-${file.name}`;
      const path = join(uploadDir, uniqueFilename);
      await writeFile(path, buffer);

      const extractedContent = await extractText(buffer, file.type, file.name);

      const dbFile = await prisma.uploadedFile.create({
        data: {
          chatMessageId: latestChatMessage?.id || null,
          realTimeChatMessageId: realTimeMsg?.id || null,
          file: uniqueFilename,
          fileType: file.type.startsWith('image/') ? 'image' : 'document',
          originalFilename: file.name,
          fileSize: file.size,
          processed: extractedContent.length > 0,
          processedContent: extractedContent,
          senderType: senderType
        }
      });

      uploadedFilesData.push({
        id: dbFile.id,
        original_filename: dbFile.originalFilename,
        file_path: dbFile.file,
        file_type: dbFile.fileType,
        processed_content: extractedContent,
        sender_type: senderType
      });
    }

    return NextResponse.json({
      message: `Successfully uploaded ${files.length} file(s)`,
      files: uploadedFilesData,
      session_id: sessionId
    });

  } catch (error: any) {
    console.error('Upload API Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
