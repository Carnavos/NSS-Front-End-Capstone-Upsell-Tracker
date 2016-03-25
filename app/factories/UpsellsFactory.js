"use strict";

UpsellTracker.factory("upsellsFactory", ($http, firebaseURL) =>
  () =>
    new Promise((resolve, reject) => {
      console.log(`upsellsFactory run`);
      $http
        .get(`${firebaseURL}/upsells/.json`)
        .then(
        	// delivers all Firebase upsells
          upsellsObject => resolve(upsellsObject.data),
          error => reject(error)
        );
    })
);
