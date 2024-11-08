"use client";

import React, { useState, useEffect } from "react";
import { Layout, Button, Tabs, Modal, Input, List, notification, Dropdown, Menu, Spin } from "antd";
import LogoutButton from "@/app/lk/LogoutButton";
import { companyService } from "@/services/company.service";
import { managerService } from "@/services/manager.service";
import { TeacherResponse, StudentResponse, StudyGroupResponse } from "@/types/manager.types";
import { DownOutlined } from "@ant-design/icons";

const { Content, Sider } = Layout;
const { TabPane } = Tabs;

export default function ManagerPanel() {
    const managerOrgId = 1;
    const [ activeCompany, setActiveCompany ] = useState<Company | null>(null);
    const [ isModalVisible, setIsModalVisible ] = useState<boolean>(false);
    const [ modalMode, setModalMode ] = useState<"add" | "edit">("add");
    const [ newType, setNewType ] = useState<"teacher" | "student">("teacher");
    const [ isGroupModalVisible, setIsGroupModalVisible ] = useState<boolean>(false);

    const [ teachers, setTeachers ] = useState<TeacherResponse[]>([]);
    const [ students, setStudents ] = useState<StudentResponse[]>([]);
    const [ groups, setGroups ] = useState<StudyGroupResponse[]>([]);

    // Преподаватели
    const [ newTeacherName, setNewTeacherName ] = useState<string>("");
    const [ newTeacherSurname, setNewTeacherSurname ] = useState<string>("");
    const [ newTeacherLastname, setNewTeacherLastname ] = useState<string>("");
    const [ newTeacherEmail, setNewTeacherEmail ] = useState<string>("");

    // Студенты
    const [ newStudentName, setNewStudentName ] = useState<string>("");
    const [ newStudentSurname, setNewStudentSurname ] = useState<string>("");
    const [ newStudentLastname, setNewStudentLastname ] = useState<string>("");
    const [ newStudentEmail, setNewStudentEmail ] = useState<string>("");
    const [ newStudentGroup, setNewStudentGroup ] = useState<StudyGroupResponse | null>(null);

    const [ editId, setEditId ] = useState<number | null>(null);
    const currentYear = new Date().getFullYear();
    const [ newGroupProgram, setNewGroupProgram ] = useState<string>("");
    const [ newGroupNumber, setNewGroupNumber ] = useState<string>("");
    const [ newGroupAdmissionYear, setNewGroupAdmissionYear ] = useState<number>(currentYear);
    const years = Array.from({ length: currentYear - 2019 }, (_, i) => 2020 + i);

    useEffect(() => {
        companyService.getCompany(managerOrgId).then(setActiveCompany);
        loadTeachers();
        loadStudents();
        loadGroups();
    }, []);

    const loadTeachers = async () => {
        const teacherList = await managerService.getTeachers(managerOrgId, 1);
        setTeachers(teacherList);
    };

    const loadStudents = async () => {
        const studentList = await managerService.getStudents(managerOrgId, 1);
        setStudents(studentList);
    };

    const loadGroups = async () => {
        const groupList = await managerService.getStudyGroups(managerOrgId, 1);
        setGroups(groupList);
    };

    // Обработчики для преподавателей
    const handleAddTeacher = async () => {
        if (newTeacherName.trim() && newTeacherSurname.trim() && newTeacherEmail.trim()) {
            try {
                const newTeacher = await managerService.registerTeacher(managerOrgId, 1, {
                    surname: newTeacherSurname,
                    name: newTeacherName,
                    fatherName: newTeacherLastname,
                    email: newTeacherEmail,
                });
                setTeachers([ ...teachers, newTeacher ]);
                notification.success({ message: "Новый преподаватель успешно добавлен" });
            } catch (error: any) {
                notification.error({
                    message: "Ошибка при добавлении преподавателя",
                    description: error?.message ?? "Неизвестная ошибка",
                });
            }
            resetModal();
        }
    };

    const handleEditTeacher = async () => {
        if (editId && newTeacherName.trim() && newTeacherSurname.trim() && newTeacherEmail.trim()) {
            try {
                const updatedTeacher = {
                    surname: newTeacherSurname,
                    name: newTeacherName,
                    fatherName: newTeacherLastname,
                    email: newTeacherEmail,
                };
                let updated = await managerService.updateTeacher(1, managerOrgId, editId, updatedTeacher);
                setTeachers(teachers.map(t => t.id === editId ? { ...t, ...updated } : t));
                notification.success({ message: "Преподаватель успешно обновлен" });
            } catch (error: any) {
                notification.error({
                    message: "Ошибка при редактировании преподавателя",
                    description: error?.message ?? "Неизвестная ошибка",
                });
            }
            resetModal();
        }
    };

    // Обработчики для студентов
    const handleAddStudent = async () => {
        if (newStudentName.trim() && newStudentSurname.trim() && newStudentEmail.trim() && newStudentGroup) {
            try {
                const newStudent = await managerService.registerStudent(managerOrgId, 1, {
                    surname: newStudentSurname,
                    name: newStudentName,
                    fatherName: newStudentLastname,
                    email: newStudentEmail,
                    studyGroupId: newStudentGroup.id, // Используем выбранную группу
                });
                setStudents([ ...students, newStudent ]);
                notification.success({ message: "Новый студент успешно добавлен" });
            } catch (error: any) {
                notification.error({
                    message: "Ошибка при добавлении студента",
                    description: error?.message ?? "Неизвестная ошибка",
                });
            }
            resetModal();
        }
    };

    const handleEditStudent = async () => {
        if (editId && newStudentName.trim() && newStudentSurname.trim() && newStudentEmail.trim() && newStudentGroup) {
            try {
                const updatedStudent = {
                    surname: newStudentSurname,
                    name: newStudentName,
                    fatherName: newStudentLastname,
                    email: newStudentEmail,
                    studyGroupId: newStudentGroup.id, // Используем выбранную группу
                };
                let updated = await managerService.updateStudent(1, managerOrgId, editId, updatedStudent);
                setStudents(students.map(s => s.id === editId ? { ...s, ...updated } : s));
                notification.success({ message: "Студент успешно обновлен" });
            } catch (error: any) {
                notification.error({
                    message: "Ошибка при редактировании студента",
                    description: error?.message ?? "Неизвестная ошибка",
                });
            }
            resetModal();
        }
    };

    const resetModal = () => {
        setIsModalVisible(false);
        setNewTeacherName("");
        setNewTeacherSurname("");
        setNewTeacherLastname("");
        setNewTeacherEmail("");
        setNewStudentName("");
        setNewStudentSurname("");
        setNewStudentLastname("");
        setNewStudentEmail("");
        setNewStudentGroup(null);
        setEditId(null);
        setModalMode("add");
    };

    const openEditTeacherModal = (teacher: TeacherResponse) => {
        setNewType("teacher");
        setModalMode("edit");
        setEditId(teacher.id);
        setNewTeacherSurname(teacher.surname);
        setNewTeacherName(teacher.name);
        setNewTeacherLastname(teacher.fatherName ?? "");
        setNewTeacherEmail(teacher.email);
        setIsModalVisible(true);
    };

    const openEditStudentModal = (student: StudentResponse) => {
        setNewType("student");
        setModalMode("edit");
        setEditId(student.id);
        setNewStudentSurname(student.surname);
        setNewStudentName(student.name);
        setNewStudentLastname(student.fatherName ?? "");
        setNewStudentEmail(student.email);
        setNewStudentGroup(groups.find(group => group.id === student.studyGroupId) || null);
        setIsModalVisible(true);
    };

    const openAddTeacherModal = () => {
        setNewType("teacher");
        setModalMode("add");
        setIsModalVisible(true);
    };

    const openAddStudentModal = () => {
        setNewType("student");
        setModalMode("add");
        setIsModalVisible(true);
    };

    return (
            <Layout style={ { minHeight: "100vh" } }>
                <Sider width={ 200 } className="site-layout-background" theme="light">
                    <div className="p-4">
                        <h2 style={ { textAlign: "center" } }>{ activeCompany ? activeCompany.name : <Spin/> }</h2>
                        <LogoutButton width="80%"/>
                    </div>
                </Sider>
                <Layout>
                    <Content style={ { padding: "24px", minHeight: "280px" } }>
                        <Tabs defaultActiveKey="teachers" tabPosition="left">
                            <TabPane tab="Преподаватели" key="teachers">
                                <Button type="primary" onClick={ openAddTeacherModal }>Добавить преподавателя</Button>
                                <List
                                        itemLayout="horizontal"
                                        dataSource={ teachers }
                                        renderItem={ (teacher) => (
                                                <List.Item
                                                        actions={ [
                                                            <Button type="link"
                                                                    onClick={ () => openEditTeacherModal(teacher) }>Редактировать</Button>,
                                                        ] }
                                                >
                                                    <List.Item.Meta
                                                            title={ `${ teacher.surname } ${ teacher.name }` }
                                                            description={ teacher.email }
                                                    />
                                                </List.Item>
                                        ) }
                                />
                            </TabPane>
                            <TabPane tab="Студенты" key="students">
                                <Button type="primary" onClick={ openAddStudentModal }>Добавить студента</Button>
                                <List
                                        itemLayout="horizontal"
                                        dataSource={ students }
                                        renderItem={ (student) => (
                                                <List.Item
                                                        actions={ [
                                                            <Button type="link"
                                                                    onClick={ () => openEditStudentModal(student) }>Редактировать</Button>,
                                                        ] }
                                                >
                                                    <List.Item.Meta
                                                            title={ `${ student.surname } ${ student.name }` }
                                                            description={ student.email }
                                                    />
                                                </List.Item>
                                        ) }
                                />
                            </TabPane>
                        </Tabs>

                        {/* Модальное окно */ }
                        <Modal
                                title={ modalMode === "add" ? `Добавить ${ newType === "teacher" ? "преподавателя" : "студента" }` : `Редактировать ${ newType === "teacher" ? "преподавателя" : "студента" }` }
                                visible={ isModalVisible }
                                onCancel={ resetModal }
                                onOk={ newType === "teacher" ? (modalMode === "add" ? handleAddTeacher : handleEditTeacher) : (modalMode === "add" ? handleAddStudent : handleEditStudent) }
                        >
                            { newType === "teacher" ? (
                                    <div>
                                        <Input placeholder="Фамилия" value={ newTeacherSurname }
                                               onChange={ (e) => setNewTeacherSurname(e.target.value) }/>
                                        <Input placeholder="Имя" value={ newTeacherName }
                                               onChange={ (e) => setNewTeacherName(e.target.value) }/>
                                        <Input placeholder="Отчество" value={ newTeacherLastname }
                                               onChange={ (e) => setNewTeacherLastname(e.target.value) }/>
                                        <Input placeholder="Email" value={ newTeacherEmail }
                                               onChange={ (e) => setNewTeacherEmail(e.target.value) }/>
                                    </div>
                            ) : (
                                    <div>
                                        <Input placeholder="Фамилия" value={ newStudentSurname }
                                               onChange={ (e) => setNewStudentSurname(e.target.value) }/>
                                        <Input placeholder="Имя" value={ newStudentName }
                                               onChange={ (e) => setNewStudentName(e.target.value) }/>
                                        <Input placeholder="Отчество" value={ newStudentLastname }
                                               onChange={ (e) => setNewStudentLastname(e.target.value) }/>
                                        <Input placeholder="Email" value={ newStudentEmail }
                                               onChange={ (e) => setNewStudentEmail(e.target.value) }/>
                                        <Dropdown
                                                overlay={ <Menu>
                                                    { groups.map(group => (
                                                            <Menu.Item key={ group.id }
                                                                       onClick={ () => setNewStudentGroup(group) }>
                                                                { group.program } { group.groupNumber }
                                                            </Menu.Item>
                                                    )) }
                                                </Menu> }
                                        >
                                            <Button>Выберите группу <DownOutlined/></Button>
                                        </Dropdown>
                                    </div>
                            ) }
                        </Modal>
                    </Content>
                </Layout>
            </Layout>
    );
}
