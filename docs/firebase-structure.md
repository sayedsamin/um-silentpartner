# Firebase Data Structure (Inferred from Code)

Last scanned: 2026-02-21 (post onboarding-flow consolidation)

This document describes the Firebase structure currently used by the app based on repository code analysis (not direct Firebase Console inspection).

## Firestore Overview

Current detected Firestore usage:
- Collection: `users`
- Document ID: Firebase Auth UID (`{uid}`)
- Document path pattern: `users/{uid}`

No other collection or subcollection paths are currently referenced in source code.

## `users/{uid}` Document Shape

The app writes these fields when LinkedIn is connected:

- `linkedinConnected: boolean`
- `linkedinConnectedAt: string` (ISO timestamp from `new Date().toISOString()`)
- `linkedin: object`

The app also writes these fields when onboarding questions are completed from the combined onboarding flow (`/onboarding-questions`):

- `onboardingComplete: boolean`
- `onboardingAnswers: object`
  - `personalityTraits: string[]`
  - `primaryGoal: string`
  - `conversationStyle: string`
  - `favoriteTopics: string[]`

`linkedin` object fields:
- `name: string`
- `email: string`
- `picture: string`
- `sub: string`
- `headline: string`
- `summary: string`
- `firstName: object` (raw LinkedIn value)
- `lastName: object` (raw LinkedIn value)
- `positions: unknown[]`
- `educations: unknown[]`
- `rawMe: object` (full LinkedIn `/v2/me` payload subset/raw response)

Write behavior:
- Uses `set(..., { merge: true })`, so this updates/merges into existing `users/{uid}` documents.
- Onboarding payload is validated with `zod` before write.

## Where It Is Used

- Firestore path write:
  - `src/services/linkedin/client.ts:145`
  - `src/features/onboarding/services/save-onboarding-answers.ts:19`
- Onboarding flow UI source:
  - `src/features/onboarding/ui/onboarding-questions-screen.tsx:1`
- Firestore ref helpers:
  - `src/services/firebase/firestore.ts:5`
  - `src/services/firebase/firestore.ts:11`
- Firebase bootstrap/init:
  - `src/services/app/bootstrap.ts:1`
  - `src/services/firebase/client.ts:45`

## Notes

- This repo currently uses Firebase Auth and Firestore native SDK wiring.
- No Firestore reads (`get`, listeners, queries) were found in the active source paths for these user profile/onboarding fields yet.
- Legacy split onboarding screens were removed; onboarding writes now come through the feature service above.
- If schema evolves, update this document whenever new Firestore paths are introduced.
