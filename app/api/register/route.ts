import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import prisma from "@/app/libs/prismadb";
import { z } from "zod";

// Input validation schema
const userSchema = z.object({
    email: z.string().email(),
    username: z.string().min(1),
    name: z.string().min(1),
    password: z.string().min(6),
});

export async function POST(req: Request) {
    try {
        const body = await req.json();

        // Validate input data
        const validatedData = userSchema.parse(body);
        const { email, username, name, password } = validatedData;

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 12);

        // Save the user in the database
        const user = await prisma.user.create({
            data: {
                email,
                username,
                name,
                hashedPassword,
            },
        });

        // Return the created user
        return NextResponse.json(user, { status: 201 });
    } catch (error) {
        if (error instanceof z.ZodError) {
            return NextResponse.json(
                { errors: error.errors },
                { status: 400 }
            );
        }

        console.error("Server Error:", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}
