import '@/styles/globals.css'
import "@glideapps/glide-data-grid/dist/index.css";
import type { AppProps } from 'next/app'

export default function App({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />
}
