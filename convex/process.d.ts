// Declares the process.env global for Convex functions.
// Convex makes environment variables available via process.env at runtime,
// but the Convex tsconfig doesn't include @types/node, so we declare it here.
declare const process: {
  env: Record<string, string | undefined>
}
