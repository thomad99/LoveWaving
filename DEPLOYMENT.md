<<<<<<< HEAD
# Deployment Guide for LoveWaving

This guide will walk you through deploying LoveWaving to Render.

## Prerequisites

- A Render account (free tier available)
- An AWS account with S3 access
- A Google Cloud project (optional, for OAuth)

## Step 1: Database Setup on Render

1. Log in to your Render dashboard
2. Click "New +" and select "PostgreSQL"
3. Create a database with:
   - Name: `lovewaving-db`
   - Plan: Free (or paid for better performance)
   - Database: `lovewaving`
   - User: `lovewaving`
4. Copy the Internal Database URL (you'll need this later)

## Step 2: AWS S3 Setup

1. Log in to AWS Console
2. Create a new S3 bucket:
   - Name: `lovewaving-waivers` (or your preferred name)
   - Region: Choose your region (e.g., `us-east-1`)
   - Block public access: Enable (waivers should be private)
3. Create an IAM user for application access:
   - Go to IAM → Users → Create user
   - Name: `lovewaving-app`
   - Attach policy: `AmazonS3FullAccess` (or create custom policy)
4. Generate access keys:
   - Select the user → Security credentials
   - Create access key
   - Save Access Key ID and Secret Access Key

### S3 CORS Configuration

Add this CORS configuration to your S3 bucket:

```json
[
  {
    "AllowedHeaders": ["*"],
    "AllowedMethods": ["GET", "PUT", "POST"],
    "AllowedOrigins": ["https://your-render-app.onrender.com"],
    "ExposeHeaders": []
  }
]
```

## Step 3: Google OAuth Setup (Optional)

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable Google+ API
4. Go to Credentials → Create Credentials → OAuth 2.0 Client ID
5. Application type: Web application
6. Authorized redirect URIs: `https://your-render-app.onrender.com/api/auth/callback/google`
7. Save Client ID and Client Secret

## Step 4: Deploy to Render

### Option A: Using Render Dashboard

1. Connect your GitHub repository to Render
2. Click "New +" → "Web Service"
3. Configure:
   - Name: `lovewaving`
   - Environment: Node
   - Build Command: `npm install && npx prisma generate && npm run build`
   - Start Command: `npm start`

### Option B: Using render.yaml

1. Push your code to GitHub
2. Render will automatically detect the `render.yaml` file
3. Click "New +" → "Blueprint"
4. Connect your repository
5. Render will create the services as specified

## Step 5: Configure Environment Variables

In the Render dashboard, go to your web service → Environment:

```env
# Database (use Render's internal database URL)
DATABASE_URL=postgresql://user:pass@internal-host:5432/lovewaving

# NextAuth
NEXTAUTH_URL=https://your-app.onrender.com
NEXTAUTH_SECRET=generate-a-random-secret-here

# AWS S3
AWS_ACCESS_KEY_ID=your-access-key
AWS_SECRET_ACCESS_KEY=your-secret-key
AWS_REGION=us-east-1
AWS_S3_BUCKET_NAME=lovewaving-waivers

# Google OAuth (optional)
GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-client-secret

# Node
NODE_ENV=production
```

**Important:** Generate a secure `NEXTAUTH_SECRET`:
```bash
openssl rand -base64 32
```

## Step 6: Run Database Migrations

After deployment, run migrations:

1. Go to your Render dashboard → Shell
2. Or connect to your database via SSH:
```bash
psql $DATABASE_URL
```

3. Run migrations:
```bash
npm run db:migrate
```

Alternatively, use Prisma Studio:
```bash
npx prisma studio
```

## Step 7: Create First Admin User

You'll need to create the first admin user manually:

1. Sign up normally via the web interface
2. Connect to your database and run:
```sql
UPDATE "User" SET role = 'ADMIN' WHERE email = 'your-email@example.com';
```

Or use Prisma Studio to update the user role.

## Step 8: Verify Deployment

1. Visit your Render URL
2. Test signup/signin
3. Create a test event as admin
4. Try signing a waiver
5. Check S3 for uploaded files

## Troubleshooting

### Build Errors

- Ensure all environment variables are set
- Check Node.js version (should be 18+)
- Review build logs in Render dashboard

### Database Connection Issues

- Verify DATABASE_URL is correct
- Use internal database URL for Render services
- Check database is running

### S3 Upload Failures

- Verify AWS credentials
- Check S3 bucket exists and is accessible
- Review IAM permissions
- Check CORS configuration

### Authentication Issues

- Verify NEXTAUTH_URL matches your Render URL
- Ensure NEXTAUTH_SECRET is set
- Check callback URLs in OAuth providers

### Performance

- Consider upgrading to a paid database plan
- Enable database connection pooling
- Use CDN for static assets
- Optimize images

## Monitoring

- Use Render's built-in logging
- Set up error tracking (Sentry, etc.)
- Monitor database performance
- Track S3 usage

## Backup

- Enable automatic backups on Render database
- Regularly back up S3 bucket
- Keep database dumps
- Version control your code

## Security

- Never commit `.env` files
- Use strong NEXTAUTH_SECRET
- Rotate AWS keys periodically
- Enable 2FA on all accounts
- Use HTTPS only
- Review and update dependencies regularly

## Scaling

- Upgrade database plan as needed
- Add more web instances for load balancing
- Use Redis for session storage
- Implement caching where appropriate
- Consider CDN for static assets

## Support

For issues:
1. Check Render logs
2. Review error messages
3. Test locally with production env vars
4. Contact Render support if needed

=======
# Deployment Guide for LoveWaving

This guide will walk you through deploying LoveWaving to Render.

## Prerequisites

- A Render account (free tier available)
- An AWS account with S3 access
- A Google Cloud project (optional, for OAuth)

## Step 1: Database Setup on Render

1. Log in to your Render dashboard
2. Click "New +" and select "PostgreSQL"
3. Create a database with:
   - Name: `lovewaving-db`
   - Plan: Free (or paid for better performance)
   - Database: `lovewaving`
   - User: `lovewaving`
4. Copy the Internal Database URL (you'll need this later)

## Step 2: AWS S3 Setup

1. Log in to AWS Console
2. Create a new S3 bucket:
   - Name: `lovewaving-waivers` (or your preferred name)
   - Region: Choose your region (e.g., `us-east-1`)
   - Block public access: Enable (waivers should be private)
3. Create an IAM user for application access:
   - Go to IAM → Users → Create user
   - Name: `lovewaving-app`
   - Attach policy: `AmazonS3FullAccess` (or create custom policy)
4. Generate access keys:
   - Select the user → Security credentials
   - Create access key
   - Save Access Key ID and Secret Access Key

### S3 CORS Configuration

Add this CORS configuration to your S3 bucket:

```json
[
  {
    "AllowedHeaders": ["*"],
    "AllowedMethods": ["GET", "PUT", "POST"],
    "AllowedOrigins": ["https://your-render-app.onrender.com"],
    "ExposeHeaders": []
  }
]
```

## Step 3: Google OAuth Setup (Optional)

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable Google+ API
4. Go to Credentials → Create Credentials → OAuth 2.0 Client ID
5. Application type: Web application
6. Authorized redirect URIs: `https://your-render-app.onrender.com/api/auth/callback/google`
7. Save Client ID and Client Secret

## Step 4: Deploy to Render

### Option A: Using Render Dashboard

1. Connect your GitHub repository to Render
2. Click "New +" → "Web Service"
3. Configure:
   - Name: `lovewaving`
   - Environment: Node
   - Build Command: `npm install && npx prisma generate && npm run build`
   - Start Command: `npm start`

### Option B: Using render.yaml

1. Push your code to GitHub
2. Render will automatically detect the `render.yaml` file
3. Click "New +" → "Blueprint"
4. Connect your repository
5. Render will create the services as specified

## Step 5: Configure Environment Variables

In the Render dashboard, go to your web service → Environment:

```env
# Database (use Render's internal database URL)
DATABASE_URL=postgresql://user:pass@internal-host:5432/lovewaving

# NextAuth
NEXTAUTH_URL=https://your-app.onrender.com
NEXTAUTH_SECRET=generate-a-random-secret-here

# AWS S3
AWS_ACCESS_KEY_ID=your-access-key
AWS_SECRET_ACCESS_KEY=your-secret-key
AWS_REGION=us-east-1
AWS_S3_BUCKET_NAME=lovewaving-waivers

# Google OAuth (optional)
GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-client-secret

# Node
NODE_ENV=production
```

**Important:** Generate a secure `NEXTAUTH_SECRET`:
```bash
openssl rand -base64 32
```

## Step 6: Run Database Migrations

After deployment, run migrations:

1. Go to your Render dashboard → Shell
2. Or connect to your database via SSH:
```bash
psql $DATABASE_URL
```

3. Run migrations:
```bash
npm run db:migrate
```

Alternatively, use Prisma Studio:
```bash
npx prisma studio
```

## Step 7: Create First Admin User

You'll need to create the first admin user manually:

1. Sign up normally via the web interface
2. Connect to your database and run:
```sql
UPDATE "User" SET role = 'ADMIN' WHERE email = 'your-email@example.com';
```

Or use Prisma Studio to update the user role.

## Step 8: Verify Deployment

1. Visit your Render URL
2. Test signup/signin
3. Create a test event as admin
4. Try signing a waiver
5. Check S3 for uploaded files

## Troubleshooting

### Build Errors

- Ensure all environment variables are set
- Check Node.js version (should be 18+)
- Review build logs in Render dashboard

### Database Connection Issues

- Verify DATABASE_URL is correct
- Use internal database URL for Render services
- Check database is running

### S3 Upload Failures

- Verify AWS credentials
- Check S3 bucket exists and is accessible
- Review IAM permissions
- Check CORS configuration

### Authentication Issues

- Verify NEXTAUTH_URL matches your Render URL
- Ensure NEXTAUTH_SECRET is set
- Check callback URLs in OAuth providers

### Performance

- Consider upgrading to a paid database plan
- Enable database connection pooling
- Use CDN for static assets
- Optimize images

## Monitoring

- Use Render's built-in logging
- Set up error tracking (Sentry, etc.)
- Monitor database performance
- Track S3 usage

## Backup

- Enable automatic backups on Render database
- Regularly back up S3 bucket
- Keep database dumps
- Version control your code

## Security

- Never commit `.env` files
- Use strong NEXTAUTH_SECRET
- Rotate AWS keys periodically
- Enable 2FA on all accounts
- Use HTTPS only
- Review and update dependencies regularly

## Scaling

- Upgrade database plan as needed
- Add more web instances for load balancing
- Use Redis for session storage
- Implement caching where appropriate
- Consider CDN for static assets

## Support

For issues:
1. Check Render logs
2. Review error messages
3. Test locally with production env vars
4. Contact Render support if needed

>>>>>>> 323292e4b68c097df3b7c68f2edcdaab42bcfef9
