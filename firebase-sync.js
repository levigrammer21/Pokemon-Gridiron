import { initializeApp } from 'https://www.gstatic.com/firebasejs/12.17.1/firebase-app.js';
import {
  getAuth, onAuthStateChanged, GoogleAuthProvider, signInWithPopup,
  createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut,
  EmailAuthProvider, linkWithCredential, linkWithPopup,
  RecaptchaVerifier, PhoneAuthProvider, signInWithCredential
} from 'https://www.gstatic.com/firebasejs/12.17.1/firebase-auth.js';
import {
  getFirestore, doc, getDoc, setDoc, collection, query, orderBy, limit, getDocs,
  serverTimestamp
} from 'https://www.gstatic.com/firebasejs/12.17.1/firebase-firestore.js';

const firebaseConfig = {
  apiKey: 'AIzaSyALNWprlsknXwJLjn3YUbcrXN5i2xV_zsU',
  authDomain: 'pokemongridiron.firebaseapp.com',
  projectId: 'pokemongridiron',
  storageBucket: 'pokemongridiron.firebasestorage.app',
  messagingSenderId: '1083451194498',
  appId: '1:1083451194498:web:cde4347001eedfc0dd889b'
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
auth.useDeviceLanguage();

let saveTimer = null;
let pendingSave = null;
let phoneVerificationId = null;
let phoneMode = 'signin';
let recaptchaVerifier = null;
let lastAuthDetail = { signedIn:false, ready:false, profile:null, cloudState:null, cloudUpdatedAt:0 };

function providerIds(user) {
  return [...new Set((user?.providerData || []).map((item)=>item.providerId))];
}

function profileFor(user) {
  if (!user) return null;
  return {
    uid:user.uid,
    displayName:user.displayName || '',
    email:user.email || '',
    phoneNumber:user.phoneNumber || '',
    photoURL:user.photoURL || '',
    providers:providerIds(user)
  };
}

function dispatchAuth(detail) {
  lastAuthDetail = detail;
  window.PGCloudStatus = detail;
  window.dispatchEvent(new CustomEvent('pg-cloud-auth', { detail }));
}

function errorMessage(error) {
  const code = String(error?.code || '');
  const friendly = {
    'auth/email-already-in-use':'That email is already attached to another account.',
    'auth/credential-already-in-use':'That sign-in method is already attached to another account.',
    'auth/account-exists-with-different-credential':'An account already exists with that email under another sign-in method.',
    'auth/invalid-credential':'The email/password or verification credential was not accepted.',
    'auth/invalid-verification-code':'That SMS verification code is not valid.',
    'auth/invalid-phone-number':'Use a valid phone number including country code, such as +1 555 555 0123.',
    'auth/popup-closed-by-user':'The Google sign-in window was closed before sign-in finished.',
    'auth/too-many-requests':'Too many attempts were made. Try again later.',
    'auth/operation-not-allowed':'That sign-in provider is not enabled in Firebase Authentication.',
    'auth/unauthorized-domain':'This domain is not authorized for Firebase Authentication.'
  };
  return friendly[code] || error?.message || 'Firebase could not complete that request.';
}

async function loadCloudSave(user) {
  const ref = doc(db, 'users', user.uid, 'saves', 'main');
  const snap = await getDoc(ref);
  if (!snap.exists()) return { state:null, updatedAt:0 };
  const data = snap.data();
  return { state:data.state || null, updatedAt:Number(data.clientUpdatedAt) || 0 };
}

async function writeCloud(state, leaderboard) {
  const user = auth.currentUser;
  if (!user || !state) return false;
  const clientUpdatedAt = Number(state.localSavedAt) || Date.now();
  await setDoc(doc(db, 'users', user.uid, 'saves', 'main'), {
    state,
    clientUpdatedAt,
    updatedAt:serverTimestamp()
  }, { merge:true });
  if (leaderboard) {
    await setDoc(doc(db, 'leaderboards', user.uid), {
      ...leaderboard,
      uid:user.uid,
      updatedAt:serverTimestamp()
    });
  }
  window.dispatchEvent(new CustomEvent('pg-cloud-saved', { detail:{ clientUpdatedAt } }));
  return true;
}

function queueSave(state, leaderboard, immediate=false) {
  if (!auth.currentUser || !state) return;
  pendingSave = { state, leaderboard };
  clearTimeout(saveTimer);
  if (immediate) {
    const payload = pendingSave; pendingSave = null;
    return writeCloud(payload.state, payload.leaderboard).catch((error)=>{
      window.dispatchEvent(new CustomEvent('pg-cloud-error', { detail:{ message:errorMessage(error) } }));
    });
  }
  saveTimer = setTimeout(async()=>{
    const payload = pendingSave; pendingSave = null;
    if (!payload) return;
    try { await writeCloud(payload.state, payload.leaderboard); }
    catch (error) { window.dispatchEvent(new CustomEvent('pg-cloud-error', { detail:{ message:errorMessage(error) } })); }
  }, 1200);
}

async function signInGoogle() {
  return signInWithPopup(auth, new GoogleAuthProvider());
}
async function linkGoogle() {
  if (!auth.currentUser) throw new Error('Sign in first.');
  return linkWithPopup(auth.currentUser, new GoogleAuthProvider());
}
async function emailSignIn(email,password) { return signInWithEmailAndPassword(auth,email,password); }
async function emailCreate(email,password) { return createUserWithEmailAndPassword(auth,email,password); }
async function linkEmail(email,password) {
  if (!auth.currentUser) throw new Error('Sign in first.');
  return linkWithCredential(auth.currentUser, EmailAuthProvider.credential(email,password));
}

function resetRecaptcha() {
  if (recaptchaVerifier) {
    try { recaptchaVerifier.clear(); } catch {}
    recaptchaVerifier = null;
  }
}

async function sendPhoneCode(phone, mode='signin') {
  resetRecaptcha();
  phoneMode = mode;
  recaptchaVerifier = new RecaptchaVerifier(auth, 'phoneRecaptcha', { size:'normal' });
  await recaptchaVerifier.render();
  const provider = new PhoneAuthProvider(auth);
  phoneVerificationId = await provider.verifyPhoneNumber(phone, recaptchaVerifier);
  return true;
}

async function confirmPhoneCode(code) {
  if (!phoneVerificationId) throw new Error('Send an SMS code first.');
  const credential = PhoneAuthProvider.credential(phoneVerificationId, code);
  let result;
  if (phoneMode === 'link') {
    if (!auth.currentUser) throw new Error('Sign in first.');
    result = await linkWithCredential(auth.currentUser, credential);
  } else {
    result = await signInWithCredential(auth, credential);
  }
  phoneVerificationId = null;
  resetRecaptcha();
  return result;
}

async function getLeaderboard() {
  const q = query(collection(db, 'leaderboards'), orderBy('rankScore','desc'), limit(100));
  const snaps = await getDocs(q);
  return snaps.docs.map((snap,index)=>({ rank:index+1, id:snap.id, ...snap.data() }));
}

window.PGCloud = {
  ready:true,
  get user(){ return profileFor(auth.currentUser); },
  get lastAuth(){ return lastAuthDetail; },
  emitCurrentAuth(){ dispatchAuth(lastAuthDetail); },
  signInGoogle, linkGoogle, emailSignIn, emailCreate, linkEmail,
  sendPhoneCode, confirmPhoneCode,
  signOut:()=>signOut(auth),
  queueSave,
  saveNow:(state,leaderboard)=>queueSave(state,leaderboard,true),
  getLeaderboard,
  errorMessage
};

onAuthStateChanged(auth, async(user)=>{
  if (!user) {
    dispatchAuth({ signedIn:false, ready:true, profile:null, cloudState:null, cloudUpdatedAt:0 });
    return;
  }
  try {
    const cloud = await loadCloudSave(user);
    dispatchAuth({ signedIn:true, ready:true, profile:profileFor(user), cloudState:cloud.state, cloudUpdatedAt:cloud.updatedAt });
    if (!cloud.state && typeof window.PGGetLocalState === 'function') {
      const payload = window.PGGetLocalState();
      if (payload?.state) queueSave(payload.state,payload.leaderboard,true);
    }
  } catch (error) {
    dispatchAuth({ signedIn:true, ready:true, profile:profileFor(user), cloudState:null, cloudUpdatedAt:0, error:errorMessage(error) });
  }
});
