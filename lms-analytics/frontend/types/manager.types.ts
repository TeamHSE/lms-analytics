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

export type {
	AddDisciplineRequest,
	RegisterManagerRequest,
	ManagerResponse,
	DisciplineResponse,
	TeacherResponse,
	RegisterTeacherRequest,
	UpdateTeacherRequest,
	AssignDisciplineRequest,
};