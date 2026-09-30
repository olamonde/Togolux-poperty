import {
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  User,
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db } from '../firebase/config';
import { UserRecord } from '../types';

export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: 'select_account' });

/**
 * Connexion sécurisée avec le compte Google (Popup).
 */
export async function loginWithGoogle(): Promise<User> {
  const result = await signInWithPopup(auth, googleProvider);
  if (result.user) {
    try {
      await syncUserRecord(result.user);
    } catch (e) {
      console.warn('Erreur lors de la synchronisation du profil utilisateur Firestore:', e);
    }
  }
  return result.user;
}

/**
 * Déconnexion de Firebase Authentication.
 */
export async function logoutUser(): Promise<void> {
  await signOut(auth);
}

/**
 * Synchronise ou initialise le document utilisateur dans la collection `users`.
 */
export async function syncUserRecord(user: User): Promise<UserRecord> {
  const userRef = doc(db, 'users', user.uid);
  const isBootstrapped = user.email === 'olamonde7@gmail.com';

  try {
    const snap = await getDoc(userRef);
    if (snap.exists()) {
      const data = snap.data() as UserRecord;
      if (isBootstrapped && data.role !== 'admin') {
        const updated: UserRecord = { ...data, role: 'admin', updatedAt: new Date().toISOString() };
        await setDoc(userRef, updated, { merge: true });
        return updated;
      }
      return data;
    }
  } catch (err) {
    console.warn('Recherche utilisateur Firestore différée:', err);
  }

  const names = (user.displayName || 'Utilisateur TogoLux').trim().split(' ');
  const firstName = names[0] || 'Utilisateur';
  const lastName = names.slice(1).join(' ') || 'TogoLux';

  const newRecord: UserRecord = {
    uid: user.uid,
    firstName,
    lastName,
    displayName: user.displayName || user.email || 'Utilisateur',
    email: user.email || '',
    phone: user.phoneNumber || '',
    photoURL: user.photoURL || undefined,
    role: isBootstrapped ? 'admin' : 'agent',
    status: 'active',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  try {
    await setDoc(userRef, newRecord);
  } catch (err) {
    console.warn("Création de l'utilisateur Firestore différée:", err);
  }

  return newRecord;
}

/**
 * Écouteur des changements d'état d'authentification.
 */
export function subscribeAuthState(callback: (user: User | null) => void) {
  return onAuthStateChanged(auth, callback);
}
