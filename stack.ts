import { StackClientApp } from "@stackframe/stack";

// Initialize Stack Auth dengan project ID Anda
export const stackApp = new StackClientApp({
  projectId: "0ecf147b-389f-4d64-b1ba-c27b528838d9",
  // publishableClientKey akan diambil dari environment variable
  // atau bisa langsung hardcode jika diperlukan
});
