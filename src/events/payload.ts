import type { AccessRegular } from "@/types/server.ts";

export interface EventNewSSHPayload {
  nonce: string;
  server: AccessRegular;
}
