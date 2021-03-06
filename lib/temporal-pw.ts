import Base58 from 'bs58';
import aesjs from 'aes-js';
import Hashes from 'jshashes';
import { Buffer } from 'safe-buffer';

export async function storeCipher(cipher: string, days: number, myIp = false): Promise<string> {
  const params = new URLSearchParams([
    ['cipher', cipher],
    ['days', `${+days}`],
    ['myiponly', myIp ? 'true' : 'false']
  ]);

  const response = await fetch('https://temporal.pw/new', {
    method: 'POST',
    body: params
  });

  return (await response.json()).pw_id;
}

export async function fetchCipher(cipher_id: string): Promise<string> {
  const response = await fetch(`https://temporal.pw/get/${cipher_id}`);

  return (await response.json()).cipher;
}


export function encrypt(secret: string) {
  const key = new Uint8Array(16);

  crypto.getRandomValues(key);  // generate random 128 bit AES key

  // encode key byte array ..
  var encoded_key = Base58.encode(new Buffer(key));

  // convert password string to byte array, never send this to the server unencrypted ..
  var password_bytes = aesjs.utils.utf8.toBytes(secret);

  // encrypt password ..
  var aesCtr = new aesjs.ModeOfOperation.ctr(key, new aesjs.Counter(5));
  var encrypted_bytes = aesCtr.encrypt(password_bytes);

  // encode encrypted password ..
  var cipher = Base58.encode(new Buffer(encrypted_bytes));

  return [cipher, encoded_key];
};

export function decrypt(cipher, key) {
  var decoded_encrypted_bytes = Base58.decode( new Buffer(cipher) );
               
  // decode key ..
  var decoded_key = Base58.decode( new Buffer(key) );
  
  // decrypt decoded password with decoded key ..
  var aesCtr = new aesjs.ModeOfOperation.ctr( decoded_key, new aesjs.Counter( 5 ) );
  var decrypted_bytes = aesCtr.decrypt( decoded_encrypted_bytes );
  
  // Convert our bytes back into text
  return  aesjs.utils.utf8.convertBytesToString( decrypted_bytes );
}

export function createUrl(cipher_id, encoded_key) {
  const SHA256 = new Hashes.SHA256;
  const token = `${cipher_id}-${encoded_key}`;
  const url = new URL(location.href);
  return `${url.protocol}//${url.host}/#/p/${token}${SHA256.hex(token).substr(0, 2)}`;
}
