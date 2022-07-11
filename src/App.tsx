import React from "react";
import Layout from "./layout";
import "./styles/_global.scss";
import styles from "./index.module.scss";

import * as firebase from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";

import { useAuthState } from "react-firebase-hooks/auth";
import { useCollectionData } from "react-firebase-hooks/firestore";

const app = firebase.initializeApp({
  apiKey: "AIzaSyCG7mvkOU87ggsNI5iwLAlzls4EOst-bJ4",
  authDomain: "jtn-chat-demo.firebaseapp.com",
  projectId: "jtn-chat-demo",
  storageBucket: "jtn-chat-demo.appspot.com",
  messagingSenderId: "876421873757",
  appId: "1:876421873757:web:54f44329f764b3c7498db4",
  measurementId: "G-B3TFT492R8",
});

const auth = getAuth();
const firestore = getFirestore();

const SignIn: React.FC = () => {
  const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    await signInWithPopup(auth, provider);
  };

  return (
    <>
      <button onClick={signInWithGoogle}>Sign in with Google</button>
    </>
  );
};

const SignOut: React.FC = () => {
  return (
    auth.currentUser && <button onClick={() => auth.signOut()}>Sign Out</button>
  );
};

const App: React.FC = () => {
  const [user] = useAuthState(auth);

  return (
    <Layout>
      {!user ? <SignIn /> : <SignOut />}
      <div className={styles.Chatbox}>
        <header className="App-header">Hello World :fire:</header>
      </div>
    </Layout>
  );
};

export default App;
