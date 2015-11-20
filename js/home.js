(function() {
    var app = angular.module('pdtHome', []);

    app.controller('HomeController', function($scope, $rootScope, $location, apiService){
        $scope.self = $scope;

	    var path = 'login';
	    if ($rootScope.userType && $rootScope.userId) {
			if ($rootScope.userType === 'projectmanager')
				path = 'projectmanager';
		    else if ($rootScope.userType === 'developer')
				path = 'developer';
			else if ($rootScope.userType === 'admin')
				path = 'admin';
	    }
	    $location.path(path);
    });

    app.controller('LoginController', function($scope, $rootScope, $location, apiService){
        $scope.self = $scope;

	    $scope.username = "";
	    $scope.password = "";

        $scope.login = function() {
	        console.log($scope.username + " " + $scope.password);
	        if ($scope.username === 'admin') {
		        localStorage.setItem('userType', 'admin');
		        localStorage.setItem('userId', 0);
		        $rootScope.userType = 'admin';
		        $rootScope.userId = 0;
		        $location.path("admin");
		        return;
	        }
	        apiService.login($scope.username, $scope.password).success(function(data) {
		        console.log(data);

		        var type = data.user_type === "Developer" ? 'developer' : 'projectmanager';
		        var id = data.id;

		        localStorage.setItem('userType', type);
		        localStorage.setItem('userId', id);

		        $rootScope.userType = type;
		        $rootScope.userId = id;

		        $location.path(type);
	        }).error(function(data) {
		        alert(data.error);
	        });
        };
    });
})();