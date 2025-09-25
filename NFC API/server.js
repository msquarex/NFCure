const express = require('express');
const https = require('https');
const fs = require('fs');
const path = require('path');
const cors = require('cors');
const { getSupabaseClient } = require('./src/services/supabaseClient');

const app = express();
const PORT = 3000;
const FORCE_IP = process.env.FORCE_IP; // Allow manual IP override

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Store received NFC data
let nfcData = [];

// Route to receive NFC data from Android
app.post('/api/nfc-data', async (req, res) => {
    const { text, timestamp, deviceInfo } = req.body;
    
    const data = {
        id: Date.now(),
        text: text,
        timestamp: new Date().toISOString(),
        deviceInfo: deviceInfo || 'Unknown Device'
    };
    
    nfcData.unshift(data); // Add to beginning of array
    
    // Keep only last 50 messages
    if (nfcData.length > 50) {
        nfcData = nfcData.slice(0, 50);
    }
    
    console.log('Received NFC data:', data);
    
    // Forward data if forwarding is enabled
    if (forwardingConfig.enabled && forwardingConfig.targetUrl) {
        try {
            const headers = {
                'Content-Type': 'application/json',
                ...forwardingConfig.customHeaders
            };
            
            if (forwardingConfig.apiKey) {
                headers['Authorization'] = forwardingConfig.apiKey.startsWith('Bearer ') 
                    ? forwardingConfig.apiKey 
                    : `Bearer ${forwardingConfig.apiKey}`;
            }
            
            const forwardResponse = await fetch(forwardingConfig.targetUrl, {
                method: 'POST',
                headers: headers,
                body: JSON.stringify(data)
            });
            
            if (forwardResponse.ok) {
                console.log('Data forwarded successfully to:', forwardingConfig.targetUrl);
            } else {
                console.error('Failed to forward data:', forwardResponse.status, forwardResponse.statusText);
            }
        } catch (error) {
            console.error('Error forwarding data:', error);
        }
    }
    
    res.json({ success: true, message: 'NFC data received successfully' });
});

// Route to get all NFC data
app.get('/api/nfc-data', (req, res) => {
    res.json(nfcData);
});

// Route to clear all NFC data
app.delete('/api/nfc-data', (req, res) => {
    nfcData = [];
    res.json({ success: true, message: 'All NFC data cleared' });
});

// Forwarding configuration storage
let forwardingConfig = {
    enabled: false,
    targetUrl: '',
    apiKey: '',
    customHeaders: {}
};

// Route to get forwarding configuration
app.get('/api/forwarding-config', (req, res) => {
    res.json(forwardingConfig);
});

// Route to save forwarding configuration
app.post('/api/forwarding-config', (req, res) => {
    const { enabled, targetUrl, apiKey, customHeaders } = req.body;
    
    forwardingConfig = {
        enabled: enabled || false,
        targetUrl: targetUrl || '',
        apiKey: apiKey || '',
        customHeaders: customHeaders || {}
    };
    
    console.log('Forwarding configuration updated:', forwardingConfig);
    res.json({ success: true, message: 'Configuration saved' });
});

// Route to test forwarding
app.post('/api/test-forwarding', async (req, res) => {
    if (!forwardingConfig.enabled || !forwardingConfig.targetUrl) {
        return res.json({ success: false, error: 'Forwarding not configured' });
    }
    
    try {
        const testData = {
            text: 'Test NFC data from NFCure',
            deviceInfo: 'Test Device',
            timestamp: new Date().toISOString(),
            test: true
        };
        
        const headers = {
            'Content-Type': 'application/json',
            ...forwardingConfig.customHeaders
        };
        
        if (forwardingConfig.apiKey) {
            headers['Authorization'] = forwardingConfig.apiKey.startsWith('Bearer ') 
                ? forwardingConfig.apiKey 
                : `Bearer ${forwardingConfig.apiKey}`;
        }
        
        const response = await fetch(forwardingConfig.targetUrl, {
            method: 'POST',
            headers: headers,
            body: JSON.stringify(testData)
        });
        
        if (response.ok) {
            res.json({ success: true, message: 'Test data forwarded successfully' });
        } else {
            res.json({ success: false, error: `HTTP ${response.status}: ${response.statusText}` });
        }
    } catch (error) {
        console.error('Forwarding test failed:', error);
        res.json({ success: false, error: error.message });
    }
});



// Serve the main page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Serve the sender page
app.get('/sender', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'sender.html'));
});

// Create HTTPS server
// Ensure certs exist with helpful error
const certKeyPath = path.join(__dirname, 'certs', 'server-key.pem');
const certCertPath = path.join(__dirname, 'certs', 'server-cert.pem');

if (!fs.existsSync(certKeyPath) || !fs.existsSync(certCertPath)) {
    console.error('ERROR: SSL certificates not found in ./certs');
    console.error('Run "npm run generate-certs" or "setup.bat" to create them.');
    process.exit(1);
}

const options = {
    key: fs.readFileSync(certKeyPath),
    cert: fs.readFileSync(certCertPath)
};

const server = https.createServer(options, app);

server.listen(PORT, '0.0.0.0', () => {
    // If FORCE_IP is set, use it directly
    if (FORCE_IP) {
        console.log(`HTTPS Server running on https://${FORCE_IP}:${PORT}`);
        console.log('Open this URL in Chrome on your laptop to receive NFC data');
        console.log('Make sure to accept the self-signed certificate warning');
        return;
    }
    
    const os = require('os');
    const interfaces = os.networkInterfaces();
    let localIp = 'localhost';
    let preferredIp = null;
    
    // First, try to find your actual network IP (10.x.x.x range)
    for (const name of Object.keys(interfaces)) {
        for (const net of interfaces[name]) {
            if (net.family === 'IPv4' && !net.internal) {
                // Prefer 10.x.x.x addresses (your actual network)
                if (net.address.startsWith('192.168.229.14')) {
                    preferredIp = net.address;
                    break;
                }
                // Fallback to any non-internal IP
                if (!localIp || localIp === 'localhost') {
                    localIp = net.address;
                }
            }
        }
        if (preferredIp) break;
    }
    
    // Use preferred IP if found, otherwise use fallback
    const finalIp = preferredIp || localIp;
    
    console.log(`HTTPS Server running on https://${finalIp}:${PORT}`);
    console.log('Open this URL in Chrome on your laptop to receive NFC data');
    console.log('Make sure to accept the self-signed certificate warning');
    
    // Also log all available IPs for debugging
    console.log('\nAvailable network interfaces:');
    for (const name of Object.keys(interfaces)) {
        for (const net of interfaces[name]) {
            if (net.family === 'IPv4' && !net.internal) {
                console.log(`  ${name}: ${net.address}`);
            }
        }
    }
});

// Handle graceful shutdown
process.on('SIGINT', () => {
    console.log('\nShutting down server...');
    server.close(() => {
        console.log('Server closed');
        process.exit(0);
    });
});
