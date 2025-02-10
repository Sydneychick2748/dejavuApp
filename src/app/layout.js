"use client"

import "./globals.css";
import { Provider } from "@/components/ui/provider"
import Header1 from "@/components/ui/header1"
import Header2 from "@/components/ui/header2"
import Footer1 from "@/components/ui/footer1"
import { useRouter } from 'next/navigation'

// export const metadata = {
//   title: "DejaVuAI",
//   description: "amazing site right here",
// };


export default function RootLayout({ children }) {
  const router = useRouter()
  return (
    <html lang= "en" suppressHydrationWarning>
      <body  suppressHydrationWarning>
        <Provider>
        {/* {router.pathname === 'localhost:3000' ? <Header2 /> : <Header1 />} */}
        {window.location.origin === 'http://localhost:3000/create-account' || window.location.origin === 'http://localhost3000/login' || window.location.origin === 'http://localhost3000/profile' || window.location.origin === 'http://localhost3000/contact' || window.location.origin === 'http://localhost3000/dashboard' || window.location.origin === 'http://localhost3000/help' ? <Header2 /> : <Header1 />}
        {children}
        <Footer1 />
        </Provider>
      </body>
    </html>
  );
}