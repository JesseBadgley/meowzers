require('dotenv').config();
const functions = require('firebase-functions');
const app = require('express')();
const FBAuth = require('./util/fbAuth');

const cors = require('cors');
app.use(cors());

const { db } = require('./util/admin');

const {
  getAllMeows,
  postOneMeow,
  getMeow,
  commentOnMeow,
  likeMeow,
  unlikeMeow,
  deleteMeow
} = require('./handlers/meows');
const {
  signup,
  login,
  uploadImage,
  addUserDetails,
  getAuthenticatedUser
} = require('./handlers/users');

// meow routes
app.get('/meows', getAllMeows);
app.post('/meow', FBAuth, postOneMeow);
app.get('/meow/:meowId', getMeow);
app.delete('/meow/:meowId', FBAuth, deleteMeow);
app.get('/meow/:meowId/like', FBAuth, likeMeow);
app.get('/meow/:meowId/unlike', FBAuth, unlikeMeow);
app.post('/meow/:meowId/comment', FBAuth, commentOnMeow);

// users routes
app.post('/signup', signup);
app.post('/login', login);
app.post('/user/image', FBAuth, uploadImage);
app.post('/user', FBAuth, addUserDetails);
app.get('/user', FBAuth, getAuthenticatedUser);

exports.api = functions.https.onRequest(app);

// Create notifications on like
exports.createNotificationOnLike = functions.firestore
  .document('likes/{id}')
  .onCreate((snapshot) => {
    db.doc(`/meows/${snapshot.data().meowId}`)
      .get()
      .then((doc) => {
        if (
          doc.exists &&
          doc.data().userHandle !== snapshot.data().userHandle
        ) {
          return db.doc(`/notifications/${snapshot.id}`).set({
            createdAt: new Date().toISOString(),
            recipient: doc.date().userHandle,
            sender: snapshot.data().userHandle,
            type: 'like',
            read: false,
            meowId: doc.id
          });
        }
      })
      .catch((err) => {
        console.error(err);
        return;
      });
  });

// Delete notification on unlike
exports.deleteNotificationOnUnlike = functions.firestore
  .document('likes/{id}')
  .onDelete((snapshot) => {
    db.doc(`/notifications/${snapshot.id}`)
      .delete()
      .then(() => {
        return;
      })
      .catch((err) => {
        console.error(err);
        return;
      });
  });

// Create notifications on comment
exports.createNotificationOnComment = functions.firestore
  .document('comments/{id}')
  .onCreate((snapshot) => {
    db.doc(`/meows/${snapshot.data().meowId}`)
      .get()
      .then((doc) => {
        if (doc.exists) {
          return db.doc(`/notifications/${snapshot.id}`).set({
            createdAt: new Date().toISOString(),
            recipient: doc.date().userHandle,
            sender: snapshot.data().userHandle,
            type: 'comment',
            read: false,
            meowId: doc.id
          });
        }
      })
      .then(() => {
        return;
      })
      .catch((err) => {
        console.error(err);
        return;
      });
  });
