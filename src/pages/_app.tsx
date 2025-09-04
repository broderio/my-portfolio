import 'tailwindcss/tailwind.css';
import '../globalStyles.scss';

import type { AppProps } from 'next/app';
import { memo } from 'react';
import Script from 'next/script';

const MyApp = memo(({ Component, pageProps }: AppProps): JSX.Element => {
  return (
    <>
      {/* Load Google reCAPTCHA script */}
      <Script
        src={`https://www.google.com/recaptcha/api.js?render=6LeJKb4rAAAAAJ55PNa6U3Xrn_kMRdBQDFUoDDs1`}
        strategy="beforeInteractive" // ensures it's available before user interaction
      />

      <Component {...pageProps} />
    </>
  );
});

export default MyApp;
