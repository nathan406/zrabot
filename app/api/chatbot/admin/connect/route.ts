import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(req: NextRequest) {
  try {
    const { session_id, admin } = await req.json();

    if (!session_id) {
      return NextResponse.json({ error: 'Session ID is required' }, { status: 400 });
    }

    // For now, we'll mimic the Django logic which allows admin: true for development
    if (!admin) {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    }

    const activeSession = await prisma.activeChatSession.findUnique({
      where: { sessionId: session_id }
    });

    if (!activeSession) {
      return NextResponse.json({ error: 'Session not found' }, { status: 404 });
    }

    if (activeSession.status === 'active' && activeSession.staffMemberId) {
      return NextResponse.json({ error: 'Session already connected to another staff member' }, { status: 400 });
    }

    const updatedSession = await prisma.activeChatSession.update({
      where: { sessionId: session_id },
      data: {
        status: 'active',
        connectedAt: new Date(),
        isUserWaitingForStaff: false
      }
    });

    // Only create join message if it doesn't exist
    const existingJoinMessage = await prisma.realTimeChatMessage.findFirst({
      where: {
        chatSessionId: updatedSession.id,
        senderType: 'system',
        message: 'ZRA staff member has joined the chat'
      }
    });

    if (!existingJoinMessage) {
      await prisma.realTimeChatMessage.create({
        data: {
          chatSessionId: updatedSession.id,
          senderType: 'system',
          senderId: 'system',
          message: 'ZRA staff member has joined the chat'
        }
      });
    }

    return NextResponse.json({
      message: 'Successfully connected to user chat',
      session_id: updatedSession.sessionId,
      status: updatedSession.status,
      connected_at: updatedSession.connectedAt?.toISOString()
    });

  } catch (error: any) {
    console.error('Connect API Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
