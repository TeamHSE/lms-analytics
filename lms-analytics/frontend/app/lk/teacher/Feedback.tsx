"use client";

import React, { useState, useEffect } from "react";
import { List, Button, Modal, Input, Tabs, Select } from "antd";
import { feedbackService } from "@/services/feedback.service";
import { studentService } from "@/services/student.service";

const { TabPane } = Tabs;

const TEACHER_ID = 1; // todo
const FeedbackPage = () => {
	const [ isModalVisible, setIsModalVisible ] = useState<boolean>(false);
	const [ feedbackText, setFeedbackText ] = useState<string>("");
	const [ selectedStudentId, setSelectedStudentId ] = useState<number | undefined>(undefined);
	const [ students, setStudents ] = useState<any[]>([]);
	const [ receivedFeedbacks, setReceivedFeedbacks ] = useState<any[]>([]);
	const [ sentFeedbacks, setSentFeedbacks ] = useState<any[]>([]);

	useEffect(() => {
		studentService.getStudents().then((students) => setStudents(students));
		feedbackService.getFeedbacksForTeacher(TEACHER_ID).then((feedbacks) => setReceivedFeedbacks(feedbacks));
		feedbackService.getFeedbacksFromTeacher(TEACHER_ID).then((feedbacks) => setSentFeedbacks(feedbacks));
	}, []);

	const handleSendFeedback = async () => {
		if (selectedStudentId) {
			const sentFeedback = await feedbackService.addTeacherStudentFeedback({
				senderId: TEACHER_ID,
				receiverId: selectedStudentId,
				text: feedbackText,
			});
			setSentFeedbacks([...sentFeedbacks, sentFeedback]);

			setIsModalVisible(false);
			setFeedbackText("");
			setSelectedStudentId(undefined);
		}
	};

	return (
		<>
			<h1>Обратная связь</h1>
			<Tabs defaultActiveKey="1">
				<TabPane tab="Полученная обратная связь" key="1">
					<List
						header={ <div>Обратная связь от студентов</div> }
						bordered
						dataSource={ receivedFeedbacks }
						renderItem={ item => (
							<List.Item>
								<strong>
									{ studentService.getStudentName(students.find(student => student.id === item.senderId)) }:
								</strong> { item.text }
							</List.Item>
						) }
					/>
				</TabPane>
				<TabPane tab="Отправленная обратная связь" key="2">
					<List
						header={ <div>Обратная связь студентам</div> }
						bordered
						dataSource={ sentFeedbacks }
						renderItem={ item => (
							<List.Item>
								<strong>
									{ studentService.getStudentName(students.find(student => student.id === item.receiverId)) }:
								</strong> { item.text }
							</List.Item>
						) }
					/>
				</TabPane>
			</Tabs>
			<Button type="primary" onClick={ () => setIsModalVisible(true) } style={ { top: "1%" } }>
				Отправить обратную связь
			</Button>
			<Modal
				title="Отправить обратную связь"
				open={ isModalVisible }
				onCancel={ () => setIsModalVisible(false) }
				onOk={ handleSendFeedback }
				okText="Отправить"
				cancelText="Отмена"
			>
				<Input.TextArea
					rows={ 4 }
					value={ feedbackText }
					onChange={ (e) => setFeedbackText(e.target.value) }
					placeholder="Напишите Вашу обратную связь"
				/>
				<Select
					style={ { width: "100%", marginTop: "16px" } }
					placeholder="Выберите студента"
					value={ selectedStudentId }
					onChange={ (value) => setSelectedStudentId(value) }
					options={ students.map((student) => ({
						value: student.id,
						label: studentService.getStudentName(student),
					})) }
				>
				</Select>
			</Modal>
		</>
	);
};

export default FeedbackPage;