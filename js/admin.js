(function() {
	var app = angular.module('pdtAdmin', []);

	app.controller('AdminController', function($scope, $rootScope, $location, apiService){
		$scope.self = $scope;

		$scope.projectManagers = [];
		$scope.developers = [];

		$scope.getUsers = function() {
			apiService.projectManagers().success(function(data) {
				console.log(data);
				$scope.projectManagers = data;
			});
			apiService.developers().success(function(data) {
				$scope.developers = data;
			});
		};

        $scope.createUser = function() {
			$location.path("admin/createuser");
        };

		$scope.getUsers();
	});

    app.controller('CreateUserController', function($scope, $rootScope, $location, apiService){
        $scope.self = $scope;

        $scope.type = "projectmanager";
		$scope.username = "";
		$scope.displayName = "";
		$scope.email = "";
		$scope.password = "";

        $scope.create = function() {
            console.log($scope.type + $scope.username + $scope.displayName + $scope.email + $scope.password);
            apiService.createUser($scope.type, $scope.username, $scope.displayName, $scope.email, $scope.password)
                .success(function(data) {
                    console.log(data);
		            $location.path("admin");
                })
	            .error(function(data) {
		            console.log(data.error);
	            })
            ;
        };
    });
})();