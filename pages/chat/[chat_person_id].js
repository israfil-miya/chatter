import Header from '../../components/Header.js'
import Link from 'next/link'
import io from 'socket.io-client'
import { useState, useEffect, useRef } from 'react'
import { MyMsg, PartnerMsg } from '../../components/MsgTamplate'
import { useSession, getSession } from "next-auth/react"
import { toast } from 'react-toastify';
let socket

export default function Chatting({ PartnerInfo }) {
  const { data: session } = useSession();
  const username = session.user.name
  const myuid = session.user.id
  const [message, setMessage] = useState('')
  const [messages, setMessages] = useState([])
  const [file, setFile] = useState()
  const messageEl = useRef(null);
  const timelineLoaded = useRef(false);

  async function getImage(imageFile) {
    const res = await fetch(`/api/compressImage`, {
      method: 'POST',
      body: JSON.stringify({ imagebase64: imageFile }),
      headers: {
        'Content-Type': 'application/json',
      },
    })
    const resData = await res.json()
    console.log("image compression", resData)
    return resData.base64Image
  }

  async function retrieveMessage() {
    const res = await fetch(`/api/chats-api`, {
      method: 'POST',
      body: JSON.stringify({ chatsRetrieve: true, uid: session.user.id, partnerId: PartnerInfo._id }),
      headers: {
        'Content-Type': 'application/json',
      },
    })
    const resData = await res.json()
    return resData
  }

  useEffect(() => {
    if (!timelineLoaded.current) {


      socketInitializer()
      async function fetchDbMessages() {
        const allMessages = await retrieveMessage(1)

        if (allMessages.length) {
          allMessages.map((data, index) => {
            setMessages((currentMsg) => [
              ...currentMsg,
              { uid: (data.partnerId != PartnerInfo._id) ? PartnerInfo._id : session.user.id, username: (data.partnerId != PartnerInfo._id) ? PartnerInfo.name : session.user.name, message: data.message, msg_timestamp: data.updatedAt },
            ])
          })
        }
      }
      fetchDbMessages()
      if (messageEl) {
        messageEl.current.addEventListener('DOMNodeInserted', event => {
          const { currentTarget: target } = event;
          target.scroll({ top: target.scrollHeight, behavior: 'auto' });
        });
      }

      timelineLoaded.current = true;
    }
  }, [setMessages, session, PartnerInfo])

  const socketInitializer = async () => {
    // We just call it because we don't need anything else out of it
    await fetch('/api/socket')

    socket = io()

    socket.on('newIncomingMessage', async (msg) => {
      console.log('incoming msg', msg)
      if (msg.partnerId == myuid && PartnerInfo._id == msg.uid) {
        setMessages((currentMsg) => [
          ...currentMsg,
          { uid: msg.uid, username: msg.username, message: msg.message, msg_timestamp: msg.msg_timestamp },
        ])
        console.log('all messages', messages)
      }
      else {
        return
      }
    })
  }

  const sendMessage = async (e) => {
    e.preventDefault()
    let timestamp = Date.now() - 1000
    if (!message && !file) {
      toast.error("Cannot send empty message", { toastId: "error" })
      return
    }
    if (message.length) {

      socket?.emit('createdMessage', { uid: myuid, username, message, partnerId: PartnerInfo._id, msg_timestamp: timestamp })

      setMessages((currentMsg) => [
        ...currentMsg,
        { uid: myuid, username, message, msg_timestamp: timestamp },
      ])
      console.log('Submit event ', messages)

      const res = await fetch(`/api/chats-api`, {
        method: 'POST',
        body: JSON.stringify({ id: session.user.id, partnerId: PartnerInfo._id, message }),
        headers: {
          'Content-Type': 'application/json',
        },
      })
      const resData = await res.json()
      console.log("Message DB Info", resData.UserSide)

      e.target.reset();
      setMessage('')
    }
    if (file) {
      var reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = async function (evt) {
        // console.log(evt.target.result)
        socket.emit('createdMessage', { uid: myuid, username, message: evt.target.result, partnerId: PartnerInfo._id, msg_timestamp: timestamp })
        setMessages((currentMsg) => [
          ...currentMsg,
          { uid: myuid, username, message: evt.target.result, msg_timestamp: timestamp },
        ])

        const base64str = evt.target.result.split(',')[1];

        const imageFile = Buffer.from(base64str, 'base64'); //encode image into bytes
        console.log('FileSize: ' + imageFile.length);
        if (imageFile.length > 4000000) {
          toast.error('Image size limit exceeded (limit: 4mb)', { toastId: 'error' })
          return
        }
        else {
          const reducedImageBase64 = await getImage(evt.target.result)
          console.log(reducedImageBase64)
          const res = await fetch(`/api/chats-api`, {
            method: 'POST',
            body: JSON.stringify({ id: session.user.id, partnerId: PartnerInfo._id, message: reducedImageBase64 }),
            headers: {
              'Content-Type': 'application/json',
            },
          })
          const resData = await res.json()
          console.log("Message DB Info", resData.UserSide)
        }

      };
      setFile(null)
      e.target.reset();
    }
  }

  function enterKeyPressed(e) {
    if (e.shiftKey) {
      if (e.which == 13) {
        sendMessage()
      }
    } else {
      return false
    }
  }
  return (
    <>
      <Header activeNow={true} personName={PartnerInfo.name} headerFor="chatting" />
      <div ref={messageEl} className="chatBox bg-success p-2 shadow-sm" id="chatbox-div">
        {messages.length != 0 ? (
          messages.map((data, id) => {
            let isBase64Valid
            const splitted = data.message.split(',')[1];
            if (splitted) isBase64Valid = true
            else isBase64Valid = false

            if (data.uid == myuid) {
              return (
                isBase64Valid ? <MyMsg isImage={true} timestamp={data.msg_timestamp} key={id} msg={data.message}></MyMsg>
                  : <MyMsg isImage={false} timestamp={data.msg_timestamp} key={id} msg={data.message}></MyMsg>
              )
            } else {
              return (
                isBase64Valid ? <PartnerMsg
                  isImage={true}
                  timestamp={data.msg_timestamp}
                  key={id}
                  name={data.username}
                  msg={data.message}
                ></PartnerMsg> : <PartnerMsg
                  isImage={false}
                  timestamp={data.msg_timestamp}
                  key={id}
                  name={data.username}
                  msg={data.message}
                ></PartnerMsg>
              )
            }

          })
        ) : (
          <p className="no-message">No messages</p>
        )}
      </div>
      <form onSubmit={sendMessage}>
        <div className="input-group my-3">
          <input
            id="fileupload"
            type="file"
            onkeypress={e => enterKeyPressed(e)}
            onChange={(e) => setFile(e.target.files[0])}
            className="form-control file-input" />
          <input
            autocomplete="off"
            autofocus="true"
            placeholder="Say something..."
            value={message}
            onkeypress={e => enterKeyPressed(e)}
            onChange={(e) => setMessage(e.target.value)}
            className="form-control"/>
          <button
            type="submit"
            className="btn btn-outline-success"
            id="button-addon2"
          >
            Send
          </button>
        </div>
      </form>
      <style jsx>{`
        .chatBox {
          overflow-x: hidden;
          overflow-y: auto;
          height: 450px;
        }
        .no-message {
          color:white
        }
        .file-input {
          max-width: 200px
        }
      `}</style>
    </>
  )
}


export async function getServerSideProps(context) {
  const { chat_person_id } = context.params
  const session = await getSession(context)
  const res = await fetch(`${process.env.BASE_URL}/api/user`, {
    method: 'POST',
    body: JSON.stringify({ getUserInfo: true, isFriendCheck: true, uid: session.user.id, id: chat_person_id }),
    headers: {
      'Content-Type': 'application/json',
    },
  })

  const apiTestCall = await fetch(`${process.env.BASE_URL}/api/lastMessage-api`, {
    method: 'POST',
    body: JSON.stringify({ uid: session.user.id, partnerId: chat_person_id }),
    headers: {
      'Content-Type': 'application/json',
    },
  })

  const resData = await res.json()
  if (resData.error) {
    return {
      redirect: {
        destination: "/?error=The user is either doesn't exists or not in your contacts",
        permanent: false,
      },
      props: {},
    };
  }
  else {
    console.log(resData)
    return {
      props: {
        PartnerInfo: resData.error ? {} : resData
      }
    }
  }
}