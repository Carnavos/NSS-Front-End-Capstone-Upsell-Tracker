"use strict";

UpsellTracker.controller("LoginCtrl",
[
  "$scope",
  "$location",
  // used to have "$http" here
  "authFactory",

  function ($scope, $location, authFactory)  {

    // Variables on $scope for use in DOM
    $scope.account = { email: "", password: "", userName: "" };
    $scope.message = "";

    /*
      Attempt to register a new user account.
      If successful, attempts to store user in Firebase (with additional account details), then logs user in.
     */
    $scope.register = () => {
      authFactory.register($scope.account)
        .then(
          // register resolve
          (authData) => {
            console.log(`Registration Success`);
            // chain into storeUser promise
            return authFactory.storeUser(authData, $scope.account);
            // $scope.login(); original placement
          },
          error => console.log(`register error: `, error)
        ).then(
          // storeUser resolve
          () => {
            console.log(`User Stored Successfully!`);
            // login (does not depend on storeUser)
            $scope.login();
          },
          // storeUser error
          error => console.log(`Store User error: `, error)
        );
    };

    $scope.login = () =>
      authFactory
        .authenticate($scope.account)
        .then(
          // authenticate resolve
          (authData) => {
            console.log("LoginCtrl > login() method resolve handler");
            // possible link to PageCtrl account info which changes every login
            return authFactory.pullUser(authData.uid);
          },
          // authenticate reject
          error => console.log(`authenticate error: `, error)
        ).then(
          // pullUser resolve
          returnedUserObject => {
            console.log(`Current User Pulled/Defined: `, returnedUserObject);
            // change path
            $location.path("/");
            $scope.$apply();  // Needed for $location.path() to succeed
          },
          // pullUser reject
          error => console.log(`error: `, error)
        );

  }
]);
