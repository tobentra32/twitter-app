import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/app/libs/prismadb';
import serverAuth from '@/app/libs/serverAuth';

// ✅ USE this signature exactly — context.params typed as Record<string, string>

export async function POST(
  request: Request,
  { params }: { params: Promise<{ postId: string }> }
) {
  const { postId } = await params;

  try {
    const { body } = await request.json();
    const { currentUser } = await serverAuth();

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

    try {
      const post = await prisma.post.findUnique({ where: { id: postId } });

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
