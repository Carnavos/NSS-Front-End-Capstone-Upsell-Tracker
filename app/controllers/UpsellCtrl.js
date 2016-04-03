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
      // material modal setup
      $('.modal-trigger').leanModal({
        dismissible: false
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
          // date reformatting
          $scope.dateReformat(upsellsObject[key]);
          $scope.upsells.push(upsellsObject[key]);
        });
        $scope.$apply();
        console.log(`$scope.upsells: `, $scope.upsells);
      },
      // Handle reject() from the promise
      err => console.log(err)
    );

    $scope.dateReformat = function (dateObject) {
      dateObject.DateSent = new Date(dateObject.DateSent);
      dateObject.DateClosed = new Date(dateObject.DateClosed);
    };

    // attempt at non-modal new upsell add locally only
    $scope.addUpsellLocal = function () {
      let newUpsell = {
        "userID": $scope.$parent.currentUser.uid,
        "CSM": $scope.$parent.currentUser.userName,
        "AccountName": $scope.addAccountName,
        "AccountID": $scope.addAccountID,
        "PreviousContractID": $scope.addPreviousContractID, 
        "PreviousMRR": $scope.addPreviousMRR,
        "NewContractID": $scope.addNewContractID,
        "NewMRR": $scope.addNewMRR,
        "OrderID": $scope.addOrderID,
        "DateSent": $scope.addDateSent, // WILL NEED TO STRING METHOD
        "closed": false, // initialize as open, rep can close afterwards
        "DateClosed": $scope.addDateClosed, // WILL NEED TO STRING METHOD
        "Term": $scope.addTerm,
        "OneTimeFee": $scope.addOneTimeFee,
        "isNew": true
      };

      $scope.upsells.push(newUpsell);
      // code to focus new collapsible (add "active" class)
      // code to allow easy cancel/delete

    };

    $scope.testUpsell = {
      "userID": authFactory.getUserID(),
      "CSM": "Jeff Williams",
      "AccountName": "Globocom Inc",
      "AccountID": 111222,
      "PreviousContractID": 111112, 
      "PreviousMRR": 1500,
      "NewContractID": 111113,
      "NewMRR": 3000,
      "OrderID": 111113,
      "DateSent": "2016-01-13T06:00:00.000Z",
      "closed": false,
      "DateClosed": "2016-02-17T06:00:00.000Z",
      "Term": 12,
      "OneTimeFee": 0
    };

    $scope.addTestUpsell = function () {
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
        "DateSent": "2016-01-13T06:00:00.000Z",
        "closed": false,
        "DateClosed": "2016-02-17T06:00:00.000Z",
        "Term": 12,
        "OneTimeFee": 0
      };

      $http.post(`${firebaseURL}/upsells.json`, JSON.stringify(newUpsell))
      .then(
        (response) => {
          console.log(`Test Upsell Successfully Added!`, response.data.name);
          // tag id onto the locally stored upsell, then push into $scope.upsells, triggering DOM append
          newUpsell.id = response.data.name;
          $scope.dateReformat(newUpsell);
          $scope.upsells.push(newUpsell);
          Materialize.toast("Upsell Added Successfully", 3000, 'green');
        },
        (error) => console.log(`error: `, error)
      );
    };

    $scope.addAccountName = "";
    $scope.addAccountID = "";
    $scope.addPreviousContractID = "";
    $scope.addPreviousMRR = "";
    $scope.addNewContractID = "";
    $scope.addNewMRR = "";
    $scope.addOrderID = "";
    $scope.addDateSent = "";
    $scope.addDateClosed = "";
    $scope.addTerm = "";
    $scope.addOneTimeFee = "";

    $scope.addUpsell = function (upsellObject) {
      let newUpsell = {
        "userID": $scope.$parent.currentUser.uid,
        "CSM": $scope.$parent.currentUser.userName,
        "AccountName": $scope.addAccountName,
        "AccountID": $scope.addAccountID,
        "PreviousContractID": $scope.addPreviousContractID, 
        "PreviousMRR": $scope.addPreviousMRR,
        "NewContractID": $scope.addNewContractID,
        "NewMRR": $scope.addNewMRR,
        "OrderID": $scope.addOrderID,
        "DateSent": $scope.addDateSent, // WILL NEED TO STRING METHOD
        "closed": false, // initialize as open, rep can close afterwards
        "DateClosed": $scope.addDateClosed, // WILL NEED TO STRING METHOD
        "Term": $scope.addTerm,
        "OneTimeFee": $scope.addOneTimeFee
    	};
      // console.log(`JSON.stringify(upsellObject): `, JSON.stringify(upsellObject));
      // using Angular specific JSON string method to remove $$hashkey (triggering 400 error)
      $http.post(`${firebaseURL}/upsells.json`, angular.toJson(upsellObject))
      .then(
        (response) => {
          console.log(`Test Upsell Successfully Added!`, response.data.name);
          // tag id onto the local upsell
          upsellObject.id = response.data.name;
          // $scope.dateReformat(newUpsell);
          // $scope.upsells.push(newUpsell);
        },
        (error) => console.log(`error: `, error)
      );

    };

    $scope.cancelNewUpsell = function() {
      $('#upsellModal').closeModal();
      clearNew();
      console.log(`cancelled/cleared new upsell`);
    };

    // clear out new values on modal if cancelled
    function clearNew () {
      $scope.addAccountName = "";
      $scope.addAccountID = "";
      $scope.addPreviousContractID = "";
      $scope.addPreviousMRR = "";
      $scope.addNewContractID = "";
      $scope.addNewMRR = "";
      $scope.addOrderID = "";
      $scope.addDateSent = "";
      $scope.addDateClosed = "";
      $scope.addTerm = "";
      $scope.addOneTimeFee = "";
    };

    // delete upsell from database, then remove from page using $index in the ng-repeat directive
  	$scope.deleteUpsell = function (upsellID) {
      $http.delete(`${firebaseURL}/upsells/${upsellID}.json`)
      .then(
        () => {
          console.log(`Upsell Deleted Successfully`);
          // must now find index of deleted object in upsells array; $index undependable
          let deletedUpsell = $scope.upsells.filter(element => element.id === upsellID)[0];
          let deletedUpsellIndex = $scope.upsells.indexOf(deletedUpsell);
          $scope.upsells.splice(deletedUpsellIndex, 1);
          console.log(`$scope.upsells after delete: `, $scope.upsells);
          // $scope.simpleToast("Upsell Deleted Successfully");
          Materialize.toast("Upsell Deleted Successfully", 3000, 'red');

        },
        rej => console.log(`Delete Error`, rej)
      );
    };

    $scope.cancelAdd = function ($index) {
      console.log(`cancel run`);
      $scope.upsells.splice($index, 1);
      console.log(`$scope.upsells after cancel: `, $scope.upsells);
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