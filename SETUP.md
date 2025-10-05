# Quick Setup Guide

## 1. Firebase Setup

### Create Firebase Project
1. Go to https://console.firebase.google.com/
2. Click "Add project"
3. Follow the wizard to create your project

### Enable Authentication
1. In your Firebase project, go to **Authentication**
2. Click "Get started"
3. Enable **Email/Password** sign-in method

### Create Firestore Database
1. Go to **Firestore Database**
2. Click "Create database"
3. Start in **production mode** (or test mode, then update rules later)
4. Choose your region

### Set Firestore Rules
1. In Firestore, go to **Rules** tab
2. Copy the contents of `firestore.rules` from this project
3. Click "Publish"

### Get Firebase Config
1. Go to **Project Settings** (gear icon)
2. Scroll down to "Your apps"
3. Click the web icon (</>)
4. Register your app
5. Copy the config values

## 2. Local Development Setup

### Install Dependencies
```bash
npm install
```

### Configure Environment Variables
Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key-here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project-id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id
```

### Run Development Server
```bash
npm run dev
```

Visit http://localhost:3000

## 3. Deploy to Vercel

### Option A: Using Vercel CLI
```bash
npm install -g vercel
vercel
```

### Option B: Using Vercel Dashboard
1. Go to https://vercel.com/
2. Import your Git repository
3. Add environment variables (from `.env.local`)
4. Deploy!

### Add Environment Variables in Vercel
1. Go to your project settings
2. Navigate to "Environment Variables"
3. Add all variables from `.env.local`
4. Redeploy if needed

## 4. Testing the Application

1. Sign up with a new email/password
2. You'll start with 1000 chips
3. Place a bet and play blackjack
4. View your game history
5. Check Firestore to see stored data

## Firestore Collections Structure

### users
```
{
  uid: string
  email: string
  chips: number
  createdAt: timestamp
  updatedAt: timestamp
}
```

### gameHistory
```
{
  userId: string
  betAmount: number
  playerHand: Card[]
  dealerHand: Card[]
  result: 'win' | 'loss' | 'push' | 'blackjack'
  chipsWon: number
  timestamp: timestamp
}
```

## Troubleshooting

### Build fails with Firebase errors
- Make sure `.env.local` is created with valid Firebase credentials
- Check that all environment variables are set

### Authentication not working
- Verify Email/Password is enabled in Firebase Console
- Check Firebase config in `.env.local`

### Firestore errors
- Ensure Firestore rules are deployed
- Check that Firestore is created in Firebase Console

### Deployment issues on Vercel
- Verify all environment variables are added in Vercel
- Make sure they're available for production environment
- Redeploy after adding environment variables

## Next Steps

- Add more chip purchase options
- Implement social features
- Add leaderboards
- Enhance UI/UX
- Add sound effects
- Implement double down and split features
