# Tenant App Skeleton

React Native app skeleton for a tenant-facing product using:

- TypeScript
- NativeWind (Tailwind for React Native)
- TanStack Query
- Vertical slicing by feature with a shared reusable UI layer

## Architecture

- `src/app`: app composition, providers, config, navigation
- `src/shared`: reusable theme, primitives, utilities, hooks, shared types
- `src/features`: feature slices with isolated api, queries, hooks, components, screens, and types

## Token Direction

The initial theme is derived from the Figma file's dashboard screen:

- Brand blues: `#003178`, `#0D47A1`
- Soft blue surface: `#F6FAFE`
- Elevated muted surface: `#F0F4F8`
- Soft highlight fill: `#CFE6F2`
- Primary text: `#171C1F`
- Secondary text: `#434652`
- Tertiary text: `#4C616C`
- Alert: `#BA1A1A`
- Core card radius: `24`
- Core spacing rhythm: `4, 8, 12, 16, 24, 32, 40`
- Typography pairing: `Plus Jakarta Sans` for display/headings, `Inter` for body/labels

## Next Step

After dependencies are installed, the next pass should wire:

1. Expo or bare React Native entry setup
2. NativeWind runtime setup
3. React Navigation
4. Feature entry screens and API modules

## Firebase Auth

Firebase auth scaffolding is now expected under the auth feature slice.

Fill these values in [`app.json`](/Users/syarilnazirul/Documents/Documents%20-%20BLMY-NB0069%E2%80%99s%20MacBook%20Pro/test_figma/app.json:1) before testing sign-in:

- `expo.extra.firebase.apiKey`
- `expo.extra.firebase.projectId`
- `expo.extra.firebase.appId`
- `expo.extra.auth.googleWebClientId`
- `expo.extra.auth.googleIosClientId`
- `expo.extra.auth.googleAndroidClientId`
- `expo.extra.auth.facebookAppId`

You will also need:

- Firebase Authentication enabled for Google and Facebook
- Android package name and SHA fingerprints registered with Firebase/Google
- iOS bundle identifier registered with Firebase/Google
- Facebook app configured in Meta for Developers
- A development build for native Google/Facebook login because Expo Go cannot run those SDKs
