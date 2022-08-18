import { useState} from 'react'
import {toast } from 'react-toastify';
import {useSession} from 'next-auth/react'
export default function AddToContact() {
    const { data: session } = useSession()
    const [email, setEmail] = useState('')
    const addFrnd = async (e) => {
      
      e.preventDefault()
      const res = await fetch(`/api/contacts-api`, {
        method: 'POST',
        body: JSON.stringify({ uid: session.user.id, user_email: session.user.email, email, name: session.user.name }),
        headers: {
          'Content-Type': 'application/json',
        },
      })
      const resData = await res.json()
      if (resData && !resData.error)
        toast.success('The person is now added to your contacts', { toastId: "success" })
      else toast.error(resData.message, { toastId: "error" })
  
      setEmail('')
    }
    return (
        <>
            <div className="input-group mb-3 my-2">
                <input value={email} onChange={e=>setEmail(e.target.value)} type="email" className="form-control" placeholder="Enter e-mail" aria-label="Enter e-mail"/>
                <button className="btn btn-success" onClick={addFrnd} type="button" id="button-addon2">Send</button>
            </div>
        </>
    )
}