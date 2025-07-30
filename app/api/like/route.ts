import { NextRequest, NextResponse } from 'next/server';
import prisma from '../../libs/prismadb';
import serverAuth from '../../libs/serverAuth';

export async function POST(req: NextRequest) {
  try {
    const { postId } = await req.json();
    const { currentUser } = await serverAuth();

    if (!postId || typeof postId !== 'string') {
      return new NextResponse('Invalid post ID', { status: 400 });
    }

    const post = await prisma.post.findUnique({ where: { id: postId } });
    if (!post) {
      return new NextResponse('Post not found', { status: 404 });
    }

    const updatedLikedIds = [...(post.likedIds || []), currentUser.id];

    const updatedPost = await prisma.post.update({
      where: { id: postId },
      data: { likedIds: updatedLikedIds },
    });

    // NOTIFICATION
    try {
      if (post.userId) {
        await prisma.notification.create({
          data: {
            body: 'Someone liked your tweet!',
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

    return NextResponse.json(updatedPost);
  } catch (error) {
    console.error('POST /api/like error:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { postId } = await req.json();
    const { currentUser } = await serverAuth();

    if (!postId || typeof postId !== 'string') {
      return new NextResponse('Invalid post ID', { status: 400 });
    }

    const post = await prisma.post.findUnique({ where: { id: postId } });
    if (!post) {
      return new NextResponse('Post not found', { status: 404 });
    }

    const updatedLikedIds = (post.likedIds || []).filter(
      (id) => id !== currentUser.id
    );

    const updatedPost = await prisma.post.update({
      where: { id: postId },
      data: { likedIds: updatedLikedIds },
    });

    return NextResponse.json(updatedPost);
  } catch (error) {
    console.error('DELETE /api/like error:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
