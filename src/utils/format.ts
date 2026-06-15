import * as CryptoJS from "crypto-js";
import { getConfig } from "./template";

export function formatPrice(price: number) {
  return `${new Intl.NumberFormat("vi-VN").format(price)}đ`;
}

export const safeJsonParse = <T>(
  value: string | null | undefined,
  fallback: T,
): T => {
  try {
    if (!value) return fallback;
    const result = JSON.parse(value) as T;
    return result;
  } catch {
    return fallback;
  }
};

export const parseBrand = (brand = "") => {
  if (!brand) return [];

  return brand
    .split(",")
    .map((item) => item.trim())
    .map((item) => {
      // Case 1: "JJ6:1"
      if (item.includes(":")) {
        return item.split(":")[0].trim();
      }

      // Case 2: "1 - JJ6 - JEX..."
      if (item.includes("-")) {
        const parts = item.split("-").map((p) => p.trim());
        return parts[1]; // middle is product_code
      }

      return null;
    })
    .filter(Boolean);
};
const KEY_IV = getConfig((config) => config.template.KEY_IV);

export const decrypt = (text: any) => {
  try {
    const key = CryptoJS.enc.Utf8.parse(KEY_IV);
    const iv = CryptoJS.enc.Hex.parse(text.iv);

    const cipherParams = CryptoJS.lib.CipherParams.create({
      ciphertext: CryptoJS.enc.Hex.parse(text.encryptedData),
    });
    const decrypted = CryptoJS.AES.decrypt(cipherParams, key, {
      iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7,
    });

    const decryptedText = CryptoJS.enc.Utf8.stringify(decrypted);

    return JSON.parse(decryptedText);
  } catch (error) {
    throw error;
  }
};
