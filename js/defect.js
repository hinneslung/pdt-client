(function() {
    var app = angular.module('pdtDefect', []);

    app.directive("defectTable", function() {
        return {
            restrict: 'E',
            templateUrl: "templates/defect-table.html",
            scope: {
                defects: '=',
                delegate: '='
            },
            controller: function($window, $rootScope, $scope, $location, apiService, projectService, defectService) {
                $scope.projectService = projectService;
                $scope.defectService = defectService;

                $scope.isMine = function(defect) {
                    return defect.developer.id == $rootScope.userId;
                };
            }
        };
    });

    app.directive("defectForm", function() {
        return {
            restrict: 'E',
            templateUrl: "templates/defect-form.html",
            scope: {
                project: '=',
                defect: '=',
                delegate: '='
            },
            controller: function($window, $rootScope, $scope, $location, apiService, projectService) {
                if ($scope.defect) {
                    $scope.typeCode = $scope.defect.defect_type;
                    $scope.description = $scope.defect.description;
                    $scope.iterationActivityTypeCode = $scope.defect.iteration_activity_type;
                    $scope.isShared = $scope.defect.is_shared;

                    $scope.phaseIndex = projectService.phaseIndexFromCode($scope.defect.injected_in_iteration.phase.phase_type);
                    $scope.iterationId = $scope.defect.injected_in_iteration.id + 0;
                    console.log('iteration id ' + $scope.iterationId);

                    $scope.removedIterationId = $scope.defect.removed_in_iteration.id;
                } else {
                    //form
                    $scope.typeCode = "";
                    $scope.description = "";
                    $scope.iterationId = "";
                    $scope.iterationActivityTypeCode = "";
                    $scope.isShared = false;

                    $scope.phaseIndex = "";
                }



                $scope.itemHasStarted = function(item) {
                    return item.status != 'N';
                };

                $scope.phaseChanged = function() {
                    $scope.iterationId = "";
                };

                $scope.create = function() {
                    if ($scope.defect) {
                        apiService.sendDefect($rootScope.userId, $scope.typeCode, $scope.description,
                            $scope.iterationId, $scope.removedIterationId, $scope.iterationActivityTypeCode, $scope.isShared, $scope.defect.id).success(function(data) {
                            $scope.clearForm();
                            $scope.delegate.defectFormFinishEditing();
                            console.log(data);
                        });
                    } else {
                        apiService.sendDefect($rootScope.userId, $scope.typeCode, $scope.description,
                            $scope.iterationId, $scope.project.active_iteration.id, $scope.iterationActivityTypeCode, $scope.isShared, undefined).success(function(data) {
                            $scope.clearForm();
                            console.log(data);
                        });
                    }
                };

                $scope.clearForm = function() {
                    $scope.typeCode = "";
                    $scope.description = "";
                    $scope.iterationId = "";
                    $scope.iterationActivityTypeCode = "";
                    $scope.isShared = false;
                    $scope.phaseIndex = "";
                };

                $scope.cancel = function() {
                    $scope.delegate.defectTypeFromType();
                };
            }
        };
    });
})();

function defectService(projectService) {
    var ds = {};

    ds.processDefects = function(defects, project) {

        var metrics = project.metrics;

        for (var i = 0; i < defects.length; i++) {
            console.log(defects[i].id);
            if (defects[i].removed_in_iteration.id == project.last_iteration.id) {
                var phaseIndex = projectService.phaseIndexFromCode(defects[i].injected_in_iteration.phase.phase_type);
                var iterationIndex = defects[i].injected_in_iteration.index;
                console.log(phaseIndex + ' ' + iterationIndex);
                if (project.phases[phaseIndex].iterations[iterationIndex - 1].num_defects_removed_in_last_iteration)
                    project.phases[phaseIndex].iterations[iterationIndex - 1].num_defects_removed_in_last_iteration++;
                else
                    project.phases[phaseIndex].iterations[iterationIndex - 1].num_defects_removed_in_last_iteration = 1;
            }
        }

        return defects;
    };

    ds.yield = function(removed, total) {

    };

    //percentage = 1/percentage - 1

    ds.iterationActivityFromType = function(type) {
        switch (type) {
            case 'R':
                return 'Requirements';
            case 'D':
                return 'Design';
            case 'C':
                return 'Coding';
            default:
                return 'ERROR';
        }
    };

    ds.defectTypeFromType = function(type) {
        switch (type) {
            case 'R':
                return 'Requirements';
            case 'D':
                return 'Design';
            case 'I':
                return 'Implementation';
            case 'B':
                return 'Bad Fix';
            default:
                return 'ERROR';
        }
    };

    return ds;
}
