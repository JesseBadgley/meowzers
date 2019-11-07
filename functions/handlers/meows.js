const { db } = require("../util/admin");

exports.getAllMeows = (req, res) => {
  db.collection("meows")

    .get()
    .then((data) => {
      data
        .forEach((doc) => {
          let meows = [];
          data.forEach((doc) => {
            meows.push({
              meowId: doc.id,
              body: doc.data().body,
              userHandle: doc.data().userHandle,
              createAt: doc.data().createdAt
            });
          });
          return res.json(meows);
        })
        .catch((err) => console.error(err));
    });
};

exports.postOneMeow = (req, res) => {
  if (req.body.body.trim() === "") {
    return res
      .status(400)
      .json({ body: "Sorry kitty, the body must not be empty." });
  }

  const newMeow = {
    body: req.body.body,
    userHandle: req.user.handle,
    userImage: req.user.imageUrl,
    createAt: new Date().toISOString(),
    likeCount: 0,
    commentCount: 0
  };

  db.collection("meows")
    .add(newMeow)
    .then((doc) => {
      const resMeow = newMeow;
      resMeow.meowId = doc.id;
      res.json(resMeow);
    })
    .catch((err) => {
      res
        .status(500)
        .json({ error: "You have to be kitten me.. Something went wrong" });
      console.error(err);
    });
};
// Fetch one meow
exports.getMeow = (req, res) => {
  let meowData = {};
  db.doc(`/meows/${req.params.meowId}`)
    .get()
    .then((doc) => {
      if (!doc.exists) {
        return res
          .status(404)
          .json({ error: "You have to be kitten me.. Meow not found." });
      }
      meowData = doc.data();
      meowData.meowId = doc.id;
      return db
        .collection("comments")
        .orderBy("createdAt", "desc")
        .where("meowId", "==", req.params.meowId)
        .get();
    })
    .then((data) => {
      meowData.comments = [];
      data.forEach((doc) => {
        meowData.comments.push(doc.data());
      });
      return res.json(meowData);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json({ error: err.code });
    });
};

// Comment on a meow
exports.commentOnMeow = (req, res) => {
  if (req.body.body.trim() === "")
    return res
      .status(400)
      .json({ error: "You have to be kitten me.. Must not be empty." });

  const newComment = {
    body: req.body.body,
    createAt: new Date().toISOString(),
    meowId: req.params.meowId,
    userHandle: req.user.handle,
    userImage: req.user.imageUrl
  };

  db.doc(`/meows/${req.params.meowId}`)
    .get()
    .then((doc) => {
      if (!doc.exists) {
        return res
          .status(400)
          .json({ error: "You have to be kitten me.. Meow not found." });
      }
      return doc.ref.update({ commentCount: doc.data().commentCount + 1 });
    })
    .then(() => {
      return db.collection("comments").add(newComment);
    })
    .then(() => {
      res.json(newComment);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ error: "Oops, something went wrong." });
    });
};

// Like a meow
exports.likeMeow = (req, res) => {
  const likeDocument = db
    .collection("likes")
    .where("userHandle", "==", req.user.handle)
    .where("meowId", "==", req.params.meowId)
    .limit(1);

  const meowDocument = db.doc(`/meows/${req.params.meowId}`);

  let moewData = {};

  meowDocument
    .get()
    .then((doc) => {
      if (doc.exists) {
        meowData = doc.data();
        meowData.meowId = doc.id;
        return likeDocument.get();
      } else {
        return res
          .status(404)
          .json({ error: "You have to be kitten me.. Meow not found." });
      }
    })
    .then((data) => {
      if (data.empty) {
        return db
          .collection("likes")
          .add({
            meowId: req.params.meowId,
            userHandle: req.user.handle
          })
          .then(() => {
            meowData.likeCount++;
            return meowDocument.update({ likeCount: meowData.likeCount });
          })
          .then(() => {
            return res.json(meowData);
          });
      } else {
        return res
          .status(400)
          .json({ error: "You have to be kitten me.. Meow already liked." });
      }
    })
    .catch((err) => {
      res.status(500).json({ error: err.code });
    });
};

// Unlike meow
exports.unlikeMeow = (req, res) => {
  const likeDocument = db
    .collection("likes")
    .where("userHandle", "==", req.user.handle)
    .where("meowId", "==", req.params.meowId)
    .limit(1);

  const meowDocument = db.doc(`/meows/${req.params.meowId}`);

  let moewData = {};

  meowDocument
    .get()
    .then((doc) => {
      if (doc.exists) {
        meowData = doc.data();
        meowData.meowId = doc.id;
        return likeDocument.get();
      } else {
        return res
          .status(404)
          .json({ error: "You have to be kitten me.. Meow not found." });
      }
    })
    .then((data) => {
      if (data.empty) {
        return res
          .status(400)
          .json({ error: "You have to be kitten me.. Meow not liked." });
      } else {
        return db
          .doc(`/likes/${data.docs[0].id}`)
          .delete()
          .then(() => {
            meowData.likeCount--;
            return meowDocument.update({ likeCount: meowData.likeCount });
          })
          .then(() => {
            res.json(meowData);
          });
      }
    })
    .catch((err) => {
      res.status(500).json({ error: err.code });
    });
};

// Delete a meow
exports.deleteMeow = (req, res) => {
  const document = db.doc(`/meows/${req.params.meowId}`);
  document
    .get()
    .then((doc) => {
      if (!doc.exists) {
        return res
          .status(404)
          .json({ error: "You have to be kitten me.. Meow not found." });
      }
      if (doc.data().userHandle !== req.user.handle) {
        return res
          .status(403)
          .json({ error: "No kitty! That is unauthorized." });
      } else {
        return document.delete();
      }
    })
    .then(() => {
      res.json({ message: "Meow deleted successfully." });
    })
    .catch((err) => {
      console.error(err);
      return res.status(500).json({ error: err.code });
    });
};
