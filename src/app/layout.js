
import "./globals.css";
import { Provider } from "@/components/ui/provider"
import Header from '@/components/ui/header'
import Footer from '@/components/ui/footer'





export const metadata = {
  title: "DejaVuAI",
  description: "amazing site right here",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body  suppressHydrationWarning>
        <Provider>
        <Header />
        {children}
        <Footer />
        </Provider>
      </body>
    </html>
  );
}
