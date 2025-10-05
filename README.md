# MAC Blackjack

A full-stack blackjack game built with Next.js, Firebase/Firestore, TailwindCSS, and ShadCN.

## Features

- 🔐 Firebase Authentication (Email/Password)
- 💰 User chip management system (starts with 1000 chips)
- 🎮 Full blackjack game logic with proper rules
- 📊 Game history tracking
- 🎨 Beautiful UI with TailwindCSS and ShadCN components
- ⚡ Real-time updates with Firestore
- 🚀 Deployed on Vercel

## Getting Started

### Prerequisites

- Node.js 18+ installed
- A Firebase project set up

### Firebase Setup

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project (or use existing)
3. Enable **Authentication** → Email/Password sign-in method
4. Create a **Firestore Database** in production mode
5. Update Firestore rules with the contents of `firestore.rules`
6. Get your Firebase config from Project Settings → General → Your apps

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env.local` file based on `.env.local.example`:
   ```bash
   NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-auth-domain
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-storage-bucket
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-messaging-sender-id
   NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id
   ```

4. Run the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

### Firestore Rules

Deploy the Firestore rules from `firestore.rules`:

```bash
firebase deploy --only firestore:rules
```

Or manually copy the rules from `firestore.rules` to your Firebase Console.

## Deployment on Vercel

1. Push your code to a Git repository (GitHub, GitLab, Bitbucket)
2. Import your project to Vercel
3. Add environment variables from `.env.local`
4. Deploy!

## Game Rules

- Standard blackjack rules apply
- Dealer hits on 16 and stands on 17
- Blackjack pays 3:2
- Regular win pays 1:1
- Push returns the bet
- Starting chips: 1000

## Tech Stack

- **Framework**: Next.js 15 with App Router
- **Authentication**: Firebase Auth
- **Database**: Firestore
- **Styling**: TailwindCSS
- **Components**: ShadCN UI
- **Icons**: Lucide React
- **Deployment**: Vercel

## Project Structure

```
├── app/                    # Next.js app directory
│   ├── layout.tsx         # Root layout with AuthProvider
│   ├── page.tsx           # Main game page
│   └── globals.css        # Global styles
├── components/            # React components
│   ├── ui/               # ShadCN UI components
│   ├── auth-form.tsx     # Login/signup form
│   ├── blackjack-game.tsx # Main game component
│   ├── card-display.tsx  # Card visualization
│   ├── game-history.tsx  # Game history display
│   └── user-profile.tsx  # User profile with chips
├── lib/                   # Utilities and logic
│   ├── auth-context.tsx  # Authentication context
│   ├── blackjack.ts      # Game logic
│   ├── firebase.ts       # Firebase configuration
│   ├── game-history.ts   # History management
│   ├── types.ts          # TypeScript types
│   └── utils.ts          # Utility functions
└── firestore.rules       # Firestore security rules
```

## License

MIT
