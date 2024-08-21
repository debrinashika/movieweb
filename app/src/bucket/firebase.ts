import { initializeApp, cert, getApps } from 'firebase-admin/app';
import { getStorage } from 'firebase-admin/storage';

const serviceAccount = require('../bucket/firebase.json');

export const firebaseApp = getApps().length === 0 ? initializeApp({
  credential: cert(serviceAccount),
  storageBucket: 'gs://moviebros-8be55.appspot.com',
}) : getApps()[0];

export const bucket = getStorage(firebaseApp).bucket();
