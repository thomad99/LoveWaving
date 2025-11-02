<<<<<<< HEAD
# Connect Render to Your GitHub Repository

After your code is on GitHub, follow these steps to connect Render:

## Step-by-Step Instructions

### 1. Go to Render Dashboard
Visit: https://dashboard.render.com/

### 2. Create New Web Service
- Click **"New +"** button (top right)
- Select **"Web Service"**

### 3. Connect GitHub Account
- Click **"Connect GitHub"** button
- Authorize Render to access your repositories
- Grant necessary permissions

### 4. Select Your Repository
- Search for: `LoveWaving`
- Click on: **thomad99/LoveWaving**
- Click **"Connect"**

### 5. Configure Service
Fill in the details:

**Name:** `lovewaving` (or any name you prefer)

**Environment:** `Node`

**Region:** Choose closest to you (or your users)

**Branch:** `main`

**Root Directory:** (leave empty, or use `.`)

**Runtime:** `Node`

**Build Command:**
```
npm install && npx prisma generate && npm run build
```

**Start Command:**
```
npm start
```

**Instance Type:** `Free` (to start)

### 6. Add Environment Variables

Click **"Advanced"** to expand environment variables section.

Click **"Add Environment Variable"** for each:

#### Required Variables:

1. **NODE_ENV**
   - Key: `NODE_ENV`
   - Value: `production`

2. **DATABASE_URL**
   - Key: `DATABASE_URL`
   - Value: (Your Render PostgreSQL internal URL)
   - Where to find: Render Dashboard → Your PostgreSQL DB → Info → Internal Database URL

3. **NEXTAUTH_URL**
   - Key: `NEXTAUTH_URL`
   - Value: `https://your-service-name.onrender.com` (use your actual service name)

4. **NEXTAUTH_SECRET**
   - Key: `NEXTAUTH_SECRET`
   - Value: (Generate with: `openssl rand -base64 32`)

#### Optional Variables:

5. **AWS_ACCESS_KEY_ID** (if using S3)
   - Key: `AWS_ACCESS_KEY_ID`
   - Value: (Your AWS access key)

6. **AWS_SECRET_ACCESS_KEY** (if using S3)
   - Key: `AWS_SECRET_ACCESS_KEY`
   - Value: (Your AWS secret key)

7. **AWS_REGION** (if using S3)
   - Key: `AWS_REGION`
   - Value: `us-east-1` (or your preferred region)

8. **AWS_S3_BUCKET_NAME** (if using S3)
   - Key: `AWS_S3_BUCKET_NAME`
   - Value: `lovewaving-waivers` (or your bucket name)

9. **GOOGLE_CLIENT_ID** (if using OAuth)
   - Key: `GOOGLE_CLIENT_ID`
   - Value: (Your Google OAuth client ID)

10. **GOOGLE_CLIENT_SECRET** (if using OAuth)
    - Key: `GOOGLE_CLIENT_SECRET`
    - Value: (Your Google OAuth secret)

### 7. Create Service

Click **"Create Web Service"** at the bottom.

Render will now:
1. Clone your repository
2. Install dependencies
3. Build your application
4. Deploy to production

**First deployment takes 5-10 minutes.**

### 8. Wait for Deployment

You'll see the build logs in real-time. Watch for:
- ✅ Dependencies installing
- ✅ Prisma client generating
- ✅ Next.js building
- ✅ Service starting

### 9. Run Database Migrations

Once deployment succeeds:

#### Via Render Shell:
1. Go to your service → **"Shell"** tab
2. Click **"Connect"** or **"Open Shell"**
3. Run:
```bash
npx prisma migrate deploy
```

#### Or use render.yaml (if using Blueprint):
Migrations may run automatically if configured.

### 10. Test Your Application

Visit your deployed app:
```
https://your-service-name.onrender.com
```

You should see the LoveWaving landing page!

### 11. Create First Admin User

1. Click **"Sign Up"**
2. Create your account
3. Open Render Shell
4. Run Prisma Studio:
```bash
npx prisma studio
```
5. Find your user and change `role` to `ADMIN`

Or use SQL:
```sql
UPDATE "User" SET role = 'ADMIN' WHERE email = 'your-email@example.com';
```

## Auto-Deploy Setup

Render is now configured for automatic deploys!

### Automatic Deployments:
- ✅ Every push to `main` branch
- ✅ Triggered by commits
- ✅ Zero-downtime updates
- ✅ Rollback capability

### Manual Deploy:
1. Go to service → **"Manual Deploy"** tab
2. Select branch
3. Click **"Deploy latest commit"**

## Configuration Verification Checklist

Before going live, verify:

- [ ] Repository connected
- [ ] Build command correct
- [ ] Start command correct
- [ ] Environment variables set
- [ ] Database connected
- [ ] Migrations run
- [ ] Application accessible
- [ ] Login working
- [ ] Admin access working

## Troubleshooting Deployment

### Build Fails

**Check:**
- Environment variables are set
- Build command is correct
- No syntax errors in code
- Node version compatibility

**Fix:**
- Check build logs
- Review error messages
- Test locally first

### Application Crashes

**Check:**
- Start command is correct
- All environment variables set
- Database connection works
- Migrations completed

**Fix:**
- Review runtime logs
- Test database connection
- Verify environment variables

### Database Connection Issues

**Check:**
- Using INTERNAL database URL
- Database is running
- Credentials are correct

**Fix:**
- Verify database is active in Render
- Use internal URL not external
- Check environment variables

### Migration Errors

**Check:**
- Prisma schema is valid
- Database permissions
- Schema conflicts

**Fix:**
```bash
# In Render Shell
npx prisma migrate reset  # Warning: deletes data
# OR
npx prisma db push  # For development
```

## Monitoring

### View Logs
- Go to service → **"Logs"** tab
- Real-time application logs
- Search and filter available

### Health Checks
- Render checks `/` endpoint
- Automatic restart on failure
- Email alerts for issues

### Metrics
- Request rate
- Response times
- Error rates
- Resource usage

## Next Steps After Deployment

1. ✅ Test all features
2. ✅ Set up monitoring
3. ✅ Configure backups
4. ✅ Enable auto-scaling
5. ✅ Set custom domain
6. ✅ Set up alerts
7. ✅ Review security
8. ✅ Document deployment process

## Production Checklist

- [ ] Database backups enabled
- [ ] Monitoring configured
- [ ] Alerts set up
- [ ] Custom domain configured
- [ ] SSL certificate active
- [ ] Environment variables secured
- [ ] Secrets rotated regularly
- [ ] Logs reviewed
- [ ] Performance optimized
- [ ] Security audit completed

## Support Resources

- **Render Docs:** https://render.com/docs
- **Render Community:** https://community.render.com
- **Status Page:** https://status.render.com
- **GitHub Repository:** https://github.com/thomad99/LoveWaving

## You're Live! 🎉

Your LoveWaving application is now deployed and accessible worldwide!

**Your URL:** `https://your-service-name.onrender.com`

Share it with your team and start managing waivers digitally!

=======
# Connect Render to Your GitHub Repository

After your code is on GitHub, follow these steps to connect Render:

## Step-by-Step Instructions

### 1. Go to Render Dashboard
Visit: https://dashboard.render.com/

### 2. Create New Web Service
- Click **"New +"** button (top right)
- Select **"Web Service"**

### 3. Connect GitHub Account
- Click **"Connect GitHub"** button
- Authorize Render to access your repositories
- Grant necessary permissions

### 4. Select Your Repository
- Search for: `LoveWaving`
- Click on: **thomad99/LoveWaving**
- Click **"Connect"**

### 5. Configure Service
Fill in the details:

**Name:** `lovewaving` (or any name you prefer)

**Environment:** `Node`

**Region:** Choose closest to you (or your users)

**Branch:** `main`

**Root Directory:** (leave empty, or use `.`)

**Runtime:** `Node`

**Build Command:**
```
npm install && npx prisma generate && npm run build
```

**Start Command:**
```
npm start
```

**Instance Type:** `Free` (to start)

### 6. Add Environment Variables

Click **"Advanced"** to expand environment variables section.

Click **"Add Environment Variable"** for each:

#### Required Variables:

1. **NODE_ENV**
   - Key: `NODE_ENV`
   - Value: `production`

2. **DATABASE_URL**
   - Key: `DATABASE_URL`
   - Value: (Your Render PostgreSQL internal URL)
   - Where to find: Render Dashboard → Your PostgreSQL DB → Info → Internal Database URL

3. **NEXTAUTH_URL**
   - Key: `NEXTAUTH_URL`
   - Value: `https://your-service-name.onrender.com` (use your actual service name)

4. **NEXTAUTH_SECRET**
   - Key: `NEXTAUTH_SECRET`
   - Value: (Generate with: `openssl rand -base64 32`)

#### Optional Variables:

5. **AWS_ACCESS_KEY_ID** (if using S3)
   - Key: `AWS_ACCESS_KEY_ID`
   - Value: (Your AWS access key)

6. **AWS_SECRET_ACCESS_KEY** (if using S3)
   - Key: `AWS_SECRET_ACCESS_KEY`
   - Value: (Your AWS secret key)

7. **AWS_REGION** (if using S3)
   - Key: `AWS_REGION`
   - Value: `us-east-1` (or your preferred region)

8. **AWS_S3_BUCKET_NAME** (if using S3)
   - Key: `AWS_S3_BUCKET_NAME`
   - Value: `lovewaving-waivers` (or your bucket name)

9. **GOOGLE_CLIENT_ID** (if using OAuth)
   - Key: `GOOGLE_CLIENT_ID`
   - Value: (Your Google OAuth client ID)

10. **GOOGLE_CLIENT_SECRET** (if using OAuth)
    - Key: `GOOGLE_CLIENT_SECRET`
    - Value: (Your Google OAuth secret)

### 7. Create Service

Click **"Create Web Service"** at the bottom.

Render will now:
1. Clone your repository
2. Install dependencies
3. Build your application
4. Deploy to production

**First deployment takes 5-10 minutes.**

### 8. Wait for Deployment

You'll see the build logs in real-time. Watch for:
- ✅ Dependencies installing
- ✅ Prisma client generating
- ✅ Next.js building
- ✅ Service starting

### 9. Run Database Migrations

Once deployment succeeds:

#### Via Render Shell:
1. Go to your service → **"Shell"** tab
2. Click **"Connect"** or **"Open Shell"**
3. Run:
```bash
npx prisma migrate deploy
```

#### Or use render.yaml (if using Blueprint):
Migrations may run automatically if configured.

### 10. Test Your Application

Visit your deployed app:
```
https://your-service-name.onrender.com
```

You should see the LoveWaving landing page!

### 11. Create First Admin User

1. Click **"Sign Up"**
2. Create your account
3. Open Render Shell
4. Run Prisma Studio:
```bash
npx prisma studio
```
5. Find your user and change `role` to `ADMIN`

Or use SQL:
```sql
UPDATE "User" SET role = 'ADMIN' WHERE email = 'your-email@example.com';
```

## Auto-Deploy Setup

Render is now configured for automatic deploys!

### Automatic Deployments:
- ✅ Every push to `main` branch
- ✅ Triggered by commits
- ✅ Zero-downtime updates
- ✅ Rollback capability

### Manual Deploy:
1. Go to service → **"Manual Deploy"** tab
2. Select branch
3. Click **"Deploy latest commit"**

## Configuration Verification Checklist

Before going live, verify:

- [ ] Repository connected
- [ ] Build command correct
- [ ] Start command correct
- [ ] Environment variables set
- [ ] Database connected
- [ ] Migrations run
- [ ] Application accessible
- [ ] Login working
- [ ] Admin access working

## Troubleshooting Deployment

### Build Fails

**Check:**
- Environment variables are set
- Build command is correct
- No syntax errors in code
- Node version compatibility

**Fix:**
- Check build logs
- Review error messages
- Test locally first

### Application Crashes

**Check:**
- Start command is correct
- All environment variables set
- Database connection works
- Migrations completed

**Fix:**
- Review runtime logs
- Test database connection
- Verify environment variables

### Database Connection Issues

**Check:**
- Using INTERNAL database URL
- Database is running
- Credentials are correct

**Fix:**
- Verify database is active in Render
- Use internal URL not external
- Check environment variables

### Migration Errors

**Check:**
- Prisma schema is valid
- Database permissions
- Schema conflicts

**Fix:**
```bash
# In Render Shell
npx prisma migrate reset  # Warning: deletes data
# OR
npx prisma db push  # For development
```

## Monitoring

### View Logs
- Go to service → **"Logs"** tab
- Real-time application logs
- Search and filter available

### Health Checks
- Render checks `/` endpoint
- Automatic restart on failure
- Email alerts for issues

### Metrics
- Request rate
- Response times
- Error rates
- Resource usage

## Next Steps After Deployment

1. ✅ Test all features
2. ✅ Set up monitoring
3. ✅ Configure backups
4. ✅ Enable auto-scaling
5. ✅ Set custom domain
6. ✅ Set up alerts
7. ✅ Review security
8. ✅ Document deployment process

## Production Checklist

- [ ] Database backups enabled
- [ ] Monitoring configured
- [ ] Alerts set up
- [ ] Custom domain configured
- [ ] SSL certificate active
- [ ] Environment variables secured
- [ ] Secrets rotated regularly
- [ ] Logs reviewed
- [ ] Performance optimized
- [ ] Security audit completed

## Support Resources

- **Render Docs:** https://render.com/docs
- **Render Community:** https://community.render.com
- **Status Page:** https://status.render.com
- **GitHub Repository:** https://github.com/thomad99/LoveWaving

## You're Live! 🎉

Your LoveWaving application is now deployed and accessible worldwide!

**Your URL:** `https://your-service-name.onrender.com`

Share it with your team and start managing waivers digitally!

>>>>>>> 323292e4b68c097df3b7c68f2edcdaab42bcfef9
