import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ sessionId: string }> }
) {
  try {
    const { sessionId } = await params;

    const activeSession = await prisma.activeChatSession.findUnique({
      where: { sessionId },
      include: {
        staffMember: {
          select: { username: true }
        }
      }
    });

    if (!activeSession) {
      return NextResponse.json({ error: 'Session not found' }, { status: 404 });
    }

    return NextResponse.json({
      session_id: activeSession.sessionId,
      status: activeSession.status,
      staff_member: activeSession.staffMember?.username || null,
      is_user_waiting_for_staff: activeSession.isUserWaitingForStaff
    });

  } catch (error: any) {
    console.error('Session Status API Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
