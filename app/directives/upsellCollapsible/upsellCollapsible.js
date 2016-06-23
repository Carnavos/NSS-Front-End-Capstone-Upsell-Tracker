'use strict';
// collapsible directive, shares scope with upsellCtrl
UpsellTracker.directive('upsellCollapsible', function() {
	return {
    templateUrl:'app/directives/upsellCollapsible/upsellCollapsible.html',
    restrict: 'E',
    replace: true,
	}
});