// app/api/user/update/route.ts
import {NextRequest, NextResponse } from 'next/server';
import prisma from '../../libs/prismadb';
import serverAuth from '../../libs/serverAuth';


export async function PATCH(req: NextRequest) {
  try {
    const { currentUser } = await serverAuth();

    const body = await req.json();
    const { name, username, bio, profileImage, coverImage } = body;

    if (!name || !username) {
      return new NextResponse('Missing fields', { status: 400 });
    }

    const updatedUser = await prisma.user.update({
      where: {
        id: currentUser.id,
      },
      data: {
        name,
        username,
        bio,
        profileImage,
        coverImage,
      },
    });

    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error('[USER_UPDATE_ERROR]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}
