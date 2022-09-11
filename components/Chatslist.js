import Link from 'next/link'
export default function Chats({ personname, lastmsgby, lastmsg, uid }) {
  return (
    <>
      <Link href={{ pathname: '/chat/' + uid }}>
        <a>
          <div className="chat-person text-break my-3 rounded mx-2 p-3 bg-success">
            <span className="chat-name">{personname}</span>
            <small className="last-chat text-break">
              {lastmsgby}: {lastmsg}
            </small>
          </div>
        </a>
      </Link>

      <style jsx>{`
      .chat-name {
        display: block
      }
      .last-chat {
        color rgb(233,233,233)
      }
      .chat-person {
        line-height: 20px;
        color: white
      }
      .chat-person:hover {
        cursor: pointer;
        box-shadow: 0 4px 4px 0 rgba(0, 0, 0, 0.2), 0 5px 25px 0 rgba(0, 0, 0, 0.19);
      }
      `}</style>
    </>
  )
}
