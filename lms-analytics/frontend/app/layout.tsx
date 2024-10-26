import type { Metadata } from "next";
import { Toaster } from "sonner";

import { SITE_NAME } from "@/constants/seo.constants";

import Providers from "@/app/providers";
import { AntdRegistry } from "@ant-design/nextjs-registry";

export const metadata: Metadata = {
    title: {
        default: SITE_NAME,
        template: `%s | ${ SITE_NAME }`,
    },
    description: "Отслеживайте статистику учеников и обменивайтесь обратной связью",
};

export default function RootLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode;
}>) {
    return (
            <html lang="ru">
            <body>
            <AntdRegistry>
                <Toaster
                        theme="light"
                        position="top-right"
                        duration={ 1500 }
                />
                <Providers>{ children }</Providers>
            </AntdRegistry>
            </body>
            </html>
    );
}
