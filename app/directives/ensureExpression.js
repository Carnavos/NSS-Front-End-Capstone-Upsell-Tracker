'use strict';
// validation directive
UpsellTracker.directive('ensureExpression', ['$parse', function($parse) {
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
}]);