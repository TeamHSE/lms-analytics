import React, { useState } from "react";
import { Button, Input, List, Modal, Select, Tabs } from "antd";
import TabPane from "antd/es/tabs/TabPane";

const FeedbackPage = () => {
    const [ isModalVisible, setIsModalVisible ] = useState<boolean>(false);
    const [ feedbackText, setFeedbackText ] = useState<string>("");
    const [ selectedRecipient, setSelectedRecipient ] = useState<string | undefined>(undefined);
    const [ recipientType, setRecipientType ] = useState<string>("teacher");

    const receivedFeedback = [
        { id: 1, sender: "Иванов И.И.", feedback: "Хорошая работа на проекте!" },
        { id: 2, sender: "Петров П.П.", feedback: "Крутая презентация!" },
    ];

    const preparedFeedbackToTeachers = [
        { id: 1, recipient: "Кузнецов К.К.", feedback: "Спасибо за лекцию" },
    ];

    const preparedPeerFeedback = [
        { id: 1, recipient: "Кузнецов К.К.", feedback: "Хорошо поработали на проекте!" },
    ];

    const [ feedbackToTeachers, setFeedbackToTeachers ] = useState(preparedFeedbackToTeachers);
    const [ peerFeedback, setPeerFeedback ] = useState(preparedPeerFeedback);

    const handleSendFeedback = () => {
        if (selectedRecipient) {
            if (recipientType === "teacher") {
                setFeedbackToTeachers([
                    ...feedbackToTeachers,
                    { id: feedbackToTeachers.length + 1, recipient: selectedRecipient, feedback: feedbackText },
                ]);
            } else {
                setPeerFeedback([
                    ...peerFeedback,
                    { id: peerFeedback.length + 1, recipient: selectedRecipient, feedback: feedbackText },
                ]);
            }
            setIsModalVisible(false);
            setFeedbackText("");
            setSelectedRecipient(undefined);
        }
    };

    return (
            <>
                <h1>Обратная связь</h1>
                <Tabs defaultActiveKey="1">
                    <TabPane tab="Полученная обратная связь" key={ 1 }>
                        <List
                                header={ <div>Полученная обратная связь</div> }
                                bordered
                                dataSource={ receivedFeedback }
                                renderItem={ item => (
                                        <List.Item key={ item.id }>
                                            <strong>{ item.sender }:</strong> { item.feedback }
                                        </List.Item>
                                ) }
                        />
                    </TabPane>
                    <TabPane tab="Обратная связь преподавателю" key={ 2 }>
                        <List
                                header={ <div>Обратная связь преподавателю</div> }
                                bordered
                                dataSource={ feedbackToTeachers }
                                renderItem={ item => (
                                        <List.Item key={ item.id }>
                                            <strong>{ item.recipient }:</strong> { item.feedback }
                                        </List.Item>
                                ) }
                        />
                    </TabPane>
                    <TabPane tab="Кросс-оценка" key={ 3 }>
                        <List
                                header={ <div>Обратная связь от других ребят</div> }
                                bordered
                                dataSource={ peerFeedback }
                                renderItem={ item => (
                                        <List.Item key={ item.id }>
                                            <strong>{ item.recipient }:</strong> { item.feedback }
                                        </List.Item>
                                ) }
                        />
                    </TabPane>
                </Tabs>
                <Button type="primary" onClick={ () => setIsModalVisible(true) } style={ { top: "1%" } }>
                    Send Feedback
                </Button>
                <Modal
                        title="Отправить обратную связь"
                        open={ isModalVisible }
                        onCancel={ () => setIsModalVisible(false) }
                        onOk={ () => handleSendFeedback() }
                        okText="Send"
                        cancelText="Cancel"
                >
                    <Input.TextArea
                            rows={ 4 }
                            value={ feedbackText }
                            onChange={ (e) => setFeedbackText(e.target.value) }
                            placeholder="Введите текст Вашей обратной связи"
                    />
                    <Select
                            style={ { width: "100%", marginTop: "16px" } }
                            placeholder="Выберите, кому отправить"
                            value={ recipientType }
                            onChange={ (value) => setRecipientType(value.toString()) }
                    >
                        <Select.Option value="teacher">Преподавателю</Select.Option>
                        <Select.Option value="student">Другому ученику</Select.Option>
                    </Select>
                    { recipientType === "teacher" ? (
                            <Select
                                    style={ { width: "100%", marginTop: "16px" } }
                                    placeholder="Выберите получателя"
                                    value={ selectedRecipient }
                                    onChange={ (value) => setSelectedRecipient(value.toString()) }
                            >
                                <Select.Option value="Иванов И.И.">Иванов И.И.</Select.Option>
                                <Select.Option value="Петров П.П.">Петров П.П.</Select.Option>
                            </Select>
                    ) : (
                            <Select
                                    style={ { width: "100%", marginTop: "16px" } }
                                    placeholder="Выберите получателя"
                                    value={ selectedRecipient }
                                    onChange={ (value) => setSelectedRecipient(value.toString()) }
                            >
                                <Select.Option value="Иванов И.И.">Иванов И.И.</Select.Option>
                                <Select.Option value="Петров П.П.">Петров П.П.</Select.Option>
                            </Select>
                    ) }
                </Modal>
            </>
    );
};

export default FeedbackPage;