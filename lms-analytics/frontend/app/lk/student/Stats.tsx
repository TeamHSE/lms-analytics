import React from "react";
import { Card, Col, Row, Table } from "antd";
import {
    Bar,
    BarChart,
    CartesianGrid,
    Cell,
    Legend,
    Line,
    LineChart,
    Pie,
    PieChart,
    Tooltip,
    XAxis,
    YAxis,
} from "recharts";
import "./StatsPage.css";

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

const StatsPage = () => {
    const COLORS = [ "#0088FE", "#00C49F", "#FFBB28", "#FF8042" ];

    const subjectsData: SubjectData[] = [
        { key: "1", subject: "Математика", grade: "4" },
        { key: "2", subject: "Физика", grade: "5" },
        { key: "3", subject: "История", grade: "3" },
        { key: "4", subject: "Биология", grade: "4" },
        { key: "5", subject: "Химия", grade: "5" },
        { key: "6", subject: "География", grade: "4" },
    ];

    const progressData: ProgressData = {
        overallProgress: 80,
        assignmentsCompleted: 15,
        assignmentsTotal: 20,
        attendanceRate: 90,
    };

    const attendanceData = [
        { name: "Посещено", value: progressData.attendanceRate },
        { name: "Пропущено", value: 100 - progressData.attendanceRate },
    ];

    const monthlyProgressData = [
        { month: "Янв", progress: 70 },
        { month: "Фев", progress: 75 },
        { month: "Мар", progress: 80 },
        { month: "Апр", progress: 85 },
        { month: "Май", progress: 90 },
        { month: "Июн", progress: 95 },
        { month: "Июл", progress: 100 },
    ];

    return (
            <>
                <Row gutter={ [ 16, 16 ] } className="card-grid">
                    <Col span={ 12 }>
                        <Card title="Мои предметы и оценки" className="custom-card">
                            <Table
                                    dataSource={ subjectsData }
                                    columns={ [
                                        { title: "Предмет", dataIndex: "subject", key: "subject" },
                                        { title: "Оценка", dataIndex: "grade", key: "grade" },
                                    ] }
                                    pagination={ false }
                                    bordered
                            />
                        </Card>
                    </Col>
                    <Col span={ 12 }>
                        <Card title="Прогресс по заданиям" className="custom-card">
                            <BarChart width={ 500 } height={ 300 } data={ [ progressData ] }>
                                <CartesianGrid strokeDasharray="3 3"/>
                                <XAxis dataKey="name"/>
                                <YAxis/>
                                <Tooltip/>
                                <Legend/>
                                <Bar dataKey="assignmentsCompleted" fill="#8884d8"/>
                                <Bar dataKey="assignmentsTotal" fill="#82ca9d"/>
                            </BarChart>
                        </Card>
                    </Col>
                </Row>
                <Row gutter={ [ 16, 16 ] } className="card-grid">
                    <Col span={ 12 }>
                        <Card title="Общий прогресс" className="custom-card">
                            <LineChart width={ 500 } height={ 300 } data={ [ progressData ] }>
                                <CartesianGrid strokeDasharray="3 3"/>
                                <XAxis dataKey="name"/>
                                <YAxis/>
                                <Tooltip/>
                                <Legend/>
                                <Line type="monotone" dataKey="overallProgress" stroke="#8884d8"/>
                            </LineChart>
                        </Card>
                    </Col>
                    <Col span={ 12 }>
                        <Card title="Посещаемость" className="custom-card">
                            <PieChart width={ 400 } height={ 400 }>
                                <Pie
                                        data={ attendanceData }
                                        cx={ 200 }
                                        cy={ 200 }
                                        labelLine={ false }
                                        label={ ({ name, percent }) => `${ name }: ${ (percent * 100).toFixed(0) }%` }
                                        outerRadius={ 80 }
                                        fill="#8884d8"
                                        dataKey="value"
                                >
                                    { attendanceData.map((_, index) => (
                                            <Cell key={ `cell-${ index }` } fill={ COLORS[index % COLORS.length] }/>
                                    )) }
                                </Pie>
                                <Tooltip/>
                            </PieChart>
                        </Card>
                    </Col>
                </Row>
                <Row gutter={ [ 16, 16 ] } className="card-grid">
                    <Col span={ 24 }>
                        <Card title="Ежемесячный прогресс" className="custom-card">
                            <LineChart width={ 1000 } height={ 400 } data={ monthlyProgressData }>
                                <CartesianGrid strokeDasharray="3 3"/>
                                <XAxis dataKey="month"/>
                                <YAxis/>
                                <Tooltip/>
                                <Legend/>
                                <Line type="monotone" dataKey="progress" stroke="#8884d8"/>
                            </LineChart>
                        </Card>
                    </Col>
                </Row>
            </>
    );
};

export default StatsPage;