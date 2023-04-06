import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import { SessionProvider } from 'next-auth/react'
import 'react-dropdown/style.css'
import '../../public/styles/index.scss'
export default function App({
    Component,
    pageProps: { ...pageProps },
}: AppProps) {
    return <Component {...pageProps} />
}
