// ChefIApp™ - Image Compression Utility
// Compress images before upload using browser-image-compression

import imageCompression from 'browser-image-compression';

export interface CompressionOptions {
  maxSizeMB?: number;
  maxWidthOrHeight?: number;
  useWebWorker?: boolean;
  fileType?: string;
}

const DEFAULT_OPTIONS: CompressionOptions = {
  maxSizeMB: 1, // Maximum file size in MB
  maxWidthOrHeight: 1920, // Max width or height
  useWebWorker: true, // Use web worker for better performance
  fileType: 'image/jpeg', // Output format
};

/**
 * Compress an image file
 * @param file - Original image file
 * @param options - Compression options
 * @returns Compressed image file
 */
export async function compressImage(
  file: File,
  options: CompressionOptions = {}
): Promise<File> {
  try {
    const compressionOptions = {
      ...DEFAULT_OPTIONS,
      ...options,
    };

    const compressedFile = await imageCompression(file, compressionOptions);

    // Log compression stats
    const originalSize = (file.size / 1024 / 1024).toFixed(2);
    const compressedSize = (compressedFile.size / 1024 / 1024).toFixed(2);
    const reductionPercent = (
      ((file.size - compressedFile.size) / file.size) *
      100
    ).toFixed(1);

    console.log(`[ImageCompression] Original: ${originalSize}MB`);
    console.log(`[ImageCompression] Compressed: ${compressedSize}MB`);
    console.log(`[ImageCompression] Reduction: ${reductionPercent}%`);

    return compressedFile;
  } catch (error) {
    console.error('[ImageCompression] Error compressing image:', error);
    // Return original file if compression fails
    return file;
  }
}

/**
 * Compress image for profile photo (smaller size)
 * @param file - Original image file
 * @returns Compressed image file
 */
export async function compressProfilePhoto(file: File): Promise<File> {
  return compressImage(file, {
    maxSizeMB: 0.5,
    maxWidthOrHeight: 512,
    fileType: 'image/jpeg',
  });
}

/**
 * Compress image for task proof photo (medium size)
 * @param file - Original image file
 * @returns Compressed image file
 */
export async function compressTaskPhoto(file: File): Promise<File> {
  return compressImage(file, {
    maxSizeMB: 1,
    maxWidthOrHeight: 1280,
    fileType: 'image/jpeg',
  });
}

/**
 * Compress image for company logo (small size)
 * @param file - Original image file
 * @returns Compressed image file
 */
export async function compressCompanyLogo(file: File): Promise<File> {
  return compressImage(file, {
    maxSizeMB: 0.3,
    maxWidthOrHeight: 256,
    fileType: 'image/png', // PNG for transparency support
  });
}

/**
 * Validate image file
 * @param file - File to validate
 * @param maxSizeMB - Maximum file size in MB
 * @returns True if valid, error message otherwise
 */
export function validateImageFile(
  file: File,
  maxSizeMB: number = 10
): { valid: boolean; error?: string } {
  // Check if file exists
  if (!file) {
    return { valid: false, error: 'Nenhum arquivo selecionado' };
  }

  // Check file type
  const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
  if (!validTypes.includes(file.type)) {
    return {
      valid: false,
      error: 'Formato inválido. Use JPEG, PNG ou WebP',
    };
  }

  // Check file size
  const fileSizeMB = file.size / 1024 / 1024;
  if (fileSizeMB > maxSizeMB) {
    return {
      valid: false,
      error: `Arquivo muito grande. Máximo: ${maxSizeMB}MB`,
    };
  }

  return { valid: true };
}

/**
 * Create a preview URL from a file
 * @param file - Image file
 * @returns Preview URL (remember to revoke with URL.revokeObjectURL)
 */
export function createImagePreview(file: File): string {
  return URL.createObjectURL(file);
}

/**
 * Revoke a preview URL to free memory
 * @param url - Preview URL to revoke
 */
export function revokeImagePreview(url: string): void {
  URL.revokeObjectURL(url);
}

/**
 * Convert a File to base64 string
 * @param file - Image file
 * @returns Base64 string
 */
export function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        resolve(reader.result);
      } else {
        reject(new Error('Failed to convert file to base64'));
      }
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

/**
 * Get image dimensions
 * @param file - Image file
 * @returns Width and height
 */
export function getImageDimensions(
  file: File
): Promise<{ width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = createImagePreview(file);

    img.onload = () => {
      revokeImagePreview(url);
      resolve({
        width: img.width,
        height: img.height,
      });
    };

    img.onerror = () => {
      revokeImagePreview(url);
      reject(new Error('Failed to load image'));
    };

    img.src = url;
  });
}
