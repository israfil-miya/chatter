import '../styles/globals.css'
import Head from 'next/head'
import Script from 'next/script'
import { useRouter } from "next/router";
import { useEffect } from 'react'
import NextNProgress from 'nextjs-progressbar'
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';
import { useSession } from 'next-auth/react'
import { SessionProvider } from 'next-auth/react'
function MyApp({ Component, pageProps }) {
  return (
    <>
      <Script
        src="https://cdn.jsdelivr.net/npm/bootstrap@5.2.0-beta1/dist/js/bootstrap.bundle.min.js"
        integrity="sha384-pprn3073KE6tl6bjs2QrFaJGz5/SUsLqktiwsUTF55Jfv3qYSDhgCecCxMW52nD2"
        crossOrigin="anonymous"
      />

      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>Chatter</title>
      </Head>
      <NextNProgress
        color="#ffffff"
        startPosition={0.3}
        stopDelayMs={200}
        height={1.5}
        showOnShallow={true}
        options={{ easing: 'ease', speed: 500, showSpinner: false }}
      />
      <ToastContainer />

      <SessionProvider session={pageProps.session}>
        {!Component.noAuth ? (
          <Auth>
            <Component {...pageProps} />
          </Auth>
        ) : (
          <Component {...pageProps} />
        )}
      </SessionProvider>
    </>
  )
}


const Auth = ({ children }) => {
  const { data: session, status } = useSession();
  const loading = status === "loading";
  const hasUser = !!session?.user;
  const router = useRouter();
  useEffect(() => {
    if (!loading && !hasUser) {
      router.push("/account?error=You have to login first");
    }
  }, [loading, hasUser]);
  if (loading || !hasUser) {
    return <div>Hold up a bit...</div>;
  }
  return children;
};
export default MyApp
