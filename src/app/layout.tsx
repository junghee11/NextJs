import "../styles/global.css"
import { Metadata } from "next"
import Navigation from "../components/navigation"

export const metadata : Metadata = {
  title: {
    template : '%s | I ❤ baseball',
    default : "Baseball Info"
  } ,
  description: 'Baseball Info',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <Navigation></Navigation>
      <body>{children}</body>
    </html>
  )
}
