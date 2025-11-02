<<<<<<< HEAD
# LoveWaving Setup Instructions

Welcome to LoveWaving! This document will guide you through the initial setup process.

## Quick Start Checklist

- [ ] Install Node.js 18+ and npm
- [ ] Install PostgreSQL
- [ ] Clone the repository
- [ ] Install dependencies
- [ ] Configure environment variables
- [ ] Set up database
- [ ] Create first admin user
- [ ] Test the application

## Detailed Steps

### 1. Install Dependencies

```bash
# Install Node.js from nodejs.org if you haven't already
node --version  # Should be 18 or higher

# Install PostgreSQL
# macOS: brew install postgresql
# Windows: Download from postgresql.org
# Linux: sudo apt-get install postgresql

# Clone and setup
git clone <your-repo>
cd LoveWaving
npm install
```

### 2. Database Setup

#### Option A: Using Docker (Easiest)

```bash
# Start PostgreSQL container
docker run --name lovewaving-db \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_DB=lovewaving \
  -p 5432:5432 \
  -d postgres:15

# Your DATABASE_URL is:
# postgresql://postgres:postgres@localhost:5432/lovewaving
```

#### Option B: Local PostgreSQL

```bash
# Create database
createdb lovewaving

# Your DATABASE_URL is:
# postgresql://your-username@localhost:5432/lovewaving
```

### 3. Environment Configuration

```bash
# Copy example file
cp env.example .env

# Edit .env file
# Minimum required fields:
# - DATABASE_URL
# - NEXTAUTH_SECRET (generate with: openssl rand -base64 32)
# - NEXTAUTH_URL (http://localhost:3000 for local)
```

### 4. Database Migration

```bash
# Generate Prisma Client
npm run db:generate

# Apply migrations
npm run db:migrate

# Or push schema (for development)
npm run db:push
```

### 5. Run the Application

```bash
# Start dev server
npm run dev
```

Visit http://localhost:3000

### 6. Create First Admin User

1. Go to http://localhost:3000/auth/signup
2. Create an account with your email
3. Open Prisma Studio: `npm run db:studio`
4. Find your user in the User table
5. Change `role` field from `USER` to `ADMIN`
6. Save changes

### 7. Test the Application

1. **Test Admin Features:**
   - Go to http://localhost:3000/admin
   - Create a new event
   - Attach a waiver

2. **Test User Features:**
   - Logout
   - Create a test user account
   - Go to dashboard
   - Sign up for the event
   - Sign the waiver

3. **Test Authentication:**
   - Try email/password login
   - Try Google OAuth (if configured)

## AWS S3 Setup (Optional for Local)

For production-like testing:

1. Create S3 bucket on AWS
2. Create IAM user with S3 access
3. Generate access keys
4. Add to `.env`:
   ```
   AWS_ACCESS_KEY_ID=your-key
   AWS_SECRET_ACCESS_KEY=your-secret
   AWS_REGION=us-east-1
   AWS_S3_BUCKET_NAME=your-bucket-name
   ```

## Google OAuth Setup (Optional)

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create project
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Add to `.env`:
   ```
   GOOGLE_CLIENT_ID=your-client-id
   GOOGLE_CLIENT_SECRET=your-secret
   ```

## Verification

You should now be able to:

✅ Sign up and sign in
✅ Create events as admin
✅ Upload waivers
✅ Sign waivers as user
✅ View signed waivers
✅ See admin statistics

## Common Issues

### "Cannot find module '@prisma/client'"

```bash
npm run db:generate
```

### "Database connection failed"

- Check PostgreSQL is running
- Verify DATABASE_URL in .env
- Check port 5432 is not blocked

### "NextAuth secret missing"

Generate a secret and add to .env:
```bash
openssl rand -base64 32
```

### "Port 3000 already in use"

```bash
PORT=3001 npm run dev
```

## Next Steps

1. Read [DEVELOPMENT.md](DEVELOPMENT.md) for development guidelines
2. Read [DEPLOYMENT.md](DEPLOYMENT.md) for production deployment
3. Review [README.md](README.md) for project overview
4. Customize branding and colors
5. Add your logo and content

## Getting Help

- Review documentation files
- Check GitHub issues
- Review error logs in terminal
- Use `npm run db:studio` to inspect database

## Important Notes

- **Never commit `.env` file** - it contains secrets
- **Use migrations in production** - not `db:push`
- **Test locally before deploying**
- **Backup your database regularly**
- **Keep dependencies updated**

## Deployment

When ready for production:

1. Read [DEPLOYMENT.md](DEPLOYMENT.md)
2. Set up Render account
3. Configure environment variables
4. Deploy database and application
5. Test production environment

Good luck! 🎉

=======
# LoveWaving Setup Instructions

Welcome to LoveWaving! This document will guide you through the initial setup process.

## Quick Start Checklist

- [ ] Install Node.js 18+ and npm
- [ ] Install PostgreSQL
- [ ] Clone the repository
- [ ] Install dependencies
- [ ] Configure environment variables
- [ ] Set up database
- [ ] Create first admin user
- [ ] Test the application

## Detailed Steps

### 1. Install Dependencies

```bash
# Install Node.js from nodejs.org if you haven't already
node --version  # Should be 18 or higher

# Install PostgreSQL
# macOS: brew install postgresql
# Windows: Download from postgresql.org
# Linux: sudo apt-get install postgresql

# Clone and setup
git clone <your-repo>
cd LoveWaving
npm install
```

### 2. Database Setup

#### Option A: Using Docker (Easiest)

```bash
# Start PostgreSQL container
docker run --name lovewaving-db \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_DB=lovewaving \
  -p 5432:5432 \
  -d postgres:15

# Your DATABASE_URL is:
# postgresql://postgres:postgres@localhost:5432/lovewaving
```

#### Option B: Local PostgreSQL

```bash
# Create database
createdb lovewaving

# Your DATABASE_URL is:
# postgresql://your-username@localhost:5432/lovewaving
```

### 3. Environment Configuration

```bash
# Copy example file
cp env.example .env

# Edit .env file
# Minimum required fields:
# - DATABASE_URL
# - NEXTAUTH_SECRET (generate with: openssl rand -base64 32)
# - NEXTAUTH_URL (http://localhost:3000 for local)
```

### 4. Database Migration

```bash
# Generate Prisma Client
npm run db:generate

# Apply migrations
npm run db:migrate

# Or push schema (for development)
npm run db:push
```

### 5. Run the Application

```bash
# Start dev server
npm run dev
```

Visit http://localhost:3000

### 6. Create First Admin User

1. Go to http://localhost:3000/auth/signup
2. Create an account with your email
3. Open Prisma Studio: `npm run db:studio`
4. Find your user in the User table
5. Change `role` field from `USER` to `ADMIN`
6. Save changes

### 7. Test the Application

1. **Test Admin Features:**
   - Go to http://localhost:3000/admin
   - Create a new event
   - Attach a waiver

2. **Test User Features:**
   - Logout
   - Create a test user account
   - Go to dashboard
   - Sign up for the event
   - Sign the waiver

3. **Test Authentication:**
   - Try email/password login
   - Try Google OAuth (if configured)

## AWS S3 Setup (Optional for Local)

For production-like testing:

1. Create S3 bucket on AWS
2. Create IAM user with S3 access
3. Generate access keys
4. Add to `.env`:
   ```
   AWS_ACCESS_KEY_ID=your-key
   AWS_SECRET_ACCESS_KEY=your-secret
   AWS_REGION=us-east-1
   AWS_S3_BUCKET_NAME=your-bucket-name
   ```

## Google OAuth Setup (Optional)

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create project
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Add to `.env`:
   ```
   GOOGLE_CLIENT_ID=your-client-id
   GOOGLE_CLIENT_SECRET=your-secret
   ```

## Verification

You should now be able to:

✅ Sign up and sign in
✅ Create events as admin
✅ Upload waivers
✅ Sign waivers as user
✅ View signed waivers
✅ See admin statistics

## Common Issues

### "Cannot find module '@prisma/client'"

```bash
npm run db:generate
```

### "Database connection failed"

- Check PostgreSQL is running
- Verify DATABASE_URL in .env
- Check port 5432 is not blocked

### "NextAuth secret missing"

Generate a secret and add to .env:
```bash
openssl rand -base64 32
```

### "Port 3000 already in use"

```bash
PORT=3001 npm run dev
```

## Next Steps

1. Read [DEVELOPMENT.md](DEVELOPMENT.md) for development guidelines
2. Read [DEPLOYMENT.md](DEPLOYMENT.md) for production deployment
3. Review [README.md](README.md) for project overview
4. Customize branding and colors
5. Add your logo and content

## Getting Help

- Review documentation files
- Check GitHub issues
- Review error logs in terminal
- Use `npm run db:studio` to inspect database

## Important Notes

- **Never commit `.env` file** - it contains secrets
- **Use migrations in production** - not `db:push`
- **Test locally before deploying**
- **Backup your database regularly**
- **Keep dependencies updated**

## Deployment

When ready for production:

1. Read [DEPLOYMENT.md](DEPLOYMENT.md)
2. Set up Render account
3. Configure environment variables
4. Deploy database and application
5. Test production environment

Good luck! 🎉

>>>>>>> 323292e4b68c097df3b7c68f2edcdaab42bcfef9
