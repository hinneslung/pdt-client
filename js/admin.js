(function() {
	var app = angular.module('pdtAdmin', []);

	app.controller('AdminController', function($scope, $rootScope, apiService){
		$scope.self = $scope;

		$scope.projectManagers = [];
		$scope.developers = [];

		$scope.getUsers = function() {
			apiService.projectManagers().success(function(data) {
				$scope.projectManagers = data.data;
			});
			apiService.developers().success(function(data) {
				$scope.developers = data.data;
			});
		};

		$scope.projectManagers();
		$scope.developers();
	});
})();