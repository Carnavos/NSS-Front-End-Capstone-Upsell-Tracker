"use strict";

UpsellTracker.controller("LoginCtrl",
[
  "$scope",
  "$location",
  // used to have "$http" here
  "authFactory",

  function ($scope, $location, authFactory)  {

    // Variables on $scope for use in DOM
    $scope.account = { email: "", password: "" };
    $scope.message = "";

    /*
      Attempt to register a new user account.
      If successful, immediately log user in.
     */
    $scope.register = () => {
      authFactory.register($scope.account)
        .then(
          () => {
            console.log(`Registration Success`);
            $scope.login();
          },
          error => console.log(error)
        );
    };

    /*
      Attempt to authenticate the user with the
      supplied credentials.
     */
    $scope.login = () =>
      authFactory
        .authenticate($scope.account)
        .then(() => {
          console.log("LoginCtrl > login() method resolve handler");
          $location.path("/");
          $scope.$apply();  // Needed for $location.path() to succeed
        });
  }
]);
