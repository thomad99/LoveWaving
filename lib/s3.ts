import { S3Client, PutObjectCommand, GetObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'

// Configure AWS S3
const s3Client = new S3Client({
  region: process.env.AWS_REGION || 'us-east-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
  },
})

const BUCKET_NAME = process.env.AWS_S3_BUCKET_NAME!

export async function uploadSignedWaiver(
  fileBuffer: Buffer,
  fileName: string,
  contentType: string = 'application/pdf'
): Promise<string> {
  const command = new PutObjectCommand({
    Bucket: BUCKET_NAME,
    Key: fileName,
    Body: fileBuffer,
    ContentType: contentType,
    ACL: 'private', // Make sure signed waivers are private
  })

  await s3Client.send(command)
  return fileName
}

export async function uploadWaiverPDF(
  fileBuffer: Buffer,
  fileName: string
): Promise<string> {
  const command = new PutObjectCommand({
    Bucket: BUCKET_NAME,
    Key: fileName,
    Body: fileBuffer,
    ContentType: 'application/pdf',
    ACL: 'public-read', // Waiver PDFs should be publicly accessible
  })

  await s3Client.send(command)
  // Return the public URL
  return `https://${BUCKET_NAME}.s3.${process.env.AWS_REGION || 'us-east-1'}.amazonaws.com/${fileName}`
}

export async function getSignedWaiverUrl(key: string): Promise<string> {
  const command = new GetObjectCommand({
    Bucket: BUCKET_NAME,
    Key: key,
  })

  // Generate a URL that expires in 1 hour
  return getSignedUrl(s3Client, command, { expiresIn: 3600 })
}

export async function deleteSignedWaiver(key: string): Promise<void> {
  const command = new DeleteObjectCommand({
    Bucket: BUCKET_NAME,
    Key: key,
  })

  await s3Client.send(command)
}
