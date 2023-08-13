import * as crypto from 'crypto';

function getCurrentDateTime(): string {
    const now = new Date();
    const year = now.getFullYear().toString();
    const month = (now.getMonth() + 1).toString().padStart(2, '0');
    const day = now.getDate().toString().padStart(2, '0');
    const hour = now.getHours().toString().padStart(2, '0');
    const minute = now.getMinutes().toString().padStart(2, '0');
    const second = now.getSeconds().toString().padStart(2, '0');

    return `${year}/${month}/${day} ${hour}:${minute}:${second}`;
}

function generateHash(input: string): string {
    const hash = crypto.createHash('sha256');
    hash.update(input);
    const fullHash = hash.digest('hex');
    const shortHash = fullHash.substring(0, 8);
    return shortHash;
}

function generateUniqueGroupId(userId: string): string {
    const hash = generateHash(userId + getCurrentDateTime());
    return hash;
}

export default {
    generateUniqueGroupId
}