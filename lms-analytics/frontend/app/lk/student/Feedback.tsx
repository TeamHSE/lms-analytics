"use client";

import React, { useEffect, useState } from "react";
import { Button, Input, List, Modal, Select, Tabs } from "antd";
import TabPane from "antd/es/tabs/TabPane";
import { feedbackService } from "@/services/feedback.service";
import { StudentResponse, TeacherResponse } from "@/types/manager.types";
import { managerService } from "@/services/manager.service";
import { Feedback, FeedbackPersonType } from "@/types/feedback.types";

interface FeedbackPageProps {
    student?: StudentResponse | undefined;
}

const FeedbackPage = ({ student }: FeedbackPageProps) => {
    const [ isModalVisible, setIsModalVisible ] = useState<boolean>(false);
    const [ feedbackText, setFeedbackText ] = useState<string>("");
    const [ selectedRecipient, setSelectedRecipient ] = useState<TeacherResponse | StudentResponse | undefined>(undefined);
    const [ recipientType, setRecipientType ] = useState<string>("teacher");

    const [ receivedFeedback, setReceivedFeedback ] = useState<Feedback[]>([]);
    const [ feedbackToTeachers, setFeedbackToTeachers ] = useState<Feedback[]>([]);
    const [ peerFeedback, setPeerFeedback ] = useState<Feedback[]>([]);

    const [ teachers, setTeachers ] = useState<TeacherResponse[]>([]);
    const [ classmates, setClassmates ] = useState<StudentResponse[]>([]);

    const fetchReceivedFeedback = async () => {
        if (student === undefined) {
            return;
        }

        feedbackService.getFeedbacksForStudent(student?.id).then((feedbacks) => setReceivedFeedback(feedbacks));
    };

    const fetchFeedbackToTeachers = async () => {
        if (student === undefined) {
            return;
        }

        feedbackService.getFeedbacksFromStudent(student?.id)
                .then((feedbacks) =>
                        feedbacks.filter((feedback) => feedback.receiverType === FeedbackPersonType.Teacher))
                .then((feedbacks) => setFeedbackToTeachers(feedbacks));
    };

    const fetchPeerFeedback = async () => {
        if (student === undefined) {
            return;
        }

        feedbackService.getFeedbacksFromStudent(student?.id)
                .then((feedbacks) =>
                        feedbacks.filter((feedback) => feedback.receiverType === FeedbackPersonType.Student))
                .then((feedbacks) => setPeerFeedback(feedbacks));
    };

    const fetchTeachersToSendFeedback = async () => {
        if (student === undefined) {
            return;
        }

        managerService.getStudentDisciplines(1, 1, student?.id).then((studentWithDisciplines) => {
            const disciplineIds = studentWithDisciplines.disciplines.map((discipline) => discipline.id);
            managerService.getTeachersForDisciplines(1, 1, disciplineIds).then((teachers) => setTeachers(teachers));
        });
    };

    const fetchClassmatesToSendFeedback = async () => {
        if (student === undefined) {
            return;
        }

        managerService.getStudyGroup(1, 1, student?.studyGroupId).then((studyGroup) => {
            managerService.getStudents(1, 1).then((students) => {
                const classmates = students.filter((student) => student.studyGroupId === studyGroup.id);
                setClassmates(classmates);
            });
        });
    };

    useEffect(() => {
        fetchReceivedFeedback();
        fetchFeedbackToTeachers();
        fetchPeerFeedback();
        fetchTeachersToSendFeedback();
        fetchClassmatesToSendFeedback();
    }, []);

    const handleSendFeedback = async () => {
        if (selectedRecipient) {
            if (recipientType === "teacher" && student) {
                const sentFeedback = await feedbackService.addStudentTeacherFeedback({
                    senderId: student?.id,
                    receiverId: selectedRecipient.id,
                    text: feedbackText,
                });
                setFeedbackToTeachers([ ...feedbackToTeachers, sentFeedback ]);
            } else if (recipientType === "student" && student) {
                const sentFeedback = await feedbackService.addXStudentFeedback({
                    senderId: student?.id,
                    receiverId: selectedRecipient.id,
                    text: feedbackText,
                });
                setPeerFeedback([ ...peerFeedback, sentFeedback ]);
            }

            setIsModalVisible(false);
            setFeedbackText("");
            setSelectedRecipient(undefined);
        }
    };

    return (
            <>
                <h1>Обратная связь</h1>
                <Tabs defaultActiveKey="1">
                    <TabPane tab="Полученная обратная связь" key={ 1 }>
                        <List
                                header={ <div>Полученная обратная связь</div> }
                                bordered
                                dataSource={ receivedFeedback }
                                renderItem={ item => (
                                        <List.Item key={ item.id }>
                                            <strong>{
                                                item.senderType === FeedbackPersonType.Student
                                                        ? managerService.getStudent(1, 1, item.senderId).then((student) => student?.name + " " + student?.surname + " (ученик)")
                                                        : managerService.getTeacher(1, 1, item.senderId).then((teacher) => teacher?.name + " " + teacher?.surname + " (преподаватель)")
                                            }:</strong> { item.text }
                                        </List.Item>
                                ) }
                        />
                    </TabPane>
                    <TabPane tab="Обратная связь преподавателю" key={ 2 }>
                        <List
                                header={ <div>Обратная связь преподавателю</div> }
                                bordered
                                dataSource={ feedbackToTeachers }
                                renderItem={ item => (
                                        <List.Item key={ item.id }>
                                            <strong>{ managerService.getTeacher(1, 1, item.senderId)
                                                    .then((teacher) => teacher?.name + " " + teacher?.surname) }
                                                | </strong> { item.text }
                                        </List.Item>
                                ) }
                        />
                    </TabPane>
                    <TabPane tab="Кросс-оценка" key={ 3 }>
                        <List
                                header={ <div>Обратная связь другим ребятам</div> }
                                bordered
                                dataSource={ peerFeedback }
                                renderItem={ item => (
                                        <List.Item key={ item.id }>
                                            <strong>{
                                                managerService.getStudent(1, 1, item.senderId).then((student) => student?.name + " " + student?.surname)
                                            } | </strong> { item.text }
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
                        onOk={ () => handleSendFeedback() }
                        okText="Отправить"
                        cancelText="Отмена"
                >
                    <Input.TextArea
                            rows={ 4 }
                            value={ feedbackText }
                            onChange={ (e) => setFeedbackText(e.target.value) }
                            placeholder="Введите текст Вашей обратной связи"
                    />
                    <Select
                            style={ { width: "100%", marginTop: "16px" } }
                            placeholder="Выберите, кому отправить"
                            value={ recipientType }
                            onChange={ (value) => setRecipientType(value.toString()) }
                    >
                        <Select.Option value="teacher">Преподавателю</Select.Option>
                        <Select.Option value="student">Другому ученику</Select.Option>
                    </Select>
                    { recipientType === "teacher" ? (
                            <Select
                                    style={ { width: "100%", marginTop: "16px" } }
                                    placeholder="Выберите получателя"
                                    value={ selectedRecipient }
                                    onChange={ (value) => setSelectedRecipient(value) }
                            >
                                { teachers.map((teacher) => (
                                        <Select.Option value={ teacher.id }>
                                            { teacher.name } { teacher.surname }
                                        </Select.Option>
                                )) }
                            </Select>
                    ) : (
                            <Select
                                    style={ { width: "100%", marginTop: "16px" } }
                                    placeholder="Выберите получателя"
                                    value={ selectedRecipient }
                                    onChange={ (value) => setSelectedRecipient(value) }
                            >
                                { classmates.map((classmate) => (
                                        <Select.Option value={ classmate.id }>
                                            { classmate.name } { classmate.surname }
                                        </Select.Option>
                                )) }
                            </Select>
                    ) }
                </Modal>
            </>
    );
};

export default FeedbackPage;