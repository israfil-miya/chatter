import ContactTamplate from '../components/Contactslist.js'
import Header from '../components/Header.js'
import Tabs from '../components/Tabs.js'
import AddToContact from '../components/AddToContact'
import { getSession } from 'next-auth/react'
export default function Contacts({ ContactsList }) {

  return (
    <>
      <Header />
      <Tabs tabName="contacts" />
      <AddToContact />

      {

        ContactsList.map((data, index) => {
          if (data.length != 0) {
            return (
              <ContactTamplate
                key={index}
                name={data.name}
                pfp="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRANz5CgqyycbDs_MWzJs7pyoMOJIAsrPlPy_Dyq9nFsfU4qKBe2JJrLBM&s=10"
                activeNow={false}
                uid={data.id}
              />
            )
          } else {
            return (<div key={index}></div>)
          }
        })

      }
      <p className="text-muted text-center p-3"> No more contacts ! </p>
    </>
  )
}

export async function getServerSideProps(context) {
  const session = await getSession(context)
  const res = await fetch(`${process.env.BASE_URL}/api/contacts-api`, {
    method: 'POST',
    body: JSON.stringify({ getContacts: true, uid: session.user.id }),
    headers: {
      'Content-Type': 'application/json',
    },
  })
  const resData = await res.json()
  return {
    props: {
      ContactsList: resData.error ? [] : resData.allContacts
    }
  }
}