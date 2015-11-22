(function() {
    var app = angular.module('pdtProjectManager', []);

    app.controller('ProjectManagerController', function($scope, $rootScope, $location,
                                                        apiService, modalService, productService){
        $scope.self = $scope;
	    $scope.projectService = productService;
	    $scope.navColumnItems = [];
	    $scope.project = {};

        $scope.createProject = function(){
            $location.path('projectmanager/createproject');
        };

	    $scope.getProjects = function() {
		    apiService.projectManager($rootScope.userId).success(function(data) {
			    console.log(data);
				$scope.navColumnItems = data.projects;
				if (data.projects.length > 0)
					$scope.getProject(data.projects[0].id);
		    });
	    };

		$scope.getProject = function(id) {
			apiService.project(id).success(function(data) {
				console.log(data);
				data = productService.processProject(data);
				$scope.project = data;
			});
		};

	    //close iteration
	    $scope.closeIterationPressed = function() {
		    modalService.open(
				    "Close Iteration",
				    "Please enter the number of source lines of codes",
				    [{identifier: 'sloc', title: 'SLOC'}],
				    $scope.closeIteration
		    );
	    };

	    $scope.closeIteration = function(params) {
		    console.log($scope.project.id + ' ' + params.sloc);
		    apiService.closeIteration($scope.project.id, params.sloc).success(function(data) {
			    console.log(data);
		    });
	    };


	    //nav column delegate
	    $scope.selectNavColumnItem = function(item) {
		    for (var i = 0; i < $scope.navColumnItems.length; i++) {
			    if (item.id === $scope.navColumnItems[i].id) {
					$scope.getProject($scope.navColumnItems[i].id);
				    break;
			    }
		    }
		    console.log(item.id);
	    };
	    $scope.isActiveNavColumnItem = function(item) {
			return item.id == $scope.project.id;
	    };

	    //run time
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