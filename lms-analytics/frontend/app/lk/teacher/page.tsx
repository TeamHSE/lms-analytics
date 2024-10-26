"use client";

import React, { useState } from "react";
import { Layout, List, Card, Progress, Button, Menu, Modal } from "antd";
import LogoutButton from "@/app/lk/LogoutButton";

const { Sider, Content } = Layout;

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

export default function TeacherPanel() {
    const [ selectedGroup, setSelectedGroup ] = useState<StudentGroup | null>(null);
    const [ isModalVisible, setIsModalVisible ] = useState<boolean>(false);
    const [ selectedStudent, setSelectedStudent ] = useState<string | null>(null);

    const teacherInfo: TeacherInfo = {
        fullName: "Иванов И.И.",
        organization: "Государственный университет",
    };

    const studentGroups: StudentGroup[] = [
        { id: 1, name: "Группа А", students: [ "Иванов И.И.", "Петров П.П.", "Сидоров С.С." ] },
        { id: 2, name: "Группа Б", students: [ "Алексеев А.А.", "Кузнецов К.К." ] },
        { id: 3, name: "Группа В", students: [ "Смирнова С.С.", "Романова Р.Р.", "Новиков Н.Н." ] },
    ];

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
            <Layout style={ { minHeight: "100vh" } }>
                <Sider width={ 300 } style={ { background: "#fff", justifyItems: "center" } }>
                    <h2 style={ { padding: "5px" } }>Группы студентов</h2>
                    <Menu mode="inline" defaultSelectedKeys={ [ "0" ] }>
                        { studentGroups.map((group) => (
                                <Menu.Item key={ group.id } onClick={ () => setSelectedGroup(group) }>
                                    { group.name }
                                </Menu.Item>
                        )) }
                    </Menu>
                    <LogoutButton/>
                </Sider>
                <Layout>
                    <Content style={ { padding: "24px", paddingTop: "0" } }>
                        <h1>{ teacherInfo.organization }</h1>
                        <p>{ teacherInfo.fullName }</p>
                        { selectedGroup ? (
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
                        ) }
                    </Content>
                </Layout>
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
            </Layout>
    );
}