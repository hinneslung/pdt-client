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
                    return $scope.clientType !== undefined && $scope.clientType !== null;
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
				$scope.selectItem = function(id) {
					$scope.delegate.selectItem(id);
				};
			}
		};
	});

})();