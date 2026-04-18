import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(req: NextRequest) {
  try {
    const activeSessions = await prisma.activeChatSession.findMany({
      where: {
        status: { in: ['pending', 'active'] }
      },
      include: {
        staffMember: {
          select: { username: true }
        },
        realTimeMessages: {
          orderBy: { timestamp: 'desc' },
          take: 1
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    const sessionsData = activeSessions.map(session => ({
      session_id: session.sessionId,
      status: session.status,
      user_id: session.userId,
      created_at: session.createdAt.toISOString(),
      connected_at: session.connectedAt?.toISOString() || null,
      staff_member: session.staffMember?.username || null,
      is_user_waiting_for_staff: session.isUserWaitingForStaff,
      latest_message: session.realTimeMessages[0]?.message || null,
      latest_message_time: session.realTimeMessages[0]?.timestamp.toISOString() || null
    }));

    return NextResponse.json({ active_sessions: sessionsData });
  } catch (error: any) {
    console.error('Active Sessions API Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
