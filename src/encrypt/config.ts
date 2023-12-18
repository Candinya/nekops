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
// A pair of built-in key
//   2023-12-01: The project's initialize date
//   75f8e...33: The project's initialize commit hash
// using setTimeout to prevent access imported functions before initialization
// setTimeout(async () => {
//   const km = await getKeyMaterial(
//     "Nekops: tweetnacl built-in key @ Nya Candy + 2023-12-01 #75f8e333610f96b4ca9cf407f47132b9c237f133",
//   );
//   const pb = await getPrivateBits(km);
//   const builtInKey = box.keyPair.fromSecretKey(new Uint8Array(pb));
//   console.log(
//     "Built-in key:",
//     arrayBufferToBase64(builtInKey.publicKey),
//     arrayBufferToBase64(builtInKey.secretKey),
//   );
// }, 1000);

// Since it's just a built-in constant, using a constant here.
export const builtInKey: BoxKeyPair = {
  publicKey: base64ToUint8Array("i0oxBNRKEG4f2dJ1jjLbpXGstkukCRhHTmfkMx+6kC8="),
  secretKey: base64ToUint8Array("5gnKfcAX2ewYcDiUNQ0+zu3o2rU1ymiaKtn0XQATtlM="),
};
