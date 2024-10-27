import React from "react";
import { Button } from "antd";
import { LogoutOutlined } from "@ant-design/icons";
import { useRouter } from "next/navigation";
import { CSSProperties } from "react";

interface LogoutButtonProps {
    position?: CSSProperties["position"],
    margin?: CSSProperties["margin"],
    width?: CSSProperties["width"],
}

const LogoutButton = ({ position, width, margin }: LogoutButtonProps) => {
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
                    margin: margin ?? "16px",
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