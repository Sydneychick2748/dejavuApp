"use client"

import "./globals.css";
import { Provider } from "@/components/ui/provider"
import Header1 from "@/components/ui/header1"
import Header2 from "@/components/ui/header2"
import Footer1 from "@/components/ui/footer1"
import Footer2 from "@/components/ui/footer2"
import { usePathname } from 'next/navigation'

// export const metadata = {
//   title: "DejaVuAI",
//   description: "amazing site right here",
// };

export default function RootLayout({ children }) {
  const pathname = usePathname()
  console.log('pathname is ', pathname)
  return (
    <html lang= "en" suppressHydrationWarning>
      <body  suppressHydrationWarning>
        {/* <div className="container"> */}
          <Provider>
          {pathname === '/accounts/create-account' || pathname === '/accounts/login' || pathname === '/accounts/profile' || pathname === '/contact' || pathname === '/dashboard/upload-files' || pathname === '/help' || pathname === '/dashboard' ? <Header2 /> : <Header1 />}
          {children}
          {pathname === '/help' || pathname === '/contact' ? <Footer2 /> : <Footer1 />}
          </Provider>
        {/* </div> */}
      </body>
    </html>
  );
}