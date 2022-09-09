import {
  signIn,
  useSession,
  signOut,
} from 'next-auth/react'
import HeaderBack from '../components/HeaderBack'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/router'

import {toast } from 'react-toastify';

export default function account() {
  const router = useRouter()

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [repeatpassword, setReatPassword] = useState('')
  const { data: session } = useSession()

useEffect(()=>{
    const { error, success } = router.query
    console.log(success)
    console.log(error)
    if(error){
      toast.error(error, {toastId: "error"})
      router.replace("/account")
    }
    if(success){
      toast.success(success, {toastId: "success"})
      router.replace("/account")
    }
  }, [router]);



  const signinSubmit = async (e) => {
    e.preventDefault()
    const result = await signIn('signin', {
      redirect: false,
      email,
      password,
    })

    if (!result.error) {
      router.replace('/account?success=Successfully signed in')
    }
    if (result.error)  {
      router.replace("/account?error="+result.error)
    }

    setEmail('')
    setPassword('')
  }
  const signupSubmit = async (e) => {
    e.preventDefault()
    if (repeatpassword != password) {
      toast.error("Password and Retyped password doesn't match", {toastId: "error"})
    }
    const result = await signIn('signup', {
      redirect: false,
      name,
      email,
      password,
    })

    if (!result.error) {
      router.replace('/account?success=Successfully signed up')
    }
    if (result.error)  {
      router.replace("/account?error="+ result.error)
    }
    setName('')
    setEmail('')
    setReatPassword('')
    setPassword('')
  }
  const signOutHandle = () => {
    signOut()
    toast.success("Successfully signed out", {toastId: "logOut"})
    
  }

  return (
    <>
      <HeaderBack title="Manage Account" />

      <div className="main-wrapper bg-success">
        {session ? (
          <div className="loggedIn">
            <div className="card px-1 py-1 bg-success">
              <div className="row no-gutters">
                <div className="col-auto">
                  <Image
                    width="75"
                    height="75"
                    src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRANz5CgqyycbDs_MWzJs7pyoMOJIAsrPlPy_Dyq9nFsfU4qKBe2JJrLBM&s=10"
                    className="img-fluid rounded"
                    alt="User Avatar"
                  />
                </div>
                <div className="col ps-3">
                  <div className="card-block px-2 details">
                    <h4 className="card-title">{session.user.name}</h4>
                    <p className="card-text">{session.user.email}</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="d-grid col-6 mx-auto my-2">
              <button onClick={signOutHandle} className="btn btn-danger">
                Sign Out
              </button>
            </div>
          </div>
        ) : (
          <div className="notLoggedIn container pt-2">
            <div className="signup-form py-1">
              <form onSubmit={signupSubmit}>
                <div className="text-center mb-3">
                  <p>Sign Up</p>
                </div>

                <div className="form-outline mb-4">
                  <input
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    type="text"
                    id="registerName"
                    className="form-control"
                  />
                  <label className="form-label" htmlFor="registerName">
                    Name
                  </label>
                </div>

                <div className="form-outline mb-4">
                  <input
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    type="email"
                    id="registerEmail"
                    className="form-control"
                  />
                  <label className="form-label" htmlFor="registerEmail">
                    Email
                  </label>
                </div>

                <div className="form-outline mb-4">
                  <input
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    type="password"
                    id="registerPassword"
                    className="form-control"
                  />
                  <label className="form-label" htmlFor="registerPassword">
                    Password
                  </label>
                </div>

                <div className="form-outline mb-4">
                  <input
                    required
                    value={repeatpassword}
                    onChange={(e) => setReatPassword(e.target.value)}
                    type="password"
                    id="registerRepeatPassword"
                    className="form-control"
                  />
                  <label className="form-label" htmlFor="registerRepeatPassword">
                    Repeat password
                  </label>
                </div>

                <button type="submit" className="btn btn-light btn-block mb-3">
                  Sign up
                </button>
              </form>
            </div>
            <div className="signin-form py-1">
              <form onSubmit={signinSubmit}>
                <div className="text-center mb-3">
                  <p>Sign In</p>
                </div>

                <div className="form-outline mb-4">
                  <input
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    type="email"
                    id="loginName"
                    className="form-control"
                  />
                  <label className="form-label" htmlFor="loginName">
                    Email
                  </label>
                </div>

                <div className="form-outline mb-4">
                  <input
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    type="password"
                    id="loginPassword"
                    className="form-control"
                  />
                  <label className="form-label" htmlFor="loginPassword">
                    Password
                  </label>
                </div>

                <button type="submit" className="btn btn-light btn-block mb-4">
                  Sign in
                </button>
              </form>
            </div>

            <div className="no-credential-signin py-1">
              <p className="text-center">or</p>
              <div className="text-center mb-3">
                <p>Sign in with</p>
                <button
                  type="button"
                  className="btn btn-link btn-floating mx-1"
                >
                  <i className="bi bi-facebook"></i>
                </button>

                <button
                  type="button"
                  className="btn btn-link btn-floating mx-1"
                >
                  <i className="bi bi-github"></i>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      <style jsx>
        {`
          .bi {
            color: white;
            font-size: 26px
          }
          .main-wrapper {
            overflow: hidden;
            min-height: 100%;
            color: white;
          }
          .details {
            line-height: 8px;
          }
        `}
      </style>
    </>
  )
}

account.noAuth = true