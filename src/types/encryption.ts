export interface EncryptionState {
  publicKeyBase64?: string;
  privateKeyBase64?: string;

  // State
  isEncryptionEnabled: boolean;
  isUnlocked: boolean;
}
