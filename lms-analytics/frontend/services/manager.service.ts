import { client } from '@/api/interceptors';
import {
	AddDisciplineRequest,
	AssignDisciplineRequest,
	DisciplineResponse,
	ManagerResponse,
	RegisterManagerRequest, RegisterStudentRequest, RegisterStudyGroupRequest,
	RegisterTeacherRequest, StudentDisciplinesResponse, StudentResponse, StudyGroupResponse,
	TeacherResponse, UpdateStudentRequest, UpdateStudyGroupRequest,
	UpdateTeacherRequest,
} from '@/types/manager.types';

class ManagerService {
	async getManagers(companyId: number) {
		const response = await client.get<ManagerResponse[]>(`${ companyId }/managers`);
		return response.data;
	}

	async getManager(companyId: number, managerId: number) {
		const response = await client.get<ManagerResponse>(`${ companyId }/managers/${ managerId }`);
		return response.data;
	}

	async getAllDisciplines(companyId: number) {
		const response = await client.get<DisciplineResponse[]>(`${ companyId }/managers/disciplines`);
		return response.data;
	}

	async registerManager(companyId: number, request: RegisterManagerRequest) {
		const response = await client.post<ManagerResponse>(`${ companyId }/managers`, request);
		return response.data;
	}

	async addDiscipline(companyId: number, managerId: number, request: AddDisciplineRequest) {
		const response = await client.post<DisciplineResponse>(`${ companyId }/managers/${ managerId }/disciplines`, request);
		return response.data;
	}

	async getTeachersForDisciplines(companyId: number, managerId: number, disciplineIds: number[]) {
		const response = await client.get<TeacherResponse[]>(`${ companyId }/managers/${ managerId }/disciplines/teachers/`, {
			params: {
				disciplineIds: disciplineIds.join(','),
			},
		});
		return response.data;
	}

	async getTeachers(companyId: number, managerId: number) {
		const response = await client.get<TeacherResponse[]>(`${ companyId }/managers/${ managerId }/teachers`);
		return response.data;
	}

	async registerTeacher(companyId: number, managerId: number, request: RegisterTeacherRequest) {
		const response = await client.post<TeacherResponse>(`${ companyId }/managers/${ managerId }/teachers`, request);
		return response.data;
	}

	async getTeacher(companyId: number, managerId: number, teacherId: number) {
		const response = await client.get<TeacherResponse>(`${ companyId }/managers/${ managerId }/teachers/${ teacherId }`);
		return response.data;
	}

	async updateTeacher(companyId: number, managerId: number, teacherId: number, request: UpdateTeacherRequest) {
		const response = await client.put<TeacherResponse>(`${ companyId }/managers/${ managerId }/teachers/${ teacherId }`, request);
		return response.data;
	}

	async deleteTeacher(companyId: number, managerId: number, teacherId: number) {
		await client.delete(`${ companyId }/managers/${ managerId }/teachers/${ teacherId }`);
	}

	async assignDisciplineToTeacher(companyId: number, managerId: number, teacherId: number, request: AssignDisciplineRequest) {
		await client.post(`${ companyId }/managers/${ managerId }/teachers/${ teacherId }/disciplines`, request);
	}

	async getTeacherDisciplines(companyId: number, managerId: number, teacherId: number) {
		const response = await client.get<DisciplineResponse[]>(`${ companyId }/managers/${ managerId }/teachers/${ teacherId }/disciplines`);
		return response.data;
	}

	async unassignDisciplineFromTeacher(companyId: number, managerId: number, teacherId: number, disciplineId: number) {
		await client.delete(`${ companyId }/managers/${ managerId }/teachers/${ teacherId }/disciplines/${ disciplineId }`);
	}

	async getStudyGroups(companyId: number, managerId: number) {
		const response = await client.get<StudyGroupResponse[]>(`${ companyId }/managers/${ managerId }/student-groups`);
		return response.data;
	}

	async registerStudyGroup(companyId: number, managerId: number, request: RegisterStudyGroupRequest) {
		const response = await client.post<StudyGroupResponse>(`${ companyId }/managers/${ managerId }/student-groups`, request);
		return response.data;
	}

	async getStudyGroup(companyId: number, managerId: number, studyGroupId: number) {
		const response = await client.get<StudyGroupResponse>(`${ companyId }/managers/${ managerId }/student-groups/${ studyGroupId }`);
		return response.data;
	}

	async updateStudyGroup(companyId: number, managerId: number, studyGroupId: number, request: UpdateStudyGroupRequest) {
		const response = await client.put<StudyGroupResponse>(`${ companyId }/managers/${ managerId }/student-groups/${ studyGroupId }`, request);
		return response.data;
	}

	async deleteStudyGroup(companyId: number, managerId: number, studyGroupId: number) {
		await client.delete(`${ companyId }/managers/${ managerId }/student-groups/${ studyGroupId }`);
	}

	async getStudents(companyId: number, managerId: number) {
		const response = await client.get<StudentResponse[]>(`${ companyId }/managers/${ managerId }/students`);
		return response.data;
	}

	async registerStudent(companyId: number, managerId: number, request: RegisterStudentRequest) {
		const response = await client.post<StudentResponse>(`${ companyId }/managers/${ managerId }/students`, request);
		return response.data;
	}

	async getStudent(companyId: number, managerId: number, studentId: number) {
		const response = await client.get<StudentResponse>(`${ companyId }/managers/${ managerId }/students/${ studentId }`);
		return response.data;
	}

	async updateStudent(companyId: number, managerId: number, studentId: number, request: UpdateStudentRequest) {
		const response = await client.put<StudentResponse>(`${ companyId }/managers/${ managerId }/students/${ studentId }`, request);
		return response.data;
	}

	async deleteStudent(companyId: number, managerId: number, studentId: number) {
		await client.delete(`${ companyId }/managers/${ managerId }/students/${ studentId }`);
	}

	async assignStudentToGroup(companyId: number, managerId: number, studentId: number, studyGroupId: number) {
		const response = await client.post<StudentResponse>(`${ companyId }/managers/${ managerId }/students/${ studentId }/student-groups/${ studyGroupId }`);
		return response.data;
	}

	async assignDisciplineToStudent(companyId: number, managerId: number, studentId: number, request: AssignDisciplineRequest) {
		const response = await client.post<StudentDisciplinesResponse>(`${ companyId }/managers/${ managerId }/students/${ studentId }/disciplines`, request);
		return response.data;
	}

	async getStudentDisciplines(companyId: number, managerId: number, studentId: number) {
		const response = await client.get<StudentDisciplinesResponse>(`${ companyId }/managers/${ managerId }/students/${ studentId }/disciplines`);
		return response.data;
	}

	async unassignDisciplineFromStudent(companyId: number, managerId: number, studentId: number, disciplineId: number) {
		const response = await client.delete<StudentDisciplinesResponse>(
			`${ companyId }/managers/${ managerId }/students/${ studentId }/disciplines/${ disciplineId }`);
		return response.data;
	}
}

export const managerService = new ManagerService();