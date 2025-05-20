
// Google Cloud Vision API integration for document OCR
import { parseOCRText } from "./textParser.ts";

// Process image with Google Cloud Vision API
export async function processWithGoogleVision(base64Image: string, documentType: string, options: any = {}) {
  console.log("Processing document with Google Cloud Vision API");
  
  try {
    // Google Cloud Vision API requires an API key stored in environment variables
    const apiKey = Deno.env.get("GOOGLE_CLOUD_API_KEY");
    
    if (!apiKey) {
      throw new Error("Google Cloud API key not configured");
    }
    
    // Log the document type and options for better debugging
    console.log(`Document type: ${documentType}`);
    console.log("OCR options:", JSON.stringify({
      documentCountry: options.documentCountry || "senegal",
      enhanceImage: options.enhanceImage || false,
      tryAllOrientations: options.tryAllOrientations || false
    }));
    
    // Prepare request to Google Cloud Vision API
    const requestBody = {
      requests: [
        {
          image: {
            content: base64Image
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
    
    // Call the Vision API
    const response = await fetch(
      `https://vision.googleapis.com/v1/images:annotate?key=${apiKey}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(requestBody)
      }
    );
    
    if (!response.ok) {
      const errorData = await response.json();
      console.error("Google API error status:", response.status);
      console.error("Google API error response:", JSON.stringify(errorData));
      throw new Error(`Google Cloud Vision API error: ${errorData.error?.message || response.statusText}`);
    }
    
    const result = await response.json();
    console.log("Google Vision API response received");
    
    // Check if we received valid results
    if (!result.responses || result.responses.length === 0 || !result.responses[0].fullTextAnnotation) {
      console.error("No text detected in the image");
      throw new Error("No text detected in the image");
    }
    
    // Extract the full text from the response
    const detectedText = result.responses[0].fullTextAnnotation.text;
    console.log("Text detected by Google Vision API");
    console.log("Text length:", detectedText.length);
    
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
    
    return {
      data: parsedData,
      confidence: avgConfidence,
      rawText: detectedText
    };
    
  } catch (error) {
    console.error("Error processing with Google Vision:", error);
    throw error;
  }
}

// In a production environment, you would implement proper image preprocessing here:

// Function to enhance image quality before OCR
function enhanceImageQuality(base64Image: string): Promise<string> {
  // In a real implementation, this would use image processing libraries
  // to increase contrast, adjust brightness, sharpen, etc.
  // For this implementation, we'll just return the original image
  return Promise.resolve(base64Image);
}

// Function to handle image rotation
function rotateImage(base64Image: string, degrees: number): Promise<string> {
  // In a real implementation, this would rotate the image by the specified degrees
  // For this implementation, we'll just return the original image
  console.log(`Would rotate image by ${degrees} degrees`);
  return Promise.resolve(base64Image);
}
