"use strict";

UpsellTracker.factory("authFactory", (firebaseURL, $http) => {
  let ref = new Firebase(firebaseURL);
  let currentUserData = null;


  return {

    userID () {
      return currentUserData.uid;
    },

    /*
      Determine if the client is authenticated
     */
    isAuthenticated () {
      let authData = ref.getAuth();

      if (authData) {
        currentUserData = authData;
        return true;
      } else {
        return false;
      }
    },
    /*
      Authenticate the client via Firebase
     */
    authenticate (credentials) {
      return new Promise((resolve, reject) => {
        ref.authWithPassword({
          "email": credentials.email,
          "password": credentials.password
        }, (error, authData) => {
          if (error) {
            reject(error);
          } else {
            console.log("authWithPassword method completed successfully");
            resolve(authData);
          }
        });
      });
    },

      /*
      Unauthenticate the client via Firebase
     */
    unauthenticate () {
      return new Promise((resolve) => {
        ref.unauth();
        console.log("Unauthenticating user; Logout Successful");
        resolve();
      });
    },

     /*
      Register a new client via Firebase
     */
    register (credentials) {
      return new Promise((resolve, reject) => {
        ref.createUser({
          email    : credentials.email,
          password : credentials.password
        }, (error, authData) => {
          if (error) {
            console.log(`Error creating user: ${error}`);
            reject(error);
          } else {
            console.log(`Created user account with uid: ${authData.uid}`);
            resolve(authData);
          }
        });
      });
    },

     /*
      Store each Firebase user's id in the `users` collection
     */
    storeUser (authData) {
      let stringifiedUser = JSON.stringify({ uid: authData.uid });

      return new Promise((resolve, reject) => {
        $http
          .post(`${firebaseURL}/users.json`, stringifiedUser)
          .then(
            res => resolve(res),
            err => reject(err)
          );
      });
    }
  };
});