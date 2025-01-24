
import "./globals.css";
import { Provider } from "@/components/ui/provider"





export const metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body  suppressHydrationWarning>
      <Provider>{children}</Provider>
      </body>
    </html>
  );
}
