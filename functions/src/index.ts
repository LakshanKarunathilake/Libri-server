import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin'

// Initializing Firebase App
admin.initializeApp();

// Basic helloworld function
export const helloWorld = functions.https.onRequest((request, response) => {
 response.send("Hello from Firebase!");
});


export const createNewUser = functions.https.onRequest((request, response) => {
    admin.auth().createUser({
        email: "use1ra@example.com",
        emailVerified: false,
        phoneNumber: "+112345678901",
        password: "secretPassword",
        displayName: "John Doe1",
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
            response.send("User Creation Failed");

        });
   });
   

