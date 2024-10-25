import type { Metadata } from 'next';
import { Toaster } from 'sonner';

import { SITE_NAME } from '@/constants/seo.constants';

import Providers from '@/app/providers';

export const metadata: Metadata = {
    title: {
        default: SITE_NAME,
        template: `%s | ${ SITE_NAME }`,
    },
    description: 'Отслеживайте статистику учеников и обменивайтесь обратной связью',
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
            <html lang="ru">
            <body>
            <Toaster
                    theme="light"
                    position="top-right"
                    duration={ 1500 }
            />
            <Providers>{ children }</Providers>
            </body>
            </html>
    );
}
