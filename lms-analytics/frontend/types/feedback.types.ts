export interface SendFeedbackRequest {
	senderId: number;
	receiverId: number;
	text: string;
}

export interface Feedback {
	id: number;
	senderId: number;
	receiverId: number;
	text: string;
	createdAt: string;
	senderType: FeedbackPersonType;
	receiverType: FeedbackPersonType;
}

export enum FeedbackPersonType {
	Student = "Student",
	Teacher = "Teacher",
}