import Link from 'next/link'

export default function Header({ headerFor, personName, activeNow }) {
  return (
    <>
      {headerFor && headerFor == 'chatting' ? (
        <nav className="navbar py-0 shadow px-2 bg-success">
          <div className="container-fluid">
            <Link href="/">
              <a>
                <i className="bi bi-arrow-left-short"></i>
              </a>
            </Link>
            <div className="chatHead">
              <h5 className="chatPersonName">{personName}</h5>
              <small>{activeNow ? 'Online 🔴' : 'Offline ⚪'}</small>
            </div>
          </div>
        </nav>
      ) : (
        <nav className="navbar shadow px-2 bg-success">
          <div className="container-fluid">
            <h1 className="navbar-brand fw-bold m-0">
              <i className="bi bi-chat-dots"></i> Chatter
            </h1>
            <div className="dropstart">
              <span
                id="dropdownMenuButton1"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                <i className="bi bi-three-dots-vertical"></i>
              </span>
              <ul
                className="dropdown-menu"
                aria-labelledby="dropdownMenuButton1"
              >
                <Link href="/blocks">
                  <a>
                    <li className="dropdown-item">Block list</li>
                  </a>
                </Link>
                <li>
                  <hr className="dropdown-divider" />
                </li>

                <Link href="/account">
                  <a>
                    <li className="dropdown-item">Manage account</li>
                  </a>
                </Link>
                <li>
                  <hr className="dropdown-divider" />
                </li>
                <Link href="/settings">
                  <a>
                    <li className="dropdown-item">Other setings</li>
                  </a>
                </Link>
              </ul>
            </div>
          </div>
        </nav>
      )}
      <style jsx>{`
        .navbar-brand {
          color: white;
        }
        .bi-three-dots-vertical {
          color: white;
          font-size: 20px;
        }
        .bi-three-dots-vertical:active {
          color: rgba(255, 255, 255, 0.813);
        }
        .bi-three-dots-vertical:hover {
          cursor: pointer;
        }
        .bi-arrow-left-short {
          font-size: 40px;
          color: white;
        }
        .bi-arrow-left-short:active {
          color: rgba(255, 255, 255, 0.813);
        }
        .bi-arrow-left-short:hover {
          cursor: pointer;
        }
        .chatHead {
          color: white;
          line-height: 8px;
        }
      `}</style>
    </>
  )
}
