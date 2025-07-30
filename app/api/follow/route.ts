import { NextRequest, NextResponse } from 'next/server';
import prisma from '../../libs/prismadb';
import serverAuth from '../../libs/serverAuth';

export async function POST(req: NextRequest) {
  try {
    const { userId } = await req.json();
    const { currentUser } = await serverAuth();

    if (!userId || typeof userId !== 'string') {
      return new NextResponse('Invalid ID', { status: 400 });
    }

    const user = await prisma.user.findUnique({ where: { id: userId } });

    if (!user) {
      return new NextResponse('User not found', { status: 404 });
    }

    const updatedFollowingIds = [...(currentUser.followingIds || []), userId];

    const updatedUser = await prisma.user.update({
      where: { id: currentUser.id },
      data: {
        followingIds: updatedFollowingIds,
      },
    });

    // Notification logic
    try {
      await prisma.notification.create({
        data: {
          body: 'Someone followed you!',
          userId,
        },
      });

      await prisma.user.update({
        where: { id: userId },
        data: { hasNotification: true },
      });
    } catch (notificationError) {
      console.error('Notification error:', notificationError);
    }

    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error('POST /api/follow error:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { userId } = await req.json();
    const { currentUser } = await serverAuth();

    if (!userId || typeof userId !== 'string') {
      return new NextResponse('Invalid ID', { status: 400 });
    }

    const updatedFollowingIds = (currentUser.followingIds || []).filter(
      (id) => id !== userId
    );

    const updatedUser = await prisma.user.update({
      where: { id: currentUser.id },
      data: {
        followingIds: updatedFollowingIds,
      },
    });

    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error('DELETE /api/follow error:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
