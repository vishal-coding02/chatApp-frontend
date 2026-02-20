import CryptoJS from "crypto-js";

const SECRET_KEY = import.meta.env.VITE_SECRET_KEY;

export const encryptMessage = (message: string) => {
  const encrypted = CryptoJS.AES.encrypt(message, SECRET_KEY).toString();
  return encrypted;
};

export const decryptMessage = (cipherText: string) => {
  const bytes = CryptoJS.AES.decrypt(cipherText, SECRET_KEY);
  const originalText = bytes.toString(CryptoJS.enc.Utf8);
  return originalText;
};
