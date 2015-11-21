(function() {
    var app = angular.module('pdtProjectManager', []);

    app.controller('ProjectManagerController', function($scope, $rootScope, $location, apiService){
        $scope.self = $scope;
	    $scope.navColumnItems = [];
	    $scope.projectId = undefined;

        $scope.createProject = function(){
            $location.path('projectmanager/createproject');
        };

	    $scope.getProjects = function() {
		    apiService.projectManager($rootScope.userId).success(function(data) {
			    console.log(data);
				$scope.navColumnItems = data.projects;
			    $scope.projectId = data.projects[0].id;
		    });
	    };

	    $scope.selectNavColumnItem = function(item) {
		    for (var i = 0; i < $scope.navColumnItems.length; i++) {
			    if (item.id === $scope.navColumnItems[i].id) {
				    $scope.projectId = $scope.navColumnItems[i].id;
				    break;
			    }
		    }
		    console.log(item.id);
	    };
	    $scope.isActiveNavColumnItem = function(item) {
			return item.id == $scope.projectId;
	    };

	    $scope.getProjects();
    });

	app.controller('CreateProjectController', function($scope, $rootScope, $location, apiService){
		$scope.self = $scope;

		$scope.title = "";
		$scope.description = "";
		$scope.developers = [];
		$scope.selectedDevelopers = [];

		$scope.phases = ['inception', 'elaboration', 'construction', 'transition'];
		$scope.iterationNumbers = [];

		$scope.getDevelopers = function() {
			apiService.developers().success(function(data) {
				$scope.developers = data;
			});
		};

		$scope.create = function() {
			console.log($rootScope.userId, $scope.title + $scope.description + $scope.selectedDevelopers + $scope.iterationNumbers);
			apiService.createProject($rootScope.userId, $scope.title, $scope.description, $scope.selectedDevelopers, $scope.iterationNumbers)
				.success(function(data) {
					console.log(data);
					$location.path("projectmanager");
				})
				.error(function(data) {
					console.log(data.error);
				})
			;
		};

		$scope.getDevelopers();
	});
})();