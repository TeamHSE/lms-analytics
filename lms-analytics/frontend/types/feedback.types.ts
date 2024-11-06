interface SendFeedbackRequest {
	senderId: number;
	receiverId: number;
	text: string;
}

interface Feedback {
	id: number;
	senderId: number;
	receiverId: number;
	text: string;
	createdAt: string;
	senderType: FeedbackPersonType;
	receiverType: FeedbackPersonType;
}

enum FeedbackPersonType {
	Student = 1,
	Teacher = 2,
}