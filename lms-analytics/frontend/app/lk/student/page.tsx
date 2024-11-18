"use client";

import React, { useEffect, useState } from "react";
import { Layout, Menu } from "antd";
import LogoutButton from "@/app/lk/LogoutButton";
import StatsPage from "./Stats";
import FeedbackPage from "./Feedback";
import { StudentResponse } from "@/types/manager.types";
import { managerService } from "@/services/manager.service";

const { Sider, Content } = Layout;

export default function StudentPanel() {
    const [ feedbackOpened, setOpenedFeedback ] = useState<boolean>(false);
    const [ student, setStudent ] = useState<StudentResponse>();

    const fetchStudent = async () => {
        managerService.getStudent(1, 1, 1).then((student) => setStudent(student));
    };

    useEffect(() => {
        fetchStudent();
    }, []);

    return (
            <>
                <Layout style={ { minHeight: "100vh" } }>
                    <Sider width={ 300 } style={ { background: "#fff", justifyItems: "center" } }>
                        <h2 style={ { padding: "5px" } }>Ваше пространство</h2>
                        <Menu mode="inline" defaultSelectedKeys={ [ "0" ] }>
                            <Menu.Item onClick={ () => setOpenedFeedback(false) }>
                                Статистика
                            </Menu.Item>
                            <Menu.Item onClick={ () => setOpenedFeedback(true) }>
                                Обратная связь
                            </Menu.Item>
                        </Menu>
                    </Sider>
                    <Layout>
                        <Content style={ { padding: "24px", paddingRight: "1%" } }>
                            <h1 style={ { margin: "0px" } }>
                                Ученик: { student?.surname } { student?.name }
                                <LogoutButton position="relative" width="10%"/>
                            </h1>
                            { feedbackOpened
                                    ? <FeedbackPage student={ student }/>
                                    : <StatsPage student={ student }/> }
                        </Content>
                    </Layout>
                </Layout>
            </>
    );
}