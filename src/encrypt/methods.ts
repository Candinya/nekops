import { box, randomBytes } from "tweetnacl";
import { arrayBufferToBase64, base64ToUint8Array } from "@/encrypt/helper.ts";
import { builtInKey } from "@/encrypt/config.ts";

const encoder = new TextEncoder();
const decoder = new TextDecoder();

export const rawEncrypt = (publicKey: Uint8Array, rawMessage: string) => {
  const nonce = randomBytes(box.nonceLength);
  const encryptedMessage = box(
    encoder.encode(rawMessage),
    nonce,
    publicKey,
    builtInKey.secretKey,
  );

  const fullMessage = new Uint8Array(nonce.length + encryptedMessage.length);
  fullMessage.set(nonce);
  fullMessage.set(encryptedMessage, nonce.length);

  return arrayBufferToBase64(fullMessage);
};

export const rawDecrypt = (
  privateKey: Uint8Array,
  encryptedMessage: string,
) => {
  const fullMessage = base64ToUint8Array(encryptedMessage);
  const nonce = fullMessage.slice(0, box.nonceLength);
  const encrypted = fullMessage.slice(box.nonceLength);
  const rawMessage = box.open(
    encrypted,
    nonce,
    builtInKey.publicKey,
    privateKey,
  );

  if (rawMessage === null) {
    throw "Decryption failed, message might be corrupted.";
  }

  return decoder.decode(rawMessage);
};
