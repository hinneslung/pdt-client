(function() {
    var app = angular.module('pdtDeveloper', []);
    app.controller('DeveloperController', function($scope, $rootScope, $uibModal, apiService){
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

        //nav column delegate
        $scope.selectNavColumnDropdownItem = function(item, dropdownItem) {
            $scope.promptSwitch(item, dropdownItem);
        };
        $scope.isActiveNavColumnItem = function(item) {
            return item.id == $scope.project.id;
        };

        $scope.switchTo = function(project, activityType) {
            console.log(project.id + ' ' +  activityType.id);

            if ($scope.activity) {
                apiService.endActivity($scope.activity.id).success(function(data) {
                    console.log(data);
                });
            }

            apiService.startActivity($rootScope.userId, project.id, activityType.code).success(function(data) {
                console.log(data);
                $scope.activity = data;
            });

            $scope.project = project;
            $scope.activityTypeIndex = activityType.id;
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
    });
})();