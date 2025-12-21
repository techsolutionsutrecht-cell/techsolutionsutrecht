# Tech Solutions Utrecht

A modern Next.js website for Tech Solutions Utrecht - offering IT services including repairs, software development, and web design.

## 🚀 Quick Start

### Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### With Docker (Local)

```bash
# Start PostgreSQL database
docker compose up -d

# Run Prisma migrations
npx prisma migrate dev

# Run development server
npm run dev
```

## 📦 Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Styling**: Tailwind CSS 4
- **Database**: PostgreSQL with Prisma ORM
- **Animations**: Framer Motion
- **Email**: Nodemailer
- **Deployment**: Docker + Nginx on Hetzner

## 🌐 Production Deployment

See [DEPLOYMENT.md](DEPLOYMENT.md) for complete deployment instructions.

### Quick Deploy to Hetzner Server

```bash
# On your server
git clone <your-repo-url> /var/www/techsolutionsutrecht.nl
cd /var/www/techsolutionsutrecht.nl
bash scripts/setup-server.sh
bash scripts/deploy.sh
```

## 📂 Project Structure

```
├── app/                      # Next.js App Router
│   ├── (admin)/             # Admin panel routes
│   └── (marketing)/         # Public-facing pages
├── components/              # React components
├── lib/                     # Utilities and helpers
├── prisma/                  # Database schema and migrations
├── scripts/                 # Deployment and utility scripts
└── public/                  # Static assets
```

## 🛠️ Environment Variables

Create `.env` file for development:

```env
DATABASE_URL="postgresql://admin:password@localhost:5432/tech_hub"
POSTGRES_USER=admin
POSTGRES_PASSWORD=password
POSTGRES_DB=tech_hub
NEXTAUTH_SECRET=your_secret_here
NEXTAUTH_URL=http://localhost:3000
RESEND_API_KEY=your_resend_key
```

For production, see `.env.production.example`.

## 📝 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint

## 🔒 Admin Panel

Access the admin panel at `/admin/dashboard` after deployment.

## 📄 License

Private project for Tech Solutions Utrecht.

---

**Live Site**: https://techsolutionsutrecht.nl
