interface StudentGroup {
	id: number;
	name: string;
	students: string[];
}

interface TeacherInfo {
	fullName: string;
	organization: string;
}

interface GroupStats {
	averageGrade: number;
	assignmentsCompletedRate: number;
	attendanceRate: number;
}

interface StudentStats {
	grades: { subject: string; grade: number }[];
	attendanceRate: number;
}