import { AES, enc } from 'crypto-js';

// import crypto from 'crypto';

const key = 'X5mUl3J1jneCd0adISoHWDTj7U8Rnhvd'; // The secret key (256-bit key)
const iv = enc.Hex.parse('1111111245683783'); // The initialization vector (16 bytes for AES CBC)
// const iv = '1111111245683783'
const encoding = 'utf8'

const aes = {
    encrypt: (plainData) => {
        const data = JSON.stringify(plainData);

        /**THE ABOVE BOTH SECRET KEY AND IV SHOULD WILL BE DIFFERENT FOR EACH RETAILER */

        return AES.encrypt(data, key, { iv }).toString();
    },
    decrypt: (encryptedData) => {
        // const decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);
        // let decrypted = decipher.update(encryptedData, 'hex', encoding);
        // decrypted += decipher.final(encoding);
        // return decrypted;

        const decrypted = AES.decrypt(encryptedData, key, { iv: iv });
        return decrypted.toString(enc.Utf8);
    }
}

export default aes