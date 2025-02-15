// Secure encryption/decryption functions using AES for React Native
import CryptoJS from 'crypto-js';

/**
 * Generate a secure key from the user's UID
 * @param {string} uid - The user's UID
 * @returns {string} The generated encryption key
 */
export function generateEncryptionKey(uid) {
  if (!uid) return '';
  // Use a simpler key derivation for React Native
  const salt = 'VaultPocket_Salt_2025';
  return CryptoJS.SHA256(uid + salt).toString();
}

/**
 * Encrypt data using AES
 * @param {string} data - The data to encrypt
 * @param {string} key - The encryption key
 * @returns {string} The encrypted data
 */
export function encryptData(data, key) {
  try {
    if (!data || !key) return '';
    
    // Generate a static IV based on the key
    const iv = CryptoJS.SHA256(key).toString().substr(0, 16);
    
    // Create encryption parameters
    const encrypted = CryptoJS.AES.encrypt(data, CryptoJS.enc.Utf8.parse(key), {
      iv: CryptoJS.enc.Utf8.parse(iv),
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7
    });
    
    return encrypted.toString();
  } catch (error) {
    console.error('Encryption error:', error);
    return '';
  }
}

/**
 * Decrypt data using AES
 * @param {string} encryptedData - The encrypted data to decrypt
 * @param {string} key - The decryption key
 * @returns {string} The decrypted data
 */
export function decryptData(encryptedData, key) {
  try {
    if (!encryptedData || !key) return '';
    
    // Generate the same IV based on the key
    const iv = CryptoJS.SHA256(key).toString().substr(0, 16);
    
    // Decrypt the data
    const decrypted = CryptoJS.AES.decrypt(encryptedData, CryptoJS.enc.Utf8.parse(key), {
      iv: CryptoJS.enc.Utf8.parse(iv),
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7
    });
    
    return decrypted.toString(CryptoJS.enc.Utf8);
  } catch (error) {
    console.error('Decryption error:', error);
    return '';
  }
}
