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

        $scope.createProject = function(){
            $location.path('projectmanager/createproject');
        };

        $scope.getProjects = function() {
            apiService.developer($rootScope.userId).success(function(data) {
                console.log(data);
	            $scope.navColumnItems = data.projects;
	            for (var i = 0; i < $scope.navColumnItems.length; i++)
		            $scope.navColumnItems[i].dropdownItems = $scope.activityTypes;
	            console.log($scope.navColumnItems);
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

            $scope.getProject(project.id);
            if (activityType.code == 'M')
                $scope.getDefects(project.id);

            if ($scope.activity) {
                apiService.endActivity($rootScope.userId).success(function(data) {
                    console.log(data);
                    apiService.startActivity($rootScope.userId, project.id, activityType.code).success(function(data) {
                        console.log(data);
                        $scope.activityTypeIndex = activityType.id;
                        $scope.activity = data;
                    });
                });
            } else {
                apiService.startActivity($rootScope.userId, project.id, activityType.code).success(function(data) {
                    $scope.activityTypeIndex = activityType.id;
                    //data.start_dateTime_js = Date.parse(data.start_dateTime);
                    $scope.activity = data;
                    console.log(data);
                });
            }
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
    });
})();