"use client";

import React, { useState } from "react";
import { Layout, Menu, Button, Tabs, Modal, Input, List } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import LogoutButton from "@/app/lk/LogoutButton";

const { Content, Sider } = Layout;
const { TabPane } = Tabs;

export default function AdminPanel() {
    const [organizations, setOrganizations] = useState([
        {
            name: "Университет А",
            teachers: ["Преподаватель А1", "Преподаватель А2"],
            managers: ["Менеджер А1"],
            disciplines: ["Математика", "Физика"],
        },
        {
            name: "Университет Б",
            teachers: ["Преподаватель Б1"],
            managers: ["Менеджер Б1", "Менеджер Б2"],
            disciplines: ["Химия", "Биология"],
        },
    ]);

    const [activeOrganization, setActiveOrganization] = useState(-1);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [newOrgName, setNewOrgName] = useState("");

    const handleAddOrganization = () => {
        if (newOrgName.trim()) {
            setOrganizations([
                ...organizations,
                { name: newOrgName, teachers: [], managers: [], disciplines: [] },
            ]);
            setNewOrgName("");
            setIsModalVisible(false);
        }
    };

    const handleSelectOrganization = (index: number) => {
        setActiveOrganization(index);
    };

    return (
            <Layout style={{ minHeight: "100vh" }}>
                <Sider width={200} className="site-layout-background" theme="light">
                    <div className="p-4">
                        <Button
                                type="primary"
                                icon={<PlusOutlined />}
                                onClick={() => setIsModalVisible(true)}
                        >
                            Добавить организацию
                        </Button>
                        <LogoutButton width="80%" />
                    </div>
                    <Menu mode="inline" defaultSelectedKeys={["0"]}>
                        {organizations.map((org, index) => (
                                <Menu.Item key={index} onClick={() => handleSelectOrganization(index)}>
                                    {org.name}
                                </Menu.Item>
                        ))}
                    </Menu>
                </Sider>
                <Layout>
                    <Content style={{ padding: "24px", minHeight: "280px" }}>
                        {activeOrganization !== null ? (
                                <div>
                                    <h2>{organizations[activeOrganization].name}</h2>
                                    <Tabs defaultActiveKey="teachers">
                                        <TabPane tab="Преподаватели" key="teachers">
                                            <List
                                                    dataSource={organizations[activeOrganization].teachers}
                                                    renderItem={(item) => <List.Item>{item}</List.Item>}
                                                    bordered
                                            />
                                        </TabPane>
                                        <TabPane tab="Менеджеры" key="managers">
                                            <List
                                                    dataSource={organizations[activeOrganization].managers}
                                                    renderItem={(item) => <List.Item>{item}</List.Item>}
                                                    bordered
                                            />
                                        </TabPane>
                                        <TabPane tab="Дисциплины" key="disciplines">
                                            <List
                                                    dataSource={organizations[activeOrganization].disciplines}
                                                    renderItem={(item) => <List.Item>{item}</List.Item>}
                                                    bordered
                                            />
                                        </TabPane>
                                    </Tabs>
                                </div>
                        ) : (
                                <h2>Выберите организацию</h2> // Подпись, если ничего не выбрано
                        )}
                    </Content>
                </Layout>

                <Modal
                        title="Добавить новую организацию"
                        open={isModalVisible}
                        onOk={handleAddOrganization}
                        onCancel={() => setIsModalVisible(false)}
                >
                    <Input
                            placeholder="Название организации"
                            value={newOrgName}
                            onChange={(e) => setNewOrgName(e.target.value)}
                    />
                </Modal>
            </Layout>
    );
}
