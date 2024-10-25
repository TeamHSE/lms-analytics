"use client";

import React from "react";
import { Layout, Table, Card, Progress, Row, Col } from "antd";

const { Content } = Layout;

export default function StudentPanel() {
    // Пример данных оценок по предметам
    const subjectsData = [
        { key: "1", subject: "Математика", grade: "4" },
        { key: "2", subject: "Физика", grade: "5" },
        { key: "3", subject: "История", grade: "3" },
        { key: "4", subject: "Биология", grade: "4" },
    ];

    const studentName = "Иванов Иван Иванович"; // Имя ученика

    // Пример данных для статистики и прогресса
    const progressData = {
        overallProgress: 80,
        assignmentsCompleted: 15,
        assignmentsTotal: 20,
        attendanceRate: 90,
    };

    // Колонки для таблицы предметов и оценок
    const columns = [
        { title: "Предмет", dataIndex: "subject", key: "subject" },
        { title: "Оценка", dataIndex: "grade", key: "grade" },
    ];

    return (
            <Layout style={ { minHeight: "100vh" } }>
                <Content style={ { padding: "24px" } }>
                    <h1>Ученик: { studentName }</h1>
                    <Row gutter={ [ 16, 16 ] }>
                        {/* Таблица с предметами и оценками */ }
                        <Col span={ 12 }>
                            <Card title="Мои предметы и оценки">
                                <Table
                                        dataSource={ subjectsData }
                                        columns={ columns }
                                        pagination={ false }
                                        bordered
                                />
                            </Card>
                        </Col>

                        {/* Дашборд со статистикой и прогрессом */ }
                        <Col span={ 12 }>
                            <Card title="Моя статистика">
                                <p>Процент выполненных заданий:</p>
                                <Progress
                                        percent={ (progressData.assignmentsCompleted / progressData.assignmentsTotal) * 100 }
                                        status="active"
                                />
                                <p>Общий прогресс:</p>
                                <Progress
                                        percent={ progressData.overallProgress }
                                        status="active"
                                />
                                <p>Процент посещаемости:</p>
                                <Progress
                                        percent={ progressData.attendanceRate }
                                        status="active"
                                        strokeColor="#52c41a"
                                />
                            </Card>
                        </Col>
                    </Row>
                </Content>
            </Layout>
    );
}
