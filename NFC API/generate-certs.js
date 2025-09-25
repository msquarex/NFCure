const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const certsDir = path.join(__dirname, 'certs');
const keyPath = path.join(certsDir, 'server-key.pem');
const csrPath = path.join(certsDir, 'server.csr');
const certPath = path.join(certsDir, 'server-cert.pem');

function ensureDirExists(dirPath) {
    if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true });
    }
}

function tryOpenSsl() {
    console.log('Generating private key...');
    execSync(`openssl genrsa -out "${keyPath}" 2048`, { stdio: 'inherit' });

    console.log('Generating certificate signing request (CSR)...');
    execSync(
        `openssl req -new -key "${keyPath}" -out "${csrPath}" -subj "/C=US/ST=State/L=City/O=Local Dev/CN=localhost"`,
        { stdio: 'inherit' }
    );

    console.log('Generating self-signed certificate...');
    execSync(
        `openssl x509 -req -days 365 -in "${csrPath}" -signkey "${keyPath}" -out "${certPath}"`,
        { stdio: 'inherit' }
    );

    if (fs.existsSync(csrPath)) {
        fs.unlinkSync(csrPath);
    }
}

function generateWithSelfSigned() {
    console.log('OpenSSL not found. Falling back to Node-based certificate generation...');
    const selfsigned = require('selfsigned');
    const attrs = [{ name: 'commonName', value: 'localhost' }];
    const pems = selfsigned.generate(attrs, {
        days: 365,
        keySize: 2048,
        algorithm: 'sha256'
    });
    fs.writeFileSync(keyPath, pems.private);
    fs.writeFileSync(certPath, pems.cert);
}

function generateCerts() {
    ensureDirExists(certsDir);

    if (fs.existsSync(keyPath) && fs.existsSync(certPath)) {
        console.log('Certificates already exist. Skipping generation.');
        return;
    }

    try {
        tryOpenSsl();
        console.log('SSL certificates generated at ./certs (OpenSSL)');
    } catch (error) {
        try {
            generateWithSelfSigned();
            console.log('SSL certificates generated at ./certs (Node selfsigned)');
        } catch (e) {
            console.error('Failed to generate SSL certificates.');
            console.error('Install OpenSSL or run: npm install selfsigned');
            process.exit(1);
        }
    }
}

generateCerts();


