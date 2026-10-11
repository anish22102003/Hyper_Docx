# HyperDocX 📄⚡

> **A modern, privacy-focused, all-in-one document and image processing SaaS platform.**  
> Comparable to iLovePDF and Smallpdf, built with Next.js 16, React 19, Tailwind CSS v4, and Prisma.

---

## 🌟 Overview

**HyperDocX** is a full-featured web platform that provides intuitive, fast, and secure tools for PDF manipulation, document conversion, and image editing. 

By leveraging client-side WebAssembly and HTML5 Canvas processing buffers, core file transformations happen **directly in the user's browser**. Documents and images are processed locally without exposing sensitive personal or business data to external servers, delivering lightning-fast results and uncompromising privacy.

---

## ✨ Features

### 📑 PDF Management & Organization
- **Merge PDF**: Combine multiple PDF files into a single structured document.
- **Split PDF**: Extract specific page ranges or extract individual pages.
- **Delete PDF Pages**: Select and discard unwanted pages from any PDF file.
- **Reorder PDF Pages**: Visually rearrange page order via drag-and-drop / click ordering.
- **Rotate PDF**: Rotate single pages or entire documents clockwise (90°, 180°, 270°).

### 🔄 Document & Office Converters
- **PDF to Image**: Render high-resolution PNG or JPG images from PDF pages.
- **Image to PDF**: Convert JPG, PNG, and WebP collections into clean multi-page PDFs.
- **Word to PDF (.docx ➔ .pdf)**: Render Microsoft Word documents into standard PDF format.
- **PDF to Word (.pdf ➔ .docx)**: Extract layout, tables, and text into editable Word documents.
- **Excel to PDF (.xlsx ➔ .pdf)**: Transform spreadsheets into readable PDF pages.
- **PDF to Excel (.pdf ➔ .xlsx)**: Detect and extract tabular data into Excel worksheets.
- **PowerPoint & PDF Support**: Interconvert presentation slides and PDF files.

### 🛡️ PDF Security & Optimization
- **Compress PDF**: Optimize file size and balance visual clarity with compact footprint.
- **Protect PDF**: Secure sensitive PDF files with custom password encryption.
- **Unlock PDF**: Decrypt password-protected PDFs with the authorized key.
- **Watermark PDF**: Add custom text watermarks with opacity and angle controls.

### 🖼️ Image Converter & Vector Tracing
- **JPG to PNG / PNG to JPG**: Lossless and optimized format conversion.
- **WEBP to JPG / JPG to WEBP**: Modern web format conversion for optimal web performance.
- **Convert to ICO**: Generate custom web favicons (`.ico`) from any uploaded image.
- **Image to SVG**: Vector-trace image contours into scalable vector graphic outlines.

### 🎨 Image Editor Studio
- **Image Compressor**: Adjust compression levels with live preview and size estimation.
- **Image Resizer**: Scale dimensions by exact pixels or percentage with aspect ratio lock.
- **Crop Image**: Custom rectangular crop area selection.
- **Rotate & Flip Image**: Mirror horizontally, vertically, or rotate at 90-degree increments.
- **Background Remover**: Isolate foreground subjects and strip background layers.

### 💼 SaaS Platform & Administration
- **Authentication**: Powered by Auth.js (NextAuth v5) supporting Credentials and Social Logins (Google, GitHub).
- **User Dashboard**: Real-time conversion history, recent files, and quota tracking.
- **Admin Dashboard**: Analytics overview, user role management, system metrics, and contact messages.
- **Contact & Feedback**: Built-in contact form saving inquiries to the database.
- **SEO & Performance**: Dynamic OpenGraph metadata, XML sitemap, `robots.txt`, and light/dark theme toggle.

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Framework** | [Next.js](https://nextjs.org/) (App Router, Server Actions) |
| **Frontend UI** | [React 19](https://react.dev/), [Tailwind CSS v4](https://tailwindcss.com/) |
| **Component Library** | [shadcn/ui](https://ui.shadcn.com/) (Radix UI / Base UI primitives), [Lucide React](https://lucide.dev/) |
| **Motion & Feedback** | [Framer Motion](https://www.framer.com/motion/), [Sonner](https://sonner.emilkowal.ski/), [canvas-confetti](https://www.npmjs.com/package/canvas-confetti) |
| **PDF Processing** | [`pdf-lib`](https://pdf-lib.js.org/), [`pdfjs-dist`](https://mozilla.github.io/pdf.js/) |
| **Office & Zip Processing** | [`docx`](https://docx.js.org/), [`mammoth`](https://www.npmjs.com/package/mammoth), [`xlsx`](https://sheetjs.com/), [`jszip`](https://stuk.github.io/jszip/) |
| **Database & ORM** | [Prisma ORM](https://www.prisma.io/) (SQLite for local dev, PostgreSQL for production) |
| **Authentication** | [Auth.js / NextAuth v5](https://authjs.dev/) |
| **Form Management** | [React Hook Form](https://react-hook-form.com/) + [Zod](https://zod.dev/) |

---

## 📂 Project Structure

```text
├── actions/                  # Server Actions (auth, admin, contact, conversions, subscription)
├── app/
│   ├── admin/                # Admin portal & metrics dashboard
│   ├── api/auth/             # NextAuth route handler
│   ├── blog/                 # Resource articles & documentation
│   ├── contact/              # Contact support page
│   ├── dashboard/            # User dashboard & recent conversion histories
│   ├── login/ & register/    # Authentication pages
│   ├── tools/[toolSlug]/     # Dynamic tool workspace runner
│   ├── globals.css           # Tailwind CSS v4 styling rules
│   ├── layout.tsx            # Global layout with ThemeProvider
│   ├── page.tsx              # Landing homepage
│   ├── robots.ts             # Search engine crawler configuration
│   └── sitemap.ts            # Dynamic XML sitemap generator
├── components/
│   ├── shared/               # Navbar, Footer, Logo, FileUploader, ToolWorkspace
│   ├── tools/                # Dedicated workspace components for each tool
│   └── ui/                   # shadcn/ui reusable UI components
├── hooks/                    # Reusable React hooks (e.g. useMobile)
├── lib/                      # Database client (db.ts), tools catalog (tools-data.ts), utility functions
├── prisma/
│   ├── schema.prisma         # Prisma data models (User, File, Conversion, Subscription, etc.)
│   └── dev.db                # Local SQLite database (git-ignored)
├── types/                    # TypeScript interfaces & NextAuth augmentations
├── auth.ts & auth.config.ts  # Auth.js configuration & credentials/OAuth handlers
├── middleware.ts             # Route guard middleware
└── package.json              # Project dependencies & scripts
```

---

## 🚀 Getting Started

### 1. Prerequisites
- **Node.js** (v18.17+ or v20+ recommended)
- **npm**, **pnpm**, or **yarn**

### 2. Clone the Repository
```bash
git clone https://github.com/your-username/hyperdocx.git
cd hyperdocx
```

### 3. Install Dependencies
```bash
npm install
```

### 4. Configure Environment Variables
Create a local `.env` file by copying the sample template:
```bash
cp .env.example .env
```

Open `.env` and configure your settings:
```env
# Local SQLite database (or your remote PostgreSQL connection string)
DATABASE_URL="file:./dev.db"

# Auth Secret (generate one using: npx auth secret)
AUTH_SECRET="your_generated_secret_key"
NEXTAUTH_URL="http://localhost:3000"

# Optional: Social OAuth Credentials
AUTH_GOOGLE_ID=""
AUTH_GOOGLE_SECRET=""
AUTH_GITHUB_ID=""
AUTH_GITHUB_SECRET=""

# Public URL
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

### 5. Initialize the Database
Generate the Prisma Client and synchronize the database schema:
```bash
npx prisma generate
npx prisma db push
```

### 6. Run the Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🔐 Environment Variables Reference

| Variable | Description | Required |
|---|---|:---:|
| `DATABASE_URL` | SQLite path (`file:./dev.db`) or PostgreSQL connection string | Yes |
| `AUTH_SECRET` | Secret key used to encrypt Auth.js sessions and JWTs | Yes |
| `NEXTAUTH_URL` | Canonical URL of the application (`http://localhost:3000`) | Yes |
| `AUTH_GOOGLE_ID` | Google OAuth Client ID | Optional |
| `AUTH_GOOGLE_SECRET` | Google OAuth Client Secret | Optional |
| `AUTH_GITHUB_ID` | GitHub OAuth Client ID | Optional |
| `AUTH_GITHUB_SECRET` | GitHub OAuth Client Secret | Optional |
| `BLOB_READ_WRITE_TOKEN` | Vercel Blob Token for persistent cloud storage | Optional |
| `STRIPE_API_KEY` | Stripe secret key for subscription billing | Optional |
| `STRIPE_WEBHOOK_SECRET` | Stripe webhook signing secret | Optional |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Stripe publishable key for client checkout | Optional |
| `NEXT_PUBLIC_APP_URL` | Public site URL for metadata and callback handling | Yes |

---

## 🚢 Deployment Guide

### Deploying to Vercel

1. Push your repository to GitHub.
2. Go to [Vercel](https://vercel.com/) and click **Add New Project**.
3. Import your `hyperdocx` repository.
4. For production databases, update your Prisma datasource to PostgreSQL (e.g., Neon, Supabase, or Aiven) and set the `DATABASE_URL` in Vercel's Environment Variables settings.
5. Provide the `AUTH_SECRET` and `NEXT_PUBLIC_APP_URL` in the environment variable dashboard.
6. Click **Deploy**.

---

## 🔒 Security & Git Hygiene

- Keep your `.env` file secret and never commit it to source control.
- The `.gitignore` is pre-configured to exclude sensitive credentials, local database binaries (`*.db`), build outputs (`/.next`), and cache files.
- Always use `.env.example` as a clean blueprint for team members and contributors.

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).
