import React, { useMemo, useRef, useState } from "react";
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
  addDoc,
  serverTimestamp,
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
  id?: string;
  uid: string;
  message: string;
  created_at: string;
  photoURL: string;
};

// Get id from firestore
const messageConverter: FirestoreDataConverter<Message> = {
  toFirestore(message: WithFieldValue<Message>): DocumentData {
    return {
      uid: message.uid,
      message: message.message,
      created_at: message.created_at,
      photoURL: message.photoURL,
    };
  },
  fromFirestore(
    snapshot: QueryDocumentSnapshot,
    options: SnapshotOptions
  ): Message {
    const data = snapshot.data(options);
    return {
      id: snapshot.id,
      uid: data.uid,
      message: data.message,
      created_at: data.created_at,
      photoURL: data.photoURL,
    };
  },
};

const Chatbox: React.FC = () => {
  const messageRef = collection(db, "messages").withConverter(messageConverter);
  const q = query(messageRef, orderBy("created_at", "desc"), limit(25));
  const [data, loading, error] = useCollectionData(q);
  const [message, setMessage] = useState("");
  const scrollRef = useRef<HTMLSpanElement>(null);

  const messages = useMemo(() => {
    return data?.reverse();
  }, [data]);

  const handleSendMessage: React.FormEventHandler<HTMLFormElement> = async (
    e
  ) => {
    e.preventDefault();

    let photoURL, uid;
    if (!auth.currentUser) {
      return;
    }

    photoURL = auth.currentUser.photoURL || "";
    uid = auth.currentUser.uid;

    await addDoc(messageRef, {
      message,
      created_at: serverTimestamp(),
      uid,
      photoURL,
    });

    setMessage("");
    scrollRef.current?.scrollIntoView(true);
  };
  return (
    <>
      <div className={styles.Chatbox}>
        <header className="App-header">Hello World 🔥 </header>
        {loading ? (
          <p>loading...</p>
        ) : error ? (
          <p>error loading data!</p>
        ) : (
          messages &&
          messages.map((message) => (
            <ChatMessage chat={message} key={message.id} />
          ))
        )}
        <span ref={scrollRef}></span>
      </div>
      <form onSubmit={handleSendMessage}>
        <label htmlFor="chat">Send a message</label>
        <input
          id="chat"
          type="text"
          placeholder=""
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        ></input>
        <button type="submit" disabled={!auth.currentUser || !message}>
          {!auth.currentUser ? "Login first!" : "Send Message"}
        </button>
      </form>
    </>
  );
};

const ChatMessage: React.FC<{ chat: Message }> = ({ chat }) => {
  const { message, photoURL, uid } = chat;
  const id = auth.currentUser?.uid ?? "";
  const messageStyle = uid === id ? "MessageSent" : "MessageReceived";

  return (
    <>
      <div className={`${styles[messageStyle]} ${styles.Message}`}>
        <img src={photoURL} alt={"profile pic"} />
        <p>{message}</p>
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
