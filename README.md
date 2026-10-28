# About

Mobile app to help low-income Texas families find and undersand public benefits like Medicaid, CHIP, SNAP, WIC, school meals, etc., in both English and Spanish.

## Try It Here
https://next-step-mu-jet.vercel.app/welcome

## What it does
- **Quick Check:** Answer a few questions about your household and income to see which programs you likely qualify for, like Medicaid, CHIP, SNAP, WIC, and school meals, and how to apply.
- **Ask a Question:** Ask about benefits, applications, and renewals, and get answers in plain language.
- **Understand Your Mail:** Take a photo of a letter, bill, or form. NextStep explains what it means, shows any deadline, and lists what to do next.
- **Nearby:** A map of WIC clinics, health centers, food pantries, and benefits help in Dallas, with buttons to call or get directions.

## Built with
- React Native + Expo (Expo Router)
- Claude API (Anthropic) for Ask and Mail
- Apple Maps through react-native-maps

## Setup

1. Install [Node.js](https://nodejs.org)
2. Install the packages:
   ```
   npm install
   ```
3. Create a file called `.env` in the project folder and add your Anthropic API key:
   ```
   ANTHROPIC_API_KEY=your-key-here
   ```
   Get a key at [console.anthropic.com](https://console.anthropic.com).
4. Start the app:
   ```
   npx expo start
   ```
5. Open it:
   - **Phone:** Install Expo Go and scan the QR code.
   - **iPhone Simulator:** Press `i`. You need Xcode on a Mac.
   - **Web browser:** Press `w`.

## Project structure

| File | What it does |
|------|--------------|
| `src/lib/eligibility.ts` | Income limits and the rules that decide which programs match |
| `src/app/screener.tsx` | Quick Check questions |
| `src/server/claude.ts` | AI prompts and the format for letter explanations |
| `src/app/api/` | Server routes for Ask and Mail |
| `src/data/dallas-places.ts` | Dallas locations from official sources |
| `src/lib/i18n.tsx` | All English and Spanish text |
