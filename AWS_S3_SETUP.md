# AWS S3 Setup for LoveWaving

Complete guide to configure your S3 bucket for document storage.

## Step 1: Create IAM User

### Create User
1. Go to AWS Console → IAM
2. Click **Users** → **Add Users**
3. Username: `lovewaving-app`
4. Click **Next**

### Attach Policy
1. Select **"Attach policies directly"**
2. Search for: `AmazonS3FullAccess`
3. Check the box
4. Click **Next**
5. Click **Create User**

### Create Access Keys
1. Click on the user you just created
2. Go to **Security Credentials** tab
3. Click **Create Access Key**
4. Select **Application running outside AWS**
5. Click **Next**
6. Description: `LoveWaving Web App`
7. Click **Create Access Key**
8. **IMPORTANT:** Copy both:
   - **Access Key ID**
   - **Secret Access Key** (only shown once!)

Save these - you'll add them to Render!

---

## Step 2: Configure S3 Bucket

### Set Bucket Policies

Go to your S3 bucket → **Permissions** tab:

#### A. Block Public Access
1. Click **Block public access**
2. Keep settings as:
   - ✅ Block all public access (important for security)
3. Click **Save**

#### B. Bucket Policy (for Private Access)

Click **Bucket Policy** and add:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "AllowAppAccess",
      "Effect": "Allow",
      "Principal": {
        "AWS": "arn:aws:iam::YOUR_ACCOUNT_ID:user/lovewaving-app"
      },
      "Action": [
        "s3:PutObject",
        "s3:GetObject",
        "s3:DeleteObject"
      ],
      "Resource": "arn:aws:s3:::YOUR_BUCKET_NAME/*"
    }
  ]
}
```

**Replace:**
- `YOUR_ACCOUNT_ID` - Your AWS account ID (find in IAM dashboard)
- `YOUR_BUCKET_NAME` - Your actual bucket name

#### C. CORS Configuration

Click **CORS** and add:

```json
[
  {
    "AllowedHeaders": [
      "*"
    ],
    "AllowedMethods": [
      "PUT",
      "POST",
      "GET",
      "DELETE"
    ],
    "AllowedOrigins": [
      "https://your-app-name.onrender.com",
      "http://localhost:3000"
    ],
    "ExposeHeaders": [
      "ETag"
    ],
    "MaxAgeSeconds": 3000
  }
]
```

**Replace:**
- `your-app-name.onrender.com` - Your actual Render URL

---

## Step 3: Add Credentials to Render

Go to Render Dashboard → Your Web Service → **Environment** tab:

### Add These Variables:

1. **AWS_ACCESS_KEY_ID**
   - Value: Your Access Key ID from IAM

2. **AWS_SECRET_ACCESS_KEY**
   - Value: Your Secret Access Key from IAM

3. **AWS_REGION**
   - Value: Your S3 bucket region (e.g., `us-east-1`)

4. **AWS_S3_BUCKET_NAME**
   - Value: Your S3 bucket name

Click **Save Changes** - Render will redeploy!

---

## Step 4: Verify Setup

After deployment:

1. Try uploading a waiver in your app
2. Go to AWS S3 Console
3. Check your bucket
4. You should see files in: `signed-waivers/` folder

---

## Security Best Practices

### ✅ DO:
- Keep Access Keys private
- Use IAM user (not root account)
- Block all public access
- Use specific bucket policies
- Rotate keys regularly

### ❌ DON'T:
- Commit keys to GitHub
- Share keys publicly
- Use root account credentials
- Make bucket public
- Give unnecessary permissions

---

## Accessing Your Files

Your signed waivers will be stored as:
```
bucket-name/
  signed-waivers/
    event-id/
      user-id/
        signature-id.pdf
```

**Example:**
```
lovewaving-waivers/
  signed-waivers/
    clx123456/
      user789/
        sig456.pdf
```

---

## Troubleshooting

### "Access Denied"
- Check IAM policy is attached
- Verify bucket policy syntax
- Confirm Access Key is correct

### "CORS Error"
- Check CORS configuration
- Verify AllowedOrigins includes your Render URL
- Clear browser cache

### "Invalid Signature"
- Re-check Access Key and Secret
- Verify region matches bucket region
- Ensure keys haven't expired

### "Bucket Not Found"
- Verify bucket name is correct
- Check bucket is in same region as config
- Confirm bucket exists

---

## Need Help?

- **AWS S3 Docs:** https://docs.aws.amazon.com/s3/
- **IAM Docs:** https://docs.aws.amazon.com/iam/
- **Prisma & S3:** Check our lib/s3.ts implementation

---

## Quick Reference

### Required Environment Variables:
```
AWS_ACCESS_KEY_ID=AKIAXXXXXXXXXXXXXXXX
AWS_SECRET_ACCESS_KEY=abc123xyz789...
AWS_REGION=us-east-1
AWS_S3_BUCKET_NAME=lovewaving-waivers
```

### Bucket Structure:
```
lovewaving-waivers/
├── signed-waivers/
│   ├── event-1/
│   │   ├── user-1/
│   │   │   └── signature.pdf
│   │   └── user-2/
│   │       └── signature.pdf
│   └── event-2/
└── ... (private, secure)
```

---

**You're all set!** Your S3 bucket is configured for LoveWaving! 🎉

