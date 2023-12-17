import { keySalt } from "@/encrypt/config.ts";

const encoder = new TextEncoder();

export const getKeyMaterial = (password: string) =>
  crypto.subtle.importKey(
    "raw",
    encoder.encode(password),
    {
      name: "PBKDF2",
    },
    false,
    ["deriveBits"],
  );

export const getPrivateBits = (keyMaterial: CryptoKey) =>
  crypto.subtle.deriveBits(
    {
      name: "PBKDF2",
      hash: "SHA-256",
      salt: keySalt.buffer,
      iterations: 1024,
    },
    keyMaterial,
    256, // 32 bytes
  );
