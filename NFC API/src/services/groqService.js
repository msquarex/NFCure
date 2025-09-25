const Groq = require('groq-sdk');

class GroqService {
    constructor() {
        this.groq = new Groq({
            apiKey: process.env.GROQ_API_KEY
        });
    }

    /**
     * Generate a comprehensive medical summary from patient data
     * @param {Object} patientData - The complete patient medical data
     * @param {string} rawReport - The formatted medical report text
     * @returns {Promise<Object>} - Summary object with key insights
     */
    async generateMedicalSummary(patientData, rawReport) {
        try {
            const prompt = this.createMedicalSummaryPrompt(patientData, rawReport);
            
            const completion = await this.groq.chat.completions.create({
                messages: [
                    {
                        role: "system",
                        content: "You are a medical AI assistant specialized in analyzing patient data and providing comprehensive medical summaries for healthcare professionals. You have access to complete patient medical histories and can identify patterns, risk factors, and critical health indicators."
                    },
                    {
                        role: "user",
                        content: prompt
                    }
                ],
                model: "openai/gpt-oss-20b",
                temperature: 0.3,
                max_completion_tokens: 2000,
                top_p: 1,
                reasoning_effort: "medium",
                stream: false,
                stop: null,
            });

            const summaryText = completion.choices[0]?.message?.content;
            
            if (!summaryText) {
                throw new Error('No summary generated from Groq API');
            }

            // Parse the structured response
            return this.parseSummaryResponse(summaryText, patientData);

        } catch (error) {
            console.error('Error generating medical summary:', error);
            throw new Error(`Failed to generate medical summary: ${error.message}`);
        }
    }

    /**
     * Create a comprehensive prompt for medical analysis
     * @param {Object} patientData - Patient data object
     * @param {string} rawReport - Formatted medical report
     * @returns {string} - Formatted prompt for Groq
     */
    createMedicalSummaryPrompt(patientData, rawReport) {
        return `
Please analyze the following patient medical data and provide a comprehensive medical summary for healthcare professionals. Focus on clinical insights, risk factors, and actionable recommendations.

PATIENT DATA:
${rawReport}

Please provide your analysis in the following structured format:

## EXECUTIVE SUMMARY
[Brief 2-3 sentence overview of the patient's current health status and key concerns]

## CLINICAL ASSESSMENT
[Detailed analysis of vital signs, laboratory values, and physical health indicators]

## RISK FACTOR ANALYSIS
[Identification and analysis of cardiovascular, metabolic, and lifestyle risk factors]

## LIFESTYLE IMPACT ASSESSMENT
[Analysis of smoking, diet, exercise, and other lifestyle factors on health outcomes]

## CRITICAL ALERTS
[List any urgent or concerning health indicators that require immediate attention]

## TREATMENT RECOMMENDATIONS
[Specific, actionable recommendations for healthcare providers]

## PATIENT EDUCATION PRIORITIES
[Key areas where patient education and lifestyle modifications would be most beneficial]

## FOLLOW-UP CONSIDERATIONS
[Suggested monitoring parameters and follow-up intervals]

Please ensure your analysis is:
- Clinically accurate and evidence-based
- Specific to this patient's data
- Actionable for healthcare providers
- Focused on patient safety and outcomes
- Written in clear, professional medical language
        `.trim();
    }

    /**
     * Parse the Groq response into a structured format
     * @param {string} summaryText - Raw summary text from Groq
     * @param {Object} patientData - Original patient data
     * @returns {Object} - Structured summary object
     */
    parseSummaryResponse(summaryText, patientData) {
        try {
            // Extract sections from the summary
            const sections = {
                executiveSummary: this.extractSection(summaryText, 'EXECUTIVE SUMMARY'),
                clinicalAssessment: this.extractSection(summaryText, 'CLINICAL ASSESSMENT'),
                riskFactorAnalysis: this.extractSection(summaryText, 'RISK FACTOR ANALYSIS'),
                lifestyleImpactAssessment: this.extractSection(summaryText, 'LIFESTYLE IMPACT ASSESSMENT'),
                criticalAlerts: this.extractSection(summaryText, 'CRITICAL ALERTS'),
                treatmentRecommendations: this.extractSection(summaryText, 'TREATMENT RECOMMENDATIONS'),
                patientEducationPriorities: this.extractSection(summaryText, 'PATIENT EDUCATION PRIORITIES'),
                followUpConsiderations: this.extractSection(summaryText, 'FOLLOW-UP CONSIDERATIONS'),
                fullText: summaryText
            };

            return {
                patientId: patientData.patient_id,
                generatedAt: new Date().toISOString(),
                summary: sections,
                metadata: {
                    model: 'openai/gpt-oss-20b',
                    wordCount: summaryText.split(' ').length,
                    hasCriticalAlerts: sections.criticalAlerts && sections.criticalAlerts.toLowerCase().includes('urgent')
                }
            };

        } catch (error) {
            console.error('Error parsing summary response:', error);
            return {
                patientId: patientData.patient_id,
                generatedAt: new Date().toISOString(),
                summary: {
                    fullText: summaryText,
                    executiveSummary: 'Summary generated but parsing failed',
                    clinicalAssessment: 'See full text below',
                    riskFactorAnalysis: 'See full text below',
                    lifestyleImpactAssessment: 'See full text below',
                    criticalAlerts: 'See full text below',
                    treatmentRecommendations: 'See full text below',
                    patientEducationPriorities: 'See full text below',
                    followUpConsiderations: 'See full text below'
                },
                metadata: {
                    model: 'openai/gpt-oss-20b',
                    wordCount: summaryText.split(' ').length,
                    parseError: error.message
                }
            };
        }
    }

    /**
     * Extract a specific section from the summary text
     * @param {string} text - Full summary text
     * @param {string} sectionName - Name of the section to extract
     * @returns {string} - Extracted section content
     */
    extractSection(text, sectionName) {
        const regex = new RegExp(`## ${sectionName}[\\s\\S]*?(?=##|$)`, 'i');
        const match = text.match(regex);
        
        if (match) {
            return match[0]
                .replace(new RegExp(`## ${sectionName}`, 'i'), '')
                .trim();
        }
        
        return 'Section not found in response';
    }

    /**
     * Generate a quick health risk assessment
     * @param {Object} patientData - Patient data object
     * @returns {Promise<Object>} - Risk assessment object
     */
    async generateRiskAssessment(patientData) {
        try {
            const prompt = `
Analyze the following patient data and provide a risk assessment focusing on cardiovascular, metabolic, and lifestyle risks:

Patient ID: ${patientData.patient_id}
Age: ${patientData.age || 'Unknown'}
BMI: ${patientData.bmi || 'Unknown'}
Blood Pressure: ${patientData.restbp || 'Unknown'} mmHg
Cholesterol: ${patientData.cholesterol || 'Unknown'} mg/dL
Diabetes: ${patientData.diabetes ? 'Yes' : 'No'}
Smoking: ${patientData.smoker ? 'Yes' : 'No'}
Heart Disease: ${patientData.heartdiseaseorattack ? 'Yes' : 'No'}

Provide a brief risk assessment with:
1. Overall risk level (Low/Medium/High)
2. Primary risk factors
3. Immediate concerns
4. Preventive recommendations

Format as JSON with fields: riskLevel, primaryRisks, immediateConcerns, recommendations
            `;

            const completion = await this.groq.chat.completions.create({
                messages: [
                    {
                        role: "system",
                        content: "You are a medical AI assistant providing risk assessments. Respond with valid JSON only."
                    },
                    {
                        role: "user",
                        content: prompt
                    }
                ],
                model: "openai/gpt-oss-20b",
                temperature: 0.2,
                max_completion_tokens: 500,
                top_p: 1,
                reasoning_effort: "medium",
                stream: false,
                stop: null
            });

            const responseText = completion.choices[0]?.message?.content;
            
            try {
                return JSON.parse(responseText);
            } catch (parseError) {
                return {
                    riskLevel: 'Unknown',
                    primaryRisks: ['Unable to parse risk assessment'],
                    immediateConcerns: ['Analysis failed'],
                    recommendations: ['Consult healthcare provider'],
                    rawResponse: responseText
                };
            }

        } catch (error) {
            console.error('Error generating risk assessment:', error);
            throw new Error(`Failed to generate risk assessment: ${error.message}`);
        }
    }
}

module.exports = GroqService;
