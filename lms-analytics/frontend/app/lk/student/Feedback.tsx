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
    const [ selectedRecipientId, setSelectedRecipientId ] = useState<number | undefined>(undefined);

    const [ recipientType, setRecipientType ] = useState<string>("teacher");

    const [ receivedFeedback, setReceivedFeedback ] = useState<(Feedback & { senderName: string })[]>([]);
    const [ feedbackToTeachers, setFeedbackToTeachers ] = useState<(Feedback & { receiverName: string })[]>([]);
    const [ peerFeedback, setPeerFeedback ] = useState<(Feedback & { receiverName: string })[]>([]);

    const [ teachers, setTeachers ] = useState<TeacherResponse[]>([]);
    const [ classmates, setClassmates ] = useState<StudentResponse[]>([]);

    const fetchData = async () => {
        if (!student) return;

        const [
            feedbacks,
            studentFeedbacks,
            teacherFeedbacks,
            disciplines,
            studyGroup,
            allStudents,
        ] = await Promise.all([
            feedbackService.getFeedbacksForStudent(student.id),
            feedbackService.getFeedbacksFromStudent(student.id).then((f) =>
                    f.filter((feedback) => feedback.receiverType === FeedbackPersonType.Student)),
            feedbackService.getFeedbacksFromStudent(student.id).then((f) =>
                    f.filter((feedback) => feedback.receiverType === FeedbackPersonType.Teacher),
            ),
            managerService.getStudentDisciplines(1, 1, student.id),
            managerService.getStudyGroup(1, 1, student.studyGroupId),
            managerService.getStudents(1, 1),
        ]);

        const receivedFeedback = await Promise.all(
                feedbacks.map(async (feedback) => {
                    const senderName =
                            feedback.senderType === FeedbackPersonType.Student
                                    ? await managerService
                                            .getStudent(1, 1, feedback.senderId)
                                            .then((student) => `${ student?.name } ${ student?.surname } (ученик)`)
                                    : await managerService
                                            .getTeacher(1, 1, feedback.senderId)
                                            .then((teacher) => `${ teacher?.name } ${ teacher?.surname } (преподаватель)`);
                    return { ...feedback, senderName };
                }),
        );

        const feedbackToTeachers = await Promise.all(
                teacherFeedbacks.map(async (feedback) => {
                    const receiverName = await managerService
                            .getTeacher(1, 1, feedback.receiverId)
                            .then((teacher) => `${ teacher?.name } ${ teacher?.surname }`);
                    return { ...feedback, receiverName };
                }),
        );

        const peerFeedback = await Promise.all(
                studentFeedbacks.map(async (feedback) => {
                    const receiverName = await managerService
                            .getStudent(1, 1, feedback.receiverId)
                            .then((student) => `${ student?.name } ${ student?.surname }`);
                    return { ...feedback, receiverName };
                }),
        );

        const disciplineIds = disciplines.disciplines.map((discipline) => discipline.id);
        const teachers = await managerService.getTeachersForDisciplines(1, 1, disciplineIds);

        const classmates = allStudents.filter(
                (classmate) => classmate.studyGroupId === studyGroup.id,
        );

        setReceivedFeedback(receivedFeedback);
        setFeedbackToTeachers(feedbackToTeachers);
        setPeerFeedback(peerFeedback);
        setTeachers(teachers);
        setClassmates(classmates);
    };

    useEffect(() => {
        fetchData();
    }, [ student ]);

    const handleSendFeedback = async () => {
        if (selectedRecipientId) {
            const selectedRecipient =
                    recipientType === "teacher"
                            ? teachers.find((teacher) => teacher.id === selectedRecipientId)
                            : classmates.find((classmate) => classmate.id === selectedRecipientId);

            if (selectedRecipient && student) {
                if (recipientType === "teacher") {
                    const sentFeedback = await feedbackService.addStudentTeacherFeedback({
                        senderId: student.id,
                        receiverId: selectedRecipient.id,
                        text: feedbackText,
                    });
                    setFeedbackToTeachers([
                        ...feedbackToTeachers,
                        {
                            ...sentFeedback,
                            receiverName: `${ selectedRecipient.name } ${ selectedRecipient.surname }`,
                        },
                    ]);
                } else {
                    const sentFeedback = await feedbackService.addXStudentFeedback({
                        senderId: student.id,
                        receiverId: selectedRecipient.id,
                        text: feedbackText,
                    });
                    setPeerFeedback([
                        ...peerFeedback,
                        {
                            ...sentFeedback,
                            receiverName: `${ selectedRecipient.name } ${ selectedRecipient.surname }`,
                        },
                    ]);
                }

                setIsModalVisible(false);
                setFeedbackText("");
                setSelectedRecipientId(undefined);
            }
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
                                        <List.Item key={ item.id }><strong>{ item.senderName }:</strong> { item.text }
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
                                            <strong>{ item.receiverName } | </strong> { item.text }
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
                                            <strong>{ item.receiverName } | </strong> { item.text }
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
                                    value={ selectedRecipientId }
                                    onChange={ (value) => setSelectedRecipientId(value) }
                            >
                                { teachers.map((teacher) => (
                                        <Select.Option key={ teacher.id } value={ teacher.id }>
                                            { teacher.name } { teacher.surname }
                                        </Select.Option>
                                )) }
                            </Select>
                    ) : (
                            <Select
                                    style={ { width: "100%", marginTop: "16px" } }
                                    placeholder="Выберите получателя"
                                    value={ selectedRecipientId }
                                    onChange={ (value) => setSelectedRecipientId(value) }
                            >
                                { classmates.map((classmate) => (
                                        <Select.Option key={ classmate.id } value={ classmate.id }>
                                            { classmate.name } { classmate.surname }
                                        </Select.Option>)) }
                            </Select>
                    ) }
                </Modal>
            </>
    );
};

export default FeedbackPage;