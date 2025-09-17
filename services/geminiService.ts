import { GoogleGenAI, Type, Part } from "@google/genai";
import type { AnalysisReport, FixSuggestion, MasteringChain, MasteringStyle, ChainComplexity } from '../types';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  throw new Error("API_KEY environment variable is not set");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

const metricSchema = {
    type: Type.OBJECT,
    properties: {
        score: { type: Type.INTEGER, description: "Score from 1-10 for this metric." },
        feedback: { type: Type.STRING, description: "Detailed, constructive feedback for this specific metric." }
    }
};

const responseSchema = {
  type: Type.OBJECT,
  properties: {
    overallScore: {
      type: Type.INTEGER,
      description: "An overall radio readiness score from 1 (poor) to 10 (excellent)."
    },
    overallFeedback: {
      type: Type.STRING,
      description: "A summary of the track's strengths and weaknesses for radio play."
    },
    determinedGenre: {
        type: Type.STRING,
        description: "The primary genre of the music track as determined by analyzing the audio."
    },
    determinedMood: {
        type: Type.STRING,
        description: "The primary mood or feeling of the track as determined by analyzing the audio."
    },
    dynamicRange: metricSchema,
    frequencyBalance: metricSchema,
    stereoImage: metricSchema,
    clarityAndDefinition: metricSchema,
    genreFitness: {
        type: Type.OBJECT,
        properties: {
            score: { type: Type.INTEGER, description: "Score from 1-10 for genre fitness." },
            feedback: { type: Type.STRING, description: "Feedback on how well the production choices fit the determined genre." }
        }
    },
    moodCongruence: {
        type: Type.OBJECT,
        properties: {
            score: { type: Type.INTEGER, description: "Score from 1-10 for mood congruence." },
            feedback: { type: Type.STRING, description: "Feedback on how well the mix and master support the determined mood." }
        }
    },
  },
  required: [
    "overallScore", "overallFeedback", "determinedGenre", "determinedMood", 
    "dynamicRange", "frequencyBalance", "stereoImage", "clarityAndDefinition",
    "genreFitness", "moodCongruence"
  ]
};


export const getAnalysisReport = async (fileName: string, audioBase64: string, mimeType: string): Promise<AnalysisReport> => {
  const systemInstruction = `You are an expert audio mastering engineer. Your primary task is to analyze an audio file. First, determine its genre and mood directly from the audio. Then, based on your determination, provide a detailed technical analysis across six categories: Dynamic Range, Frequency Balance, Stereo Image, Clarity/Definition, Genre Fitness, and Mood Congruence. Your tone is professional, constructive, and encouraging. A score of 1-4 is poor, 5-7 is average, and 8-10 is excellent/radio-ready. Respond ONLY with the requested JSON.`;
  
  const audioPart: Part = {
    inlineData: {
      data: audioBase64,
      mimeType: mimeType,
    },
  };

  const textPart: Part = {
      text: `Analyze the provided audio track named "${fileName}". Determine its genre and mood, then provide a complete analysis based on that context.`,
  };

  try {
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: { parts: [audioPart, textPart] },
        config: {
            systemInstruction: systemInstruction,
            responseMimeType: 'application/json',
            responseSchema: responseSchema,
        }
    });

    const jsonText = response.text.trim();
    const parsedJson = JSON.parse(jsonText);

    if (typeof parsedJson.overallScore !== 'number') {
        throw new Error("Invalid response structure from API.");
    }

    return parsedJson as AnalysisReport;
  } catch (error) {
    console.error("Error getting analysis report:", error);
    throw new Error("Failed to get analysis from AI. The model may have had trouble processing the audio file. Please try again with a different track.");
  }
};


export const generateAlbumArt = async (trackName: string, genre: string, mood: string, analysisFeedback: string): Promise<string> => {
    const prompt = `
        Create a vibrant, high-quality, conceptual album cover for a song titled "${trackName}".
        The music genre is ${genre} and the mood is ${mood}.
        The artistic style should be a mix of abstract and surrealism, reflecting key feedback from its analysis: "${analysisFeedback}".
        The image should be square, centered, and visually striking, suitable for a digital release.
        Do not include any text or words on the image.
        Focus on colors, shapes, and textures that evoke the mood and genre.
    `;

    try {
        const response = await ai.models.generateImages({
            model: 'imagen-4.0-generate-001',
            prompt: prompt,
            config: {
              numberOfImages: 1,
              outputMimeType: 'image/png',
              aspectRatio: '1:1',
            },
        });

        if (response.generatedImages && response.generatedImages.length > 0) {
            const base64ImageBytes: string = response.generatedImages[0].image.imageBytes;
            return `data:image/png;base64,${base64ImageBytes}`;
        } else {
            throw new Error("No image was generated.");
        }
    } catch (error) {
        console.error("Error generating album art:", error);
        throw new Error("Failed to generate album art. Please try again.");
    }
}

const fixSuggestionSchema = {
    type: Type.OBJECT,
    properties: {
        suggestion: {
            type: Type.STRING,
            description: "A short, one-sentence summary of the suggested fix that MUST name the specific plugin to use from the user's list. Example: 'Use the UADx 1176 FET Compressor for punchy dynamics.'"
        },
        parameters: {
            type: Type.ARRAY,
            description: "An array of specific plugin parameters relevant to the chosen plugin. Each item should be an object with 'name' and 'value' keys.",
            items: {
                type: Type.OBJECT,
                properties: {
                    name: {
                        type: Type.STRING,
                        description: "The name of the parameter (e.g., 'Threshold', 'Ratio')."
                    },
                    value: {
                        type: Type.STRING,
                        description: "The suggested value for the parameter as a string (e.g., '-10dB', '4:1', '250ms')."
                    }
                },
                required: ["name", "value"]
            }
        }
    },
    required: ["suggestion", "parameters"]
};


export const getFixSuggestion = async (metricTitle: string, metricScore: number, metricFeedback: string, pluginList: string, knowledgeBaseText: string): Promise<FixSuggestion> => {
    const knowledgeContext = knowledgeBaseText 
        ? `\n\nADDITIONAL CONTEXT FROM USER-PROVIDED MANUALS (Adhere to this documentation when possible):\n---\n${knowledgeBaseText}\n---`
        : '';

    const systemInstruction = `You are an expert audio mastering engineer acting as a personal assistant for a user working in Adobe Audition v25.

Your task is to provide a specific, actionable 'fix' for an audio mastering issue. You will be given a metric, its score, and the AI's feedback. Based on this, you MUST recommend one specific plugin from the user's available UAD plugin list and provide a starting set of parameters for it.

The user's available plugin list is:
${pluginList}

Your suggestion MUST start with the full name of the recommended plugin. For example: "Use the UADx 1176 FET Compressor to add punch..." or "Apply the UADx Manley Massive Passive EQ to..."
The parameters provided must be relevant to the chosen plugin and formatted as an array of objects, where each object has a "name" and a "value" key. Keep the parameter list short and focused on the most impactful change.${knowledgeContext}

Respond ONLY with the requested JSON.`;

    const prompt = `
        The metric is "${metricTitle}".
        It received a score of ${metricScore}/10.
        The feedback was: "${metricFeedback}".

        Based on this, provide a concise suggestion recommending a specific plugin from the user's list and a set of parameters to address the feedback.
    `;
    
    const MAX_RETRIES = 3;
    const INITIAL_BACKOFF_MS = 1000;
    let lastError: any = null;

    for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
        try {
            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: prompt,
                config: {
                    systemInstruction: systemInstruction,
                    responseMimeType: 'application/json',
                    responseSchema: fixSuggestionSchema,
                }
            });

            const jsonText = response.text.trim();
            return JSON.parse(jsonText) as FixSuggestion; // Success, exit the function

        } catch (error) {
            lastError = error;
            const errorMessage = JSON.stringify(error) || '';
            
            // Check for rate limit error specifically
            if (errorMessage.includes("429") || errorMessage.includes("RESOURCE_EXHAUSTED")) {
                 if (attempt < MAX_RETRIES - 1) { // Don't wait on the last attempt
                    const waitTime = INITIAL_BACKOFF_MS * Math.pow(2, attempt);
                    console.log(`Rate limit hit. Retrying suggestion for "${metricTitle}" in ${waitTime}ms...`);
                    await new Promise(resolve => setTimeout(resolve, waitTime));
                    continue; // Continue to next attempt
                 }
            }
            // For non-retriable errors, break the loop immediately
            break; 
        }
    }

    // If the loop completes without returning, it means all retries failed.
    console.error(`Error getting fix suggestion for "${metricTitle}" after ${MAX_RETRIES} attempts:`, lastError);
    
    const finalErrorMessage = JSON.stringify(lastError) || '';
    if (finalErrorMessage.includes("429") || finalErrorMessage.includes("RESOURCE_EXHAUSTED")) {
        throw new Error("You've made too many requests too quickly. Please wait a minute and try again.");
    }
    
    throw new Error("The AI engineer is busy tuning another track. Please try again in a moment.");
};

const chatSuggestionsSchema = {
    type: Type.ARRAY,
    items: {
      type: Type.STRING,
      description: "A single, concise follow-up question a user might ask about the audio analysis."
    }
};

export const getChatSuggestions = async (report: AnalysisReport): Promise<string[]> => {
    const systemInstruction = `You are an AI assistant helping an audio engineer. Based on the provided audio analysis report, your task is to generate exactly 3 concise, insightful follow-up questions a user might ask. The questions should be distinct and focus on different aspects of the report (e.g., one on a specific metric, one on creative direction, one on technical steps).

    Respond ONLY with a JSON array of 3 strings.`;
    
    const prompt = `Here is the analysis report: ${JSON.stringify(report, null, 2)}`;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                systemInstruction: systemInstruction,
                responseMimeType: 'application/json',
                responseSchema: chatSuggestionsSchema,
            }
        });
        const jsonText = response.text.trim();
        return JSON.parse(jsonText);

    } catch (error) {
        console.error("Error getting chat suggestions:", error);
        // Return generic suggestions as a fallback
        return [
            "What's the most important thing to fix first?",
            "Explain my frequency balance like I'm five.",
            "Suggest a reference track for this genre.",
        ];
    }
};

const masteringChainSchema = {
    type: Type.ARRAY,
    description: "A sequential list of plugins to form a mastering chain.",
    items: {
        type: Type.OBJECT,
        properties: {
            pluginName: {
                type: Type.STRING,
                description: "The full name of the plugin to use from the user's provided list."
            },
            detailedReason: {
                type: Type.STRING,
                description: "A detailed, multi-sentence explanation for why this specific plugin was chosen at this step, referencing the analysis report to justify the choice."
            },
            parameters: {
                type: Type.ARRAY,
                description: "An array of specific plugin parameters and their starting values.",
                items: {
                    type: Type.OBJECT,
                    properties: {
                        name: { type: Type.STRING, description: "The name of the parameter (e.g., 'Threshold', 'Ratio')." },
                        value: { type: Type.STRING, description: "The suggested value for the parameter (e.g., '-10dB', '4:1')." }
                    },
                    required: ["name", "value"]
                }
            },
            alternatives: {
                type: Type.ARRAY,
                description: "An array of 1-2 alternative plugins from the user's list for this step.",
                items: {
                    type: Type.OBJECT,
                    properties: {
                        pluginName: { type: Type.STRING, description: "The full name of the alternative plugin." },
                        reason: { type: Type.STRING, description: "A brief, one-sentence explanation of why this plugin is a suitable alternative." }
                    },
                    required: ["pluginName", "reason"]
                }
            }
        },
        required: ["pluginName", "detailedReason", "parameters", "alternatives"]
    }
};

export const getMasteringChain = async (
    report: AnalysisReport, 
    pluginList: string, 
    knowledgeBaseText: string, 
    style: MasteringStyle,
    complexity: ChainComplexity,
    creativeDirection: string
): Promise<MasteringChain> => {
    const knowledgeContext = knowledgeBaseText 
        ? `\n\nADDITIONAL CONTEXT FROM USER-PROVIDED MANUALS (Adhere to this documentation when possible to select plugins and parameters):\n---\n${knowledgeBaseText}\n---`
        : '';
    
    const styleInstruction = {
        'Transparent': 'Prioritize preserving original dynamics. Use high-fidelity, clean plugins. Make subtle, surgical adjustments. Goal is clarity and fidelity.',
        'Warm': 'Favor plugins with analog character (tube, tape). Introduce subtle saturation. Use broad, musical EQ curves. Goal is pleasing harmonics and cohesion.',
        'Loud': 'Aim for competitive commercial volume. Use a combination of compression and limiting. The final plugin must be a mastering limiter. Goal is punch, impact, and a high LUFS level.'
    }[style];

    const complexityInstruction = {
        'Simple': 'The chain must have exactly 2 steps. Focus on the most critical issues.',
        'Standard': 'The chain should be 3 to 4 steps. This is a typical, balanced approach.',
        'Complex': 'The chain can be 4 or 5 steps. Use this for tracks that require more detailed processing or special character shaping.'
    }[complexity];

    const creativeDirectionInstruction = creativeDirection 
        ? `\n\nUSER'S CREATIVE DIRECTION (This is very important):\n"${creativeDirection}"` 
        : '';

    const systemInstruction = `You are an expert audio mastering engineer. Your task is to create a complete, sequential mastering plugin chain based on an analysis report and a user's detailed brief. You MUST only use plugins from the provided user's list.

The chain must be logical and follow standard mastering practices (e.g., corrective EQ before compression). For each step, you must provide:
1.  A detailed, multi-sentence reason for the plugin choice, directly referencing the analysis report.
2.  A set of starting parameters.
3.  1-2 alternative plugins from the user's list, each with a short reason.

THE USER'S BRIEF:
- Mastering Style: ${style.toUpperCase()}. ${styleInstruction}
- Chain Complexity: ${complexity.toUpperCase()}. ${complexityInstruction}
${creativeDirectionInstruction}

The user's available plugin list is:
${pluginList}
${knowledgeContext}

Respond ONLY with the requested JSON array, representing the mastering chain in the correct order.`;
    
    const prompt = `
        Analysis Report:
        - Overall Score: ${report.overallScore}/10 (${report.overallFeedback})
        - Genre/Mood: ${report.determinedGenre} / ${report.determinedMood}
        - Dynamic Range: ${report.dynamicRange.score}/10 - ${report.dynamicRange.feedback}
        - Frequency Balance: ${report.frequencyBalance.score}/10 - ${report.frequencyBalance.feedback}
        - Stereo Image: ${report.stereoImage.score}/10 - ${report.stereoImage.feedback}
        - Clarity: ${report.clarityAndDefinition.score}/10 - ${report.clarityAndDefinition.feedback}

        Based on the full analysis report and the detailed user brief, construct a mastering chain.
    `;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                systemInstruction: systemInstruction,
                responseMimeType: 'application/json',
                responseSchema: masteringChainSchema,
            }
        });
        const jsonText = response.text.trim();
        return JSON.parse(jsonText);
    } catch (error) {
        console.error("Error getting mastering chain:", error);
        throw new Error("The AI engineer couldn't design a mastering chain for this track. Please try again.");
    }
};