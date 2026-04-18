import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ sessionId: string }> }
) {
  try {
    const { sessionId } = await params;
    const includeFiles = req.nextUrl.searchParams.get('include_files') === 'true';

    const activeSession = await prisma.activeChatSession.findUnique({
      where: { sessionId },
      include: {
        realTimeMessages: {
          include: {
            uploadedFiles: true
          },
          orderBy: { timestamp: 'asc' }
        }
      }
    });

    if (!activeSession) {
      return NextResponse.json({ error: 'Session not found' }, { status: 404 });
    }

    const messagesData = activeSession.realTimeMessages.map(message => ({
      id: message.id,
      sender_type: message.senderType,
      sender_id: message.senderId,
      message: message.message,
      timestamp: message.timestamp.toISOString(),
      is_read: message.isRead,
      files: message.uploadedFiles.map(file => ({
        id: file.id,
        original_filename: file.originalFilename,
        file_type: file.fileType,
        file_size: file.fileSize,
        file_path: file.file,
        full_media_url: `/uploads/${file.file}`,
        sender_type: file.senderType
      }))
    }));

    let filesData: any[] = [];
    if (includeFiles) {
      const chatMessagesWithFiles = await prisma.chatMessage.findMany({
        where: { sessionId },
        include: { uploadedFiles: true }
      });

      for (const chatMsg of chatMessagesWithFiles) {
        for (const file of chatMsg.uploadedFiles) {
          filesData.push({
            id: file.id,
            original_filename: file.originalFilename,
            file_type: file.fileType,
            file_size: file.fileSize,
            upload_time: file.uploadTime.toISOString(),
            processed_content: file.processedContent || '',
            processed: file.processed,
            file_path: file.file,
            full_media_url: `/uploads/${file.file}`,
            associated_with_message: chatMsg.message.substring(0, 50) + (chatMsg.message.length > 50 ? '...' : '')
          });
        }
      }
    }

    return NextResponse.json({
      session_id: sessionId,
      messages: messagesData,
      files: filesData
    });

  } catch (error: any) {
    console.error('Chat History API Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
