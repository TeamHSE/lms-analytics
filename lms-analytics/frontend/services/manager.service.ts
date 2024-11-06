import { client } from '@/api/interceptors';
import {
	AddDisciplineRequest,
	AssignDisciplineRequest,
	DisciplineResponse,
	ManagerResponse,
	RegisterManagerRequest,
	RegisterTeacherRequest,
	TeacherResponse,
	UpdateTeacherRequest,
} from '@/types/manager.types';

class ManagerService {
	async getManagers(companyId: number) {
		const response = await client.get<ManagerResponse[]>(`${companyId}/managers`);
		return response.data;
	}

	async getManager(companyId: number, managerId: number) {
		const response = await client.get<ManagerResponse>(`${companyId}/managers/${managerId}`);
		return response.data;
	}

	async getAllDisciplines(companyId: number) {
		const response = await client.get<DisciplineResponse[]>(`${companyId}/managers/disciplines`);
		return response.data;
	}

	async registerManager(companyId: number, request: RegisterManagerRequest) {
		const response = await client.post<ManagerResponse>(`${companyId}/managers`, request);
		return response.data;
	}

	async addDiscipline(companyId: number, managerId: number, request: AddDisciplineRequest) {
		const response = await client.post<DisciplineResponse>(`${companyId}/managers/${managerId}/disciplines`, request);
		return response.data;
	}

	async getTeachers(companyId: number, managerId: number) {
		const response = await client.get<TeacherResponse[]>(`${companyId}/managers/${managerId}/teachers`);
		return response.data;
	}

	async registerTeacher(companyId: number, managerId: number, request: RegisterTeacherRequest) {
		const response = await client.post<TeacherResponse>(`${companyId}/managers/${managerId}/teachers`, request);
		return response.data;
	}

	async getTeacher(companyId: number, managerId: number, teacherId: number) {
		const response = await client.get<TeacherResponse>(`${companyId}/managers/${managerId}/teachers/${teacherId}`);
		return response.data;
	}

	async updateTeacher(companyId: number, managerId: number, teacherId: number, request: UpdateTeacherRequest) {
		const response = await client.put<TeacherResponse>(`${companyId}/managers/${managerId}/teachers/${teacherId}`, request);
		return response.data;
	}

	async deleteTeacher(companyId: number, managerId: number, teacherId: number) {
		await client.delete(`${companyId}/managers/${managerId}/teachers/${teacherId}`);
	}

	async assignDisciplineToTeacher(companyId: number, managerId: number, teacherId: number, request: AssignDisciplineRequest) {
		await client.post(`${companyId}/managers/${managerId}/teachers/${teacherId}/disciplines`, request);
	}

	async getTeacherDisciplines(companyId: number, managerId: number, teacherId: number) {
		const response = await client.get<DisciplineResponse[]>(`${companyId}/managers/${managerId}/teachers/${teacherId}/disciplines`);
		return response.data;
	}

	async unassignDisciplineFromTeacher(companyId: number, managerId: number, teacherId: number, disciplineId: number) {
		await client.delete(`${companyId}/managers/${managerId}/teachers/${teacherId}/disciplines/${disciplineId}`);
	}
}

export const managerService = new ManagerService();