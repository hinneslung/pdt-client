(function() {
    var app = angular.module('pdtDeveloper', []);
    app.controller('DeveloperController', function($scope, $rootScope, apiService){
        $scope.self = $scope;
        $scope.navColumnItems = [];
        $scope.projectId = undefined;
        $scope.activities = [
	        {title:'Development', id:0},
	        {title:'Defect Removal', id:1},
	        {title:'Management', id:2}
        ];
	    $scope.activityIndex = undefined;

        $scope.createProject = function(){
            $location.path('projectmanager/createproject');
        };

        $scope.getProjects = function() {
            apiService.developer($rootScope.userId).success(function(data) {
                console.log(data);
	            $scope.navColumnItems = data.projects;
	            for (var i = 0; i < $scope.navColumnItems.length; i++)
		            $scope.navColumnItems[i].dropdownItems = $scope.activities;
	            console.log($scope.navColumnItems);
            });
        };

        $scope.selectNavColumnDropdownItem = function(item, dropdownItem) {
            for (var i = 0; i < $scope.navColumnItems.length; i++) {
                if (item.id === $scope.navColumnItems[i].id) {
                    $scope.projectId = $scope.navColumnItems[i].id;
	                $scope.activityIndex = dropdownItem.id;
                    break;
                }
            }
            console.log($scope.projectId + ' ' +  dropdownItem.id);
        };
        $scope.isActiveNavColumnItem = function(item) {
            return item.id == $scope.projectId;
        };

        $scope.getProjects();
    });
})();