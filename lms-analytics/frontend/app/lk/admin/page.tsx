"use client";

import React, { useEffect, useState } from "react";
import { Layout, Menu, Button, Tabs, Modal, Input, List } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import LogoutButton from "@/app/lk/LogoutButton";
import { companyService } from "@/services/company.service";
import { managerService } from "@/services/manager.service";
import { ManagerResponse } from "@/types/manager.types";

const { Content, Sider } = Layout;
const { TabPane } = Tabs;

const ADMIN_ID = 1; // todo

export default function AdminPanel() {
    const [ companies, setCompanies ] = useState<Company[]>([]);
    useEffect(() => {
        companyService.getCompanies().then((companies) => setCompanies(companies));
    }, []);

    const [ activeCompany, setActiveCompany ] = useState<number | null>(null);
    const [ isModalVisible, setIsModalVisible ] = useState(false);
    const [ isManagerModalVisible, setIsManagerModalVisible ] = useState(false);
    const [ newOrgName, setNewOrgName ] = useState("");
    const [ managers, setManagers ] = useState<ManagerResponse[]>([]);

    const [ newManagerSurname, setNewManagerSurname ] = useState("");
    const [ newManagerName, setNewManagerName ] = useState("");
    const [ newManagerFatherName, setNewManagerFatherName ] = useState<string | null>(null);
    const [ newManagerEmail, setNewManagerEmail ] = useState("");

    const handleAddCompany = async () => {
        if (newOrgName.trim()) {
            let newCompany = await companyService.addCompany({ adminId: ADMIN_ID, companyName: newOrgName });
            setCompanies([ ...companies, newCompany ]);

            setNewOrgName("");
            setIsModalVisible(false);
        }
    };

    const handleAddManager = async () => {
        if (newManagerSurname.trim() && newManagerName.trim() && newManagerEmail.trim() && activeCompany !== null) {
            let newManager = await managerService.registerManager(companies[activeCompany].id, {
                adminId: ADMIN_ID,
                surname: newManagerSurname,
                name: newManagerName,
                fatherName: newManagerFatherName,
                email: newManagerEmail,
            });
            setManagers([ ...managers, newManager ]);

            setNewManagerSurname("");
            setNewManagerName("");
            setNewManagerFatherName(null);
            setNewManagerEmail("");
            setIsManagerModalVisible(false);
        }
    };

    const handleSelectCompany = async (index: number) => {
        setActiveCompany(index);
        let managers = await managerService.getManagers(companies[index].id);
        setManagers(managers);
    };

    return (
            <Layout style={ { minHeight: "100vh" } }>
                <Sider width={ 200 } className="site-layout-background" theme="light">
                    <div className="p-4">
                        <Button
                                type="primary"
                                icon={ <PlusOutlined/> }
                                onClick={ () => setIsModalVisible(true) }
                        >
                            Добавить организацию
                        </Button>
                        <LogoutButton width="80%"/>
                    </div>
                    <Menu mode="inline" defaultSelectedKeys={ [ "0" ] }>
                        { companies.map((org, index) => (
                                <Menu.Item key={ index } onClick={ () => handleSelectCompany(index) }>
                                    { org.name }
                                </Menu.Item>
                        )) }
                    </Menu>
                </Sider>
                <Layout>
                    <Content style={ { padding: "24px", minHeight: "280px" } }>
                        { activeCompany !== null && companies[activeCompany] ? (
                                <div>
                                    <h2>{ companies[activeCompany].name }</h2>
                                    <Tabs defaultActiveKey="teachers">
                                        <TabPane tab="Менеджеры" key="managers">
                                            <Button type="primary" onClick={ () => setIsManagerModalVisible(true) }
                                                    style={ { marginBottom: "1rem" } }>
                                                Добавить менеджера
                                            </Button>
                                            <List
                                                    dataSource={ managers }
                                                    renderItem={ (item) =>
                                                            <List.Item>
                                                                { item.surname } { item.name } – { item.email }
                                                            </List.Item> }
                                                    bordered
                                            />
                                        </TabPane>
                                    </Tabs>
                                </div>
                        ) : (
                                <h2>Выберите организацию</h2>
                        ) }
                    </Content>
                </Layout>

                <Modal
                        title="Добавить новую организацию"
                        open={ isModalVisible }
                        onOk={ handleAddCompany }
                        onCancel={ () => setIsModalVisible(false) }
                        cancelText="Отмена"
                >
                    <Input
                            placeholder="Название организации"
                            value={ newOrgName }
                            onChange={ (e) => setNewOrgName(e.target.value) }
                    />
                </Modal>

                <Modal
                        title="Добавить нового менеджера"
                        open={ isManagerModalVisible }
                        onOk={ () => handleAddManager() }
                        onCancel={ () => setIsManagerModalVisible(false) }
                        cancelText="Отмена"
                >
                    <Input
                            placeholder="Фамилия"
                            value={ newManagerSurname }
                            onChange={ (e) => setNewManagerSurname(e.target.value) }
                            style={ { marginBottom: "1rem" } }
                    />
                    <Input
                            placeholder="Имя"
                            value={ newManagerName }
                            onChange={ (e) => setNewManagerName(e.target.value) }
                            style={ { marginBottom: "1rem" } }
                    />
                    <Input
                            placeholder="Отчество"
                            value={ newManagerFatherName ?? "" }
                            onChange={ (e) => setNewManagerFatherName(e.target.value) }
                            style={ { marginBottom: "1rem" } }
                    />
                    <Input
                            placeholder="Email"
                            value={ newManagerEmail }
                            onChange={ (e) => setNewManagerEmail(e.target.value) }
                            style={ { marginBottom: "1rem" } }
                    />
                </Modal>
            </Layout>
    );
}