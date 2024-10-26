"use client";

import React, { useState } from "react";
import { Layout, Menu } from "antd";
import LogoutButton from "@/app/lk/LogoutButton";
import StatsPage from "./Stats";
import FeedbackPage from "./Feedback";

const { Sider, Content } = Layout;

export default function StudentPanel() {
    const [ feedbackOpened, setOpenedFeedback ] = useState<boolean>(false);
    const studentName: string = "Иванов Иван Иванович";

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
                                Ученик: { studentName }
                                <LogoutButton position="relative" width="10%"/>
                            </h1>
                            { feedbackOpened
                                    ? <FeedbackPage/>
                                    : <StatsPage/> }
                        </Content>
                    </Layout>
                </Layout>
            </>
    );
}