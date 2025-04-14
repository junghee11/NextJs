import "../styles/global.css"
import { Metadata } from "next"
import HeaderMenu from "../components/header/headerMenu"
import Navigation from "../components/navigation"
import Footer from "../components/footer/footer"

import { cookies } from "next/headers";
import { getUserInfo } from "../service/user/apis";

export const metadata : Metadata = {
  title: {
    template : '%s | I ❤ baseball',
    default : "Baseball Hub"
  } ,
  description: 'Baseball Hub',
}

export default async function RootLayout({children,}: { children: React.ReactNode}) {
  const cookieStore = cookies();
  const access_token = cookieStore.get("access_token");
  const userInfo = await getUserInfo(access_token);


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
