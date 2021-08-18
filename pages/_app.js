import 'tailwindcss/tailwind.css'
import { NextIntlProvider } from 'next-intl';

function MyApp({ Component, pageProps }) {
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