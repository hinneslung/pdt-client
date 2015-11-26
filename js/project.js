function projectService() {
	var ps = {};

	ps.processProject = function(originalProject) {
		var project = originalProject;

		//fix api order
		//var temp = project.phases[2];
		//project.phases[2] = project.phases[1];
		//project.phases[1] = temp;

		//add title for UI
		var phaseTitles = ['Inception', 'Elaboration', 'Construction', 'Transition'];
		for (var i = 0; i < 4; i++)
			project.phases[i].title = phaseTitles[i];

		//status
		for (i = 0; i < 4; i++) {
			if (project.phases[i].is_active) {
				project.phases[i].status = 'A';
				for (j = 0; j < project.phases[i].iterations.length; j++) {
					if (project.phases[i].iterations[j].is_active) {
						project.phases[i].iterations[j].status = 'A';
						project.active_iteration = project.phases[i].iterations[j];
					} else
						project.phases[i].iterations[j].status = project.phases[i].iterations[j].end_dateTime ? 'E' : 'N';
				}
			} else {
				project.phases[i].status = project.phases[i].end_dateTime ? 'E' : 'N';
				for (j = 0; j < project.phases[i].iterations.length; j++)
					project.phases[i].iterations[j].status = project.phases[i].iterations[j].end_dateTime ? 'E' : 'N';
			}
		}
		project.last_iteration = project.phases[project.phases.length - 1].iterations[project.phases[project.phases.length - 1].iterations.length - 1];

		//metrics
		for (i = 0; i < 4; i++) {
			var phase = project.phases[i];
			if (project.metrics.phase.hasOwnProperty(phase.phase_type)) {
				for (var j = 0; j < phase.iterations.length; j++) {
					var metrics = project.metrics.phase[phase.phase_type].iteration[j];
					if (!metrics)continue;
					project.phases[i].iterations[j].sloc = metrics.lines_of_codes;
					project.phases[i].iterations[j].effort = metrics.effort;
					project.phases[i].iterations[j].numberOfdefectsRemoved = metrics.num_removed_defects;
					project.phases[i].iterations[j].numberOfDefectsInjected = metrics.num_injected_defects;
				}
				project.phases[i].effort = project.metrics.phase[phase.phase_type].effort;
				project.phases[i].sloc = project.metrics.phase[phase.phase_type].lines_of_codes;
				project.phases[i].numberOfdefectsRemoved = project.metrics.phase[phase.phase_type].num_removed_defects;
				project.phases[i].numberOfDefectsInjected = project.metrics.phase[phase.phase_type].num_injected_defects;

				if (project.phases[i].sloc > 0)
					project.sloc = project.phases[i].sloc;
			}
		}

		project.effort= project.metrics.effort;
		project.numberOfdefectsRemoved = project.metrics.num_removed_defects;
		project.numberOfDefectsInjected = project.metrics.num_injected_defects;

		//yields
		for (i = 0; i < 4; i++) {
			var phase = project.phases[i];
			if (project.metrics.phase.hasOwnProperty(phase.phase_type)) {
				for (var j = 0; j < phase.iterations.length; j++) {
					var metrics = project.metrics.phase[phase.phase_type].iteration[j];
					if (!metrics)continue;
					project.phases[i].iterations[j].sloc = metrics.lines_of_codes;
					project.phases[i].iterations[j].effort = metrics.effort;
				}
				project.phases[i].effort = project.metrics.phase[phase.phase_type].effort;
				project.phases[i].sloc = project.metrics.phase[phase.phase_type].lines_of_codes;
			}
		}

		return project;
	};

	ps.status = function(item) {
		switch(item.status) {
			case 'N':
				return 'Not Started';
			case 'A':
				return 'Active';
			case 'E':
				return 'Ended';
			default:
				return 'ERROR';
		}
	};

	ps.phaseFromType = function(type) {
		switch (type) {
			case 'I':
				return 'Inception';
			case 'E':
				return 'Elaboration';
			case 'C':
				return 'Construction';
			case 'T':
				return 'Transition';
			default:
				return 'ERROR';
		}
	};

	ps.phaseIndexFromCode = function(type) {
		switch (type) {
			case 'I':
				return '0';
			case 'E':
				return '1';
			case 'C':
				return '2';
			case 'T':
				return '3';
			default:
				return 500;
		}
	};

	return ps;
}
