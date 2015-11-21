(function() {
    var app = angular.module('pdtCommon', []);

    app.directive("navBar", function() {
        return {
            restrict: 'E',
            templateUrl: "templates/nav-bar.html",
            scope: {
                delegate: '='
            },
            controller: function($window, $rootScope, $scope, $location, apiService) {

	            $scope.logout = function() {
		            localStorage.removeItem('userType');
		            localStorage.removeItem('userId');
		            $rootScope.userType = undefined;
		            $rootScope.userId = undefined;
		            $window.location = '/pdt';
	            };

                $scope.loggedin = function() {
                    return $rootScope.userType && $rootScope.userId;
                };
            }
        };
    });

	app.directive("navColumn", function() {
		return {
			restrict: 'E',
			templateUrl: "templates/nav-pills.html",
			scope: {
				delegate: '='
			},
			controller: function($window, $rootScope, $scope, $location, apiService) {
				$scope.selectItem = function(item) {
					$scope.delegate.selectNavColumnItem(item);
				};
				$scope.selectDropdownItem = function(item, dropdownItem) {
					$scope.delegate.selectNavColumnDropdownItem(item, dropdownItem);
				};
				$scope.isActive = function(item) {
					return $scope.delegate.isActiveNavColumnItem(item);
				};
			}
		};
	});

})();