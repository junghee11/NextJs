import "../styles/global.css"
import { Metadata } from "next"
import Navigation from "../components/navigation"
import Footer from "../components/footer/footer"

export const metadata : Metadata = {
  title: {
    template : '%s | I ❤ baseball',
    default : "Baseball Hub"
  } ,
  description: 'Baseball Hub',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <Navigation></Navigation>
        <div style={{minHeight : "calc(100vh - 230px)"}}>{children}</div>
        <Footer></Footer>
        </body>
    </html>
  )
}
