export {};

declare global {
  interface CustomJwtSessionClaims {
    membership: Record<string, string>;
  }
}
