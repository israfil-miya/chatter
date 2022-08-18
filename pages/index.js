import Header from '../components/Header.js'
import Tabs from '../components/Tabs.js'
import Link from 'next/link'
import Chats from '../components/Chatslist.js'
import { useSession, getSession } from "next-auth/react"
export default function Home() {
  return (
    <>
      <Header />
      <Tabs tabName="chats" />
      <Chats
        personname="Israfil miya"
        lastmsgby="You"
        lastmsg="Hi how are you"
        uid="123"
      />
      <Chats
        personname="Parvej Hossain"
        lastmsgby="You"
        lastmsg="Can you fix the schedule next day morning?"
        uid="123"
      />
      <Chats
        personname="Jubayer Islam"
        lastmsgby="User"
        lastmsg="Hey wanna go party"
        uid="123"
      />
      <p className="text-muted text-center p-3"> No more chats ! </p>
    </>
  )
}