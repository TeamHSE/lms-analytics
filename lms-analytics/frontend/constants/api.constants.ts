class ApiConstants {
	private apiRoot = '';

	PING = `${ this.apiRoot }/ping`;

	private authRoot = `${ this.apiRoot }/auth`;
	REGISTER = `${ this.authRoot }/register`;
	LOGIN = `${ this.authRoot }/login`;
	TOKENS = `${ this.authRoot }/tokens`;

	private feedbacksRoot = `${ this.apiRoot }/feedbacks`;
	TEACHER2STUDENT = `${ this.feedbacksRoot }/teacher-student`;
	STUDENT2TEACHER = `${ this.feedbacksRoot }/student-teacher`;
	X_STUDENTS = `${ this.feedbacksRoot }/x-student`;
	FOR_TEACHER = `${ this.feedbacksRoot }/for-teacher`;
	FROM_TEACHER = `${ this.feedbacksRoot }/from-teacher`;
	FOR_STUDENT = `${ this.feedbacksRoot }/for-student`;
	FROM_STUDENT = `${ this.feedbacksRoot }/from-student`;

	private studentsRoot = `${ this.apiRoot }/students`;
	STUDENTS = `${ this.studentsRoot }`;
	
	private companiesRoot = `${ this.apiRoot }/companies`;
	COMPANIES = `${ this.companiesRoot }`;
}

export const API_CONSTANTS = new ApiConstants();
