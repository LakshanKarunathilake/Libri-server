import * as functions from "firebase-functions";
import * as admin from "firebase-admin";

// Initializing Firebase App
admin.initializeApp();
const libriFuntions = require("./libri/app-functions");
const dashboardFunctions = require("./dashboard/dashboard-functions");
const rp = require("request-promise");
const cors = require("cors")({
  origin: true
});

export const createNewUser = functions.https.onRequest((request, response) => {
  admin
    .auth()
    .createUser({
      email: request.get("email"),
      emailVerified: false,
      phoneNumber: request.get("phoneNumber"),
      password: request.get("password"),
      displayName: request.get("displayName"),
      photoURL: "http://www.example.com/12345678/photo.png",
      disabled: false
    })
    .then(function(userRecord) {
      // See the UserRecord reference doc for the contents of userRecord.
      response.send("User Created success");
      console.log("Successfully created new user:", userRecord.uid);
    })
    .catch(function(error) {
      console.log("Error creating new user:", error);
      response.send(error.errorInfo.message);
    });
});

export const subscribeToTopic = functions.https.onCall(async data => {
  await admin.messaging().subscribeToTopic(data.token, data.topic);

  return `subscribed to ${data.topic}`;
});

export const unsubscribeFromTopic = functions.https.onCall(async data => {
  await admin.messaging().unsubscribeFromTopic(data.token, data.topic);

  return `unsubscribed from ${data.topic}`;
});

export const sendNoticeCreation = functions.firestore
  .document("notices/{noticeID}")
  .onCreate(async snapshot => {
    const notice = snapshot.data() || {};

    const notification: admin.messaging.Notification = {
      title: notice.title,
      body: notice.message
    };

    const payload: admin.messaging.Message = {
      notification,
      topic: notice.topic
    };

    return admin.messaging().send(payload);
  });

export const sendMessageToDevice = functions.https.onRequest((req, res) => {
  cors(req, res, async () => {
    const token = req.body.data.token;
    const msg = req.body.data.msg;
    const title = req.body.data.title;

    const payload: admin.messaging.MessagingPayload = { data: { msg, title } };
    admin
      .messaging()
      .sendToDevice(token, payload)
      .then(() => {
        console.log("Message sent success");
        res.status(200).send({ data: {} });
      })
      .catch(err => {
        console.log("Message sent Failure");
        res.status(500).send(err);
      });
  });
});

export const captchaValidate = functions.https.onRequest((req, res) => {
  const response = req.query.response;
  console.log("recaptcha response", response);
  rp({
    uri: "https://recaptcha.google.com/recaptcha/api/siteverify",
    method: "POST",
    formData: {
      secret: "PASTE_YOUR_SECRET_CODE_HERE",
      response: response
    },
    json: true
  })
    .then((result: any) => {
      console.log("recaptcha result", result);
      if (result.success) {
        res.send("You're good to go, human.");
      } else {
        res.send("Recaptcha verification failed. Are you a robot?");
      }
    })
    .catch((reason: any) => {
      console.log("Recaptcha request failure", reason);
      res.send("Recaptcha request failed.");
    });
});

export const getRegisteredUsers = functions.https.onRequest((req, res) => {
  cors(req, res, async () => {
    const users = await admin.auth().listUsers();
    const allusers = users.users.map(user => {
      return {
        email: user.email,
        displayName: user.displayName || "",
        verified: user.emailVerified,
        disabled: user.disabled,
        phoneNumber: user.phoneNumber,
        created: user.metadata.creationTime,
        lastLogin: user.metadata.lastSignInTime,
        uid: user.uid
      };
    });
    console.log("Requested for registered users");
    console.log("Sending registered user list");
    res.status(200).send({ data: { ...allusers } });
  });
});

export const isUserIdAvailable = functions.https.onRequest((req, res) => {
  cors(req, res, async () => {
    await libriFuntions.checkAccountAvailable(req, res);
  });
});

export const searchBook = functions.https.onRequest((req, res) => {
  cors(req, res, async () => {
    await libriFuntions.getBooks(req, res);
  });
});

export const getPersonalBorrowings = functions.https.onRequest((req, res) => {
  cors(req, res, async () => {
    await libriFuntions.getPersonalBorrowings(req, res);
  });
});

export const getOldUserBorrowings = functions.https.onRequest((req, res) => {
  cors(req, res, async () => {
    await libriFuntions.getOldUserBorrowings(req, res);
  });
});

export const penaltyPayment = functions.https.onRequest((req, res) => {
  cors(req, res, async () => {
    await libriFuntions.processPenaltyPayment(req, res);
  });
});

export const isBookTransferable = functions.https.onRequest((req, res) => {
  cors(req, res, async () => {
    await libriFuntions.bookTransferable(req, res);
  });
});

export const isBookAvailable = functions.https.onRequest((req, res) => {
  cors(req, res, async () => {
    await libriFuntions.isBookAvailable(req, res);
  });
});

export const enableOrDisableUser = functions.https.onRequest((req, res) => {
  cors(req, res, async () => {
    await dashboardFunctions.enableOrDisableUser(req, res);
  });
});
