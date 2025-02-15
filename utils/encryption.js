// Simple encryption/decryption functions that work in React Native
const generateKey = (text) => {
  let key = 0;
  for (let i = 0; i < text.length; i++) {
    key += text.charCodeAt(i);
  }
  return key.toString(16);
};

// Generate a deterministic key from the user's UID
export const generateEncryptionKey = (uid) => {
  if (!uid) return '';
  return generateKey(uid + 'VaultPocket_Salt_2025');
};

// Simple XOR encryption
const xorEncrypt = (text, key) => {
  let result = '';
  for (let i = 0; i < text.length; i++) {
    const charCode = text.charCodeAt(i) ^ key.charCodeAt(i % key.length);
    result += String.fromCharCode(charCode);
  }
  return result;
};

// Convert text to base64
const toBase64 = (text) => {
  try {
    return btoa(text);
  } catch (e) {
    // For React Native
    return Buffer.from(text, 'binary').toString('base64');
  }
};

// Convert base64 to text
const fromBase64 = (text) => {
  try {
    return atob(text);
  } catch (e) {
    // For React Native
    return Buffer.from(text, 'base64').toString('binary');
  }
};

// Encrypt data
export const encryptData = (data, key) => {
  try {
    if (!data || !key) return '';
    const encrypted = xorEncrypt(data, key);
    return toBase64(encrypted);
  } catch (error) {
    console.error('Encryption error:', error);
    return '';
  }
};

// Decrypt data
export const decryptData = (encryptedData, key) => {
  try {
    if (!encryptedData || !key) return '';
    const decrypted = fromBase64(encryptedData);
    return xorEncrypt(decrypted, key); // XOR is its own inverse
  } catch (error) {
    console.error('Decryption error:', error);
    return '';
  }
};
