import type { BoxKeyPair } from "tweetnacl";
import { base64ToUint8Array } from "@/encrypt/helper.ts";

const encoder = new TextEncoder();

/***********************************************
 *                                             *
 *               Key Derive Salt               *
 *                                             *
 ***********************************************/
// We need a salt when deriving private key from password,
// so we can prevent some Credential Stuffing Attack
export const keySalt = encoder.encode("Welcome to Nekops 🥰");

/***********************************************
 *                                             *
 *          tweetnacl.js built-in key          *
 *                                             *
 ***********************************************/
// I have no fucking idea why the fuck tweetnacl.js requires 2 pairs of key,
// and cannot simply implement a x25519 single key pair encryption / decryption algo.
// Anyway, here's a fucking pair of built-in key.

// let builtInKey: BoxKeyPair;
// (async () => {
//   const km = await getKeyMaterial(
//     "Nekops: what's tweetnacl's fucking problem?",
//   );
//   const pb = await getPrivateBits(km);
//   builtInKey = box.keyPair.fromSecretKey(new Uint8Array(pb));
//   console.log(
//     "Built-in key:",
//     arrayBufferToBase64(builtInKey.publicKey),
//     arrayBufferToBase64(builtInKey.secretKey),
//   );
// })();

// Since it's just a built-in constant, using a constant here.
export const builtInKey: BoxKeyPair = {
  publicKey: base64ToUint8Array("H64dcb8Qf05Fj5aZWCH/legQYAFkLhdgv0h1SK6lWDk="),
  secretKey: base64ToUint8Array("/J7QfKTMszFS/V3qWViyrNonEeLvX2tlc0aMqqMVRMc="),
};
