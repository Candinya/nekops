import type { AccessRegular } from "@/types/server.ts";

export interface SSHSingleServer {
  nonce: string;
  name: string;
  color: string;
  access: AccessRegular;
  jumpServer?: AccessRegular;
}

export interface EventNewSSHPayload {
  server: SSHSingleServer[];
}

export interface EventSendCommandByNoncePayload {
  nonce: string[];
  command: string;
}
