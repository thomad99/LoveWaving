import { S3Client, PutObjectCommand, GetObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'

// Helper to extract region code from full region name or use as-is
function getRegionCode(): string {
  const region = process.env.AWS_REGION || 'us-east-1'
  // If region includes the full name like "US East (N. Virginia) us-east-1", extract just the code
  const match = region.match(/\b([a-z]{2}-[a-z]+-\d+)\b/i)
  return match ? match[1] : region
}

const AWS_REGION = getRegionCode()

// Configure AWS S3
const s3Client = new S3Client({
  region: AWS_REGION,
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
    // ACL removed - bucket doesn't allow ACLs, use bucket policies for access control
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
    // ACL removed - bucket doesn't allow ACLs
    // For public access, configure bucket policy or use presigned URLs
  })

  await s3Client.send(command)
  // Return the URL (will be accessible if bucket policy allows, otherwise use presigned URLs)
  return `https://${BUCKET_NAME}.s3.${AWS_REGION}.amazonaws.com/${fileName}`
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
