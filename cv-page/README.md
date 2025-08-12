# 📄 CV Page - Professional Resume Viewer

**Tech Stack:** React, Next.js (App Router), TypeScript, Tailwind CSS, Vercel

**Description:**  
A modern, responsive CV viewer and download page built with Next.js. Features a clean, professional design with automatic last-updated date detection and mobile-first responsive design. Perfect for showcasing your resume online with easy download functionality.

🎯 Features:

* 📱 **Mobile-First Design** - Fully responsive across all devices
* 📄 **PDF Preview** - In-browser PDF viewing with fallback support
* 📅 **Auto Date Detection** - Automatically shows when CV was last updated
* 🎨 **Modern UI** - Clean design with brand colors and smooth animations
* 📥 **Easy Download** - One-click PDF download with proper headers
* 🌙 **Accessible** - Proper ARIA labels and semantic HTML
* ⚡ **Fast Loading** - Optimized with Next.js App Router

## 🚀 Live Demo
[View Live CV Page](https://cv-page.vercel.app) *(Deploy to Vercel to get your live URL)*

## 🛠️ Tech Stack

* **Frontend:** React 19, Next.js 15, TypeScript
* **Styling:** Tailwind CSS, shadcn/ui components
* **Deployment:** Vercel (recommended)
* **PDF Handling:** Native browser PDF viewer with fallbacks

## 📦 Installation & Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/benjamin-matapo/projects.git
   cd projects/cv-page
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   pnpm install
   ```

3. **Add your CV**
   - Replace `public/cv.pdf` with your own CV file
   - The page will automatically detect the last modified date

4. **Customize the content**
   - Update `app/page.tsx` with your name and details
   - Modify colors in the component classes (brand color: `#0088F0`)

5. **Run the development server**
   ```bash
   npm run dev
   ```

6. **Deploy to Vercel**
   ```bash
   npx vercel
   ```

## 🎨 Customization

### Brand Colors
The project uses these brand colors:
- Primary: `#0088F0` (blue)
- Hover: `#006BBE` (darker blue)
- Text: White on buttons

### Responsive Features
- **Desktop:** Centered layout with PDF preview and download button below
- **Mobile:** Sticky download button at bottom, full-width design
- **Tablet:** Optimized spacing and typography

## 📁 Project Structure

```
cv-page/
├── app/
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx          # Main CV page component
├── components/
│   └── ui/               # shadcn/ui components
├── public/
│   └── cv.pdf           # Your CV file
├── styles/
└── README.md
```

## 🔧 Key Features Explained

### PDF Preview with Fallbacks
- Uses `iframe` for primary PDF display
- Automatic fallback for unsupported browsers
- Proper CORS headers for PDF serving

### Last Updated Date
- Fetches `last-modified` header from CV file
- Formats date as "Month Day, Year"
- Updates automatically when CV is replaced

### Mobile-First Design
- Sticky download button on mobile
- Responsive typography and spacing
- Touch-friendly interface

## 🚀 Deployment

### Vercel (Recommended)
1. Connect your GitHub repository to Vercel
2. Deploy automatically on push to main branch
3. Get a live URL instantly

### Other Platforms
- **Netlify:** Works with Next.js static export
- **Railway:** Full-stack deployment support
- **AWS Amplify:** Enterprise deployment option

## 🤝 Contributing

Feel free to:
* ⭐ Star this repo if you find it helpful
* 🍴 Fork it for your own CV page
* 💬 Open issues for suggestions or bugs

---

**Built with ❤️ using Next.js and Tailwind CSS** 