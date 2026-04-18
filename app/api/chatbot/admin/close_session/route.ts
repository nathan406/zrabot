import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(req: NextRequest) {
  try {
    const { session_id } = await req.json();

    if (!session_id) {
      return NextResponse.json({ error: 'Session ID is required' }, { status: 400 });
    }

    const activeSession = await prisma.activeChatSession.findUnique({
      where: { sessionId: session_id }
    });

    if (!activeSession) {
      return NextResponse.json({ error: 'Session not found' }, { status: 404 });
    }

    const updatedSession = await prisma.activeChatSession.update({
      where: { sessionId: session_id },
      data: {
        status: 'closed',
        closedAt: new Date()
      }
    });

    await prisma.realTimeChatMessage.create({
      data: {
        chatSessionId: updatedSession.id,
        senderType: 'system',
        senderId: 'system',
        message: 'The chat session has been closed'
      }
    });

    return NextResponse.json({
      message: 'Successfully closed the session',
      session_id: updatedSession.sessionId,
      status: updatedSession.status
    });

  } catch (error: any) {
    console.error('Close Session API Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
