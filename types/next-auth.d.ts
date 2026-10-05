import "next-auth";
import "next-auth/jwt";

type AppUserRole = "SUPERUSER" | "STAFF";

declare module "next-auth" {
  interface User {
    username: string;
    role: AppUserRole;
  }

  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      username: string;
      role: AppUserRole;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    username: string;
    role: AppUserRole;
  }
}
