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
          console.log(credentials, `credentials auth`);
          
          const { email, password } = credentials

          // Call external auth API
          const response = await axios.post(
            `${process.env.EXTERNAL_API_URL}/login`,
            { email, password },
            {
              headers: {
                'Content-Type': 'application/json',
              },
            }
          )
          console.log(response.data, `auth response`);
          
          const { accessToken, refreshToken, user } = response.data

          if (user) {
            return {
              id: user.id,
              email: user.email,
              name: user.name,
              accessToken,
              refreshToken,
            }
          }

          return null
        } catch (error) {
          console.error('Auth error:', error)
          return null
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.accessToken = user.accessToken
        token.refreshToken = user.refreshToken
      }
      return token
    },
    async session({ session, token }) {
      session.accessToken = token.accessToken
      session.refreshToken = token.refreshToken
      return session
    },
  },
  pages: {
    signIn: "/login",
  },
})
