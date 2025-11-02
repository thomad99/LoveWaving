<<<<<<< HEAD
# LoveWaving - Digital Waiver Management System

A comprehensive digital waiver management system similar to DocuSign, built with Next.js, PostgreSQL, and AWS S3.

## Features

### Authentication
- Email and password authentication
- Google OAuth integration
- Role-based access control (Admin/User)

### Event Management
- Admins can create and manage events
- Attach waivers to events (PDF or text)
- Track event statistics

### Waiver Signing
- 5 different signature styles
- User signature persistence
- Secure document storage on AWS S3
- Full audit trail with IP and user agent logging

### Admin Dashboard
- Event management interface
- View signed waivers and completion rates
- Analytics and reporting

## Technology Stack

- **Frontend**: Next.js 14, React, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: NextAuth.js
- **Storage**: AWS S3
- **Hosting**: Render

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- PostgreSQL database
- AWS S3 bucket
- Google OAuth credentials (optional)

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd LoveWaving
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```

Edit `.env` and configure:
- Database connection
- NextAuth secret
- AWS S3 credentials
- Google OAuth (optional)

4. Set up the database:
```bash
# Generate Prisma client
npm run db:generate

# Run migrations
npm run db:migrate
```

5. Run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Environment Variables

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/lovewaving"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key"

# AWS S3
AWS_ACCESS_KEY_ID="your-access-key"
AWS_SECRET_ACCESS_KEY="your-secret-key"
AWS_REGION="us-east-1"
AWS_S3_BUCKET_NAME="your-bucket-name"

# Google OAuth (optional)
GOOGLE_CLIENT_ID="your-client-id"
GOOGLE_CLIENT_SECRET="your-client-secret"
```

## Deployment to Render

1. Create a new Web Service on Render
2. Connect your GitHub repository
3. Configure environment variables
4. Set build command: `npm run build`
5. Set start command: `npm start`

### Database Setup on Render

1. Create a PostgreSQL database on Render
2. Copy the internal database URL
3. Set `DATABASE_URL` in environment variables

### S3 Setup

1. Create an S3 bucket on AWS
2. Configure CORS settings
3. Set IAM permissions for upload/read
4. Add credentials to environment variables

## Project Structure

```
├── app/                    # Next.js app directory
│   ├── admin/             # Admin dashboard
│   ├── auth/              # Authentication pages
│   ├── api/               # API routes
│   ├── dashboard/         # User dashboard
│   └── events/            # Event pages
├── components/            # React components
│   ├── admin/            # Admin components
│   ├── signature/        # Signature components
│   └── ui/               # UI components
├── lib/                   # Utility functions
│   ├── auth.ts           # Auth configuration
│   ├── prisma.ts         # Prisma client
│   └── s3.ts             # S3 utilities
├── prisma/               # Database schema
└── public/               # Static assets
```

## Signature Styles

1. **Cursive**: Hand-drawn cursive signature
2. **Formal**: Formal printed signature
3. **Initials**: Initial-based signature
4. **Stamp**: Mark/stamp signature
5. **Mark**: X or checkmark

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

MIT License

## Support

For support, email support@lovewaving.com or open an issue on GitHub.

=======
# LoveWaving - Digital Waiver Management System

A comprehensive digital waiver management system similar to DocuSign, built with Next.js, PostgreSQL, and AWS S3.

## Features

### Authentication
- Email and password authentication
- Google OAuth integration
- Role-based access control (Admin/User)

### Event Management
- Admins can create and manage events
- Attach waivers to events (PDF or text)
- Track event statistics

### Waiver Signing
- 5 different signature styles
- User signature persistence
- Secure document storage on AWS S3
- Full audit trail with IP and user agent logging

### Admin Dashboard
- Event management interface
- View signed waivers and completion rates
- Analytics and reporting

## Technology Stack

- **Frontend**: Next.js 14, React, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: NextAuth.js
- **Storage**: AWS S3
- **Hosting**: Render

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- PostgreSQL database
- AWS S3 bucket
- Google OAuth credentials (optional)

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd LoveWaving
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```

Edit `.env` and configure:
- Database connection
- NextAuth secret
- AWS S3 credentials
- Google OAuth (optional)

4. Set up the database:
```bash
# Generate Prisma client
npm run db:generate

# Run migrations
npm run db:migrate
```

5. Run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Environment Variables

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/lovewaving"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key"

# AWS S3
AWS_ACCESS_KEY_ID="your-access-key"
AWS_SECRET_ACCESS_KEY="your-secret-key"
AWS_REGION="us-east-1"
AWS_S3_BUCKET_NAME="your-bucket-name"

# Google OAuth (optional)
GOOGLE_CLIENT_ID="your-client-id"
GOOGLE_CLIENT_SECRET="your-client-secret"
```

## Deployment to Render

1. Create a new Web Service on Render
2. Connect your GitHub repository
3. Configure environment variables
4. Set build command: `npm run build`
5. Set start command: `npm start`

### Database Setup on Render

1. Create a PostgreSQL database on Render
2. Copy the internal database URL
3. Set `DATABASE_URL` in environment variables

### S3 Setup

1. Create an S3 bucket on AWS
2. Configure CORS settings
3. Set IAM permissions for upload/read
4. Add credentials to environment variables

## Project Structure

```
├── app/                    # Next.js app directory
│   ├── admin/             # Admin dashboard
│   ├── auth/              # Authentication pages
│   ├── api/               # API routes
│   ├── dashboard/         # User dashboard
│   └── events/            # Event pages
├── components/            # React components
│   ├── admin/            # Admin components
│   ├── signature/        # Signature components
│   └── ui/               # UI components
├── lib/                   # Utility functions
│   ├── auth.ts           # Auth configuration
│   ├── prisma.ts         # Prisma client
│   └── s3.ts             # S3 utilities
├── prisma/               # Database schema
└── public/               # Static assets
```

## Signature Styles

1. **Cursive**: Hand-drawn cursive signature
2. **Formal**: Formal printed signature
3. **Initials**: Initial-based signature
4. **Stamp**: Mark/stamp signature
5. **Mark**: X or checkmark

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

MIT License

## Support

For support, email support@lovewaving.com or open an issue on GitHub.

>>>>>>> 323292e4b68c097df3b7c68f2edcdaab42bcfef9
