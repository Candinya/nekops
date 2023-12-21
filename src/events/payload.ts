import type { AccessRegular } from "@/types/server.ts";

export interface EventNewSSHPayload {
  server: AccessRegular;
}
