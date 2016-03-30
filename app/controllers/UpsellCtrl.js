"use strict";

UpsellTracker.controller("UpsellCtrl", 
	[
	"$scope",
	"upsellsFactory",
	"authFactory",
	"$http",
	"firebaseURL",

	function ($scope, upsellsFactory, authFactory, $http, firebaseURL) {
    // angular's version of jQuery $(document).ready()
    angular.element(document).ready(function () {
      $('.collapsible').collapsible({
        accordion : false // A setting that changes the collapsible behavior to expandable instead of the default accordion style
      });
    });

    // scope upsell variable which holds all upsells passed from UpsellsFactory
    // use ng-show/hide or ng-if to display current user's data on partial
    $scope.upsells = [];

    upsellsFactory().then(
      // Handle resolve() from the promise
      upsellsObject => {
        Object.keys(upsellsObject).forEach(key => {
          upsellsObject[key].id = key;
          $scope.upsells.push(upsellsObject[key]);
        });
        $scope.$apply();
        console.log(`$scope.upsells: `, $scope.upsells);
      },
      // Handle reject() from the promise
      err => console.log(err)
    );

    $scope.addUpsell = function () {
      let userID = authFactory.getUserID();
    	let newUpsell = {
    		"userID": userID,
  		  "CSM": "Greg Williams",
	      "AccountName": "Globocom Inc",
	      "AccountID": 111222,
	      "PreviousContractID": 111112, 
	      "PreviousMRR": 1500,
	      "NewContractID": 111113,
	      "NewMRR": 3000,
	      "OrderID": 111113,
        "DateSent": "2016-01-13",
	      "Closed": true,
	      "DateClosed": "2016-02-17",
	      "Term": 12,
	      "OneTimeFee": 0
    	};

    	$http.post(`${firebaseURL}/upsells.json`,
  			JSON.stringify(newUpsell)
  		).then(
  			() => console.log(`Test Upsell Successfully Added!`),
  			(error) => console.log(`error: `, error)
  		);
    };

    // delete upsell from database, then remove from page using $index in the ng-repeat directive
  	$scope.deleteUpsell = function (upsellID, $index) {
      $http.delete(`${firebaseURL}/upsells/${upsellID}.json`)
      .then(
        () => {
          console.log(`Upsell Deleted Successfully`);
          $scope.upsells.splice($index, 1);
          console.log(`$scope.upsells post delete: `, $scope.upsells);
        },
        rej => console.log(`Delete Error`, rej)
      );
    };

    // return boolean for rep/admin view permissions on an upsell
    $scope.viewAllowed = function (upsell)  {
      return $scope.$parent.currentUser.uid === upsell.userID || $scope.$parent.currentUser.admin;
    };

    // accepts local upsell ID and uses a PUT request to update the upsell object in Firebase
    $scope.editUpsell = function (upsellID) {
      let editedUpsell = $scope.upsells.filter(element => element.id === upsellID)[0];
			console.log(`editedUpsell: `, editedUpsell);
      $http.put(`${firebaseURL}/upsells/${upsellID}.json`, editedUpsell)
      .then(
        () => {
          console.log(`Upsell Updated Successfully`);
          // disable temporary save button
          editedUpsell.edited = false;
  			},
  			rej => console.log(`Update/PUT Error`, rej)
			);
    };
	}
]);