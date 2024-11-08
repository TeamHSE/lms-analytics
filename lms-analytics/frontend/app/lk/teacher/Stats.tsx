"use client";

import React, { useEffect, useState } from "react";
import { List, Card, Progress, Button, Modal, DatePicker } from "antd";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, LineChart, Line, Legend } from "recharts";
import * as StudentStats from "@/app/lk/student/Stats";
import { StudentResponse, StudyGroupResponse } from "@/types/manager.types";
import { managerService } from "@/services/manager.service";

interface StatsPanelProps {
    selectedGroup?: StudyGroupResponse | null;
}

export default function StatsPanel({ selectedGroup }: StatsPanelProps) {
    const [ isModalVisible, setIsModalVisible ] = useState<boolean>(false);
    const [ selectedStudent, setSelectedStudent ] = useState<StudentResponse | null>(null);
    const [ students, setStudents ] = useState<StudentResponse[]>([]);
    const [ barChartData, setBarChartData ] = useState([
        { subject: "Математика", averageGrade: 4.5 },
        { subject: "Физика", averageGrade: 3.8 },
        { subject: "История", averageGrade: 4.0 },
        { subject: "Химия", averageGrade: 4.2 },
        { subject: "Биология", averageGrade: 3.9 },
        { subject: "География", averageGrade: 4.1 },
    ]);

    const [ groupStats, setGroupStats ] = useState<GroupStats>({
        averageGrade: Math.random() * 5,
        assignmentsCompletedRate: Math.random() * 100,
        attendanceRate: Math.random() * 100,
    });

    useEffect(() => {
        managerService.getStudents(1, 1).then((students) => setStudents(students));
    }, []);

    const handleUploadGrades = () => {
        handleDateChange();
    };

    const showModal = (student: StudentResponse) => {
        setSelectedStudent(student);
        setIsModalVisible(true);
    };

    const handleModalClose = () => {
        setIsModalVisible(false);
        setSelectedStudent(null);
    };

    const handleDateChange = () => {
        const newBarChartData = barChartData.map((data) => ({
            ...data,
            averageGrade: Math.random() * 5,
        }));
        setBarChartData(newBarChartData);
        setGroupStats({
            averageGrade: Math.random() * 5,
            assignmentsCompletedRate: Math.random() * 100,
            attendanceRate: Math.random() * 100,
        });
    };

    // noinspection NonAsciiCharacters
    const lineChartData = [
        { month: "Янв", Математика: 4.2, Физика: 3.8, История: 4.0, Химия: 4.1, Биология: 3.9, География: 4.0 },
        { month: "Фев", Математика: 4.3, Физика: 3.9, История: 4.1, Химия: 4.2, Биология: 4.0, География: 4.1 },
        { month: "Мар", Математика: 4.4, Физика: 4.0, История: 4.2, Химия: 4.3, Биология: 4.1, География: 4.2 },
        { month: "Апр", Математика: 4.5, Физика: 4.1, История: 4.3, Химия: 4.4, Биология: 4.2, География: 4.3 },
        { month: "Май", Математика: 4.6, Физика: 4.2, История: 4.4, Химия: 4.5, Биология: 4.3, География: 4.4 },
        { month: "Июн", Математика: 4.7, Физика: 4.3, История: 4.5, Химия: 4.6, Биология: 4.4, География: 4.5 },
        { month: "Июл", Математика: 4.8, Физика: 4.4, История: 4.6, Химия: 4.7, Биология: 4.5, География: 4.6 },
        { month: "Авг", Математика: 4.9, Физика: 4.5, История: 4.7, Химия: 4.8, Биология: 4.6, География: 4.7 },
        { month: "Сен", Математика: 5.0, Физика: 4.6, История: 4.8, Химия: 4.9, Биология: 4.7, География: 4.8 },
        { month: "Окт", Математика: 5.0, Физика: 4.7, История: 4.9, Химия: 5.0, Биология: 4.8, География: 4.9 },
        { month: "Ноя", Математика: 5.0, Физика: 4.8, История: 5.0, Химия: 5.0, Биология: 4.9, География: 5.0 },
        { month: "Дек", Математика: 5.0, Физика: 4.9, История: 5.0, Химия: 5.0, Биология: 5.0, География: 5.0 },
    ];

    return (
            <>
                { selectedGroup ? (
                        <Card title={ `Статистика для ${ selectedGroup.groupNumber }` }>
                            <p>Средняя оценка группы:</p>
                            <Progress
                                    percent={ (groupStats.averageGrade / 5) * 100 }
                                    status="active"
                                    format={ (percent) => `${ ((percent ?? 0) * 5) / 100 }` }
                            />
                            <p>Процент выполненных заданий:</p>
                            <Progress percent={ groupStats.assignmentsCompletedRate } status="active"/>
                            <p>Процент посещаемости:</p>
                            <Progress percent={ groupStats.attendanceRate } status="active" strokeColor="#52c41a"/>
                            <Button
                                    type="primary"
                                    style={ { marginTop: "16px" } }
                                    onClick={ handleUploadGrades }
                                    disabled={ students.length === 0 }
                            >
                                Загрузить оценки
                            </Button>
                            <Card title="Список учеников" style={ { marginTop: "16px" } }>
                                <List
                                        dataSource={ students }
                                        renderItem={ (student) => (
                                                <List.Item onClick={ () => showModal(student) }
                                                           style={ { cursor: "pointer" } }>
                                                    { student.surname } { student.name } | { student.email }
                                                </List.Item>
                                        ) }
                                        bordered
                                />
                            </Card>
                            <DatePicker onChange={ handleDateChange } style={ { marginTop: "16px" } }/>
                            <BarChart width={ 600 } height={ 300 } data={ barChartData }
                                      style={ { marginTop: "16px" } }>
                                <CartesianGrid strokeDasharray="3 3"/>
                                <XAxis dataKey="subject"/>
                                <YAxis/>
                                <Tooltip/>
                                <Bar dataKey="averageGrade" fill="#8884d8"/>
                            </BarChart>
                            <LineChart width={ 1000 } height={ 400 } data={ lineChartData }
                                       style={ { marginTop: "16px" } }>
                                <CartesianGrid strokeDasharray="3 3"/>
                                <XAxis dataKey="month"/>
                                <YAxis/>
                                <Tooltip/>
                                <Legend/>
                                <Line type="monotone" dataKey="Математика" stroke="#8884d8"/>
                                <Line type="monotone" dataKey="Физика" stroke="#82ca9d"/>
                                <Line type="monotone" dataKey="История" stroke="#ffc658"/>
                            </LineChart>
                        </Card>
                ) : (
                        <Card title="Выберите группу для просмотра статистики">
                            <p>Нажмите на группу, чтобы увидеть подробную статистику, аналитику успеваемости и список
                               учеников.</p>
                        </Card>
                ) }

                <Modal
                        title={ `${ selectedStudent?.surname } ${ selectedStudent?.name } - Статистика` }
                        open={ isModalVisible }
                        onCancel={ handleModalClose }
                        footer={ null }
                        cancelText="Отмена"
                        width={ "80%" }
                >
                    <StudentStats.default/>
                </Modal>
            </>
    );
}