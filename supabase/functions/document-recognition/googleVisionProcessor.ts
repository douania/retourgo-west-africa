
// Google Cloud Vision API integration for document OCR
import { parseOCRText } from "./textParser.ts";

// Process image with Google Cloud Vision API
export async function processWithGoogleVision(base64Image: string, documentType: string, options: any = {}) {
  console.log("Processing document with Google Cloud Vision API");
  
  try {
    // Google Cloud Vision API requires an API key stored in environment variables
    const apiKey = Deno.env.get("GOOGLE_CLOUD_API_KEY");
    
    if (!apiKey) {
      console.error("Google Cloud API key not configured");
      throw new Error("Google Cloud API key not configured");
    }
    
    console.log(`Document type: ${documentType}`);
    console.log("OCR options:", JSON.stringify({
      documentCountry: options.documentCountry || "senegal",
      enhanceImage: options.enhanceImage || false,
      tryAllOrientations: options.tryAllOrientations || false
    }));
    
    // Ensure base64Image doesn't already include data:image prefix
    const cleanBase64 = base64Image.replace(/^data:image\/[a-z]+;base64,/, "");
    
    // Prepare request to Google Cloud Vision API
    const requestBody = {
      requests: [
        {
          image: {
            content: cleanBase64
          },
          features: [
            {
              type: "DOCUMENT_TEXT_DETECTION", // Specialized for documents
              maxResults: 10
            }
          ],
          imageContext: {
            languageHints: ["fr", "en"], // French and English for Senegalese documents
            cropHintsParams: {
              aspectRatios: [1.0, 1.5] // Common aspect ratios for ID documents
            }
          }
        }
      ]
    };
    
    console.log("Sending request to Google Cloud Vision API");
    console.log("API Key first 5 chars:", apiKey.substring(0, 5) + "...");
    
    // Call the Vision API with a timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout
    
    const response = await fetch(
      `https://vision.googleapis.com/v1/images:annotate?key=${apiKey}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(requestBody),
        signal: controller.signal
      }
    );
    
    clearTimeout(timeoutId);
    
    console.log("Google Vision API Response Status:", response.status);
    
    if (!response.ok) {
      const errorData = await response.json();
      console.error("Google API error status:", response.status);
      console.error("Google API error response:", JSON.stringify(errorData));
      
      // Get more detailed error information
      let errorMessage = "Google Cloud Vision API error";
      if (errorData.error) {
        errorMessage += `: ${errorData.error.message || response.statusText}`;
        console.error("Error code:", errorData.error.code);
        console.error("Error status:", errorData.error.status);
        
        // Add additional debugging for common API errors
        if (errorData.error.code === 403) {
          console.error("API Key might be invalid or missing required permissions");
        } else if (errorData.error.code === 400) {
          console.error("Request format might be incorrect or image data is invalid");
        }
      }
      
      throw new Error(errorMessage);
    }
    
    const result = await response.json();
    console.log("Google Vision API response received successfully");
    
    // Check if we received valid results
    if (!result.responses || result.responses.length === 0) {
      console.error("Empty response from Google Vision API");
      throw new Error("Empty response from Google Vision API");
    }
    
    if (!result.responses[0].fullTextAnnotation) {
      console.error("No text detected in the image");
      throw new Error("No text detected in the image");
    }
    
    // Extract the full text from the response
    const detectedText = result.responses[0].fullTextAnnotation.text;
    console.log("Text detected by Google Vision API");
    console.log("Text length:", detectedText.length);
    console.log("First 100 chars:", detectedText.substring(0, 100));
    
    if (!detectedText || detectedText.length < 10) {
      console.error("Insufficient text detected in the document");
      throw new Error("Insufficient text detected in the document");
    }
    
    // Calculate confidence from text annotations
    let totalConfidence = 0;
    let annotationCount = 0;
    
    if (result.responses[0].textAnnotations) {
      result.responses[0].textAnnotations.forEach((annotation: any) => {
        if (annotation.confidence) {
          totalConfidence += annotation.confidence;
          annotationCount++;
        }
      });
    }
    
    const avgConfidence = annotationCount > 0 ? totalConfidence / annotationCount : 0.7;
    console.log("Average confidence score:", avgConfidence.toFixed(2));
    
    // Use our parser to extract structured data from the detected text
    const documentCountry = options?.documentCountry || "senegal";
    const parsedData = parseOCRText(detectedText, {
      sourceLang: "fr", // Assume French for Senegalese documents
      documentType: documentType,
      qualityScore: avgConfidence * 100,
      documentCountry: documentCountry
    });
    
    console.log("Successfully parsed data from Google Vision OCR result");
    console.log("Parsed data:", JSON.stringify(parsedData));
    
    // Add raw text to help with debugging
    return {
      data: {
        ...parsedData,
        raw_detected_text: detectedText.substring(0, 300) + "...", // Include a sample of the raw text
      },
      confidence: avgConfidence,
      rawText: detectedText
    };
    
  } catch (error) {
    console.error("Error processing with Google Vision:", error);
    throw error;
  }
}
