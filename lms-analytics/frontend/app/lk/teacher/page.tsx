"use client";

import React, { useEffect, useState } from "react";
import { Layout, Menu } from "antd";
import LogoutButton from "@/app/lk/LogoutButton";
import StatsPanel from "@/app/lk/teacher/Stats";
import FeedbackPanel from "@/app/lk/teacher/Feedback";
import { StudyGroupResponse, TeacherResponse } from "@/types/manager.types";
import { managerService } from "@/services/manager.service";

const { Sider, Content } = Layout;

const TeacherPage = () => {
    const [ selectedGroup, setSelectedGroup ] = useState<StudyGroupResponse | null>(null);
    const [ feedbackOpened, setOpenedFeedback ] = useState<boolean>(false);

    const [ teacherInfo, setTeacherInfo ] = useState<TeacherResponse | null>(null);
    const [ studentGroups, setStudentGroups ] = useState<StudyGroupResponse[]>([]);

    useEffect(() => {
        managerService.getTeacher(1, 1, 1).then((teacher) => setTeacherInfo(teacher));
        managerService.getStudyGroups(1, 1).then((groups) => setStudentGroups(groups));
    }, []);

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
                                { group.program } { group.groupNumber }
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
                    <h1>{ teacherInfo?.surname } { teacherInfo?.name }</h1>
                    <h2>{ teacherInfo?.email }<LogoutButton position="relative" margin={ 5 } width={ "10%" }/></h2>
                    { feedbackOpened
                            ? <FeedbackPanel/>
                            : <StatsPanel selectedGroup={ selectedGroup }/> }
                </Content>
            </Layout>
        </Layout>
    </>;
};

export default TeacherPage;