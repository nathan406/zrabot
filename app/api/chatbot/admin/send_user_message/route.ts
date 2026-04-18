import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(req: NextRequest) {
  try {
    const { session_id, message } = await req.json();

    if (!session_id || !message) {
      return NextResponse.json({ error: 'Session ID and message are required' }, { status: 400 });
    }

    const activeSession = await prisma.activeChatSession.findUnique({
      where: { sessionId: session_id }
    });

    if (!activeSession) {
      return NextResponse.json({ error: 'Session not found' }, { status: 404 });
    }

    const newMessage = await prisma.realTimeChatMessage.create({
      data: {
        chatSessionId: activeSession.id,
        senderType: 'user',
        senderId: session_id,
        message: message
      }
    });

    return NextResponse.json({
      message_id: newMessage.id,
      message: newMessage.message,
      sender_type: newMessage.senderType,
      timestamp: newMessage.timestamp.toISOString()
    });

  } catch (error: any) {
    console.error('Send User Message API Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
