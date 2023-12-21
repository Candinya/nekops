import type { Server } from "@/types/server.ts";

export interface EventNewSSHPayload {
  server: Server;
}
