import 'tailwindcss/tailwind.css'
import { NextIntlProvider } from 'next-intl';
import { pageview } from '../util/gtag';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

function MyApp({ Component, pageProps }) {

  const router = useRouter()

  useEffect(() => {
    const handleRouteChange = (url) => {
      pageview(url)
    }
    router.events.on('routeChangeComplete', handleRouteChange)
    return () => {
      router.events.off('routeChangeComplete', handleRouteChange)
    }
  }, [router.events])

  return (
    <NextIntlProvider
      formats={{
        dateTime: {
          short: {
            day: 'numeric',
            month: 'short',
            year: 'numeric'
          }
        }
      }}
      messages={pageProps.messages}
      now={new Date(pageProps.now)}
    >
      <div className={"md:container md:mx-auto px-4 py-1"}>
        <Component {...pageProps} />
      </div>
    </NextIntlProvider>
  )
}

export default MyApp