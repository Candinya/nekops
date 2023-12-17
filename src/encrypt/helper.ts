export const base64ToUint8Array = (base64: string) =>
  new Uint8Array(
    window
      .atob(base64)
      .split("")
      .map((c) => c.charCodeAt(0)),
  );

export const arrayBufferToBase64 = (arrayBuffer: ArrayBuffer) =>
  window.btoa(
    String.fromCharCode.apply(null, Array.from(new Uint8Array(arrayBuffer))),
  );
