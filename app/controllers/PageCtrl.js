"use strict";

UpsellTracker.controller("PageCtrl", 
	[
	"$scope",
	"authFactory",

	function ($scope, authFactory) {
    /*
      Just a pass-through method to the AuthFactory method of the
      same name.
     */
    $scope.isAuthenticated = () => authFactory.isAuthenticated();

    /*
      Unauthenticate the client.
     */
    $scope.logout = () => authFactory.unauthenticate();

	}
]);