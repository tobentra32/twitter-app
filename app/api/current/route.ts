import { NextRequest, NextResponse } from 'next/server';
import serverAuth from '../../libs/serverAuth';

export async function GET(req: NextRequest) {
    try {
        const { currentUser } = await serverAuth(req);

        return NextResponse.json(currentUser, { status: 200 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Something went wrong' }, { status: 400 });
    }
}

export async function POST() {
    return NextResponse.json({ error: 'Method not allowed' }, { status: 405 });
}
