<<<<<<< HEAD
# Render Deployment Guide for LoveWaving

This is a comprehensive guide for deploying LoveWaving to Render using your existing Render resources.

## Quick Start

Since you already have a Render PostgreSQL database, we'll connect to it!

## Step 1: Get Your DATABASE_URL from Render

1. Log into your [Render Dashboard](https://dashboard.render.com/)
2. Go to your PostgreSQL database
3. In the "Info" tab, find **"Internal Database URL"**
4. Copy this URL - it looks like:
   ```
   postgresql://username:password@internal-hostname:5432/database_name
   ```

**Important:** Use the **INTERNAL** database URL for your web service, not the external one!

## Step 2: Create Web Service on Render

### Option A: Using render.yaml (Recommended)

1. Push your code to GitHub
2. In Render Dashboard, click **"New +"** → **"Blueprint"**
3. Connect your GitHub repository
4. Render will automatically detect `render.yaml` and create:
   - Your web service
   - Database connection configuration

### Option B: Manual Setup

1. Click **"New +"** → **"Web Service"**
2. Connect your GitHub repository
3. Configure the service:

```yaml
Name: lovewaving
Environment: Node
Build Command: npm install && npx prisma generate && npm run build
Start Command: npm start
```

## Step 3: Configure Environment Variables

In your Render web service → **Environment** tab, add:

### Required Variables

```bash
# Database (from your existing Render DB)
DATABASE_URL=postgresql://...your-internal-db-url-from-render

# NextAuth
NEXTAUTH_URL=https://your-app-name.onrender.com
NEXTAUTH_SECRET=generate-a-strong-random-string

# Node Environment
NODE_ENV=production
```

### Optional Variables (Add as needed)

```bash
# AWS S3 (for storing signed waivers)
AWS_ACCESS_KEY_ID=your-aws-access-key-id
AWS_SECRET_ACCESS_KEY=your-aws-secret-access-key
AWS_REGION=us-east-1
AWS_S3_BUCKET_NAME=lovewaving-waivers

# Google OAuth (for social login)
GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-client-secret
```

**Generate NEXTAUTH_SECRET:**
```bash
# In your terminal
openssl rand -base64 32
```

## Step 4: Deploy!

1. Click **"Save Changes"**
2. Render will automatically:
   - Install dependencies
   - Generate Prisma Client
   - Build your application
   - Start the server

**First deployment usually takes 5-10 minutes.**

## Step 5: Run Database Migrations

After your first successful deploy:

### Option A: Via Render Shell

1. Go to your web service → **Shell** tab
2. Run:
```bash
npx prisma migrate deploy
```

### Option B: Via Render Dashboard

1. Go to your web service
2. Find the **"Shell"** option in the left menu
3. Connect and run:
```bash
npx prisma migrate deploy
```

### Option C: Use existing schema (if database already has structure)

If your Render database already has tables, you might skip migrations and just push:
```bash
npx prisma db push
```

## Step 6: Create First Admin User

1. Visit your deployed app: `https://your-app-name.onrender.com`
2. Click **"Sign Up"** and create an account
3. Go to Render Shell (or your local terminal with Render connection)
4. Use Prisma Studio:
```bash
npx prisma studio
```
5. Or update via SQL:
```sql
UPDATE "User" SET role = 'ADMIN' WHERE email = 'your-email@example.com';
```

## Configuration Details

### Build Settings

**Build Command:**
```bash
npm install && npx prisma generate && npm run build
```

**Start Command:**
```bash
npm start
```

### Auto-Deploy

Render will automatically deploy when you push to:
- `main` branch (production)
- Any branch you configure

### Health Check

The app will automatically be health-checked on:
```
GET https://your-app.onrender.com
```

## Environment Variable Reference

| Variable | Required | Source | Description |
|----------|----------|--------|-------------|
| DATABASE_URL | ✅ Yes | Render DB | PostgreSQL connection string |
| NEXTAUTH_URL | ✅ Yes | Manual | Your Render app URL |
| NEXTAUTH_SECRET | ✅ Yes | Generate | Random secret key |
| NODE_ENV | ✅ Yes | Set to `production` | Node environment |
| AWS_ACCESS_KEY_ID | ❌ Optional | AWS | For S3 storage |
| AWS_SECRET_ACCESS_KEY | ❌ Optional | AWS | For S3 storage |
| AWS_REGION | ❌ Optional | AWS | S3 region |
| AWS_S3_BUCKET_NAME | ❌ Optional | AWS | S3 bucket name |
| GOOGLE_CLIENT_ID | ❌ Optional | Google | OAuth client ID |
| GOOGLE_CLIENT_SECRET | ❌ Optional | Google | OAuth secret |

## Updating Your Application

### After Code Changes

1. Push to your main branch
2. Render automatically:
   - Builds the new version
   - Runs health checks
   - Switches traffic to new version

### Database Schema Changes

When you update Prisma schema:

1. Update `prisma/schema.prisma`
2. Commit and push
3. In Render Shell, run:
```bash
npx prisma migrate deploy
```

Or for development:
```bash
npx prisma db push
```

## Troubleshooting

### "Cannot connect to database"

**Solution:**
- Verify you're using the **INTERNAL** database URL
- Check your database is running in Render dashboard
- Ensure database is in the same region as your app

### "Module not found: @prisma/client"

**Solution:**
Build command must include `npx prisma generate`:
```bash
npm install && npx prisma generate && npm run build
```

### "NEXTAUTH_SECRET missing"

**Solution:**
Generate and add to environment variables:
```bash
openssl rand -base64 32
```

### "Build failed"

**Check:**
- All environment variables set
- Node version is 18+
- No syntax errors in code
- Review build logs

### App shows error on first load

**Solution:**
- Check Render logs
- Verify migrations ran
- Test database connection
- Review environment variables

## Monitoring

### View Logs

1. Go to your web service
2. Click **"Logs"** tab
3. Real-time logs of application activity

### Metrics

Render dashboard shows:
- Request rate
- Response times
- Error rates
- Resource usage

## Database Management

### Access Database

**Via Shell:**
```bash
# In Render Shell
psql $DATABASE_URL
```

**Via Prisma Studio:**
```bash
# In Render Shell
npx prisma studio
```

### Backup Database

Render provides automatic backups:
1. Go to your database
2. Click **"Backups"** tab
3. Configure backup schedule

### View Connection Info

In your database dashboard:
- **Info** tab → Connection strings
- **Users** tab → Database users
- **Logs** tab → Database logs

## Custom Domain (Optional)

1. Go to your web service
2. Click **"Settings"** → **"Custom Domains"**
3. Add your domain
4. Follow DNS configuration instructions

## Scaling

### Upgrade Plan

1. Go to service settings
2. Change plan (Free → Starter → Standard, etc.)
3. More resources = better performance

### Multiple Instances

For high traffic:
1. Upgrade to paid plan
2. Enable auto-scaling
3. Configure instance count

## Security Checklist

- ✅ Use INTERNAL database URL (not external)
- ✅ Strong NEXTAUTH_SECRET
- ✅ HTTPS enabled by default
- ✅ Environment variables secured
- ✅ Database backups enabled
- ✅ Regular dependency updates

## Useful Commands for Render Shell

```bash
# Database
npx prisma studio              # Open database GUI
npx prisma migrate deploy      # Run migrations
npx prisma db push             # Push schema

# Application
npm run build                  # Rebuild app
npm run start                  # Start server
npm run lint                   # Check code

# Database direct
psql $DATABASE_URL             # Connect to DB
```

## Support

- **Render Docs**: https://render.com/docs
- **Render Status**: https://status.render.com
- **Community**: Render Community Slack
- **Tickets**: Render Dashboard → Support

## Next Steps

After successful deployment:

1. ✅ Test signup/login
2. ✅ Create first event
3. ✅ Test waiver signing
4. ✅ Verify S3 uploads (if configured)
5. ✅ Set up monitoring
6. ✅ Configure custom domain
7. ✅ Enable backups

## Important Notes

⚠️ **Free tier limitations:**
- Services spin down after 15 minutes of inactivity
- First request may be slow (cold start)
- Limited bandwidth and resources

⚠️ **Production recommendations:**
- Upgrade to paid plan
- Set up monitoring
- Configure alerts
- Regular backups
- CDN for assets

🎉 **You're all set!** Your LoveWaving app is now live on Render!

=======
# Render Deployment Guide for LoveWaving

This is a comprehensive guide for deploying LoveWaving to Render using your existing Render resources.

## Quick Start

Since you already have a Render PostgreSQL database, we'll connect to it!

## Step 1: Get Your DATABASE_URL from Render

1. Log into your [Render Dashboard](https://dashboard.render.com/)
2. Go to your PostgreSQL database
3. In the "Info" tab, find **"Internal Database URL"**
4. Copy this URL - it looks like:
   ```
   postgresql://username:password@internal-hostname:5432/database_name
   ```

**Important:** Use the **INTERNAL** database URL for your web service, not the external one!

## Step 2: Create Web Service on Render

### Option A: Using render.yaml (Recommended)

1. Push your code to GitHub
2. In Render Dashboard, click **"New +"** → **"Blueprint"**
3. Connect your GitHub repository
4. Render will automatically detect `render.yaml` and create:
   - Your web service
   - Database connection configuration

### Option B: Manual Setup

1. Click **"New +"** → **"Web Service"**
2. Connect your GitHub repository
3. Configure the service:

```yaml
Name: lovewaving
Environment: Node
Build Command: npm install && npx prisma generate && npm run build
Start Command: npm start
```

## Step 3: Configure Environment Variables

In your Render web service → **Environment** tab, add:

### Required Variables

```bash
# Database (from your existing Render DB)
DATABASE_URL=postgresql://...your-internal-db-url-from-render

# NextAuth
NEXTAUTH_URL=https://your-app-name.onrender.com
NEXTAUTH_SECRET=generate-a-strong-random-string

# Node Environment
NODE_ENV=production
```

### Optional Variables (Add as needed)

```bash
# AWS S3 (for storing signed waivers)
AWS_ACCESS_KEY_ID=your-aws-access-key-id
AWS_SECRET_ACCESS_KEY=your-aws-secret-access-key
AWS_REGION=us-east-1
AWS_S3_BUCKET_NAME=lovewaving-waivers

# Google OAuth (for social login)
GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-client-secret
```

**Generate NEXTAUTH_SECRET:**
```bash
# In your terminal
openssl rand -base64 32
```

## Step 4: Deploy!

1. Click **"Save Changes"**
2. Render will automatically:
   - Install dependencies
   - Generate Prisma Client
   - Build your application
   - Start the server

**First deployment usually takes 5-10 minutes.**

## Step 5: Run Database Migrations

After your first successful deploy:

### Option A: Via Render Shell

1. Go to your web service → **Shell** tab
2. Run:
```bash
npx prisma migrate deploy
```

### Option B: Via Render Dashboard

1. Go to your web service
2. Find the **"Shell"** option in the left menu
3. Connect and run:
```bash
npx prisma migrate deploy
```

### Option C: Use existing schema (if database already has structure)

If your Render database already has tables, you might skip migrations and just push:
```bash
npx prisma db push
```

## Step 6: Create First Admin User

1. Visit your deployed app: `https://your-app-name.onrender.com`
2. Click **"Sign Up"** and create an account
3. Go to Render Shell (or your local terminal with Render connection)
4. Use Prisma Studio:
```bash
npx prisma studio
```
5. Or update via SQL:
```sql
UPDATE "User" SET role = 'ADMIN' WHERE email = 'your-email@example.com';
```

## Configuration Details

### Build Settings

**Build Command:**
```bash
npm install && npx prisma generate && npm run build
```

**Start Command:**
```bash
npm start
```

### Auto-Deploy

Render will automatically deploy when you push to:
- `main` branch (production)
- Any branch you configure

### Health Check

The app will automatically be health-checked on:
```
GET https://your-app.onrender.com
```

## Environment Variable Reference

| Variable | Required | Source | Description |
|----------|----------|--------|-------------|
| DATABASE_URL | ✅ Yes | Render DB | PostgreSQL connection string |
| NEXTAUTH_URL | ✅ Yes | Manual | Your Render app URL |
| NEXTAUTH_SECRET | ✅ Yes | Generate | Random secret key |
| NODE_ENV | ✅ Yes | Set to `production` | Node environment |
| AWS_ACCESS_KEY_ID | ❌ Optional | AWS | For S3 storage |
| AWS_SECRET_ACCESS_KEY | ❌ Optional | AWS | For S3 storage |
| AWS_REGION | ❌ Optional | AWS | S3 region |
| AWS_S3_BUCKET_NAME | ❌ Optional | AWS | S3 bucket name |
| GOOGLE_CLIENT_ID | ❌ Optional | Google | OAuth client ID |
| GOOGLE_CLIENT_SECRET | ❌ Optional | Google | OAuth secret |

## Updating Your Application

### After Code Changes

1. Push to your main branch
2. Render automatically:
   - Builds the new version
   - Runs health checks
   - Switches traffic to new version

### Database Schema Changes

When you update Prisma schema:

1. Update `prisma/schema.prisma`
2. Commit and push
3. In Render Shell, run:
```bash
npx prisma migrate deploy
```

Or for development:
```bash
npx prisma db push
```

## Troubleshooting

### "Cannot connect to database"

**Solution:**
- Verify you're using the **INTERNAL** database URL
- Check your database is running in Render dashboard
- Ensure database is in the same region as your app

### "Module not found: @prisma/client"

**Solution:**
Build command must include `npx prisma generate`:
```bash
npm install && npx prisma generate && npm run build
```

### "NEXTAUTH_SECRET missing"

**Solution:**
Generate and add to environment variables:
```bash
openssl rand -base64 32
```

### "Build failed"

**Check:**
- All environment variables set
- Node version is 18+
- No syntax errors in code
- Review build logs

### App shows error on first load

**Solution:**
- Check Render logs
- Verify migrations ran
- Test database connection
- Review environment variables

## Monitoring

### View Logs

1. Go to your web service
2. Click **"Logs"** tab
3. Real-time logs of application activity

### Metrics

Render dashboard shows:
- Request rate
- Response times
- Error rates
- Resource usage

## Database Management

### Access Database

**Via Shell:**
```bash
# In Render Shell
psql $DATABASE_URL
```

**Via Prisma Studio:**
```bash
# In Render Shell
npx prisma studio
```

### Backup Database

Render provides automatic backups:
1. Go to your database
2. Click **"Backups"** tab
3. Configure backup schedule

### View Connection Info

In your database dashboard:
- **Info** tab → Connection strings
- **Users** tab → Database users
- **Logs** tab → Database logs

## Custom Domain (Optional)

1. Go to your web service
2. Click **"Settings"** → **"Custom Domains"**
3. Add your domain
4. Follow DNS configuration instructions

## Scaling

### Upgrade Plan

1. Go to service settings
2. Change plan (Free → Starter → Standard, etc.)
3. More resources = better performance

### Multiple Instances

For high traffic:
1. Upgrade to paid plan
2. Enable auto-scaling
3. Configure instance count

## Security Checklist

- ✅ Use INTERNAL database URL (not external)
- ✅ Strong NEXTAUTH_SECRET
- ✅ HTTPS enabled by default
- ✅ Environment variables secured
- ✅ Database backups enabled
- ✅ Regular dependency updates

## Useful Commands for Render Shell

```bash
# Database
npx prisma studio              # Open database GUI
npx prisma migrate deploy      # Run migrations
npx prisma db push             # Push schema

# Application
npm run build                  # Rebuild app
npm run start                  # Start server
npm run lint                   # Check code

# Database direct
psql $DATABASE_URL             # Connect to DB
```

## Support

- **Render Docs**: https://render.com/docs
- **Render Status**: https://status.render.com
- **Community**: Render Community Slack
- **Tickets**: Render Dashboard → Support

## Next Steps

After successful deployment:

1. ✅ Test signup/login
2. ✅ Create first event
3. ✅ Test waiver signing
4. ✅ Verify S3 uploads (if configured)
5. ✅ Set up monitoring
6. ✅ Configure custom domain
7. ✅ Enable backups

## Important Notes

⚠️ **Free tier limitations:**
- Services spin down after 15 minutes of inactivity
- First request may be slow (cold start)
- Limited bandwidth and resources

⚠️ **Production recommendations:**
- Upgrade to paid plan
- Set up monitoring
- Configure alerts
- Regular backups
- CDN for assets

🎉 **You're all set!** Your LoveWaving app is now live on Render!

>>>>>>> 323292e4b68c097df3b7c68f2edcdaab42bcfef9
