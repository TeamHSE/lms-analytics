"use client";

import { useState } from "react";
import { Tabs, Button, Card } from "antd";
import styles from "./login.module.css";
import { useRouter } from "next/navigation";

export default function Home() {
    const [ activeTab, setActiveTab ] = useState("admin");
    const { push } = useRouter();

    const handleTabChange = (key: string) => {
        setActiveTab(key);
    };

    const redirects = {
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
            key: "admin",
            label: "Администратор",
            children: <Button type="primary" onClick={ handleLogin }>Войти как Администратор</Button>,
        },
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
    ];

    return (
            <div className={ styles.container }>
                <Card className={ styles.card } title="Вход">
                    <Tabs defaultActiveKey="admin" onChange={ handleTabChange } items={ tabItems }/>
                </Card>
            </div>
    );
}