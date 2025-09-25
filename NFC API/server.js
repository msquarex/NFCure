const express = require('express');
const https = require('https');
const fs = require('fs');
const path = require('path');
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js');
const GroqService = require('./src/services/groqService');

const app = express();
const PORT = 3000;
const FORCE_IP = process.env.FORCE_IP; // Allow manual IP override

// Initialize Supabase client
const supabaseUrl = 'https://iwimyejbwedasqzmnsnb.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml3aW15ZWpid2VkYXNxem1uc25iIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc5MTc1MzIsImV4cCI6MjA3MzQ5MzUzMn0.iZ4oQKXnyGEMjY38Ptpj50mJP5C2AA-Ngn4CN3IVTO4';
const supabase = createClient(supabaseUrl, supabaseKey);

// Initialize Groq service
const groqService = new GroqService();

// Middleware
app.use(cors());
app.use(express.json());

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

// Test endpoint
app.get('/api/test', (req, res) => {
    res.json({ message: 'Server is working!', timestamp: new Date().toISOString() });
});

// Route to fetch patient data and generate report with AI summary
app.post('/api/report', async (req, res) => {
    console.log('Report endpoint hit!', req.body);
    try {
        const { patientId, includeAISummary = true } = req.body;
        
        if (!patientId) {
            console.log('No patient ID provided');
            return res.status(400).json({ error: 'Patient ID is required' });
        }
        
        console.log('Fetching patient data for ID:', patientId);
        
        // Fetch patient data from Supabase
        const { data: patient, error } = await supabase
            .from('patients')
            .select('*')
            .eq('patient_id', patientId)
            .single();
        
        if (error) {
            console.error('Supabase error:', error);
            return res.status(404).json({ error: 'Patient not found' });
        }
        
        if (!patient) {
            return res.status(404).json({ error: 'Patient not found' });
        }
        
        // Generate comprehensive medical report
        const report = generateMedicalReport(patient);
        
        let aiSummary = null;
        
        // Generate AI summary if requested
        if (includeAISummary) {
            try {
                console.log('Generating AI summary for patient:', patientId);
                aiSummary = await groqService.generateMedicalSummary(patient, report);
                console.log('AI summary generated successfully');
            } catch (aiError) {
                console.error('Error generating AI summary:', aiError);
                // Continue without AI summary rather than failing the entire request
                aiSummary = {
                    error: 'AI summary generation failed',
                    message: aiError.message,
                    patientId: patientId
                };
            }
        }
        
        const response = {
            success: true,
            report,
            patient,
            aiSummary
        };
        
        res.json(response);
        
    } catch (error) {
        console.error('Error generating report:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Route to get quick risk assessment for a patient
app.post('/api/risk-assessment', async (req, res) => {
    console.log('Risk assessment endpoint hit!', req.body);
    try {
        const { patientId } = req.body;
        
        if (!patientId) {
            return res.status(400).json({ error: 'Patient ID is required' });
        }
        
        // Fetch patient data from Supabase
        const { data: patient, error } = await supabase
            .from('patients')
            .select('*')
            .eq('patient_id', patientId)
            .single();
        
        if (error || !patient) {
            return res.status(404).json({ error: 'Patient not found' });
        }
        
        // Generate risk assessment
        const riskAssessment = await groqService.generateRiskAssessment(patient);
        
        res.json({ 
            success: true, 
            patientId,
            riskAssessment,
            generatedAt: new Date().toISOString()
        });
        
    } catch (error) {
        console.error('Error generating risk assessment:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Function to generate medical report
function generateMedicalReport(patient) {
    const formatValue = (value, unit = '') => {
        if (value === null || value === undefined) return 'Not recorded';
        return `${value}${unit}`;
    };
    
    const formatBoolean = (value) => {
        if (value === null || value === undefined) return 'Not recorded';
        return value ? 'Yes' : 'No';
    };
    
    const formatDate = (date) => {
        if (!date) return 'Not recorded';
        return new Date(date).toLocaleDateString();
    };
    
    return `
═══════════════════════════════════════════════════════════════
                    PATIENT MEDICAL REPORT
═══════════════════════════════════════════════════════════════

PATIENT INFORMATION:
──────────────────
Patient ID: ${patient.patient_id}
Name: ${formatValue(patient.name)}
Age: ${formatValue(patient.age, ' years')}
Gender: ${patient.gender === 1 ? 'Male' : patient.gender === 0 ? 'Female' : 'Not specified'}
BMI: ${formatValue(patient.bmi, ' kg/m²')}
Record Created: ${formatDate(patient.created_at)}

VITAL SIGNS:
───────────
Blood Pressure:
  • Resting BP: ${formatValue(patient.restbp, ' mmHg')}
  • Systolic BP: ${formatValue(patient.systolic_bp, ' mmHg')}
  • Diastolic BP: ${formatValue(patient.diastolic_bp, ' mmHg')}
  • High BP: ${formatBoolean(patient.highbp)}

Heart Rate: ${formatValue(patient.heart_rate, ' bpm')}

LABORATORY VALUES:
────────────────
Cholesterol:
  • Total Cholesterol: ${formatValue(patient.cholesterol, ' mg/dL')}
  • LDL: ${formatValue(patient.ldl, ' mg/dL')}
  • HDL: ${formatValue(patient.hdl, ' mg/dL')}
  • High Cholesterol: ${formatBoolean(patient.highchol)}
  • Cholesterol Check: ${formatBoolean(patient.cholcheck)}

Triglycerides: ${formatValue(patient.triglycerides, ' mg/dL')}
Glucose: ${formatValue(patient.glucose, ' mg/dL')}

LIFESTYLE FACTORS:
────────────────
Smoking Status: ${formatValue(patient.smoking_status)}
Smoker: ${formatBoolean(patient.smoker)}
Alcohol Intake: ${formatValue(patient.alcohol_intake, ' units/week')}
Heavy Alcohol Consumption: ${formatBoolean(patient.hvyalcoholconsump)}

Physical Activity:
  • Activity Level: ${formatValue(patient.physical_activity_level)}
  • Physically Active: ${formatBoolean(patient.physactivity)}

Diet:
  • Fruits: ${formatValue(patient.fruits, ' servings/day')}
  • Vegetables: ${formatValue(patient.veggies, ' servings/day')}

Sleep Duration: ${formatValue(patient.sleep_duration, ' hours/night')}
Salt Intake: ${formatValue(patient.salt_intake, ' g/day')}

HEALTH CONDITIONS:
────────────────
Diabetes: ${formatBoolean(patient.diabetes)}
Stroke: ${formatBoolean(patient.stroke)}
Heart Disease/Attack: ${formatBoolean(patient.heartdiseaseorattack)}
Difficulty Walking: ${formatBoolean(patient.diffwalk)}

Family History: ${formatBoolean(patient.family_history)}

MENTAL HEALTH:
─────────────
Stress Level: ${formatValue(patient.stress_level, '/10')}
Mental Health: ${formatValue(patient.menthlth, '/30')}
Physical Health: ${formatValue(patient.physhlth, '/30')}
General Health: ${formatValue(patient.genhlth, '/5')}

CARDIAC ASSESSMENT:
─────────────────
Chest Pain: ${formatValue(patient.chestpain, '/4')}
Rest ECG: ${formatValue(patient.restecg, '/2')}
Exercise Angina: ${formatValue(patient.exang, '/1')}
ST Depression: ${formatValue(patient.st_depression, ' mm')}
ST Slope: ${formatValue(patient.st_slope, '/3')}
Major Vessels: ${formatValue(patient.majorvessels, '/3')}
Thalassemia: ${formatValue(patient.thalassemia, '/3')}

LIFESTYLE SCORE:
──────────────
Overall Lifestyle Score: ${formatValue(patient.lifestylescore, '/100')}

═══════════════════════════════════════════════════════════════
Report Generated: ${new Date().toLocaleString()}
═══════════════════════════════════════════════════════════════
    `.trim();
}

// Static file serving (must be after API routes)
app.use(express.static('public'));

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
