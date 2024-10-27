"use client";

import { useState } from "react";
import { Tabs, Button, Card } from "antd";
import styles from "./login.module.css";
import { useRouter } from "next/navigation";

type TabKey = "admin" | "teacher" | "student" | "manager";

export default function Home() {
    const [ activeTab, setActiveTab ] = useState<TabKey>("teacher");
    const { push } = useRouter();

    const handleTabChange = (key: string) => {
        setActiveTab(key as TabKey);
    };

    const redirects: Record<TabKey, string> = {
        admin: "/lk/admin",
        teacher: "/lk/teacher",
        student: "/lk/student",
        manager: "/lk/manager",
    };

    const handleLogin = () => {
        push(redirects[activeTab]);
    };

    const tabItems = [
        {
            key: "teacher",
            label: "Преподаватель",
            children: <Button type="primary" onClick={ handleLogin }>Войти как Преподаватель</Button>,
        },
        {
            key: "student",
            label: "Студент",
            children: <Button type="primary" onClick={ handleLogin }>Войти как Студент</Button>,
        },
        {
            key: "manager",
            label: "Менеджер",
            children: <Button type="primary" onClick={ handleLogin }>Войти как Менеджер</Button>,
        },
        {
            key: "admin",
            label: "Администратор",
            children: <Button type="primary" onClick={ handleLogin }>Войти как Администратор</Button>,
        },
    ];

    return (
            <div className={ styles.container }>
                <Card className={ styles.card } title="Вход">
                    <h1>LMS Analytics</h1>
                    <h3>Платформа для школьников и студентов на data-driven подходе</h3>
                    <Tabs defaultActiveKey="teacher" onChange={ handleTabChange } items={ tabItems }/>
                </Card>
            </div>
    );
}