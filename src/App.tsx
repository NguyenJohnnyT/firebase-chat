import React from "react";
import Layout from "./layout";
import "./styles/_global.scss";
import styles from "./index.module.scss";
import { SignIn, SignOut } from "./components/SignInButtons";
import * as firebase from "firebase/app";
import {
  getFirestore,
  collection,
  orderBy,
  limit,
  query,
  FirestoreDataConverter,
  WithFieldValue,
  DocumentData,
  QueryDocumentSnapshot,
  SnapshotOptions,
} from "firebase/firestore";
import { getAuth } from "firebase/auth";

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
const db = getFirestore(app);

type Message = {
  id: string;
  message: string;
  created_at: string;
};

const messageConverter: FirestoreDataConverter<Message> = {
  toFirestore(message: WithFieldValue<Message>): DocumentData {
    return {
      id: message.id,
      message: message.message,
      created_at: message.created_at,
    };
  },
  fromFirestore(
    snapshot: QueryDocumentSnapshot,
    options: SnapshotOptions
  ): Message {
    const data = snapshot.data(options);
    return {
      id: snapshot.id,
      message: data.message,
      created_at: data.created_at,
    };
  },
};

const Chatbox: React.FC = () => {
  const messageRef = collection(db, "messages").withConverter(messageConverter);
  const q = query(messageRef, orderBy("created_at"), limit(25));
  const [data, loading, error] = useCollectionData(q);

  return (
    <div className={styles.Chatbox}>
      <header className="App-header">Hello World :fire:</header>
      {loading ? (
        <p>loading...</p>
      ) : error ? (
        <p>error loading data!</p>
      ) : (
        data &&
        data.map((message) => (
          <ChatMessage message={message} key={message.id} />
        ))
      )}
    </div>
  );
};

const ChatMessage: React.FC<{ message: Message }> = ({ message }) => {
  return (
    <>
      <div>
        <p>{message.message}</p>
      </div>
    </>
  );
};

const App: React.FC = () => {
  const [user] = useAuthState(auth);

  return (
    <Layout>
      {!user ? <SignIn auth={auth} /> : <SignOut auth={auth} />}
      <Chatbox />
    </Layout>
  );
};

export default App;
