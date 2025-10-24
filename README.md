This is an assistance system for the CIIS via QR for internal control

## Getting Started

Install dependencies:
```bash
npm install
```

Run the project
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

## Development
.env
```bash
# Environment variables for email configuration
EMAIL_HOST=""
EMAIL_USER=""
EMAIL_PASS=""

# Environment variables for database configuration
DATABASE_URL=

# Environment variable for authentication secret
AUTH_SECRET=
```

## production
.env
```bash
# Environment variables for email configuration
EMAIL_HOST=""
EMAIL_USER=""
EMAIL_PASS=""

# Environment variables for database configuration
DATABASE_URL=

# Environment variable for authentication secret
AUTH_SECRET=
NEXTAUTH_URL=
NEXTAUTH_URL_INTERNAL=
AUTH_TRUST_HOST=
```

## Docker
```bash
docker build -t [NAME] .
docker run -d --name [NAME] -p PORTEXTERNO:PORTINTERNO --env-file .env [NAME]
```