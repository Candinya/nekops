import type { AccessRegular } from "@/types/server.ts";

export interface EventNewSSHPayload {
  nonce: string;
  name: string;
  color: string;
  access: AccessRegular;
}
