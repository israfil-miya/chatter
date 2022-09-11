import Header from '../components/Header.js'
import Tabs from '../components/Tabs.js'
import Chats from '../components/Chatslist.js'
import { getSession } from "next-auth/react"
import { toast } from 'react-toastify';
import { useEffect } from 'react'
import { useRouter } from 'next/router'

export default function Home({ msgList }) {
  const router = useRouter()
  useEffect(() => {
    const { error, success } = router.query
    // console.log(success)
    // console.log(error)
    if (error) {
      toast.error(error, { toastId: "error" })
      router.replace("/")
    }
    if (success) {
      toast.success(success, { toastId: "success" })
      router.replace("/")
    }
  }, [router]);

  return (
    <>
      <Header />
      <Tabs tabName="chats" />

      {

        msgList.map((data, index) => {
          if (data.length != 0) {
            return (
              <Chats
                key={index}
                personname={data.name}
                lastmsgby={data.isMe ? "You" : data.name}
                lastmsg={data.messageObj.message.length>120 ? data.messageObj.message.slice(0,120)+"....." : data.messageObj.message}
                uid={data.partnerId}
              />
            )
          } else {
            return (<div key={index}></div>)
          }
        })
      }

      <p className="text-muted text-center p-3"> No more chats ! </p>
    </>
  )
}

export async function getServerSideProps(context) {
  const session = await getSession(context)
  const res = await fetch(`${process.env.BASE_URL}/api/lastMessage-api`, {
    method: 'POST',
    body: JSON.stringify({ uid: session.user.id }),
    headers: {
      'Content-Type': 'application/json',
    },
  })
  const resData = await res.json()
  // console.log('ChatsData', resData)
  return {
    props: {
      msgList: resData
    }
  }
}