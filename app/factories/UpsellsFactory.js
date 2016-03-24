"use strict";

UpsellTracker.factory("upsellsFactory", ($http, firebaseURL, authFactory) =>
  () =>
    new Promise((resolve, reject) => {

      $http
        .get(`${firebaseURL}/upsells/.json`)
        .then(
        	// delivers all Firebase upsells
          upsellsObject => resolve(upsellsObject.data),
          error => reject(error)
        );
    })
);
