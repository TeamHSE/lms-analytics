"use client";

import React, { useState } from "react";
import { Layout, List, Card, Progress, Button, Menu, Modal } from "antd";

const { Sider, Content } = Layout;

export default function TeacherPanel() {
    const [ selectedGroup, setSelectedGroup ] = useState(null);
    const [ isModalVisible, setIsModalVisible ] = useState(false);
    const [ selectedStudent, setSelectedStudent ] = useState(null);

    // Пример информации о преподавателе и организации
    const teacherInfo = {
        fullName: "Иванов И.И.",
        organization: "Государственный университет",
    };

    // Пример данных групп студентов
    const studentGroups = [
        { id: 1, name: "Группа А", students: [ "Иванов И.И.", "Петров П.П.", "Сидоров С.С." ] },
        { id: 2, name: "Группа Б", students: [ "Алексеев А.А.", "Кузнецов К.К." ] },
        { id: 3, name: "Группа В", students: [ "Смирнова С.С.", "Романова Р.Р.", "Новиков Н.Н." ] },
    ];

    // Пример данных успеваемости для выбранной группы
    const groupStats = {
        averageGrade: 4.2,
        assignmentsCompletedRate: 85,
        attendanceRate: 92,
    };

    // Пример статистики студента
    const studentStats = {
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

    const showModal = (student) => {
        setSelectedStudent(student);
        setIsModalVisible(true);
    };

    const handleModalClose = () => {
        setIsModalVisible(false);
        setSelectedStudent(null);
    };

    return (
            <Layout style={ { minHeight: "100vh" } }>
                <Sider width={ 300 } style={ { background: "#fff" } }>
                    <h2 style={ { padding: "5px" } }>Группы студентов</h2>
                    <Menu mode="inline" defaultSelectedKeys={ [ "0" ] }>
                        { studentGroups.map((group) => (
                                <Menu.Item key={ group.id } onClick={ () => setSelectedGroup(group) }>
                                    { group.name }
                                </Menu.Item>
                        )) }
                    </Menu>
                </Sider>
                <Layout>
                    <Content style={ { padding: "24px", paddingTop: "0" } }>
                        <h1>{ teacherInfo.organization }</h1>
                        <p>{ teacherInfo.fullName }</p>
                        {/* Страница группы с аналитикой, статистикой и списком учеников */ }
                        { selectedGroup ? (
                                <Card title={ `Статистика для ${ selectedGroup.name }` }>
                                    <p>Средняя оценка группы:</p>
                                    <Progress
                                            percent={ (groupStats.averageGrade / 5) * 100 }
                                            status="active"
                                            format={ (percent) => `${ (percent * 5) / 100 }` }
                                    />
                                    <p>Процент выполненных заданий:</p>
                                    <Progress
                                            percent={ groupStats.assignmentsCompletedRate }
                                            status="active"
                                    />
                                    <p>Процент посещаемости:</p>
                                    <Progress
                                            percent={ groupStats.attendanceRate }
                                            status="active"
                                            strokeColor="#52c41a"
                                    />
                                    <Button
                                            type="primary"
                                            style={ { marginTop: "16px" } }
                                            onClick={ handleUploadGrades }
                                            disabled={ selectedGroup.students.length === 0 } // Отключить кнопку, если
                                            // нет учеников
                                    >
                                        Загрузить оценки
                                    </Button>

                                    {/* Список учеников */ }
                                    <Card title="Список учеников" style={ { marginTop: "16px" } }>
                                        <List
                                                dataSource={ selectedGroup.students }
                                                renderItem={ (student) => (
                                                        <List.Item
                                                                onClick={ () => showModal(student) }
                                                                style={ { cursor: "pointer" } }
                                                        >
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

                {/* Модальное окно со статистикой студента */ }
                <Modal
                        title={ `${ selectedStudent } - Статистика` }
                        visible={ isModalVisible }
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
