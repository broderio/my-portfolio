import 'tailwindcss/tailwind.css';
import '../globalStyles.scss';

import type {AppProps} from 'next/app';
import Script from 'next/script';
import {memo} from 'react';

const MyApp = memo(({Component, pageProps}: AppProps): JSX.Element => {
  return (
    <>
      <Script
        src="https://www.google.com/recaptcha/api.js?render=6LeJKb4rAAAAAJ55PNa6U3Xrn_kMRdBQDFUoDDs1"
        strategy="lazyOnload"
      />

      <Component {...pageProps} />
    </>
  );
});

export default MyApp;
