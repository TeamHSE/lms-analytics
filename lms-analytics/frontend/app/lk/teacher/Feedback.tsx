"use client";

import React, { useState } from "react";
import { List, Button, Modal, Input, Tabs, Select } from "antd";

const { TabPane } = Tabs;

const FeedbackPage = () => {
    const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
    const [feedbackText, setFeedbackText] = useState<string>("");
    const [selectedStudent, setSelectedStudent] = useState<string | undefined>(undefined);

    const receivedFeedback = [
        { id: 1, student: "Иванов И.И.", feedback: "Интересная лекция!" },
        { id: 2, student: "Петров П.П.", feedback: "Побольше бы примеров" },
    ];

    const sentFeedbacks = [
        { id: 1, student: "Сидоров С.С.", feedback: "Хорошо написал тест" },
        { id: 2, student: "Алексеев А.А.", feedback: "Низкое посещение занятий" },
    ];
    const [sentFeedback, setSentFeedback] = useState(sentFeedbacks);

    const handleSendFeedback = () => {
        if (selectedStudent) {
            console.log("Отправляется обратная связь:", feedbackText);
            setSentFeedback([
                ...sentFeedback,
                { id: sentFeedback.length + 1, student: selectedStudent, feedback: feedbackText },
            ]);
            setIsModalVisible(false);
            setFeedbackText("");
            setSelectedStudent(undefined);
        } else {
            console.log("Выберите студента для отправки обратной связи");
        }
    };

    return (
            <>
                <h1>Обратная связь</h1>
                <Tabs defaultActiveKey="1">
                    <TabPane tab="Полученная обратная связь" key="1">
                        <List
                                header={<div>Полученная обратная связь</div>}
                                bordered
                                dataSource={receivedFeedback}
                                renderItem={item => (
                                        <List.Item>
                                            <strong>{item.student}:</strong> {item.feedback}
                                        </List.Item>
                                )}
                        />
                    </TabPane>
                    <TabPane tab="Отправленная обратная связь" key="2">
                        <List
                                header={<div>Отправленная обратная связь</div>}
                                bordered
                                dataSource={sentFeedback}
                                renderItem={item => (
                                        <List.Item>
                                            <strong>{item.student}:</strong> {item.feedback}
                                        </List.Item>
                                )}
                        />
                    </TabPane>
                </Tabs>
                <Button type="primary" onClick={() => setIsModalVisible(true)} style={{ top: "1%" }}>
                    Отправить обратную связь
                </Button>
                <Modal
                        title="Отправить обратную связь"
                        open={isModalVisible}
                        onCancel={() => setIsModalVisible(false)}
                        onOk={handleSendFeedback}
                        okText="Отправить"
                        cancelText="Отмена"
                >
                    <Input.TextArea
                            rows={4}
                            value={feedbackText}
                            onChange={(e) => setFeedbackText(e.target.value)}
                            placeholder="Напишите Вашу обратную связь"
                    />
                    <Select
                            style={{ width: "100%", marginTop: "16px" }}
                            placeholder="Выберите студента"
                            value={selectedStudent}
                            onChange={(value) => setSelectedStudent(value)}
                    >
                        <Select.Option value="Иванов И.И.">Иванов И.И.</Select.Option>
                        <Select.Option value="Петров П.П.">Петров П.П.</Select.Option>
                        <Select.Option value="Сидоров С.С.">Сидоров С.С.</Select.Option>
                        <Select.Option value="Алексеев А.А.">Алексеев А.А.</Select.Option>
                        <Select.Option value="Кузнецов К.К.">Кузнецов К.К.</Select.Option>
                    </Select>
                </Modal>
            </>
    );
};

export default FeedbackPage;