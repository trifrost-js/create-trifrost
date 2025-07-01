import {execSync} from 'child_process';
import {readFileSync, writeFileSync, mkdirSync} from 'fs';
import {join, dirname} from 'path';
import {randomBytes} from 'crypto';

function escapePemForEnv(filePath) {
    const lines = readFileSync(filePath, 'utf-8').split('\n');
    return lines
        .map(line => line.trim())
        .filter(Boolean)
        .map(line => line.replace(/"/g, '\\"') + '\\n')
        .join('');
}

/**
 * Generates public/private keypair or HMAC secrets in .env format
 *
 * @param {string} algorithm - 'rs256' | 'rs384' | 'rs512' | 'es256' | 'es384' | 'es512' | 'hs256' | 'hs384' | 'hs512'
 * @param {string} outDir - absolute output directory
 * @param {string} outPath - file name to write to (e.g. keys.env)
 * @param {number} rsaBits - RSA key length (defaults to 2048)
 */
export function generateKeys(algorithm, outDir, outPath, rsaBits = 2048) {
    const keyEnvPath = join(outDir, outPath);
    mkdirSync(dirname(keyEnvPath), {recursive: true});

    // HMAC shared secret — generate UUID and write
    if (algorithm.startsWith('hs')) {
        const sizes = {
            hs256: 32,
            hs384: 48,
            hs512: 64,
        };
        const byteLength = sizes[algorithm] ?? 32;
        const secret = randomBytes(byteLength).toString('base64');
        writeFileSync(keyEnvPath, `SECRET="${secret}"\n`);
        return;
    }

    let privFile = '';
    let pubFile = '';

    if (algorithm.startsWith('rs')) {
        const tmpFile = 'rsa_tmp_pkcs1.pem';
        privFile = `rsa_${algorithm}_pkcs8.pem`;
        pubFile = `rsa_${algorithm}_spki.pem`;

        execSync(`openssl genrsa -out ${tmpFile} ${rsaBits}`);
        execSync(`openssl pkcs8 -topk8 -inform PEM -outform PEM -nocrypt -in ${tmpFile} -out ${privFile}`);
        execSync(`openssl rsa -in ${tmpFile} -pubout -out ${pubFile}`);
        execSync(`rm ${tmpFile}`);
    }

    if (algorithm === 'es256' || algorithm === 'es384' || algorithm === 'es512') {
        const curves = {
            es256: 'prime256v1',
            es384: 'secp384r1',
            es512: 'secp521r1',
        };
        const tmpFile = 'ec_tmp.pem';
        privFile = `${algorithm}_private_pkcs8.pem`;
        pubFile = `${algorithm}_public_spki.pem`;

        execSync(`openssl ecparam -name ${curves[algorithm]} -genkey -noout -out ${tmpFile}`);
        execSync(`openssl pkcs8 -topk8 -inform PEM -outform PEM -nocrypt -in ${tmpFile} -out ${privFile}`);
        execSync(`openssl ec -in ${tmpFile} -pubout -out ${pubFile}`);
        execSync(`rm ${tmpFile}`);
    }

    if (privFile && pubFile) {
        const escapedPriv = escapePemForEnv(privFile);
        const escapedPub = escapePemForEnv(pubFile);
        writeFileSync(keyEnvPath, `PRIVATE_KEY="${escapedPriv}"\nPUBLIC_KEY="${escapedPub}"\n`);
        execSync(`rm ${privFile} ${pubFile}`);
    }
}
