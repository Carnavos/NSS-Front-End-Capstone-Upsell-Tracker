"use strict";

let UpsellTracker = angular.module("UpsellTracker", ["ngRoute", "firebase"])
  .constant('firebaseURL', "https://tcupselltracker.firebaseio.com");

/*
  Define a promise for any view that needs an authenticated user
  before it will resolve. Look at the route definitions below and
  you will see this method's name in the resolve property.
 */
let isAuth = (authFactory) => new Promise((resolve, reject) => {
  if (authFactory.isAuthenticated()) {
    console.log("User is authenticated, resolve route promise");
    resolve();
  } else {
    console.log("User is not authenticated, reject route promise");
    reject();
  }
});

// Angular Routing through ng-Route
UpsellTracker.config(["$routeProvider",
  function ($routeProvider) {
    $routeProvider.
      when("/", {
        templateUrl: "partials/upsellList.html",
        controller: "UpsellCtrl",
        resolve: { isAuth }
      }).
      // when("/songs/list", {
      //   templateUrl: "partials/song-list.html",
      //   controller: "SongCtrl",
      //   resolve: { isAuth }
      // }).
      when("/login", {
        templateUrl: "partials/login.html",
        controller: "LoginCtrl"
      }).
      // when("/songs/new", {
      //   templateUrl: "partials/song-form.html",
      //   controller: "SongFormCtrl",
      //   resolve: { isAuth }
      // }).
      // when("/songs/:songId", {
      //   templateUrl: "partials/song-brief.html",
      //   controller: "SongDetailCtrl",
      //   resolve: { isAuth }
      // }).
      otherwise({
        redirectTo: "/"
      });
  }]);