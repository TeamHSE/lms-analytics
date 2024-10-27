"use client";

import React, { useState } from "react";
import { Layout, Menu } from "antd";
import LogoutButton from "@/app/lk/LogoutButton";
import StatsPanel from "@/app/lk/teacher/Stats";
import FeedbackPanel from "@/app/lk/teacher/Feedback";

const { Sider, Content } = Layout;

const TeacherPage = () => {
    const [ selectedGroup, setSelectedGroup ] = useState<StudentGroup | null>(null);
    const [ feedbackOpened, setOpenedFeedback ] = useState<boolean>(false);

    const teacherInfo: TeacherInfo = {
        fullName: "Иванов И.И.",
        organization: "Государственный университет",
    };

    const studentGroups: StudentGroup[] = [
        { id: 1, name: "Группа А", students: [ "Иванов И.И.", "Петров П.П.", "Сидоров С.С." ] },
        { id: 2, name: "Группа Б", students: [ "Алексеев А.А.", "Кузнецов К.К." ] },
        { id: 3, name: "Группа В", students: [ "Смирнова С.С.", "Романова Р.Р.", "Новиков Н.Н." ] },
    ];

    return <>
        <Layout style={ { minHeight: "100vh" } }>
            <Sider width={ 300 } style={ { background: "#fff", justifyItems: "center" } }>
                <h2 style={ { padding: "5px" } }>Группы студентов</h2>
                <Menu mode="inline" defaultSelectedKeys={ [ "0" ] }>
                    { studentGroups.map((group) => (
                            <Menu.Item key={ group.id } onClick={ () => {
                                setSelectedGroup(group);
                                setOpenedFeedback(false);
                            } }>
                                { group.name }
                            </Menu.Item>
                    )) }
                </Menu>
                <h2 style={ { padding: "5px" } }>Обратная связь</h2>
                <Menu mode="inline">
                    <Menu.Item onClick={ () => setOpenedFeedback(true) }>
                        Обратная связь
                    </Menu.Item>
                </Menu>
            </Sider>
            <Layout>
                <Content style={ { padding: "24px", paddingTop: "0" } }>
                    <h1>{ teacherInfo.organization }</h1>
                    <h2>{ teacherInfo.fullName }<LogoutButton position="relative" margin={ 5 } width={ "10%" }/></h2>
                    { feedbackOpened
                            ? <FeedbackPanel/>
                            : <StatsPanel selectedGroup={ selectedGroup }/> }
                </Content>
            </Layout>
        </Layout>
    </>;
};

export default TeacherPage;