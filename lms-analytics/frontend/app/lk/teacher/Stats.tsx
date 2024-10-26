"use client";

import React, { useState } from "react";
import { List, Card, Progress, Button, Modal } from "antd";

interface StatsPanelProps {
    selectedGroup?: StudentGroup | null;
}

export default function StatsPanel({ selectedGroup }: StatsPanelProps) {
    const [ isModalVisible, setIsModalVisible ] = useState<boolean>(false);
    const [ selectedStudent, setSelectedStudent ] = useState<string | null>(null);

    const teacherInfo: TeacherInfo = {
        fullName: "Иванов И.И.",
        organization: "Государственный университет",
    };

    const groupStats: GroupStats = {
        averageGrade: 4.2,
        assignmentsCompletedRate: 85,
        attendanceRate: 92,
    };

    const studentStats: StudentStats = {
        grades: [
            { subject: "Математика", grade: 4.5 },
            { subject: "Физика", grade: 3.8 },
            { subject: "История", grade: 4.0 },
        ],
        attendanceRate: 90,
    };

    const handleUploadGrades = () => {
        console.log("Загрузка оценок...");
    };

    const showModal = (student: string) => {
        setSelectedStudent(student);
        setIsModalVisible(true);
    };

    const handleModalClose = () => {
        setIsModalVisible(false);
        setSelectedStudent(null);
    };

    return (
            <>
                <h1>{ teacherInfo.organization }</h1>
                <p>{ teacherInfo.fullName }</p>
                {
                    selectedGroup ? (
                            <Card title={ `Статистика для ${ selectedGroup.name }` }>
                                <p>Средняя оценка группы:</p>
                                <Progress
                                        percent={ (groupStats.averageGrade / 5) * 100 }
                                        status="active"
                                        format={ (percent) => `${ ((percent ?? 0) * 5) / 100 }` }
                                />
                                <p>Процент выполненных заданий:</p>
                                <Progress percent={ groupStats.assignmentsCompletedRate } status="active"/>
                                <p>Процент посещаемости:</p>
                                <Progress percent={ groupStats.attendanceRate } status="active"
                                          strokeColor="#52c41a"/>
                                <Button
                                        type="primary"
                                        style={ { marginTop: "16px" } }
                                        onClick={ handleUploadGrades }
                                        disabled={ selectedGroup.students.length === 0 }
                                >
                                    Загрузить оценки
                                </Button>
                                <Card title="Список учеников" style={ { marginTop: "16px" } }>
                                    <List
                                            dataSource={ selectedGroup.students }
                                            renderItem={ (student) => (
                                                    <List.Item onClick={ () => showModal(student) }
                                                               style={ { cursor: "pointer" } }>
                                                        { student }
                                                    </List.Item>
                                            ) }
                                            bordered
                                    />
                                </Card>
                            </Card>
                    ) : (
                            <Card title="Выберите группу для просмотра статистики">
                                <p>Нажмите на группу, чтобы увидеть подробную статистику, аналитику успеваемости и
                                   список учеников.</p>
                            </Card>
                    )
                }

                <Modal
                        title={ `${ selectedStudent } - Статистика` }
                        open={ isModalVisible }
                        onCancel={ handleModalClose }
                        footer={ null }
                >
                    <h3>Оценки:</h3>
                    <List
                            dataSource={ studentStats.grades }
                            renderItem={ (grade) => (
                                    <List.Item>
                                        { grade.subject }: { grade.grade }
                                    </List.Item>
                            ) }
                            bordered
                    />
                    <h3>Процент посещаемости: { studentStats.attendanceRate }%</h3>
                </Modal>
            </>);
}