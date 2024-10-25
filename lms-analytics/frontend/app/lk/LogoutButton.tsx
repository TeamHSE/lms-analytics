import React from "react";
import { Button } from "antd";
import { LogoutOutlined } from "@ant-design/icons";
import { useRouter } from "next/navigation";

interface LogoutButtonProps {
    position?: string | undefined,
    width?: string | undefined
}

const LogoutButton = ({ position, width }: LogoutButtonProps) => {
    const router = useRouter(); // Используйте useRouter для навигации

    // Функция выхода
    const handleLogout = () => {
        router.push("/"); // Перенаправление на главную страницу
    };

    return <>
        {/* Кнопка выхода */ }
        <Button
                type="dashed"
                style={ {
                    margin: "16px",
                    width: width ?? "80%",
                    position: position ?? "absolute",
                    bottom: 0,
                    left: 0,
                } }

                onClick={ handleLogout }
        >
            <LogoutOutlined/>Выйти
        </Button>
    </>;
};

export default LogoutButton;