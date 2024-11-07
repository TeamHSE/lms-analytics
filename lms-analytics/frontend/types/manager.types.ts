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
	name?: string;
	surname?: string;
	fatherName: string | null;
	email?: string;
}

interface AssignDisciplineRequest {
	disciplineId: number;
}

interface RegisterStudyGroupRequest {
	program: string;
	groupNumber: number;
	admissionYear: number;
}

interface StudyGroupResponse {
	id: number;
	program: string;
	groupNumber: number;
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
	program?: string;
	groupNumber?: number;
	admissionYear?: number;
}

interface UpdateStudentRequest {
	name?: string;
	surname?: string;
	email?: string;
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