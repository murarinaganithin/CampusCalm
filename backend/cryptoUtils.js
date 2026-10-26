const crypto = require('crypto');

// 32-byte key for AES-256
const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY 
  ? Buffer.from(process.env.ENCRYPTION_KEY, 'hex') 
  : crypto.createHash('sha256').update('saathi-wellness-campus-secret-key-2026').digest();

const ALGORITHM = 'aes-256-cbc';

/**
 * Encrypts raw text using AES-256-CBC
 * @param {string} text 
 * @returns {{ encryptedData: string, iv: string }}
 */
function encryptText(text) {
  if (!text) return { encryptedData: '', iv: '' };
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(ALGORITHM, ENCRYPTION_KEY, iv);
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return {
    encryptedData: encrypted,
    iv: iv.toString('hex')
  };
}

/**
 * Decrypts AES-256-CBC encrypted data
 * @param {string} encryptedData 
 * @param {string} ivHex 
 * @returns {string}
 */
function decryptText(encryptedData, ivHex) {
  if (!encryptedData || !ivHex) return '';
  try {
    const iv = Buffer.from(ivHex, 'hex');
    const decipher = crypto.createDecipheriv(ALGORITHM, ENCRYPTION_KEY, iv);
    let decrypted = decipher.update(encryptedData, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
  } catch (err) {
    console.error('Decryption error:', err.message);
    return '[Encrypted Entry - Unable to decrypt]';
  }
}

module.exports = {
  encryptText,
  decryptText
};
