/**
 * ATHLYNX — Firebase Auth Client
 * Replaces Auth0/Okta with Firebase Authentication.
 * Supports: Google, Apple, Facebook (when configured), Email/Password
 */
import { initializeApp, getApps } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
  OAuthProvider,
  FacebookAuthProvider,
  TwitterAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  type User as FirebaseUser,
} from "firebase/auth";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

// Prevent duplicate initialization in dev HMR
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
export const auth = getAuth(app);

// Providers
const googleProvider = new GoogleAuthProvider();
googleProvider.addScope("email");
googleProvider.addScope("profile");

const appleProvider = new OAuthProvider("apple.com");
appleProvider.addScope("email");
appleProvider.addScope("name");

const facebookProvider = new FacebookAuthProvider();
facebookProvider.addScope("email");
facebookProvider.addScope("public_profile");

const twitterProvider = new TwitterAuthProvider();

/** Sign in with Google popup — returns Firebase ID token */
export async function signInWithGoogle(): Promise<{ idToken: string; user: FirebaseUser }> {
  const result = await signInWithPopup(auth, googleProvider);
  const idToken = await result.user.getIdToken();
  return { idToken, user: result.user };
}

/** Sign in with Apple popup — returns Firebase ID token */
export async function signInWithApple(): Promise<{ idToken: string; user: FirebaseUser }> {
  const result = await signInWithPopup(auth, appleProvider);
  const idToken = await result.user.getIdToken();
  return { idToken, user: result.user };
}

/** Sign in with Facebook popup — returns Firebase ID token */
export async function signInWithFacebook(): Promise<{ idToken: string; user: FirebaseUser }> {
  const result = await signInWithPopup(auth, facebookProvider);
  const idToken = await result.user.getIdToken();
  return { idToken, user: result.user };
}

/** Sign in with X (Twitter) popup — returns Firebase ID token */
export async function signInWithTwitter(): Promise<{ idToken: string; user: FirebaseUser }> {
  const result = await signInWithPopup(auth, twitterProvider);
  const idToken = await result.user.getIdToken();
  return { idToken, user: result.user };
}

/** Sign out from Firebase */
export async function firebaseSignOut(): Promise<void> {
  await signOut(auth);
}

export {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  type FirebaseUser,
};
