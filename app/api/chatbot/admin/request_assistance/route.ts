import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(req: NextRequest) {
  try {
    const { session_id, user_id } = await req.json();

    if (!session_id || !user_id) {
      return NextResponse.json({ error: 'Session ID and User ID are required' }, { status: 400 });
    }

    const activeSession = await prisma.activeChatSession.upsert({
      where: { sessionId: session_id },
      update: {
        isUserWaitingForStaff: true,
        status: 'pending'
      },
      create: {
        sessionId: session_id,
        userId: user_id,
        isUserWaitingForStaff: true,
        status: 'pending'
      }
    });

    await prisma.realTimeChatMessage.create({
      data: {
        chatSessionId: activeSession.id,
        senderType: 'system',
        senderId: 'system',
        message: 'User is requesting assistance from a ZRA staff member'
      }
    });

    return NextResponse.json({
      message: 'Assistance requested successfully',
      session_id: activeSession.sessionId,
      status: activeSession.status
    });

  } catch (error: any) {
    console.error('Request Assistance API Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
