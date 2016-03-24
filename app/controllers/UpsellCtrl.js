"use strict";

UpsellTracker.controller("UpsellCtrl", 
	[
	"$scope",
	"upsellsFactory",
	"authFactory",
	"$http",
	"firebaseURL",

	function ($scope, upsellsFactory, authFactory, $http, firebaseURL) {

    $scope.jeff = "jeffrey!";

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
      },
      // Handle reject() from the promise
      err => console.log(err)
    );

    $scope.addUpsell = () => {
    	console.log(`authFactory.getUserID: `, authFactory.getUserID());
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
	      "DateClosed": "2016-02-17",
	      "Term": 12,
	      "OneTimeFee": 0
    	};

    	$http.post(`${firebaseURL}/upsells.json`,
  			JSON.stringify(newUpsell)
  		).then(
  			() => console.log(`song successfully added!`),
  			(error) => console.log(`error: `, error)
  		);
    };


	}
]);