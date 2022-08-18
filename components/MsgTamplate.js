import ta from "time-ago"
import Image from 'next/image'


export function PartnerMsg({ name, msg, timestamp, isImage }) {
  return (
    <>
      <div className="receive text-break text-wrap my-1 message message-left">
        <p className="messageAgo">{ta.ago(timestamp)}</p>
        <p className="personName">{name}</p>
        {
          (!isImage) ?
            <p className="actualMessage">{msg}</p>
            : <div className="actualMessage">
              <Image
                src={msg}
                alt="Image file"
                width={200}
                height={200}
              />
            </div>
        }
      </div>
      <style jsx>{`
        .receive {
          padding: 5px;
          background-color: #ffffffe5;
          color: black;
          border-radius: 6px;
        }

        .message-left {
          clear: both;
          float: left;
        }
        .message {
          line-height: 1;
        }
        .messageAgo {
          font-size: 13px;
        }
        .actualMessage {
          max-width: 50vw;
        }
        .personName {
          font-weight: bold;
          font-size: 14px;
        }
        p {
          margin: 5px;
        }
      `}</style>
    </>
  )
}
export function MyMsg({ msg, timestamp, isImage }) {
  return (
    <>
      <div className="send text-break text-wrap float-end message my-1 message-right">
        <p className="messageAgo">{ta.ago(timestamp)}</p>
        <p className="personName">You</p>
        {
          (!isImage) ?
            <p className="actualMessage">{msg}</p>
            : <div className="actualMessage">
              <Image
                src={msg}
                alt="Image file"
                width={200}
                height={200}
              />
            </div>
        }
      </div>

      <style jsx>{`
        .send {
          padding: 5px;
          background-color: #e2f7fc;
          color: black;
          border-radius: 6px;
        }

        .message-right {
          clear: both;
          float: right;
        }
        .message {
          line-height: 1;
        }
        .messageAgo {
          font-size: 13px;
        }
        .actualMessage {
          max-width: 50vw;
        }
        .personName {
          font-weight: bold;
          font-size: 14px;
        }
        p {
          margin: 5px;
        }
      `}</style>
    </>
  )
}
