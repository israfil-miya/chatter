import Link from 'next/link'

export default function Tabs({ tabName }) {
  return (
    <>
      <ul className="nav border-bottom border-secondary py-2 bg-success nav-fill shadow">
        <li className={tabName == 'chats' ? 'nav-item active' : 'nav-item'}>
          <Link href="/">
            <a className="nav-link">Chats</a>
          </Link>
        </li>
        <li className={tabName == 'contacts' ? 'nav-item active' : 'nav-item'}>
          <Link href="/contacts">
            <a className="nav-link">Contacts</a>
          </Link>
        </li>
        <li className={tabName == 'groups' ? 'nav-item active' : 'nav-item'}>
          <Link href="/groups">
            <a className="nav-link">Groups</a>
          </Link>
        </li>
      </ul>

      <style jsx>{`
        .nav-link {
          color: white;
        }
        .nav-link:hover {
          cursor: pointer;
          color: rgba(255, 255, 255, 0.813);
        }
        .active .nav-link {
          color: rgba(255, 255, 255, 0.813);
        }
      `}</style>
    </>
  )
}
