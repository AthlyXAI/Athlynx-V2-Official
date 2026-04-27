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
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  type User as FirebaseUser,
} from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBSgiVRwuDC3rhrxONyW1twZeZk-W09PVU",
  authDomain: "athlynxai.firebaseapp.com",
  projectId: "athlynxai",
  storageBucket: "athlynxai.firebasestorage.app",
  messagingSenderId: "752093847574",
  appId: "1:752093847574:web:65b2bea33db6f861f6d537",
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
