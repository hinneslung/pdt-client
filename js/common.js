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
		            //localStorage.removeItem('jwt');
		            //$rootScope.clientType = undefined;
		            //$rootScope.clientUsername = undefined;
		            //$rootScope.clientId = undefined;
		            $window.location = '/';
	            };

                $scope.loggedin = function() {
                    return $scope.clientType !== undefined && $scope.clientType !== null;
                };
            }
        };
    });

})();