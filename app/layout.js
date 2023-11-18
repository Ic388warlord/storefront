import { Inter } from 'next/font/google'
import './globals.css'
import Navbar from './components/navbar'
import Title from './components/title'
import { Lato } from 'next/font/google'
import ChatBot from './components/chatbot'


const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'StoreFront',
}

const lato = Lato({ subsets: ['latin'], weight: ['700','900'] });


export default function RootLayout({ children }) {

  return (
    <html lang="en">
      <body className={`${inter.className} ${lato.className}`}>
        {/* <Title /> */}
        <Navbar />
        {children}
        <ChatBot/>
        </body>
    </html>
  )
}
