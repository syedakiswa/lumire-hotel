export function getJwtSecret() {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    if (process.env.NODE_ENV === "production" || process.env.VERCEL === "1") {
      throw new Error("JWT_SECRET environment variable is missing in production.");
    }
    console.warn("Notice: JWT_SECRET environment variable is missing. Using local dev secret.");
    return "lumiere_dev_fallback_secret_only";
  }
  return secret;
}
