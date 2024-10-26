"use client";

import React, { useState } from "react";
import { Layout, Table, Card, Row, Col, Select } from "antd";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, LineChart, Line, PieChart, Pie, Cell } from "recharts";
import LogoutButton from "@/app/lk/LogoutButton";

const { Content } = Layout;
const { Option } = Select;

interface SubjectData {
    key: string;
    subject: string;
    grade: string;
}

interface ProgressData {
    overallProgress: number;
    assignmentsCompleted: number;
    assignmentsTotal: number;
    attendanceRate: number;
}

export default function StudentPanel() {
    const subjectsData: SubjectData[] = [
        { key: "1", subject: "Математика", grade: "4" },
        { key: "2", subject: "Физика", grade: "5" },
        { key: "3", subject: "История", grade: "3" },
        { key: "4", subject: "Биология", grade: "4" },
    ];

    const studentName: string = "Иванов Иван Иванович";

    const progressData: ProgressData = {
        overallProgress: 80,
        assignmentsCompleted: 15,
        assignmentsTotal: 20,
        attendanceRate: 90,
    };

    const [selectedSubject, setSelectedSubject] = useState<string>("Математика");

    const handleSubjectChange = (value: string) => {
        setSelectedSubject(value);
    };

    const subjectGrades = subjectsData.map(subject => ({
        name: subject.subject,
        grade: parseInt(subject.grade),
    }));

    const attendanceData = [
        { name: "Посещено", value: progressData.attendanceRate },
        { name: "Пропущено", value: 100 - progressData.attendanceRate },
    ];

    const COLORS = ["#0088FE", "#FF8042"];

    return (
            <Layout style={{ minHeight: "100vh" }}>
                <Content style={{ padding: "24px", paddingRight: "1%" }}>
                    <div style={{ display: "flex", alignItems: "center", width: "100%" }}>
                        <h1 style={{ margin: "0", marginRight: "10px" }}>Ученик: {studentName}</h1>
                        <LogoutButton position="relative" width="10%" />
                    </div>
                    <Row gutter={[16, 16]}>
                        <Col span={12}>
                            <Card title="Мои предметы и оценки">
                                <Table
                                        dataSource={subjectsData}
                                        columns={[
                                            { title: "Предмет", dataIndex: "subject", key: "subject" },
                                            { title: "Оценка", dataIndex: "grade", key: "grade" },
                                        ]}
                                        pagination={false}
                                        bordered
                                />
                            </Card>
                        </Col>
                        <Col span={12}>
                            <Card title="Выберите предмет для статистики">
                                <Select defaultValue={selectedSubject} style={{ width: "100%" }} onChange={handleSubjectChange}>
                                    {subjectsData.map(subject => (
                                            <Option key={subject.key} value={subject.subject}>
                                                {subject.subject}
                                            </Option>
                                    ))}
                                </Select>
                            </Card>
                        </Col>
                    </Row>
                    <Row gutter={[16, 16]}>
                        <Col span={12}>
                            <Card title="Прогресс по заданиям">
                                <BarChart width={500} height={300} data={[progressData]}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="name" />
                                    <YAxis />
                                    <Tooltip />
                                    <Legend />
                                    <Bar dataKey="assignmentsCompleted" fill="#8884d8" />
                                    <Bar dataKey="assignmentsTotal" fill="#82ca9d" />
                                </BarChart>
                            </Card>
                        </Col>
                        <Col span={12}>
                            <Card title="Общий прогресс">
                                <LineChart width={500} height={300} data={[progressData]}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="name" />
                                    <YAxis />
                                    <Tooltip />
                                    <Legend />
                                    <Line type="monotone" dataKey="overallProgress" stroke="#8884d8" />
                                </LineChart>
                            </Card>
                        </Col>
                    </Row>
                    <Row gutter={[16, 16]}>
                        <Col span={12}>
                            <Card title="Посещаемость">
                                <PieChart width={400} height={400}>
                                    <Pie
                                            data={attendanceData}
                                            cx={200}
                                            cy={200}
                                            labelLine={false}
                                            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                                            outerRadius={80}
                                            fill="#8884d8"
                                            dataKey="value"
                                    >
                                        {attendanceData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                </PieChart>
                            </Card>
                        </Col>
                        <Col span={12}>
                            <Card title="Оценки по предметам">
                                <BarChart width={500} height={300} data={subjectGrades}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="name" />
                                    <YAxis />
                                    <Tooltip />
                                    <Legend />
                                    <Bar dataKey="grade" fill="#82ca9d" />
                                </BarChart>
                            </Card>
                        </Col>
                    </Row>
                </Content>
            </Layout>
    );
}