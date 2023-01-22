import "next-auth/jwt";

declare module "next-auth/jwt" {
  interface JWT {
    name: string;
    email: string;
    picture: string;
    sub: string;
    user: {
      id: string;
      name?: string;
      email?: string;
      emailVerified?: boolean;
      image?: string;
    } | AdapterUser;
    accessToken: string;
    iat: number;
    exp: number;
    jti: string;
  }
}
