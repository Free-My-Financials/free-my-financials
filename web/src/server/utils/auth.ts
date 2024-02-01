import { Lucia } from "lucia";
import { GitHub } from "arctic";
import { PrismaAdapter } from "@lucia-auth/adapter-prisma";
import prisma from "./prisma";

const adapter = new PrismaAdapter(prisma.session, prisma.user);

export const github = new GitHub(process.env.GITHUB_CLIENT_ID!, process.env.GITHUB_CLIENT_SECRET!);

export const lucia = new Lucia(adapter, {
  sessionCookie: {
    attributes: {
      secure: !import.meta.dev
    }
  },
  getUserAttributes: (attributes) => {
    return {
      // attributes has the type of DatabaseUserAttributes
      githubId: attributes.githubId,
      username: attributes.username
    };
  }
});

declare module "lucia" {
  interface Register {
    Lucia: typeof lucia;
    DatabaseUserAttributes: DatabaseUserAttributes;
  }
}

interface DatabaseUserAttributes {
  githubId: number;
  username: string;
}
