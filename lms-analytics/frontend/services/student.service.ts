import { API_CONSTANTS } from '@/constants/api.constants';
import { client } from '@/api/interceptors';

class StudentService {
	async getStudent(id: number) {
		return await this.getStudents().then(students => students.find(student => student.id === id));
	}

	async getStudents() {
		const response = await client.get<StudentResponse[]>(API_CONSTANTS.STUDENTS);
		return response.data;
	}

	async addStudent(student: AddStudentRequest) {
		const response = await client.post<StudentResponse>(API_CONSTANTS.ADD_STUDENT, student);
		return response.data;
	}

	getStudentName(student: StudentResponse | undefined): string {
		return student === undefined
			? 'Неизвестный студент'
			: `${ student.surname } ${ student.name }` + (student.lastname
			? ` ${ student.lastname }`
			: '');
	}
}

export const studentService = new StudentService();