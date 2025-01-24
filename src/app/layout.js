
import "./globals.css";
import { Provider } from "@/components/ui/provider"





export const metadata = {
  title: "DejaVuAI",
  description: "amazing site right here",
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
