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
            controller: function($window, $rootScope, $scope, $location, apiService, projectService, defectService, modalService) {
                if ($scope.defect) {
                    $scope.typeCode = $scope.defect.defect_type;
                    $scope.description = $scope.defect.description;
                    $scope.iterationActivityTypeCode = $scope.defect.iteration_activity_type;
                    $scope.isShared = $scope.defect.is_shared;

                    $scope.phaseIndex = projectService.phaseIndexFromCode($scope.defect.injected_in_iteration.phase.phase_type);
                    $scope.iteration = $scope.defect.injected_in_iteration;

                    $scope.removedIterationId = $scope.defect.removed_in_iteration.id;
                } else {
                    //form
                    $scope.typeCode = "";
                    $scope.description = "";
                    $scope.iteration = "";
                    $scope.iterationActivityTypeCode = "";
                    $scope.isShared = false;

                    $scope.phaseIndex = "";
                }

                $scope.itemHasStarted = function(item) {
                    return item.status != 'N';
                };

                $scope.phaseChanged = function() {
                    $scope.iteration = {};
                };

                $scope.create = function() {
                    modalService.open(
                        "Confirm",
                        'Type: ' +
                        defectService.defectTypeFromType($scope.typeCode) + '; Description: ' +
                        $scope.description + '; Inserted in: ' +
                        projectService.phaseFromIndex($scope.phaseIndex) + ' ' +
	                    $scope.iteration.index + ' ' +
	                    defectService.iterationActivityFromType($scope.iterationActivityTypeCode) +
                        ($scope.isShared ? '; Shared ' : '; Not Shared '),
                        [],
                        $scope.send
                    );
                };

                $scope.send = function() {
                    if ($scope.defect) {
                        apiService.sendDefect($rootScope.userId, $scope.typeCode, $scope.description,
                            $scope.iteration.id, $scope.removedIterationId, $scope.iterationActivityTypeCode, $scope.isShared, $scope.defect.id).success(function(data) {
                            $scope.clearForm();
                            $scope.delegate.defectFormFinishEditing();
                            console.log(data);
                        });
                    } else {
                        apiService.sendDefect($rootScope.userId, $scope.typeCode, $scope.description,
                            $scope.iteration.id, $scope.project.active_iteration.id, $scope.iterationActivityTypeCode, $scope.isShared, undefined).success(function(data) {
                            $scope.clearForm();
                            console.log(data);
                        });
                    }
                };

                $scope.clearForm = function() {
                    $scope.typeCode = "";
                    $scope.description = "";
                    $scope.iteration = {};
                    $scope.iterationActivityTypeCode = "";
                    $scope.isShared = false;
                    $scope.phaseIndex = "";
                };

                $scope.cancel = function() {
                    $scope.delegate.defectFormFinishEditing();
                };
            }
        };
    });
})();

function defectService(projectService) {
    var ds = {};

    ds.processDefects = function(defects, project) {

        var metrics = project.metrics;

        defects.sort(function(a, b){
            return new Date(b.created_dateTime) - new Date(a.created_dateTime);
        });

        for (var i = 0; i < defects.length; i++) {
            if (defects[i].removed_in_iteration.id == project.last_iteration.id) {
                var phaseIndex = projectService.phaseIndexFromCode(defects[i].injected_in_iteration.phase.phase_type);
                var iterationIndex = defects[i].injected_in_iteration.index;
                if (project.phases[phaseIndex].iterations[iterationIndex - 1].num_defects_removed_in_last_iteration)
                    project.phases[phaseIndex].iterations[iterationIndex - 1].num_defects_removed_in_last_iteration++;
                else
                    project.phases[phaseIndex].iterations[iterationIndex - 1].num_defects_removed_in_last_iteration = 1;
            }
        }

	    var percentage = 1/(project.percentage/100) - 1;
	    var currentDefectsNumber = 0;
	    var currentPhaseDefectsNumber = 0;
        project.total_defects_injected = 0;
	    for (i = 0; i < project.phases.length; i++) {
		    var totalPhaseDefectsInjected = 0;
		    var totalPhaseDefectsRemoved = 0;
		    for (var j = 0; j < project.phases[i].iterations.length; j++) {
			    var iteration = project.phases[i].iterations[j];
			    var number = iteration.num_defects_removed_in_last_iteration;
			    project.phases[i].iterations[j].escaped = number ? number * percentage : 0;
			    var total = project.phases[i].iterations[j].escaped + iteration.num_defects_injected;
                project.phases[i].iterations[j].total_defects_injected = total;

			    //calculate yield for this iteration
			    currentDefectsNumber += iteration.total_defects_injected;
			    project.phases[i].iterations[j].yield = iteration.num_defects_removed / currentDefectsNumber;
			    currentDefectsNumber -= iteration.num_defects_removed;

			    //for phase yield calculation
			    totalPhaseDefectsInjected += project.phases[i].iterations[j].total_defects_injected;
			    totalPhaseDefectsRemoved += project.phases[i].iterations[j].num_defects_removed;
		    }
		    //calculate yield for this phase
		    currentPhaseDefectsNumber += totalPhaseDefectsInjected;
		    project.phases[i].yield = totalPhaseDefectsRemoved / currentPhaseDefectsNumber;
		    currentPhaseDefectsNumber -= totalPhaseDefectsRemoved;

		    project.phases[i].total_defects_injected = totalPhaseDefectsInjected;
		    project.phases[i].num_defects_removed = totalPhaseDefectsRemoved;

		    //for project yield
		    project.total_defects_injected += totalPhaseDefectsInjected;
	    }
	    project.yield = project.num_defects_removed/ project.total_defects_injected;


        return defects;
    };

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
