(function() {
    var app = angular.module('pdtDeveloper', []);
    app.controller('DeveloperController', function($scope, $rootScope, $window, $uibModal, apiService){
        $scope.self = $scope;
        $scope.navColumnItems = [];//list of projects, also for providing items to navColumn
        $scope.activity = undefined;//activity object
        $scope.project = {};//project copied from navColumnItems
        $scope.activityTypes = [
	        {title:'Development', id:0, code:'D'},
	        {title:'Defect Removal', id:1, code:'R'},
	        {title:'Management', id:2, code:'M'}
        ];
	    $scope.activityTypeIndex = undefined;

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

        $scope.switchTo = function(project, activityType) {
            console.log(project.id + ' ' +  activityType.id);

            if ($scope.activity) {
                apiService.endActivity($rootScope.userId).success(function(data) {
                    console.log(data);
                    apiService.startActivity($rootScope.userId, project.id, activityType.code).success(function(data) {
                        console.log(data);
                        $scope.project = project;
                        $scope.activityTypeIndex = activityType.id;
                        $scope.activity = data;
                    });
                });
            } else {
                apiService.startActivity($rootScope.userId, project.id, activityType.code).success(function(data) {
                    console.log(data);
                    $scope.project = project;
                    $scope.activityTypeIndex = activityType.id;
                    $scope.activity = data;
                });
            }
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
                    }
                }
            });
            modalInstance.result.then(function (selectedItem) {
                $scope.switchTo(project, activityType);
            }, undefined);
        };

        //run time
        $scope.getProjects();

        //timeAgo.settings.fullDateAfterSeconds = 0;
    });


    app.filter('timeAgo', function () {
        return function (input) {
            var fromTime = new Date(input);
            var nowTime = new Date();
            var diff = nowTime - fromTime;
            return diff + ' ' + nowTime + ' ' + fromTime;
        };
    });
})();