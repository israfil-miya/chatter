import Link from 'next/link'
import Image from 'next/image'

export default function Contactslist({ name, pfp, activeNow, uid }) {
  return (
    <>
      <Link href={{ pathname: '/chat/' + uid }}>
        <a>
          <div className="rounded wrapper my-3 rounded mx-2 bg-success d-flex">
            <Image
              position="fixed"
              className="user_av rounded"
              width="70"
              height="70"
              src={pfp}
              alt="User Avatar"
            />
            <p className="px-2 ps-2 text-break">{name}</p>
            <p className="px-2 ps-2 ms-auto">
              {activeNow ? 'Online Now.' : 'Offline Now.'}
            </p>
          </div>
        </a>
      </Link>
      <style jsx>{`
        .wrapper {
          color: white;
        }
        .wrapper:hover {
          cursor: pointer;
          box-shadow: 0 4px 4px 0 rgba(0, 0, 0, 0.2),
            0 5px 25px 0 rgba(0, 0, 0, 0.19);
        }
      `}</style>
    </>
  )
}
