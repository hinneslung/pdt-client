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
					} else
						project.phases[i].iterations[j].status = project.phases[i].iterations[j].end_dateTime ? 'E' : 'N';
				}
			} else {
				project.phases[i].status = project.phases[i].end_dateTime ? 'E' : 'N';
				for (j = 0; j < project.phases[i].iterations.length; j++)
					project.phases[i].iterations[j].status = project.phases[i].iterations[j].end_dateTime ? 'E' : 'N';
			}
		}

		//metrics
		project.effort = 0;
		for (i = 0; i < 4; i++) {
			var phase = project.phases[i];
			project.phases[i].effort = 0;
			if (project.metrics.phase.hasOwnProperty(phase.phase_type)) {
				for (var j = 0; j < phase.iterations.length; j++) {
					var metrics = project.metrics.phase[phase.phase_type][j];
					if (!metrics)continue;
					project.phases[i].iterations[j].sloc = metrics.lines_of_codes;
					project.phases[i].iterations[j].effort = metrics.effort;

					project.phases[i].sloc = metrics.lines_of_codes;
					project.phases[i].effort += metrics.effort;
				}
				project.sloc = project.phases[i].sloc;
				project.effort += project.phases[i].effort;
			}
		}

		return project;
	};

	ps.status = function(item) {
		switch(item.status) {
			case 'N':
				return 'Not Started'
			case 'A':
				return 'Active';
			case 'E':
				return 'Ended';
			default:
				return 'ERROR';
		}
	};

	return ps;
}
