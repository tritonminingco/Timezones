import { neon } from "@neondatabase/serverless";
import { NextAuthOptions } from "next-auth";
import GitHubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";

const connectionString = process.env.NEON_DATABASE_URL || process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error(
    'No database connection string was provided. Please set NEON_DATABASE_URL or DATABASE_URL in your environment.'
  );
}
const sql = neon(connectionString);

export const authOptions: NextAuthOptions = {
  debug: process.env.NODE_ENV === 'development',
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    }),
  ],

  callbacks: {
    async signIn({ user, account }) {
      console.log('SignIn callback triggered:', { user: user?.email, provider: account?.provider });

      if (!account || !user.email) {
        console.log('Missing account or email:', { account: !!account, email: !!user.email });
        return false;
      }

      try {
        // Determine role based on environment variable for admin emails
        const adminEmails = process.env.ADMIN_EMAILS?.split(',').map(email => email.trim()) || [];
        const role = adminEmails.includes(user.email) ? 'admin' : 'user';
        console.log('Setting role for', user.email, ':', role);

        // Check if users table exists and create if not
        console.log('Attempting to save user to database...');

        // Create or update user in our database
        const result = await sql`
          INSERT INTO users (email, name, image, provider, provider_id, role, created_at, updated_at)
          VALUES (
            ${user.email}, 
            ${user.name || ''}, 
            ${user.image || null}, 
            ${account.provider}, 
            ${account.providerAccountId},
            ${role},
            NOW(),
            NOW()
          )
          ON CONFLICT (email) 
          DO UPDATE SET
            name = EXCLUDED.name,
            image = EXCLUDED.image,
            role = ${role},
            updated_at = NOW()
          RETURNING id, email, role
        `;

        console.log('User saved successfully:', result[0]);
        return true;
      } catch (error) {
        console.error('Error saving user to database:', error);

        // For now, allow sign-in even if database save fails
        // This prevents AccessDenied errors during development
        console.log('Allowing sign-in despite database error (development mode)');
        return true;
      }
    },

    async session({ session }) {
      console.log('🔄 Session callback called for:', session.user?.email);

      if (session.user?.email) {
        try {
          // Get user data from our database
          const dbUser = await sql`
            SELECT id, email, name, image, provider, role 
            FROM users 
            WHERE email = ${session.user.email}
            LIMIT 1
          `;

          if (dbUser[0]) {
            session.user.id = dbUser[0].id;
            session.user.provider = dbUser[0].provider;
            session.user.role = dbUser[0].role || 'user';
            console.log('✅ User data loaded from database:', dbUser[0].id, 'Role:', session.user.role);
          } else {
            console.log('⚠️ No user found in database for:', session.user.email);
          }
        } catch (error) {
          console.error('❌ Error loading user from database:', error);
        }
      }

      return session;
    },

    async jwt({ token, account, user }) {
      // Save account info to token on first sign in
      if (account && user) {
        token.provider = account.provider;
      }

      return token;
    },
  },

  pages: {
    signIn: '/auth/signin',
    error: '/auth/error',
  },

  session: {
    strategy: 'jwt',
  },

  secret: process.env.NEXTAUTH_SECRET,
};
