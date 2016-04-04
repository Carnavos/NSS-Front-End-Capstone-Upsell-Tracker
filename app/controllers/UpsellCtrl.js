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
      $('.dropdown-button').dropdown({
        inDuration: 300,
        outDuration: 225,
        constrain_width: false, // Does not change width of dropdown to that of the activator
        hover: false, // Activate on hover
        gutter: 0, // Spacing from edge
        belowOrigin: false, // Displays dropdown below the button
        alignment: 'left' // Displays dropdown with edge aligned to the left of button
      });
      $('ul.tabs').tabs();
    });

    $scope.expandNew = function () {
      console.log(`expand test run`);
      // expands new upsell via jQuery event trigger
      $(".newUpsellStyle").trigger("click.collapse");
    };
    
    // defaults to account name sort
    $scope.filterOption = 'AccountName';

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

    // CSV Export functions
    $scope.getUpsells = function () {
      console.log(`getUpsells run`);
      return $scope.upsells;
    }

    $scope.getHeaders = function () {
      return Object.keys($scope.upsells[0]);
    }

    // date reformatting into Date instances
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
        "DateSent": $scope.addDateSent,
        "closed": false, // initialize as open, user can close afterwards
        "DateClosed": $scope.addDateClosed,
        "Term": $scope.addTerm,
        "OneTimeFee": $scope.addOneTimeFee,
        "isNew": true
      };

      $scope.upsells.push(newUpsell);
      // expands all collapsibles with newUpsellStyle class (should be one at all times)
      setTimeout(function(){ $scope.expandNew(); }, 0);
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
        "OrderID": 1231234,
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

      // number reformat
      $scope.upsellNumberFormat(upsellObject);

      upsellObject.edited = false;
      upsellObject.isNew = false;
      // console.log(`JSON.stringify(upsellObject): `, JSON.stringify(upsellObject));
      // using Angular specific JSON string method to remove $$hashkey (triggering 400 error)
      $http.post(`${firebaseURL}/upsells.json`, angular.toJson(upsellObject))
      .then(
        (response) => {
          console.log(`New Upsell Successfully Added!`, response.data.name);
          // tag id onto the local upsell
          upsellObject.id = response.data.name;
          // $scope.dateReformat(newUpsell);
          // $scope.upsells.push(newUpsell);
          Materialize.toast("New Upsell Added Successfully", 3000, 'green');
        },
        (error) => console.log(`error: `, error)
      );

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

    $scope.cancelAdd = function (hashKey) {
      console.log(`cancel run`);
      let deletedUpsell = $scope.upsells.filter(element => element.$$hashKey === hashKey)[0];
      let deletedUpsellIndex = $scope.upsells.indexOf(deletedUpsell);
      $scope.upsells.splice(deletedUpsellIndex, 1);
      console.log(`$scope.upsells after delete: `, $scope.upsells);
      // $scope.simpleToast("Upsell Deleted Successfully");
      Materialize.toast("New Upsell Cancelled", 3000, 'deep-orange');
      console.log(`$scope.upsells after cancel: `, $scope.upsells);
    };

    // formats all numbers correctly (with text input type they default as strings)
    $scope.upsellNumberFormat = function(upsellObject) {
      upsellObject.AccountID = parseInt(upsellObject.AccountID);
      upsellObject.PreviousContractID = parseInt(upsellObject.PreviousContractID);
      upsellObject.PreviousMRR = parseFloat(upsellObject.PreviousMRR);
      upsellObject.NewContractID = parseInt(upsellObject.NewContractID);
      upsellObject.NewMRR = parseFloat(upsellObject.NewMRR);
      upsellObject.OrderID = parseInt(upsellObject.OrderID);
      upsellObject.OneTimeFee = parseFloat(upsellObject.OneTimeFee);
    };

    // return boolean for rep/admin view permissions on an upsell
    $scope.viewAllowed = function (upsell)  {
      return $scope.$parent.currentUser.uid === upsell.userID || $scope.$parent.currentUser.admin;
    };

    // accepts local upsell ID and uses a PUT request to update the upsell object in Firebase
    $scope.editUpsell = function (upsellID) {
      let editedUpsell = $scope.upsells.filter(element => element.id === upsellID)[0];
      console.log(`editedUpsell: `, editedUpsell);
      // disable temporary save button
      editedUpsell.edited = false;

      // number reformat
      $scope.upsellNumberFormat(editedUpsell);
      
      $http.put(`${firebaseURL}/upsells/${upsellID}.json`, editedUpsell)
      .then(
        () => {
          console.log(`Upsell Updated Successfully`);
          Materialize.toast("Upsell Updated Successfully", 3000, 'orange');
  			},
  			rej => console.log(`Update/PUT Error`, rej)
			);
    };

	}
]);