import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin'

// Initializing Firebase App
admin.initializeApp();

// Basic helloworld function
export const helloWorld = functions.https.onRequest((request, response) => {
 response.send("Hello from Firebase!");
});


export const createNewUser = admin.auth().createUser({
    email: "user@example.com",
    emailVerified: false,
    phoneNumber: "+11234567890",
    password: "secretPassword",
    displayName: "John Doe",
    photoURL: "http://www.example.com/12345678/photo.png",
    disabled: false
  })
    .then(function(userRecord) {
      // See the UserRecord reference doc for the contents of userRecord.
      console.log("Successfully created new user:", userRecord.uid);
    })
    .catch(function(error) {
      console.log("Error creating new user:", error);
    });