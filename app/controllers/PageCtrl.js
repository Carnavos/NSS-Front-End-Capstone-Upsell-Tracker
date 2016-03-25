"use strict";

UpsellTracker.controller("PageCtrl", 
	[
	"$scope",
	"authFactory",

	function ($scope, authFactory) {

    $scope.currentUser = {};

    /*
      Just a pass-through method to the AuthFactory method of the
      same name.
     */
    $scope.isAuthenticated = () => authFactory.isAuthenticated();

    /*
      Unauthenticate the client.
     */
    $scope.logout = () => {
      authFactory.unauthenticate();
      // empty current user upon logout
      $scope.currentUser = {};
    };

    // init pageCtrl command to pull user if authentication has persisted through reload (pullUser otherwise only running on login)
      if (authFactory.isAuthenticated()) {
        console.log(`PageCtrl Test Run`);
        authFactory.pullUser(authFactory.getUserID())
        .then(
          userData => {
            console.log(`userData`, userData);
            $scope.currentUser = userData;
          },
          error => console.log("Page Ctrl Pull User Error: ", error)
        );
      } else {
        console.log(`ya boy ain't authenticated yet bruh`);
      }

	}
]);