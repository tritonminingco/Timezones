import { DefaultSession } from "next-auth"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      provider?: string
      role?: 'admin' | 'user'
    } & DefaultSession["user"]
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    provider?: string
    role?: 'admin' | 'user'
  }
}
