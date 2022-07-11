import React from "react";
import { Auth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";

export const SignIn: React.FC<{ auth: Auth }> = ({ auth }) => {
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

export const SignOut: React.FC<{ auth: Auth }> = ({ auth }) => {
  return (
    auth.currentUser && <button onClick={() => auth.signOut()}>Sign Out</button>
  );
};
