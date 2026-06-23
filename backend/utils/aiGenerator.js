// const { GoogleGenAI } = require("@google/genai");

// // Initialize the SDK with your API key
// const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// // --- CORE 01: Multi-modal File Parsing ---
// exports.analyzeDocumentAndGenerateItinerary = async (fileUrl, mimeType) => {
//   try {
//     const response = await fetch(fileUrl);
//     const arrayBuffer = await response.arrayBuffer();
//     const base64Data = Buffer.from(arrayBuffer).toString("base64");

//     const prompt = `
//       You are an elite travel coordinator data validation engine.
      
//       CRITICAL TASKS:
//       1. Inspect the provided image or file thoroughly.
//       2. Set "isValidTravelDocument" to true ONLY if the document is a flight ticket, boarding pass, hotel voucher, confirmation letter, booking confirmation invoice, train pass, or vehicle rental receipt.
//       3. Set "isValidTravelDocument" to false if the file is an unrelated image, selfie, regular person photo, animal, landscape, meme, generic screenshot, or non-travel documentation text.
//       4. If "isValidTravelDocument" is false, you do not need to populate extensive mock timeline metrics; return clean blank structures for remaining parameters.
//       5. If valid, extract reference numbers, temporal dates, metadata timelines, and generate an interactive packing list inside "packingList".
//     `;

//     const aiResponse = await ai.models.generateContent({
//       model: 'gemini-2.5-flash',
//       contents: [
//         prompt,
//         {
//           inlineData: {
//             mimeType: mimeType,
//             data: base64Data,
//           },
//         },
//       ],
//       config: sharedAiConfig,
//     });

//     return JSON.parse(aiResponse.text);
//   } catch (error) {
//     console.error("AI Generation Error details:", error);
//     throw new Error("Failed to extract data and build itinerary via AI.");
//   }
// };

// // --- ✨ NEW CORE 02: Pure Text Prompt Synthesis ---
// exports.generateItineraryFromPrompt = async (userPrompt) => {
//   try {
//     const structuralInstruction = `
//       You are an expert travel coordinator. Create a comprehensive, realistic travel itinerary based entirely on the user's instructions.
      
//       User Intent Directives:
//       "${userPrompt}"

//       CRITICAL TASKS:
//       1. Synthesize a creative trip Name, Duration, and sequential Day-by-Day timeline structure.
//       2. Generate a destination-optimized checklist tracking matrix within "packingList".
//       3. Since this is a raw text-synthesis request, always return true for "isValidTravelDocument".
//     `;

//     // Fire text-only synthesis engine using the same native JSON validator
//     const aiResponse = await ai.models.generateContent({
//       model: "gemini-3.5-flash",
//       contents: structuralInstruction,
//       config: sharedAiConfig,
//     });

//     return JSON.parse(aiResponse.text);
//   } catch (error) {
//     console.error("AI Text Prompt Synthesis Error:", error);
//     throw new Error(
//       "Failed to synthesize itinerary via custom text parameters.",
//     );
//   }
// };

// // 📦 Shared Validation Object Schema Matrix to keep things DRY
// const sharedAiConfig = {
//   responseMimeType: "application/json",
//   responseSchema: {
//     type: "OBJECT",
//     properties: {
//       isValidTravelDocument: {
//         type: "BOOLEAN",
//         description:
//           "Always true for text-generations, or conditional for file checks.",
//       },
//       tripName: { type: "STRING" },
//       duration: { type: "STRING" },
//       extractedDetails: {
//         type: "OBJECT",
//         properties: {
//           type: { type: "STRING" },
//           confirmationNumber: { type: "STRING" },
//           startDate: { type: "STRING" },
//         },
//         required: ["type", "confirmationNumber", "startDate"],
//       },
//       packingList: {
//         type: "ARRAY",
//         items: {
//           type: "OBJECT",
//           properties: {
//             item: { type: "STRING" },
//             isCompleted: { type: "BOOLEAN" },
//           },
//           required: ["item", "isCompleted"],
//         },
//       },
//       days: {
//         type: "ARRAY",
//         items: {
//           type: "OBJECT",
//           properties: {
//             dayNumber: { type: "INTEGER" },
//             title: { type: "STRING" },
//             activities: {
//               type: "ARRAY",
//               items: {
//                 type: "OBJECT",
//                 properties: {
//                   time: { type: "STRING" },
//                   activity: { type: "STRING" },
//                 },
//                 required: ["time", "activity"],
//               },
//             },
//           },
//           required: ["dayNumber", "title", "activities"],
//         },
//       },
//     },
//     required: [
//       "isValidTravelDocument",
//       "tripName",
//       "duration",
//       "extractedDetails",
//       "packingList",
//       "days",
//     ],
//   },
// };



const { GoogleGenAI } = require("@google/genai");

// Initialize the SDK with your API key
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// 📦 1. Shared Validation Object Schema Matrix (Moved to top to prevent ReferenceErrors)
const sharedAiConfig = {
  responseMimeType: "application/json",
  responseSchema: {
    type: "OBJECT",
    properties: {
      isValidTravelDocument: {
        type: "BOOLEAN",
        description: "Always true for text-generations, or conditional for file checks.",
      },
      tripName: { type: "STRING" },
      duration: { type: "STRING" },
      extractedDetails: {
        type: "OBJECT",
        description: "Travel receipt details. Can contain empty strings if document is invalid.",
        properties: {
          type: { type: "STRING" },
          confirmationNumber: { type: "STRING" },
          startDate: { type: "STRING" },
        },
        required: ["type", "confirmationNumber", "startDate"],
      },
      packingList: {
        type: "ARRAY",
        items: {
          type: "OBJECT",
          properties: {
            item: { type: "STRING" },
            isCompleted: { type: "BOOLEAN" },
          },
          required: ["item", "isCompleted"],
        },
      },
      days: {
        type: "ARRAY",
        items: {
          type: "OBJECT",
          properties: {
            dayNumber: { type: "INTEGER" },
            title: { type: "STRING" },
            activities: {
              type: "ARRAY",
              items: {
                type: "OBJECT",
                properties: {
                  time: { type: "STRING" },
                  activity: { type: "STRING" },
                },
                required: ["time", "activity"],
              },
            },
          },
          required: ["dayNumber", "title", "activities"],
        },
      },
    },
    // Keep these required, but instruct the model to provide empty structures/strings if invalid
    required: [
      "isValidTravelDocument",
      "tripName",
      "duration",
      "extractedDetails",
      "packingList",
      "days",
    ],
  },
};

// --- CORE 01: Multi-modal File Parsing ---
exports.analyzeDocumentAndGenerateItinerary = async (fileUrl, mimeType) => {
  try {
    const response = await fetch(fileUrl);
    const arrayBuffer = await response.arrayBuffer();
    const base64Data = Buffer.from(arrayBuffer).toString("base64");

    const prompt = `
      You are an elite travel coordinator data validation engine.
      
      CRITICAL TASKS:
      1. Inspect the provided image or file thoroughly.
      2. Set "isValidTravelDocument" to true ONLY if the document is a flight ticket, boarding pass, hotel voucher, confirmation letter, booking confirmation invoice, train pass, or vehicle rental receipt.
      3. Set "isValidTravelDocument" to false if the file is an unrelated image, selfie, regular person photo, animal, landscape, meme, generic screenshot, or non-travel documentation text.
      4. If "isValidTravelDocument" is false, you MUST still respect the JSON schema layout: set "tripName" and "duration" to "Invalid Document", provide empty strings inside "extractedDetails", and return empty arrays [] for "packingList" and "days".
      5. If valid, extract reference numbers, temporal dates, metadata timelines, and generate an interactive packing list inside "packingList".
    `;

    const aiResponse = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [
        prompt,
        {
          inlineData: {
            mimeType: mimeType,
            data: base64Data,
          },
        },
      ],
      config: sharedAiConfig,
    });

    return JSON.parse(aiResponse.text);
  } catch (error) {
    console.error("AI Generation Error details:", error);
    throw new Error("Failed to extract data and build itinerary via AI.");
  }
};

// --- CORE 02: Pure Text Prompt Synthesis ---
exports.generateItineraryFromPrompt = async (userPrompt) => {
  try {
    const structuralInstruction = `
      You are an expert travel coordinator. Create a comprehensive, realistic travel itinerary based entirely on the user's instructions.
      
      User Intent Directives:
      "${userPrompt}"

      CRITICAL TASKS:
      1. Synthesize a creative trip Name, Duration, and sequential Day-by-Day timeline structure.
      2. Generate a destination-optimized checklist tracking matrix within "packingList".
      3. Since this is a raw text-synthesis request, always return true for "isValidTravelDocument".
      4. Provide relevant fallback strings for "extractedDetails" (e.g., type: "Custom Prompt", confirmationNumber: "N/A").
    `;

    const aiResponse = await ai.models.generateContent({
      model: "gemini-2.5-flash", // Reverted to 2.5-flash to align with your setup
      contents: structuralInstruction,
      config: sharedAiConfig,
    });

    return JSON.parse(aiResponse.text);
  } catch (error) {
    console.error("AI Text Prompt Synthesis Error:", error);
    throw new Error(
      "Failed to synthesize itinerary via custom text parameters.",
    );
  }
};