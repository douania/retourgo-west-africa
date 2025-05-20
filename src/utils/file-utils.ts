
/**
 * Utility functions for file operations
 */

/**
 * Converts a File object to a Base64 string
 * @param file The file to convert
 * @returns A promise resolving to the Base64 representation of the file
 */
export const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
  });
};

/**
 * Extracts the Base64 content from a data URL by removing the prefix
 * @param base64DataUrl The full Base64 data URL
 * @returns The Base64 content without the prefix
 */
export const extractBase64Content = (base64DataUrl: string): string => {
  return base64DataUrl.split(',')[1];
};
