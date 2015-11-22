(function() {
    var app = angular.module('pdtCommon', []);

    app.directive("navBar", function() {
        return {
            restrict: 'E',
            templateUrl: "templates/nav-bar.html",
            scope: {
                delegate: '='
            },
            controller: function($window, $rootScope, $scope, $location, apiService) {

	            $scope.logout = function() {
		            if ($scope.delegate && typeof($scope.delegate.navBarLogout) == "function")
			            $scope.delegate.navBarLogout();

		            localStorage.removeItem('userType');
		            localStorage.removeItem('userId');
		            $rootScope.userType = undefined;
		            $rootScope.userId = undefined;
		            $window.location = '/pdt';
	            };

                $scope.loggedin = function() {
                    return $rootScope.userType && $rootScope.userId;
                };
            }
        };
    });

	app.directive("navColumn", function() {
		return {
			restrict: 'E',
			templateUrl: "templates/nav-pills.html",
			scope: {
				delegate: '='
			},
			controller: function($window, $rootScope, $scope, $location, apiService) {
				$scope.selectItem = function(item) {
					$scope.delegate.selectNavColumnItem(item);
				};
				$scope.selectDropdownItem = function(item, dropdownItem) {
					$scope.delegate.selectNavColumnDropdownItem(item, dropdownItem);
				};
				$scope.isActive = function(item) {
					return $scope.delegate.isActiveNavColumnItem(item);
				};
			}
		};
	});

	app.service('modalService', function($uibModal) {
		var ms = {};

		ms.open = function(title, details, promptParams, callback) {
			var modalInstance = $uibModal.open({
				animation: true,
				templateUrl: '/pdt/templates/modal.html',
				controller: 'ModalInstanceController',
				resolve: {
					title: function () {return title;},
					details: function () {return details;},
					promptParams: function () {return promptParams;}
				}
			});
			modalInstance.result.then(function (params) {
				callback(params);
			}, undefined);
		};

		return ms;
	});

	app.controller('ModalInstanceController', function ($scope, $uibModalInstance, title, details, promptParams) {

		$scope.title = title;
		$scope.details = details;

		$scope.promptParams = {};
		for (var i = 0; i < promptParams.length; i++) {
			$scope.promptParams[promptParams[i].identifier] = {};
			$scope.promptParams[promptParams[i].identifier].value = "";
			$scope.promptParams[promptParams[i].identifier].title = promptParams[i].title;
		}

		$scope.ok = function () {
			var params = {};
			for (var key in $scope.promptParams)
				if ($scope.promptParams.hasOwnProperty(key))
					params[key] = $scope.promptParams[key].value;
			$uibModalInstance.close(params);
		};

		$scope.cancel = function () {
			$uibModalInstance.dismiss('cancel');
		};

		$(window).keyup(function (e) {
			if (e.keyCode == 13)
				$scope.ok();
		});
	});

})();