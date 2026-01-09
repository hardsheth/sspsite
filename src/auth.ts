import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import axios from "axios"

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
        rememberMe: { label: "Remember Me", type: "checkbox" }
      },
      async authorize(credentials) {
        try {
          const { email, password } = credentials

          // Call external auth API
          const response = await axios.post(
            `${process.env.EXTERNAL_API_URL}/login`,
            { UserName: email, Password: password },
            {
              headers: {
                'Content-Type': 'application/json',
              },
            }
          )

          const { token, refreshToken, data: user } = response.data

          if (!user) {
            throw null;
          }
          console.log(token, `token`, refreshToken, `refreshtoken`, user);
          return {
            id: String((user as any).id),
            email: (user as any).Email || '',
            name: (user as any).UserName || '',
            accessToken: token,
            refreshToken,
          }
        } catch (error) {
          console.error('Auth error:', error)
          return null;
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 60 * 60 * 24,
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.accessToken = (user as any).accessToken
        token.refreshToken = (user as any).refreshToken
      }
      return token
    },
    async session({ session, token }) {
      session.accessToken = token.accessToken as string
      session.refreshToken = token.refreshToken as string
      return session
    },
  },
  pages: {
    signIn: "/login",
  },
})
