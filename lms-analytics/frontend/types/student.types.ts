interface Student {
	id: number;
	name: string;
	surname: string;
	lastname: string | null;
	email: string;
}

type AddStudentRequest = Omit<Student, 'id'>;
