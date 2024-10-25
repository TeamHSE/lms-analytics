"use client";

import React, { useState, useEffect } from "react";
import { Layout, Button, Tabs, Modal, Input, List } from "antd";

const { Content, Sider } = Layout;
const { TabPane } = Tabs;

export default function ManagerPanel() {
    // Пример данных организаций
    const [ organizations ] = useState([
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

    // ID организации менеджера
    const managerOrgId = 1; // Здесь можно подставить динамическое значение после аутентификации
    const [ activeOrganization, setActiveOrganization ] = useState(null);
    const [ isModalVisible, setIsModalVisible ] = useState(false);
    const [ newName, setNewName ] = useState("");
    const [ newType, setNewType ] = useState("teacher");

    useEffect(() => {
        // Установим активную организацию, если ID совпадает с ID организации менеджера
        const organization = organizations.find((org) => org.id === managerOrgId);
        setActiveOrganization(organization);
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
                <Sider width={ 200 } className="site-layout-background" theme="light" collapsible={ true }>
                    <div className="p-4">
                        <h2>{ activeOrganization ? activeOrganization.name : "Организация не найдена" }</h2>
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
                        visible={ isModalVisible }
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
