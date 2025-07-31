// app/api/auth/[...nextauth]/route.ts
import NextAuth from "next-auth";
// Adjust the import path if 'lib/auth' is located at 'src/lib/auth.ts'
import { authOptions } from "../../../lib/auth";


const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
