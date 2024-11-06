interface StudentResponse {
	id: number;
	name: string;
	surname: string;
	fatherName: string | null;
	email: string;
}

type AddStudentRequest = Omit<StudentResponse, 'id'>;
