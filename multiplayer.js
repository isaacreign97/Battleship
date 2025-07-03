// Firebase setup for realtime Battleship
const firebaseConfig = {
  apiKey: "YOUR_KEY",
  authDomain: "YOUR_DOMAIN",
  projectId: "YOUR_PROJECT_ID"
};
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

window.createGame = async function() {
  const id = Math.random().toString(36).slice(2,7);
  await db.collection('games').doc(id).set({turn: 'p1'});
  return id;
};

window.joinGame = async function(id) {
  const ref = db.collection('games').doc(id);
  const snap = await ref.get();
  if(!snap.exists) throw new Error('Game not found');
  return id;
};

window.sendMove = function(id, player, board) {
  const ref = db.collection('games').doc(id);
  const field = player === 'p1' ? 'board1' : 'board2';
  return ref.update({[field]: board, turn: player === 'p1' ? 'p2' : 'p1'});
};

window.listenGame = function(id, cb) {
  return db.collection('games').doc(id).onSnapshot(doc => cb(doc.data()));
};
