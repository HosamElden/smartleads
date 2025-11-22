---
description: Continue working on Local_SmartLeads project
---

# Local_SmartLeads Project - Quick Start Workflow

## Project Overview
**Local_SmartLeads** is a React + TypeScript real estate marketplace application connecting property marketers with potential buyers. Built with Vite, TailwindCSS, and Supabase.

## Tech Stack
- **Frontend**: React 18.2, TypeScript, TailwindCSS
- **Backend/Database**: Supabase
- **Build Tool**: Vite 5.0
- **Routing**: React Router DOM v6
- **Forms**: React Hook Form + Zod validation

## Starting the Development Server

// turbo
```bash
cd /Users/hosamelden/Documents/antigravity/Local_SmartLeads
npm run dev
```

**Application URL**: http://localhost:5173/

## Project Structure

```
Local_SmartLeads/
├── src/
│   ├── App.tsx                    # Main routing configuration
│   ├── main.tsx                   # Entry point
│   ├── components/                # Reusable components
│   │   ├── Header.tsx            # Main navigation header
│   │   ├── InterestButton.tsx    # Property interest button with modal
│   │   ├── PropertyCard.tsx      # Property display cards
│   │   └── ...
│   ├── pages/                    # Page components
│   │   ├── Home.tsx              # Homepage
│   │   ├── Gallery.tsx           # Gallery X - Property images gallery
│   │   ├── Properties.tsx        # Property listings
│   │   ├── PropertyDetails.tsx   # Single property view
│   │   ├── MyInterests.tsx       # Buyer's interested properties
│   │   ├── auth/                 # Authentication pages
│   │   └── dashboard/            # Marketer dashboard
│   └── lib/
│       ├── supabase.ts           # Supabase client
│       ├── context/              # React Context providers
│       ├── matching/             # Property matching logic
│       └── types/                # TypeScript types
├── supabase/
│   └── migrations/               # Database migrations
└── .env                          # Supabase configuration
```

## Key Features Implemented

### 1. Gallery X Page
- **Route**: `/gallery`
- **File**: `src/pages/Gallery.tsx`
- Displays 30 random property images in responsive grid
- Lightbox modal for full-size image viewing
- Accessible from header navigation

### 2. Interest System
- **Component**: `src/components/InterestButton.tsx`
- Smart matching between buyer preferences and property
- Elegant warning modal for preference mismatches
- Creates leads in Supabase when buyer expresses interest
- "My Interests" page shows all interested properties

### 3. User Types
- **Buyers**: Can browse properties, express interest, view "My Interests"
- **Marketers**: Can add properties, manage listings, view leads

## Recent Changes
- Gallery renamed to "Gallery X"
- Homepage branding updated to "SmartLead1"
- Interest button now shows elegant warning modal instead of basic browser alert
- Modal allows users to proceed with interest even if property doesn't match preferences

## Common Development Tasks

### View Live Application
Open http://localhost:5173/ in your browser

### Check Git Status
```bash
git status
```

### Commit Changes
```bash
git add .
git commit -m "Your commit message"
```

### View Database (Supabase)
- URL: https://ufmgqjmhusejlkplchdb.supabase.co
- Tables: properties, leads, buyers, marketers

## Important Files to Know

### Navigation & Layout
- `src/components/Header.tsx` - Main navigation with links to Home, Properties, Gallery X

### Core Pages
- `src/pages/Home.tsx` - Landing page with hero section and featured properties
- `src/pages/Gallery.tsx` - Gallery X with property images
- `src/pages/Properties.tsx` - Property listings with filters
- `src/pages/PropertyDetails.tsx` - Individual property details with interest button

### Key Components
- `src/components/InterestButton.tsx` - Handles buyer interest with matching validation
- `src/lib/matching/matchingEngine.ts` - Property/buyer matching logic
- `src/lib/context/AuthContext.tsx` - Authentication state management
- `src/lib/context/InterestContext.tsx` - Interest tracking

## Environment Variables
Check `.env` file for Supabase configuration:
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

## Next Steps / TODO
When resuming work, consider:
- Testing the interest system with different buyer profiles
- Adding more property filters
- Implementing marketer dashboard improvements
- Adding property search functionality
- Enhancing Gallery X with categories or filtering

## Quick Commands
- Start dev server: `npm run dev`
- Build for production: `npm run build`
- Preview production build: `npm run preview`

---
**Last Updated**: 2025-11-22
**Project Location**: `/Users/hosamelden/Documents/antigravity/Local_SmartLeads`
