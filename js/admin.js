(function() {
	var app = angular.module('pdtAdmin', []);

	app.controller('AdminController', function($scope, $rootScope, apiService){
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

        };

		$scope.getUsers();
	});

    app.controller('CreateUserController', function($scope, $rootScope, apiService){
        $scope.self = $scope;


    });
})();