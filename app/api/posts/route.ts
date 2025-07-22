// app/api/posts/route.ts
import { NextRequest, NextResponse } from 'next/server';
import prisma from '../../libs/prismadb';
import serverAuth from '../../libs/serverAuth';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');

    let posts;

    if (userId && typeof userId === 'string') {
      posts = await prisma.post.findMany({
        where: { userId },
        include: { user: true, comments: true },
        orderBy: { createdAt: 'desc' },
      });
    } else {
      posts = await prisma.post.findMany({
        include: { user: true, comments: true },
        orderBy: { createdAt: 'desc' },
      });
    }

    return NextResponse.json(posts);
  } catch (error) {
    console.error(error);
    return new NextResponse('Error fetching posts', { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { body } = await req.json();
    const { currentUser } = await serverAuth();

    const post = await prisma.post.create({
      data: {
        body,
        userId: currentUser.id,
      },
    });

    return NextResponse.json(post);
  } catch (error) {
    console.error(error);
    return new NextResponse('Error creating post', { status: 500 });
  }
}
