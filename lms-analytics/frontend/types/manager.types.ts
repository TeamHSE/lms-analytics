interface AddDisciplineRequest {
	name: string;
}

interface RegisterManagerRequest {
	adminId: number;
	name: string;
	surname: string;
	fatherName: string | null;
	email: string;
}

interface ManagerResponse {
	id: number;
	name: string;
	surname: string;
	fatherName: string | null;
	email: string;
	companyId: number;
}

interface DisciplineResponse {
	id: number;
	name: string;
	companyId: number;
}

interface TeacherResponse {
	id: number;
	name: string;
	surname: string;
	fatherName: string | null;
	email: string;
	companyId: number;
}

interface RegisterTeacherRequest {
	name: string;
	surname: string;
	fatherName: string;
	email: string;
}

interface UpdateTeacherRequest {
	name: string | null;
	surname: string | null;
	fatherName: string | null;
	email: string | null;
}

interface AssignDisciplineRequest {
	disciplineId: number;
}

interface RegisterStudyGroupRequest {
	program: string;
	groupNumber: string;
	admissionYear: number;
}

interface StudyGroupResponse {
	id: number;
	program: string;
	groupNumber: string;
	admissionYear: number;
}

interface RegisterStudentRequest {
	name: string;
	surname: string;
	fatherName: string | null;
	email: string;
	studyGroupId: number;
}

interface StudentResponse {
	id: number;
	name: string;
	surname: string;
	fatherName: string | null;
	email: string;
	studyGroupId: number;
}

interface UpdateStudyGroupRequest {
	program: string | null;
	groupNumber: string | null;
	admissionYear: number | null;
}

interface UpdateStudentRequest {
	name: string | null;
	surname: string | null;
	email: string | null;
}

interface StudentDisciplinesResponse {
	studentId: number;
	disciplines: DisciplineResponse[];
}

export type {
	AddDisciplineRequest,
	RegisterManagerRequest,
	ManagerResponse,
	DisciplineResponse,
	TeacherResponse,
	RegisterTeacherRequest,
	UpdateTeacherRequest,
	AssignDisciplineRequest,
	RegisterStudyGroupRequest,
	StudyGroupResponse,
	RegisterStudentRequest,
	StudentResponse,
	UpdateStudyGroupRequest,
	UpdateStudentRequest,
	StudentDisciplinesResponse
};