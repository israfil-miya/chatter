import Link from 'next/link'

export default function HeaderBack({ title }) {
  return (
    <>
      <nav className="navbar py-0 shadow px-2 bg-success">
        <div className="container-fluid">
          <Link href="/">
            <a>
              <i className="bi bi-arrow-left-short"></i>
            </a>
          </Link>
          <div className="heading">
            <h5 className="title">{title}</h5>
          </div>
        </div>
      </nav>

      <style jsx>{`
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
        .heading {
          color: white;
        }
      `}</style>
    </>
  )
}
