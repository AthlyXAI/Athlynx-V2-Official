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

// Only initialize Firebase if all required config values are present
export const isFirebaseConfigured = !!(
  firebaseConfig.apiKey &&
  firebaseConfig.authDomain &&
  firebaseConfig.projectId &&
  firebaseConfig.appId
);
const app = isFirebaseConfigured
  ? (getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0])
  : null;
export const auth = isFirebaseConfigured && app ? getAuth(app) : null as any;

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
  if (!isFirebaseConfigured || !auth) throw new Error('Firebase is not configured');
  const result = await signInWithPopup(auth, googleProvider);
  const idToken = await result.user.getIdToken();
  return { idToken, user: result.user };
}

/** Sign in with Apple popup — returns Firebase ID token */
export async function signInWithApple(): Promise<{ idToken: string; user: FirebaseUser }> {
  if (!isFirebaseConfigured || !auth) throw new Error('Firebase is not configured');
  const result = await signInWithPopup(auth, appleProvider);
  const idToken = await result.user.getIdToken();
  return { idToken, user: result.user };
}

/** Sign in with Facebook popup — returns Firebase ID token */
export async function signInWithFacebook(): Promise<{ idToken: string; user: FirebaseUser }> {
  if (!isFirebaseConfigured || !auth) throw new Error('Firebase is not configured');
  const result = await signInWithPopup(auth, facebookProvider);
  const idToken = await result.user.getIdToken();
  return { idToken, user: result.user };
}

/** Sign in with X (Twitter) popup — returns Firebase ID token */
export async function signInWithTwitter(): Promise<{ idToken: string; user: FirebaseUser }> {
  if (!isFirebaseConfigured || !auth) throw new Error('Firebase is not configured');
  const result = await signInWithPopup(auth, twitterProvider);
  const idToken = await result.user.getIdToken();
  return { idToken, user: result.user };
}

/** Sign out from Firebase */
export async function firebaseSignOut(): Promise<void> {
  if (auth) await signOut(auth);
}

export {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  type FirebaseUser,
};
