  "use strict";

let UpsellTracker = angular.module("UpsellTracker", ["ngRoute", "firebase", "ngMaterial", "ngMessages", "ui.validate", "ngSanitize", "ngCsv" ])
  .constant('firebaseURL', "https://tcupselltracker.firebaseio.com")

// This directive allows us to pass a function in on an enter key to do what we want.
.directive('ngEnter', function () {
    return function (scope, element, attrs) {
        element.bind("keydown keypress", function (event) {
            if(event.which === 13) {
                scope.$apply(function (){
                  scope.$eval(attrs.ngEnter);
                });
 
                event.preventDefault();
            }
        });
    };
})
// copy pasted validator test directive
.directive('ensureExpression', ['$parse', function($parse) {
  return {
    require: 'ngModel',
    link: function(scope, ele, attrs, ngModelController) {
      scope.$watch(attrs.ngModel, function(value) {
        let expressionResults = $parse(attrs.ensureExpression)(scope);
        for (let expressionName in expressionResults) {
          ngModelController.$setValidity(expressionName, expressionResults[expressionName]);
        }
      });
    }
  };
}])
// autofocus directive for editing fields (not angular native)
.directive('focusOnShow', function($timeout) {
    return {
      restrict: 'A',
      link: function($scope, $element, $attr) {
        if ($attr.ngShow){
          $scope.$watch($attr.ngShow, function(newValue){
              if(newValue){
                  $timeout(function(){
                    $element[0].focus();
                  }, 0);
              }
          });      
        }
        if ($attr.ngHide){
            $scope.$watch($attr.ngHide, function(newValue){
                if(!newValue){
                    $timeout(function(){
                        $element[0].focus();
                    }, 0);
                }
            });      
        }
      }
    };
});

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
      when("/login", {
        templateUrl: "partials/login.html",
        controller: "LoginCtrl"
      }).
      otherwise({
        redirectTo: "/login"
      });
  }]);
