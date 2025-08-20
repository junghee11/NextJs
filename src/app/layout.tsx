import "../styles/global.css"
import { Metadata } from "next"
import HeaderMenu from "../components/header/headerMenu"
import Navigation from "../components/navigation"
import Footer from "../components/footer/footer"

import { getUserInfo } from "../service/user/serverApis";

export const metadata : Metadata = {
  title: {
    template : '%s | I ❤ baseball',
    default : "Baseball Hub"
  } ,
  description: 'Baseball Hub',
}

export default async function RootLayout({children,}: { children: React.ReactNode}) {
  const userInfo = await getUserInfo();

  return (
    <html lang="en">
      <body>
        <HeaderMenu userInfo={userInfo != null}></HeaderMenu>
        <Navigation></Navigation>
        <div style={{minHeight : "calc(100vh - 230px)"}}>{children}</div>
        <Footer></Footer>
        </body>
    </html>
  )
}
