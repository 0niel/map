import { Header } from '@/components/header'
import { CustomQueryClientProvider } from '@/components/query-client-provider'
import { ThemeProvider } from '@/components/theme-provider'
import { Toaster } from '@/components/ui/sonner'
import { cn } from '@/lib/utils'
import type { Metadata, Viewport } from 'next'
import { Inter as FontSans } from 'next/font/google'
import './globals.css'

const fontSans = FontSans({ subsets: ['latin'], variable: '--font-sans' })

const title = 'Интерактивная карта РОСБИОТЕХ'
const description =
  'Интерактивная карта кампусов РОСБИОТЕХ. Стройте маршруты и следите за расписанием на онлайн-карте'

export const metadata: Metadata = {
  title,
  description,
  openGraph: {
    title,
    description
  },
  twitter: {
    title,
    description,
    card: 'summary_large_image',
    creator: '@miiura'
  }
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  minimumScale: 1,
  maximumScale: 1
}

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ru" suppressHydrationWarning>
      <body className={cn('font-sans antialiased', fontSans.variable)}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <CustomQueryClientProvider>
            <main className="flex h-screen flex-col">
              <Header />
              {children}
              <Toaster position="bottom-center" expand />
            </main>
          </CustomQueryClientProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
