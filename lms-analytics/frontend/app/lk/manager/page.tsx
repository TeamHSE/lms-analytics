"use client";

import React, { useState, useEffect } from "react";
import { Layout, Button, Tabs, Modal, Input, List } from "antd";
import LogoutButton from "@/app/lk/LogoutButton";

const { Content, Sider } = Layout;
const { TabPane } = Tabs;

interface Organization {
    id: number;
    name: string;
    teachers: string[];
    students: string[];
}

export default function ManagerPanel() {
    const [ organizations ] = useState<Organization[]>([
        {
            id: 1,
            name: "Университет А",
            teachers: [ "Преподаватель А1", "Преподаватель А2" ],
            students: [ "Студент А1", "Студент А2", "Студент А3" ],
        },
        {
            id: 2,
            name: "Университет Б",
            teachers: [ "Преподаватель Б1" ],
            students: [ "Студент Б1", "Студент Б2" ],
        },
    ]);

    const managerOrgId = 1;
    const [ activeOrganization, setActiveOrganization ] = useState<Organization | null>(null);
    const [ isModalVisible, setIsModalVisible ] = useState<boolean>(false);
    const [ newName, setNewName ] = useState<string>("");
    const [ newType, setNewType ] = useState<"teacher" | "student">("teacher");

    useEffect(() => {
        const organization = organizations.find((org) => org.id === managerOrgId);
        setActiveOrganization(organization ?? null);
    }, [ organizations ]);

    const handleAddPerson = () => {
        if (newName.trim() && activeOrganization) {
            const updatedOrganization = { ...activeOrganization };
            const listType = newType === "teacher" ? "teachers" : "students";
            updatedOrganization[listType].push(newName);
            setActiveOrganization(updatedOrganization);
            setNewName("");
            setIsModalVisible(false);
        }
    };

    return (
            <Layout style={ { minHeight: "100vh" } }>
                <Sider width={ 200 } className="site-layout-background" theme="light">
                    <div className="p-4">
                        <h2>{ activeOrganization ? activeOrganization.name : "Организация не найдена" }</h2>
                        <LogoutButton width="80%"/>
                    </div>
                </Sider>
                <Layout>
                    <Content style={ { padding: "24px", minHeight: "280px" } }>
                        { activeOrganization && (
                                <div>
                                    <Tabs defaultActiveKey="teachers">
                                        <TabPane tab="Преподаватели" key="teachers">
                                            <List
                                                    dataSource={ activeOrganization.teachers }
                                                    renderItem={ (item) => <List.Item>{ item }</List.Item> }
                                                    bordered
                                            />
                                            <Button type="primary" onClick={ () => {
                                                setNewType("teacher");
                                                setIsModalVisible(true);
                                            } }>
                                                Добавить преподавателя
                                            </Button>
                                        </TabPane>
                                        <TabPane tab="Студенты" key="students">
                                            <List
                                                    dataSource={ activeOrganization.students }
                                                    renderItem={ (item) => <List.Item>{ item }</List.Item> }
                                                    bordered
                                            />
                                            <Button type="primary" onClick={ () => {
                                                setNewType("student");
                                                setIsModalVisible(true);
                                            } }>
                                                Добавить студента
                                            </Button>
                                        </TabPane>
                                    </Tabs>
                                </div>
                        ) }
                    </Content>
                </Layout>

                <Modal
                        title={ `Добавить нового ${ newType === "teacher" ? "преподавателя" : "студента" }` }
                        open={ isModalVisible }
                        onOk={ handleAddPerson }
                        onCancel={ () => setIsModalVisible(false) }
                >
                    <Input
                            placeholder={ `Имя ${ newType === "teacher" ? "преподавателя" : "студента" }` }
                            value={ newName }
                            onChange={ (e) => setNewName(e.target.value) }
                    />
                </Modal>
            </Layout>
    );
}