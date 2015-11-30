(function() {
    var app = angular.module('pdtDeveloper', []);
    app.controller('DeveloperController', function($scope, $rootScope, $window, $uibModal,
                                                   apiService, projectService, defectService){
        $scope.self = $scope;
        $scope.defectService = defectService;

        $scope.navColumnItems = [];//list of projects, also for providing items to navColumn
        $scope.activity = undefined;//activity object
        $scope.project = {};//project copied from navColumnItems
        $scope.defects = [];
        $scope.activityTypes = [
	        {title:'Development', id:0, code:'D'},
	        {title:'Defect Removal', id:1, code:'R'},
	        {title:'Management', id:2, code:'M'}
        ];
	    $scope.activityTypeIndex = undefined;

        //for editing defect
        $scope.isEditingDefect = false;
        $scope.defectBeingEdited = undefined;

        $scope.timer = {hour:0, minute:0, second:0};

        $scope.createProject = function(){
            $location.path('projectmanager/createproject');
        };

        $scope.getProjects = function() {
            apiService.developer($rootScope.userId).success(function(data) {
                console.log(data);
	            $scope.navColumnItems = projectService.processProjects(data.projects);
	            for (var i = 0; i < $scope.navColumnItems.length; i++) {
		            if ($scope.navColumnItems[i].is_active)
			            $scope.navColumnItems[i].dropdownItems = $scope.activityTypes;
		            else
		                $scope.navColumnItems[i].title += " (Ended)";
	            }


            });
        };

        $scope.getProject = function(id) {
            apiService.project(id).success(function(data) {
                console.log(data);
                data = projectService.processProject(data);
                $scope.project = data;
            });
        };

        $scope.getDefects = function(projectId) {
            apiService.defects('developer', $rootScope.userId, projectId).success(function(data) {
                console.log(data);
                $scope.defects = data;
            });
        };

        $scope.switchTo = function(project, activityType) {
            console.log(project.id + ' ' +  activityType.id);

            $scope.isEditingDefect = false;

            $scope.getProject(project.id);
            if (activityType.code == 'M')
                $scope.getDefects(project.id);

            if ($scope.activity) {
                apiService.endActivity($rootScope.userId).success(function(data) {
	                $scope.startActivity(project, activityType);
                }).error(function(data) {
	                $scope.startActivity(project, activityType);
                });
            } else {
                $scope.startActivity(project, activityType);
            }
        };

	    $scope.startActivity = function(project, activityType) {
		    apiService.startActivity($rootScope.userId, project.id, activityType.code).success(function(data) {
			    $scope.activityTypeIndex = activityType.id;
			    $scope.activity = data;
                $scope.activity.localStartTime = new Date();
			    console.log(data);
		    });
	    };

        $scope.updateTimer = function() {
            if (!$scope.activity)return;
            var now = new Date();
            var timeDiff = Math.abs(now.getTime() - $scope.activity.localStartTime.getTime());
            var diffHours = Math.floor(timeDiff / (1000 * 3600));
            var diffMinutes = Math.floor(timeDiff / (1000 * 60)) - diffHours * 60;
            var diffSeconds = Math.floor(timeDiff / (1000)) - diffHours * 3600 - diffMinutes * 60;
            $scope.timer.hour = diffHours;
            $scope.timer.minute = diffMinutes;
            $scope.timer.second = diffSeconds;
            $scope.$apply();
        };

        //defect form delegate
        $scope.defectTableEditDefect = function(defect) {
            console.log(defect.id);
            $scope.defectBeingEdited = defect;
            $scope.isEditingDefect = true;
        };
        $scope.defectFormFinishEditing = function() {
            $scope.defectBeingEdited = undefined;
            $scope.isEditingDefect = false;
            $scope.getDefects($scope.project.id);
        };

        //nav bar delegate
        $scope.navBarLogout = function() {
            $scope.stopActivity();
        };

        //nav column delegate
        $scope.selectNavColumnDropdownItem = function(item, dropdownItem) {
            $scope.promptSwitch(item, dropdownItem);
        };
        $scope.isActiveNavColumnItem = function(item) {
            return item.id == $scope.project.id;
        };

        $scope.stopActivity = function() {
            apiService.endActivity($rootScope.userId).success(function(data) {
                console.log(data);
                $scope.project = {};
                $scope.activityTypeIndex = undefined;
                $scope.activity = undefined;
            });
        };

        //modal delegate
        $scope.promptSwitch = function (project, activityType) {
            var modalInstance = $uibModal.open({
                animation: true,
                templateUrl: '/pdt/templates/modal.html',
                controller: 'ModalInstanceController',
                resolve: {
                    title: function () {return "Confirm";},
                    details: function () {
                        return "Do you want to switch to " + project.title + " " + activityType.title + "?";
                    },
                    promptParams: function () {return [];}
                }
            });
            modalInstance.result.then(function (selectedItem) {
                $scope.switchTo(project, activityType);
            }, undefined);
        };

        //run time
        $scope.getProjects();
        setInterval($scope.updateTimer, 250);
    });
})();