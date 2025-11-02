<<<<<<< HEAD
# Development Guide for LoveWaving

This guide will help you set up and run LoveWaving locally for development.

## Prerequisites

1. **Node.js 18+** - [Download](https://nodejs.org/)
2. **PostgreSQL** - [Download](https://www.postgresql.org/download/)
3. **npm or yarn** - Comes with Node.js

### Optional Prerequisites

- **AWS Account** (for S3 functionality)
- **Google Cloud Account** (for OAuth)

## Local Setup

### 1. Clone the Repository

```bash
git clone <your-repository-url>
cd LoveWaving
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up PostgreSQL Database

#### Using Docker (Recommended)

```bash
docker run --name lovewaving-db \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_DB=lovewaving \
  -p 5432:5432 \
  -d postgres:15
```

#### Using Local PostgreSQL

Create a new database:

```bash
createdb lovewaving
```

### 4. Configure Environment Variables

Create a `.env` file in the root directory:

```bash
cp env.example .env
```

Edit `.env` with your configuration:

```env
# Database
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/lovewaving"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-super-secret-key-here-change-in-production"

# AWS S3 (optional for local dev)
AWS_ACCESS_KEY_ID="your-access-key"
AWS_SECRET_ACCESS_KEY="your-secret-key"
AWS_REGION="us-east-1"
AWS_S3_BUCKET_NAME="lovewaving-waivers"

# Google OAuth (optional)
GOOGLE_CLIENT_ID="your-client-id.apps.googleusercontent.com"
GOOGLE_CLIENT_SECRET="your-client-secret"

# Node Environment
NODE_ENV="development"
```

### 5. Set Up Database Schema

Generate Prisma Client:

```bash
npm run db:generate
```

Run migrations:

```bash
npm run db:migrate
```

Or push schema directly (for development):

```bash
npm run db:push
```

### 6. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Development Workflow

### Creating a New Admin User

1. Sign up via the web interface at `/auth/signup`
2. Open Prisma Studio:

```bash
npm run db:studio
```

3. Navigate to `User` table
4. Find your user and change `role` from `USER` to `ADMIN`

Or use SQL:

```sql
UPDATE "User" SET role = 'ADMIN' WHERE email = 'your-email@example.com';
```

### Database Management

**View database:**
```bash
npm run db:studio
```

**Create migration:**
```bash
npm run db:migrate
```

**Reset database (development only):**
```bash
npx prisma migrate reset
```

**Pull schema from database:**
```bash
npx prisma db pull
```

### Running Tests

```bash
npm run test
```

### Building for Production

```bash
npm run build
npm start
```

## Project Structure

```
LoveWaving/
├── app/                    # Next.js 14 App Router
│   ├── admin/             # Admin dashboard pages
│   │   └── events/        # Event management
│   ├── api/               # API routes
│   │   ├── admin/        # Admin API endpoints
│   │   ├── auth/         # Authentication endpoints
│   │   └── events/       # Event endpoints
│   ├── auth/              # Authentication pages
│   ├── dashboard/         # User dashboard
│   └── events/            # Event pages
├── components/            # React components
│   ├── admin/            # Admin components
│   ├── signature/        # Signature components
│   └── ui/               # UI components (shadcn/ui)
├── lib/                   # Utility libraries
│   ├── auth.ts           # NextAuth configuration
│   ├── prisma.ts         # Prisma client
│   └── s3.ts             # AWS S3 utilities
├── prisma/               # Database schema
│   └── schema.prisma     # Prisma schema
├── public/               # Static assets
├── env.example           # Environment template
├── package.json          # Dependencies
├── tsconfig.json         # TypeScript config
└── tailwind.config.ts    # Tailwind CSS config
```

## Key Technologies

- **Next.js 14** - React framework with App Router
- **TypeScript** - Type safety
- **Prisma** - ORM for PostgreSQL
- **NextAuth.js** - Authentication
- **Tailwind CSS** - Styling
- **shadcn/ui** - UI components
- **AWS SDK** - S3 integration
- **React Signature Canvas** - Signature capture

## Common Tasks

### Adding a New Feature

1. Create/update Prisma schema if needed
2. Run migration: `npm run db:migrate`
3. Create API routes if needed
4. Create frontend components
5. Test locally
6. Update documentation

### Debugging

**View logs:**
- Server logs appear in terminal
- Use `console.log()` for debugging
- Check browser DevTools for client errors

**Database issues:**
```bash
npm run db:studio
```

**Reset everything:**
```bash
npm run db:migrate reset
npm install
```

### Code Quality

**Linting:**
```bash
npm run lint
```

**Formatting:**
Install Prettier extension in VS Code for auto-formatting

**Type checking:**
```bash
npx tsc --noEmit
```

## Environment-Specific Notes

### Local Development

- Use local PostgreSQL instance
- S3 is optional (can mock or skip)
- Google OAuth is optional
- Use simple NEXTAUTH_SECRET

### Production

- Use managed PostgreSQL (Render)
- Configure real S3 bucket
- Set up Google OAuth
- Use strong, random NEXTAUTH_SECRET
- Enable HTTPS only
- Set up monitoring and logging

## Troubleshooting

### Database Connection Issues

```
Error: Can't reach database server
```

**Solution:**
- Check PostgreSQL is running: `pg_isready`
- Verify DATABASE_URL is correct
- Check firewall settings

### Prisma Client Issues

```
Module not found: Can't resolve '@prisma/client'
```

**Solution:**
```bash
npm run db:generate
```

### Build Errors

**Clear cache:**
```bash
rm -rf .next
npm run build
```

**Reinstall dependencies:**
```bash
rm -rf node_modules package-lock.json
npm install
```

### Port Already in Use

**Change port:**
```bash
PORT=3001 npm run dev
```

Or kill the process:
```bash
# On macOS/Linux
lsof -ti:3000 | xargs kill

# On Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

## Useful Commands

```bash
# Development
npm run dev              # Start dev server
npm run build            # Build for production
npm start                # Start production server

# Database
npm run db:generate      # Generate Prisma Client
npm run db:push          # Push schema to database
npm run db:migrate       # Run migrations
npm run db:studio        # Open Prisma Studio

# Utilities
npm run lint             # Run ESLint
```

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [NextAuth.js Documentation](https://next-auth.js.org)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [shadcn/ui Documentation](https://ui.shadcn.com)

## Support

For issues or questions:
1. Check existing issues on GitHub
2. Review documentation
3. Search Stack Overflow
4. Open a new issue with details

=======
# Development Guide for LoveWaving

This guide will help you set up and run LoveWaving locally for development.

## Prerequisites

1. **Node.js 18+** - [Download](https://nodejs.org/)
2. **PostgreSQL** - [Download](https://www.postgresql.org/download/)
3. **npm or yarn** - Comes with Node.js

### Optional Prerequisites

- **AWS Account** (for S3 functionality)
- **Google Cloud Account** (for OAuth)

## Local Setup

### 1. Clone the Repository

```bash
git clone <your-repository-url>
cd LoveWaving
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up PostgreSQL Database

#### Using Docker (Recommended)

```bash
docker run --name lovewaving-db \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_DB=lovewaving \
  -p 5432:5432 \
  -d postgres:15
```

#### Using Local PostgreSQL

Create a new database:

```bash
createdb lovewaving
```

### 4. Configure Environment Variables

Create a `.env` file in the root directory:

```bash
cp env.example .env
```

Edit `.env` with your configuration:

```env
# Database
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/lovewaving"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-super-secret-key-here-change-in-production"

# AWS S3 (optional for local dev)
AWS_ACCESS_KEY_ID="your-access-key"
AWS_SECRET_ACCESS_KEY="your-secret-key"
AWS_REGION="us-east-1"
AWS_S3_BUCKET_NAME="lovewaving-waivers"

# Google OAuth (optional)
GOOGLE_CLIENT_ID="your-client-id.apps.googleusercontent.com"
GOOGLE_CLIENT_SECRET="your-client-secret"

# Node Environment
NODE_ENV="development"
```

### 5. Set Up Database Schema

Generate Prisma Client:

```bash
npm run db:generate
```

Run migrations:

```bash
npm run db:migrate
```

Or push schema directly (for development):

```bash
npm run db:push
```

### 6. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Development Workflow

### Creating a New Admin User

1. Sign up via the web interface at `/auth/signup`
2. Open Prisma Studio:

```bash
npm run db:studio
```

3. Navigate to `User` table
4. Find your user and change `role` from `USER` to `ADMIN`

Or use SQL:

```sql
UPDATE "User" SET role = 'ADMIN' WHERE email = 'your-email@example.com';
```

### Database Management

**View database:**
```bash
npm run db:studio
```

**Create migration:**
```bash
npm run db:migrate
```

**Reset database (development only):**
```bash
npx prisma migrate reset
```

**Pull schema from database:**
```bash
npx prisma db pull
```

### Running Tests

```bash
npm run test
```

### Building for Production

```bash
npm run build
npm start
```

## Project Structure

```
LoveWaving/
├── app/                    # Next.js 14 App Router
│   ├── admin/             # Admin dashboard pages
│   │   └── events/        # Event management
│   ├── api/               # API routes
│   │   ├── admin/        # Admin API endpoints
│   │   ├── auth/         # Authentication endpoints
│   │   └── events/       # Event endpoints
│   ├── auth/              # Authentication pages
│   ├── dashboard/         # User dashboard
│   └── events/            # Event pages
├── components/            # React components
│   ├── admin/            # Admin components
│   ├── signature/        # Signature components
│   └── ui/               # UI components (shadcn/ui)
├── lib/                   # Utility libraries
│   ├── auth.ts           # NextAuth configuration
│   ├── prisma.ts         # Prisma client
│   └── s3.ts             # AWS S3 utilities
├── prisma/               # Database schema
│   └── schema.prisma     # Prisma schema
├── public/               # Static assets
├── env.example           # Environment template
├── package.json          # Dependencies
├── tsconfig.json         # TypeScript config
└── tailwind.config.ts    # Tailwind CSS config
```

## Key Technologies

- **Next.js 14** - React framework with App Router
- **TypeScript** - Type safety
- **Prisma** - ORM for PostgreSQL
- **NextAuth.js** - Authentication
- **Tailwind CSS** - Styling
- **shadcn/ui** - UI components
- **AWS SDK** - S3 integration
- **React Signature Canvas** - Signature capture

## Common Tasks

### Adding a New Feature

1. Create/update Prisma schema if needed
2. Run migration: `npm run db:migrate`
3. Create API routes if needed
4. Create frontend components
5. Test locally
6. Update documentation

### Debugging

**View logs:**
- Server logs appear in terminal
- Use `console.log()` for debugging
- Check browser DevTools for client errors

**Database issues:**
```bash
npm run db:studio
```

**Reset everything:**
```bash
npm run db:migrate reset
npm install
```

### Code Quality

**Linting:**
```bash
npm run lint
```

**Formatting:**
Install Prettier extension in VS Code for auto-formatting

**Type checking:**
```bash
npx tsc --noEmit
```

## Environment-Specific Notes

### Local Development

- Use local PostgreSQL instance
- S3 is optional (can mock or skip)
- Google OAuth is optional
- Use simple NEXTAUTH_SECRET

### Production

- Use managed PostgreSQL (Render)
- Configure real S3 bucket
- Set up Google OAuth
- Use strong, random NEXTAUTH_SECRET
- Enable HTTPS only
- Set up monitoring and logging

## Troubleshooting

### Database Connection Issues

```
Error: Can't reach database server
```

**Solution:**
- Check PostgreSQL is running: `pg_isready`
- Verify DATABASE_URL is correct
- Check firewall settings

### Prisma Client Issues

```
Module not found: Can't resolve '@prisma/client'
```

**Solution:**
```bash
npm run db:generate
```

### Build Errors

**Clear cache:**
```bash
rm -rf .next
npm run build
```

**Reinstall dependencies:**
```bash
rm -rf node_modules package-lock.json
npm install
```

### Port Already in Use

**Change port:**
```bash
PORT=3001 npm run dev
```

Or kill the process:
```bash
# On macOS/Linux
lsof -ti:3000 | xargs kill

# On Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

## Useful Commands

```bash
# Development
npm run dev              # Start dev server
npm run build            # Build for production
npm start                # Start production server

# Database
npm run db:generate      # Generate Prisma Client
npm run db:push          # Push schema to database
npm run db:migrate       # Run migrations
npm run db:studio        # Open Prisma Studio

# Utilities
npm run lint             # Run ESLint
```

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [NextAuth.js Documentation](https://next-auth.js.org)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [shadcn/ui Documentation](https://ui.shadcn.com)

## Support

For issues or questions:
1. Check existing issues on GitHub
2. Review documentation
3. Search Stack Overflow
4. Open a new issue with details

>>>>>>> 323292e4b68c097df3b7c68f2edcdaab42bcfef9
