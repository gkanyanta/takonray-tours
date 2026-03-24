import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export { cloudinary };

// ---------------------------------------------------------------------------
// Upload helpers
// ---------------------------------------------------------------------------

interface UploadOptions {
  folder?: string;
  transformation?: Record<string, any>[];
  publicId?: string;
  overwrite?: boolean;
}

interface UploadResult {
  publicId: string;
  url: string;
  secureUrl: string;
  width: number;
  height: number;
  format: string;
  bytes: number;
}

/**
 * Upload an image from a file path, URL, or base64 data URI.
 */
export async function uploadImage(
  source: string,
  options: UploadOptions = {}
): Promise<UploadResult> {
  const result = await cloudinary.uploader.upload(source, {
    folder: options.folder ?? "takonray-tours",
    public_id: options.publicId,
    overwrite: options.overwrite ?? true,
    transformation: options.transformation,
    resource_type: "image",
  });

  return {
    publicId: result.public_id,
    url: result.url,
    secureUrl: result.secure_url,
    width: result.width,
    height: result.height,
    format: result.format,
    bytes: result.bytes,
  };
}

/**
 * Upload multiple images in parallel.
 */
export async function uploadImages(
  sources: string[],
  options: UploadOptions = {}
): Promise<UploadResult[]> {
  return Promise.all(sources.map((src) => uploadImage(src, options)));
}

/**
 * Delete an image by its public ID.
 */
export async function deleteImage(publicId: string) {
  return cloudinary.uploader.destroy(publicId);
}

/**
 * Generate an optimised delivery URL for an existing image.
 */
export function getImageUrl(
  publicId: string,
  options: { width?: number; height?: number; crop?: string } = {}
): string {
  return cloudinary.url(publicId, {
    fetch_format: "auto",
    quality: "auto",
    width: options.width,
    height: options.height,
    crop: options.crop ?? "fill",
    secure: true,
  });
}
