function productService() {
	var ps = {};

	ps.processProject = function(originalProject) {
		var project = originalProject;

		var temp = project.phases[2];
		project.phases[2] = project.phases[1];
		project.phases[1] = temp;

		var phaseTitles = ['Inception', 'Elaboration', 'Construction', 'Transition'];
		for (var i = 0; i < 4; i++)
			project.phases[i].title = phaseTitles[i];

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
