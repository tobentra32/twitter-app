// app/api/posts/[postId]/route.ts

import { NextRequest, NextResponse } from 'next/server';
import prisma from '../../../libs/prismadb';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ postId: string }> }
) {
  // This endpoint fetches a single post by its ID
  try {
    const { postId } = await params;

    if (!postId || typeof postId !== 'string') {
      return NextResponse.json({ error: 'Invalid post ID' }, { status: 400 });
    }

    const post = await prisma.post.findUnique({
      where: { id: postId },
      include: {
        user: true,
        comments: {
          include: {
            user: true,
          },
          orderBy: {
            createdAt: 'desc',
          },
        },
      },
    });

    return NextResponse.json(post, { status: 200 });
  } catch (error) {
    console.error('Error fetching post:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
