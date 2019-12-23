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
	getAuthenticatedUser,
	getUserDetails,
	markNotificationsRead
} = require('./handlers/users');

// meow routes
app.get('/meows', getAllMeows);
app.post('/meow', FBAuth, postOneMeow);
app.get('/meow/:meowId', getMeow);
app.delete('/meow/:meowId', FBAuth, deleteMeow);
app.put('/meow/:meowId/like', FBAuth, likeMeow);
app.put('/meow/:meowId/unlike', FBAuth, unlikeMeow);
app.post('/meow/:meowId/comment', FBAuth, commentOnMeow);

// users routes
app.post('/signup', signup);
app.post('/login', login);
app.post('/user/image', FBAuth, uploadImage);
app.post('/user', FBAuth, addUserDetails);
app.get('/user', FBAuth, getAuthenticatedUser);
app.get('/user/:handle', getUserDetails);
app.post('/notifications', FBAuth, markNotificationsRead);

exports.api = functions.https.onRequest(app);

exports.createNotificationOnLike = functions.firestore
	.document('likes/{id}')
	.onCreate((snapshot) => {
		return db
			.doc(`/meows/${snapshot.data().meowId}`)
			.get()
			.then((doc) => {
				if (
					doc.exists &&
					doc.data().userHandle !== snapshot.data().userHandle
				) {
					return db.doc(`/notifications/${snapshot.id}`).set({
						createdAt: new Date().toISOString(),
						recipient: doc.data().userHandle,
						sender: snapshot.data().userHandle,
						type: 'like',
						read: false,
						meowId: doc.id
					});
				}
			})
			.catch((err) => console.error(err));
	});
exports.deleteNotificationOnUnlike = functions.firestore
	.document('likes/{id}')
	.onDelete((snapshot) => {
		return db
			.doc(`/notifications/${snapshot.id}`)
			.delete()
			.catch((err) => {
				console.error(err);
				return;
			});
	});
exports.createNotificationOnComment = functions.firestore
	.document('comments/{id}')
	.onCreate((snapshot) => {
		return db
			.doc(`/meows/${snapshot.data().meowId}`)
			.get()
			.then((doc) => {
				if (
					doc.exists &&
					doc.data().userHandle !== snapshot.data().userHandle
				) {
					return db.doc(`/notifications/${snapshot.id}`).set({
						createdAt: new Date().toISOString(),
						recipient: doc.data().userHandle,
						sender: snapshot.data().userHandle,
						type: 'comment',
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

exports.onUserImageChange = functions.firestore
	.document('/users/{userId}')
	.onUpdate((change) => {
		console.log(change.before.data());
		console.log(change.after.data());
		if (change.before.data().imageUrl !== change.after.data().imageUrl) {
			console.log('image has changed');
			const batch = db.batch();
			return db
				.collection('meows')
				.where('userHandle', '==', change.before.data().handle)
				.get()
				.then((data) => {
					data.forEach((doc) => {
						const meow = db.doc(`/meows/${doc.id}`);
						batch.update(meow, { userImage: change.after.data().imageUrl });
					});
					return batch.commit();
				});
		} else return true;
	});

exports.onMeowDelete = functions.firestore
	.document('/meows/{meowId}')
	.onDelete((snapshot, context) => {
		const meowId = context.params.meowId;
		const batch = db.batch();
		return db
			.collection('comments')
			.where('meowId', '==', meowId)
			.get()
			.then((data) => {
				data.forEach((doc) => {
					batch.delete(db.doc(`/comments/${doc.id}`));
				});
				return db
					.collection('likes')
					.where('meowId', '==', meowId)
					.get();
			})
			.then((data) => {
				data.forEach((doc) => {
					batch.delete(db.doc(`/likes/${doc.id}`));
				});
				return db
					.collection('notifications')
					.where('meowId', '==', meowId)
					.get();
			})
			.then((data) => {
				data.forEach((doc) => {
					batch.delete(db.doc(`/notifications/${doc.id}`));
				});
				return batch.commit();
			})
			.catch((err) => console.error(err));
	});
