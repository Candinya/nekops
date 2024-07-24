import type { AccessRegular } from "@/types/server.ts";
import type { ShellState } from "@/types/shellState.ts";

export interface SSHSingleServerBase {
  nonce: string;
  name: string;
  color: string;
}

export interface SSHSingleServer extends SSHSingleServerBase {
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

export interface EventResponseTabsListPayloadSingleTab {
  server: SSHSingleServerBase;
  state: ShellState;
  isNewMessage: boolean;
}

export interface EventResponseTabsListPayload {
  tabs: EventResponseTabsListPayloadSingleTab[];
  currentActive: string | null; // Nonce
}
