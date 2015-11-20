(function() {
    var app = angular.module('pdtHome', []);

    app.controller('HomeController', function($scope, $rootScope, apiService){
        $scope.self = $scope;

    });

    app.controller('LoginController', function($scope, $rootScope, $location, apiService){
        $scope.self = $scope;

	    $scope.username = "";
	    $scope.password = "";

        $scope.login = function() {
	        console.log($scope.username + " " + $scope.password);
	        apiService.login($scope.username, $scope.password).success(function(data) {
				if ($scope.username == 'admin')
					$location.path("admin");
                else if ($scope.username == 'manager')
                    $location.path("projectmanager");
                else if ($scope.username == 'developer')
                    $location.path("developer");
	        });
        };
    });
})();