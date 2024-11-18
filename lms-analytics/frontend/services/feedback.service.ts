import { API_CONSTANTS } from "@/constants/api.constants";
import { client } from "@/api/interceptors";
import { Feedback, SendFeedbackRequest } from '@/types/feedback.types';

class FeedbackService {
	async addTeacherStudentFeedback(request: SendFeedbackRequest) {
		const response = await client.post<Feedback>(API_CONSTANTS.TEACHER2STUDENT, request);
		return response.data;
	}

	async addStudentTeacherFeedback(request: SendFeedbackRequest) {
		const response = await client.post<Feedback>(API_CONSTANTS.STUDENT2TEACHER, request);
		return response.data;
	}

	async addXStudentFeedback(request: SendFeedbackRequest) {
		const response = await client.post<Feedback>(API_CONSTANTS.X_STUDENTS, request);
		return response.data;
	}

	async getFeedbacksForTeacher(teacherId: number) {
		const response = await client.get<Feedback[]>(API_CONSTANTS.FOR_TEACHER + `/${ teacherId }`);
		return response.data;
	}

	async getFeedbacksFromTeacher(teacherId: number) {
		const response = await client.get<Feedback[]>(API_CONSTANTS.FROM_TEACHER + `/${ teacherId }`);
		return response.data;
	}

	async getFeedbacksForStudent(studentId: number) {
		const response = await client.get<Feedback[]>(API_CONSTANTS.FOR_STUDENT + `/${ studentId }`);
		return response.data;
	}

	async getFeedbacksFromStudent(studentId: number) {
		const response = await client.get<Feedback[]>(API_CONSTANTS.FROM_STUDENT + `/${ studentId }`);
		return response.data;
	}
}

export const feedbackService = new FeedbackService();