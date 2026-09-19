import { v2 as cloudinary, UploadApiResponse } from 'cloudinary'

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || '',
  api_key: process.env.CLOUDINARY_API_KEY || '',
  api_secret: process.env.CLOUDINARY_API_SECRET || '',
  secure: true,
})

export { cloudinary }

export const isCloudinaryConfigured = Boolean(
  process.env.CLOUDINARY_CLOUD_NAME &&
  process.env.CLOUDINARY_API_KEY &&
  process.env.CLOUDINARY_API_SECRET
)

/**
 * Upload a Buffer or Base64 image to Cloudinary
 */
export async function uploadImageToCloudinary(
  fileBuffer: Buffer,
  folder: string = 'serendipity-books'
): Promise<{ success: boolean; url: string; public_id?: string; error?: any }> {
  if (!isCloudinaryConfigured) {
    // If Cloudinary is not configured yet, convert to base64 data URI as fallback for demo
    const base64 = `data:image/jpeg;base64,${fileBuffer.toString('base64')}`
    return {
      success: true,
      url: base64,
    }
  }

  return new Promise((resolve) => {
    cloudinary.uploader
      .upload_stream(
        {
          folder,
          resource_type: 'image',
        },
        (error, result: UploadApiResponse | undefined) => {
          if (error || !result) {
            console.error('Cloudinary upload stream error:', error)
            resolve({ success: false, url: '', error })
          } else {
            resolve({
              success: true,
              url: result.secure_url,
              public_id: result.public_id,
            })
          }
        }
      )
      .end(fileBuffer)
  })
}
