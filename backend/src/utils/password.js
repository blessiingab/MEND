const crypto = require('crypto');
const { promisify } = require('util');

const scrypt = promisify(crypto.scrypt);
const KEY_LENGTH = 64;

async function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString('hex');
  const derivedKey = await scrypt(password, salt, KEY_LENGTH);

  return `scrypt$${salt}$${Buffer.from(derivedKey).toString('hex')}`;
}

async function verifyPassword(password, storedHash) {
  if (!storedHash || typeof storedHash !== 'string') {
    return false;
  }

  const [algorithm, salt, keyHex] = storedHash.split('$');
  if (algorithm !== 'scrypt' || !salt || !keyHex) {
    return false;
  }

  const derivedKey = await scrypt(password, salt, KEY_LENGTH);
  const storedKey = Buffer.from(keyHex, 'hex');
  const candidateKey = Buffer.from(derivedKey);

  if (storedKey.length !== candidateKey.length) {
    return false;
  }

  return crypto.timingSafeEqual(storedKey, candidateKey);
}

module.exports = {
  hashPassword,
  verifyPassword
};
