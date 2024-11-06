"use client";

import React, { useState, useEffect } from "react";
import { Layout, Button, Tabs, Modal, Input, List, notification, Popconfirm } from "antd";
import LogoutButton from "@/app/lk/LogoutButton";
import { companyService } from "@/services/company.service";
import { managerService } from "@/services/manager.service";
import { TeacherResponse, StudentResponse, Company } from "@/types/manager.types";

const { Content, Sider } = Layout;
const { TabPane } = Tabs;

export default function ManagerPanel() {
    const managerOrgId = 1;
    const [ activeCompany, setActiveCompany ] = useState<Company | null>(null);
    const [ isModalVisible, setIsModalVisible ] = useState<boolean>(false);
    const [ modalMode, setModalMode ] = useState<"add" | "edit">("add");
    const [ newType, setNewType ] = useState<"teacher" | "student">("teacher");

    const [ teachers, setTeachers ] = useState<TeacherResponse[]>([]);
    const [ students, setStudents ] = useState<StudentResponse[]>([]);

    const [ newSurname, setNewSurname ] = useState<string>("");
    const [ newName, setNewName ] = useState<string>("");
    const [ newLastname, setNewLastname ] = useState<string>("");
    const [ newEmail, setNewEmail ] = useState<string>("");
    const [ editId, setEditId ] = useState<number | null>(null);

    // Загрузка данных преподавателей и студентов при монтировании компонента
    useEffect(() => {
        companyService.getCompany(managerOrgId).then(setActiveCompany);
        loadTeachers();
        loadStudents();
    }, []);

    const loadTeachers = async () => {
        const teacherList = await managerService.getTeachers(managerOrgId, 1);
        setTeachers(teacherList);
    };

    const loadStudents = async () => {
        const studentList = await managerService.getStudents(managerOrgId, 1);
        setStudents(studentList);
    };

    const handleAddPerson = async () => {
        if (newName.trim() && newSurname.trim() && newEmail.trim() && activeCompany !== null) {
            try {
                let newPerson;
                if (newType === "teacher") {
                    newPerson = await managerService.registerTeacher(managerOrgId, 1, {
                        surname: newSurname,
                        name: newName,
                        fatherName: newLastname,
                        email: newEmail,
                    });
                    setTeachers([ ...teachers, newPerson ]);
                } else {
                    newPerson = await managerService.registerStudent(managerOrgId, 1, {
                        surname: newSurname,
                        name: newName,
                        fatherName: newLastname,
                        email: newEmail,
                    });
                    setStudents([ ...students, newPerson ]);
                }
                notification.success({ message: `Новый ${ newType === "teacher" ? "преподаватель" : "студент" } успешно добавлен` });
            } catch (error) {
                notification.error({
                    message: `Ошибка при добавлении ${ newType === "teacher" ? "преподавателя" : "студента" }`,
                    description: error?.message ?? "Неизвестная ошибка",
                });
            }
            resetModal();
        }
    };

    const handleEditPerson = async () => {
        if (editId && newName.trim() && newSurname.trim() && newEmail.trim()) {
            try {
                const updatedPerson = {
                    surname: newSurname,
                    name: newName,
                    fatherName: newLastname,
                    email: newEmail,
                };
                if (newType === "teacher") {
                    let updatedTeacher = await managerService.updateTeacher(1, managerOrgId, editId, updatedPerson);
                    setTeachers(teachers.map(t => t.id === editId ? { ...t, ...updatedTeacher } : t));
                } else {
                    await managerService.updateStudent(managerOrgId, editId, updatedPerson);
                    setStudents(students.map(s => s.id === editId ? { ...s, ...updatedPerson } : s));
                }
                notification.success({ message: `${ newType === "teacher" ? "Преподаватель" : "Студент" } успешно обновлен` });
            } catch (error) {
                notification.error({
                    message: `Ошибка при редактировании ${ newType === "teacher" ? "преподавателя" : "студента" }`,
                    description: error?.message ?? "Неизвестная ошибка",
                });
            }
            resetModal();
        }
    };
    
    const handleDeleteTeacher = async (teacherId: number) => {
        try {
            await managerService.deleteTeacher(managerOrgId, 1, teacherId);
            setTeachers(teachers.filter(t => t.id !== teacherId));
            notification.success({ message: "Преподаватель успешно удален" });
        } catch (error) {
            notification.error({
                message: "Ошибка при удалении преподавателя",
                description: error?.message ?? "Неизвестная ошибка",
            });
        }
    };

    const openEditModal = (type: "teacher" | "student", person: TeacherResponse | StudentResponse) => {
        setNewType(type);
        setModalMode("edit");
        setEditId(person.id);
        setNewSurname(person.surname);
        setNewName(person.name);
        setNewLastname(person.fatherName);
        setNewEmail(person.email);
        setIsModalVisible(true);
    };

    const resetModal = () => {
        setIsModalVisible(false);
        setNewSurname("");
        setNewName("");
        setNewLastname("");
        setNewEmail("");
        setEditId(null);
        setModalMode("add");
    };

    return (
            <Layout style={ { minHeight: "100vh" } }>
                <Sider width={ 200 } className="site-layout-background" theme="light">
                    <div className="p-4">
                        <h2>{ activeCompany ? activeCompany.name : "Организация не найдена" }</h2>
                        <LogoutButton width="80%"/>
                    </div>
                </Sider>
                <Layout>
                    <Content style={ { padding: "24px", minHeight: "280px" } }>
                        { activeCompany && (
                                <Tabs defaultActiveKey="teachers">
                                    <TabPane tab="Преподаватели" key="teachers">
                                        <Button
                                                type="primary"
                                                onClick={ () => {
                                                    setNewType("teacher");
                                                    setModalMode("add");
                                                    setIsModalVisible(true);
                                                } }
                                                style={ { marginBottom: "1rem" } }
                                        >
                                            Добавить преподавателя
                                        </Button>
                                        <List
                                                dataSource={ teachers }
                                                renderItem={ (item) => (
                                                        <List.Item
                                                                actions={ [
                                                                    <a key="edit"
                                                                       onClick={ () => openEditModal("teacher", item) }>Редактировать</a>,
                                                                    <Popconfirm
                                                                            title="Вы уверены, что хотите удалить преподавателя?"
                                                                            onConfirm={ () => handleDeleteTeacher(item.id) }
                                                                            okText="Да"
                                                                            cancelText="Нет"
                                                                    >
                                                                        <a>Удалить</a>
                                                                    </Popconfirm>,
                                                                ] }
                                                        >
                                                            { `${ item.surname } ${ item.name } ${ item.fatherName } – ${ item.email }` }
                                                        </List.Item>
                                                ) }
                                                bordered
                                        />
                                    </TabPane>
                                    <TabPane tab="Студенты" key="students">
                                        <Button
                                                type="primary"
                                                onClick={ () => {
                                                    setNewType("student");
                                                    setModalMode("add");
                                                    setIsModalVisible(true);
                                                } }
                                                style={ { marginBottom: "1rem" } }
                                        >
                                            Добавить студента
                                        </Button>
                                        <List
                                                dataSource={ students }
                                                renderItem={ (item) => (
                                                        <List.Item
                                                                actions={ [
                                                                    <a key="edit"
                                                                       onClick={ () => openEditModal("student", item) }>Редактировать</a>,
                                                                    <Popconfirm
                                                                            title="Вы уверены, что хотите удалить студента?"
                                                                            onConfirm={ () => handleDeleteStudent(item.id) }
                                                                            okText="Да"
                                                                            cancelText="Нет"
                                                                    >
                                                                        <a>Удалить</a>
                                                                    </Popconfirm>,
                                                                ] }
                                                        >
                                                            { `${ item.surname } ${ item.name } ${ item.fatherName } – ${ item.email }` }
                                                        </List.Item>
                                                ) }
                                                bordered
                                        />
                                    </TabPane>
                                </Tabs>
                        ) }
                    </Content>
                </Layout>

                {/* Модальное окно для добавления и редактирования преподавателей/студентов */ }
                <Modal
                        title={ `${ modalMode === "add" ? "Добавить" : "Редактировать" } ${ newType === "teacher" ? "преподавателя" : "студента" }` }
                        open={ isModalVisible }
                        onOk={ modalMode === "add" ? handleAddPerson : handleEditPerson }
                        onCancel={ resetModal }
                        cancelText="Отмена"
                >
                    <Input placeholder="Фамилия" value={ newSurname } onChange={ (e) => setNewSurname(e.target.value) }
                           style={ { marginBottom: "1rem" } }/>
                    <Input placeholder="Имя" value={ newName } onChange={ (e) => setNewName(e.target.value) }
                           style={ { marginBottom: "1rem" } }/>
                    <Input placeholder="Отчество" value={ newLastname }
                           onChange={ (e) => setNewLastname(e.target.value) } style={ { marginBottom: "1rem" } }/>
                    <Input placeholder="Email" value={ newEmail } onChange={ (e) => setNewEmail(e.target.value) }
                           style={ { marginBottom: "1rem" } }/>
                </Modal>
            </Layout>
    );
}
