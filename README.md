# Firebase Chat App

![Imgur](https://i.imgur.com/93x2Ba5.png)

For practicing deploying to Firebase.

Deploy link: [here](https://jtn-chat-demo.firebaseapp.com/)

Source videos: [here](https://www.youtube.com/watch?v=q5J5ho7YUhA) & [here](https://www.youtube.com/watch?v=zQyrwxMPm88&t=148s)

Reference code repo: [fireship-io](https://github.com/fireship-io/react-firebase-chat)

### Post-mortem

- Achieved deploy to firebase web.app
- Message document database created
- Authentication via `GoogleAuthProvider` and `signInWithPopup`
- Banned words and users were not added (could probably be a future implementation, but not important)
- Issues
  - Converting reference code to TypeScript
  - Reference videos were on an older version of firebase
    - Firebase 7 vs Firebase 9
    - Firebase version 9 is modularized, so destructured imports
    - Lots of functions were imported rather than calling firebase methods
    - Needed to use a converter for the <code>useCollectionData</code> react hook which is explained [here](https://github.com/CSFrequency/react-firebase-hooks/blob/master/firestore/README.md#transforming-data) as `idField`, `refField` options were replaced in react-firebase-hooks v4.

So instead of calling...

```js
const [messages] = useCollectionData(query, { idField: "id" });
```

We write...

```js
// From react-firebase-tools: Enables transforming data as it leaves Firestore and also access the underlying id and ref fields of the snapshot.
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

// Convert the collection, then query it. Note that query, orderby, collection, etc are all imported functions. So we no longer do const query = messageRef.orderBy('created_at').limit(25) as in the reference code
const Chatbox: React.FC = () => {
  const messageRef = collection(db, "messages").withConverter(messageConverter);
  const q = query(messageRef, orderBy("created_at", "desc"), limit(25));
  const [data, loading, error] = useCollectionData(q);

  ...code
}
```
