// Using tweetnacl.js before Web Crypto API supports cv25519 or use a rust implementation later
// https://github.com/dchest/tweetnacl-js#secret-key-authenticated-encryption-secretbox

import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { RootState } from "@/store.ts";
import {
  exists,
  readTextFile,
  remove,
  writeTextFile,
} from "@tauri-apps/plugin-fs";
import { box, verify } from "tweetnacl";
import { checkParentDir } from "@/slices/common.ts";
import { getKeyMaterial, getPrivateBits } from "@/encrypt/keyHandler.ts";
import { arrayBufferToBase64, base64ToUint8Array } from "@/encrypt/helper.ts";
import type { Server } from "@/types/server.ts";
import { rawDecrypt, rawEncrypt } from "@/encrypt/methods.ts";
import type { EncryptionState } from "@/types/encryption.ts";
import { path } from "@tauri-apps/api";

const PublicKeyFile = "public.key";

const noEncryption: EncryptionState = {
  isEncryptionEnabled: false,
  isUnlocked: true,
};

export const readEncryption = createAsyncThunk(
  "encryption/read",
  async (_, { getState }): Promise<EncryptionState> => {
    const state = getState() as RootState;
    const publicKeyFilePath = await path.join(
      state.settings.current_workspace.data_dir,
      PublicKeyFile,
    );
    if (await exists(publicKeyFilePath)) {
      // Read and parse
      const publicKeyFile = await readTextFile(publicKeyFilePath);
      return {
        publicKeyBase64: publicKeyFile,
        privateKeyBase64: undefined,

        isEncryptionEnabled: true,
        isUnlocked: false,
      };
    } else {
      return noEncryption;
    }
  },
);

export const updatePassword = createAsyncThunk(
  "encryption/update",
  async (password: string, { getState }): Promise<EncryptionState> => {
    const state: any = getState() as RootState;

    if (!state.encryption.isUnlocked) {
      throw "Please unlock first";
    }

    const publicKeyFilePath = await path.join(
      state.settings.current_workspace.data_dir,
      PublicKeyFile,
    );
    if (password === "") {
      // Disable encryption
      if (await exists(publicKeyFilePath)) {
        await remove(publicKeyFilePath);
      }
      return noEncryption;
    }
    const km = await getKeyMaterial(password);
    const pb = await getPrivateBits(km);
    const keyPair = box.keyPair.fromSecretKey(new Uint8Array(pb));

    const newEncryptionState = {
      publicKeyBase64: arrayBufferToBase64(keyPair.publicKey),
      privateKeyBase64: arrayBufferToBase64(keyPair.secretKey),

      isEncryptionEnabled: true,
      isUnlocked: true,
    };

    // Save public key into file
    await checkParentDir(state.settings.current_workspace.data_dir);
    await writeTextFile(publicKeyFilePath, newEncryptionState.publicKeyBase64);

    return newEncryptionState;
  },
);

export const unlock = createAsyncThunk(
  "encryption/unlock",
  async (password: string, { getState }): Promise<EncryptionState> => {
    const state: any = getState() as RootState;

    if (state.encryption.isUnlocked) {
      // Already unlocked
      return state.encryption;
    }

    const km = await getKeyMaterial(password);
    const pb = await getPrivateBits(km);
    const keyPair = box.keyPair.fromSecretKey(new Uint8Array(pb));

    if (
      verify(
        keyPair.publicKey,
        base64ToUint8Array(state.encryption.publicKeyBase64),
      )
    ) {
      return {
        publicKeyBase64: arrayBufferToBase64(keyPair.publicKey),
        privateKeyBase64: arrayBufferToBase64(keyPair.secretKey),

        isEncryptionEnabled: true,
        isUnlocked: true,
      };
    } else {
      // Wrong password, nothing changed
      // return state.encryption;
      throw new Error("Password mismatch");
    }
  },
);

export const encrypt = (state: EncryptionState, rawMessage: string) => {
  if (!state.isEncryptionEnabled) {
    return rawMessage; // Skip encryption
  }

  return rawEncrypt(base64ToUint8Array(state.publicKeyBase64!), rawMessage);
};

export const decrypt = (state: EncryptionState, encryptedMessage: string) => {
  if (!state.isUnlocked) {
    throw "Please unlock first";
  }

  if (!state.isEncryptionEnabled) {
    return encryptedMessage; // Actually not encrypted
  }

  return rawDecrypt(
    base64ToUint8Array(state.privateKeyBase64!),
    encryptedMessage,
  );
};

export const encryptServer = (
  state: EncryptionState,
  newServerInfo: Server,
  oldServerInfo?: Server,
): Server => {
  if (!state.isEncryptionEnabled) {
    return newServerInfo; // Skip encryption
  }

  const encryptedServerInfo = structuredClone(newServerInfo);
  // Encrypt sensitive fields:
  //   - access.emergency.root_password
  //   - access.emergency.address
  //   - access.emergency.username
  //   - access.emergency.password

  //// access.emergency.root_password
  if (
    newServerInfo.access.emergency.root_password !== "" &&
    newServerInfo.access.emergency.root_password !==
      oldServerInfo?.access.emergency.root_password
  ) {
    encryptedServerInfo.access.emergency.root_password = encrypt(
      state,
      newServerInfo.access.emergency.root_password,
    );
  }

  //// access.emergency.address
  if (
    newServerInfo.access.emergency.address !== "" &&
    newServerInfo.access.emergency.address !==
      oldServerInfo?.access.emergency.address
  ) {
    encryptedServerInfo.access.emergency.address = encrypt(
      state,
      newServerInfo.access.emergency.address,
    );
  }

  //// access.emergency.username
  if (
    newServerInfo.access.emergency.username !== "" &&
    newServerInfo.access.emergency.username !==
      oldServerInfo?.access.emergency.username
  ) {
    encryptedServerInfo.access.emergency.username = encrypt(
      state,
      newServerInfo.access.emergency.username,
    );
  }

  //// access.emergency.password
  if (
    newServerInfo.access.emergency.password !== "" &&
    newServerInfo.access.emergency.password !==
      oldServerInfo?.access.emergency.password
  ) {
    encryptedServerInfo.access.emergency.password = encrypt(
      state,
      newServerInfo.access.emergency.password,
    );
  }

  return encryptedServerInfo;
};

export const decryptServer = (
  state: EncryptionState,
  encryptedServerInfo: Server,
): Server => {
  if (!state.isEncryptionEnabled) {
    return encryptedServerInfo; // Actually not encrypted
  }

  const serverInfo = structuredClone(encryptedServerInfo);
  if (encryptedServerInfo.access.emergency.root_password !== "") {
    serverInfo.access.emergency.root_password = decrypt(
      state,
      encryptedServerInfo.access.emergency.root_password,
    );
  }
  if (encryptedServerInfo.access.emergency.address !== "") {
    serverInfo.access.emergency.address = decrypt(
      state,
      encryptedServerInfo.access.emergency.address,
    );
  }
  if (encryptedServerInfo.access.emergency.username !== "") {
    serverInfo.access.emergency.username = decrypt(
      state,
      encryptedServerInfo.access.emergency.username,
    );
  }
  if (encryptedServerInfo.access.emergency.password !== "") {
    serverInfo.access.emergency.password = decrypt(
      state,
      encryptedServerInfo.access.emergency.password,
    );
  }

  return serverInfo;
};

export const encryptionSlice = createSlice({
  name: "encryption",
  initialState: noEncryption,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(readEncryption.fulfilled, (_, action) => action.payload);
    builder.addCase(updatePassword.fulfilled, (_, action) => action.payload);
    builder.addCase(unlock.fulfilled, (_, action) => action.payload);
  },
});

export const {} = encryptionSlice.actions;

export default encryptionSlice.reducer;
