import { NextRequest, NextResponse } from 'next/server';
import prisma from '../../libs/prismadb';
import serverAuth from '../../libs/serverAuth';

export async function POST(req: NextRequest, { params }: { params: { postId: string } }) {
  try {
    const { body } = await req.json();
    const { currentUser } = await serverAuth();

    const postId = params.postId;

    if (!postId || typeof postId !== 'string') {
      return new NextResponse('Invalid ID', { status: 400 });
    }

    const comment = await prisma.comment.create({
      data: {
        body,
        userId: currentUser.id,
        postId,
      },
    });

    // Send notification to post owner
    try {
      const post = await prisma.post.findUnique({
        where: {
          id: postId,
        },
      });

      if (post?.userId) {
        await prisma.notification.create({
          data: {
            body: 'Someone replied on your tweet!',
            userId: post.userId,
          },
        });

        await prisma.user.update({
          where: { id: post.userId },
          data: { hasNotification: true },
        });
      }
    } catch (notificationError) {
      console.error('Notification error:', notificationError);
    }

    return NextResponse.json(comment);
  } catch (error) {
    console.error('Comment POST error:', error);
    return new NextResponse('Failed to post comment', { status: 500 });
  }
}
