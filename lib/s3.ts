import AWS from 'aws-sdk'

// Configure AWS S3
const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION || 'us-east-1',
})

const BUCKET_NAME = process.env.AWS_S3_BUCKET_NAME!

export async function uploadSignedWaiver(
  fileBuffer: Buffer,
  fileName: string,
  contentType: string = 'application/pdf'
): Promise<string> {
  const params = {
    Bucket: BUCKET_NAME,
    Key: fileName,
    Body: fileBuffer,
    ContentType: contentType,
    ACL: 'private', // Make sure signed waivers are private
  }

  const result = await s3.upload(params).promise()
  return result.Key
}

export async function uploadWaiverPDF(
  fileBuffer: Buffer,
  fileName: string
): Promise<string> {
  const params = {
    Bucket: BUCKET_NAME,
    Key: fileName,
    Body: fileBuffer,
    ContentType: 'application/pdf',
    ACL: 'public-read', // Waiver PDFs should be publicly accessible
  }

  const result = await s3.upload(params).promise()
  // Return the public URL
  return `https://${BUCKET_NAME}.s3.${process.env.AWS_REGION || 'us-east-1'}.amazonaws.com/${result.Key}`
}

export async function getSignedWaiverUrl(key: string): Promise<string> {
  const params = {
    Bucket: BUCKET_NAME,
    Key: key,
    Expires: 3600, // URL expires in 1 hour
  }

  return s3.getSignedUrl('getObject', params)
}

export async function deleteSignedWaiver(key: string): Promise<void> {
  const params = {
    Bucket: BUCKET_NAME,
    Key: key,
  }

  await s3.deleteObject(params).promise()
}

