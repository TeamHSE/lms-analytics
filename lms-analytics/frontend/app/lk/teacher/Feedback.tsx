"use client";

import React, { useState } from "react";
import { List, Button, Modal, Input } from "antd";

const FeedbackPage = () => {
    const [ isModalVisible, setIsModalVisible ] = useState<boolean>(false);
    const [ feedbackText, setFeedbackText ] = useState<string>("");
    const [ selectedFeedbackType, setSelectedFeedbackType ] = useState<string>("received");

    const receivedFeedback = [
        { id: 1, student: "Иванов И.И.", feedback: "Great lecture!" },
        { id: 2, student: "Петров П.П.", feedback: "Could use more examples." },
    ];

    const sentFeedback = [
        { id: 1, student: "Сидоров С.С.", feedback: "Good job on the assignment." },
        { id: 2, student: "Алексеев А.А.", feedback: "Please improve your attendance." },
    ];

    const handleSendFeedback = () => {
        console.log("Sending feedback:", feedbackText);
        setIsModalVisible(false);
        setFeedbackText("");
    };

    return (
            <>
                <h1>Feedback</h1>
                <Button onClick={ () => setSelectedFeedbackType("received") }>Received Feedback</Button>
                <Button onClick={ () => setSelectedFeedbackType("sent") }>Sent Feedback</Button>
                <Button type="primary" onClick={ () => setIsModalVisible(true) }>Send Feedback</Button>

                { selectedFeedbackType === "received" ? (
                        <List
                                header={ <div>Received Feedback</div> }
                                bordered
                                dataSource={ receivedFeedback }
                                renderItem={ item => (
                                        <List.Item>
                                            <strong>{ item.student }:</strong> { item.feedback }
                                        </List.Item>
                                ) }
                        />
                ) : (
                        <List
                                header={ <div>Sent Feedback</div> }
                                bordered
                                dataSource={ sentFeedback }
                                renderItem={ item => (
                                        <List.Item>
                                            <strong>{ item.student }:</strong> { item.feedback }
                                        </List.Item>
                                ) }
                        />
                ) }

                <Modal
                        title="Send Feedback"
                        open={ isModalVisible }
                        onCancel={ () => setIsModalVisible(false) }
                        onOk={ handleSendFeedback }
                >
                    <Input.TextArea
                            rows={ 4 }
                            value={ feedbackText }
                            onChange={ (e) => setFeedbackText(e.target.value) }
                            placeholder="Enter feedback text"
                    />
                </Modal>
            </>
    );
};

export default FeedbackPage;