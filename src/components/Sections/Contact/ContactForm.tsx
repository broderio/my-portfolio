import emailjs from '@emailjs/browser';
import {FC, memo, useCallback, useEffect,useMemo, useState} from 'react';

const RECAPTCHA_SITE_KEY = '6LeJKb4rAAAAAJ55PNa6U3Xrn_kMRdBQDFUoDDs1';

interface FormData {
  [key: string]: string;
  name: string;
  email: string;
  message: string;
}

declare global {
  interface Window {
    grecaptcha?: ReCaptchaV2.ReCaptcha;
  }
}

const ContactForm: FC = memo(() => {
  const defaultData = useMemo(
    () => ({
      name: '',
      email: '',
      message: '',
    }),
    []
  );

  const [data, setData] = useState<FormData>(defaultData);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [grecaptchaReady, setGrecaptchaReady] = useState(false);

  // Wait for grecaptcha to be ready
  useEffect(() => {
    const interval = setInterval(() => {
      if (window.grecaptcha) {
        setGrecaptchaReady(true);
        clearInterval(interval);
      }
    }, 100);

    return () => clearInterval(interval);
  }, []);

  const onChange = useCallback(
    <T extends HTMLInputElement | HTMLTextAreaElement>(
      event: React.ChangeEvent<T>
    ) => {
      const {name, value} = event.target;
      setData(prev => ({...prev, [name]: value}));
    },
    []
  );

  const handleSendMessage = useCallback(
    async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      if (!grecaptchaReady) {
        alert('reCAPTCHA is not ready. Please wait a moment and try again.');
        return;
      }

      setLoading(true);
      setStatus('idle');
      setErrorMessage('');

      try {
        const token = await window.grecaptcha.execute(RECAPTCHA_SITE_KEY, {action: 'submit'});

        if (!token) {
          // Stop sending the email because reCAPTCHA failed
          setStatus('error');
          setErrorMessage('reCAPTCHA verification failed. Please try again.');
          setLoading(false);
          return; // exit early
        }

        // Token is valid — safe to send email
        const dataWithRecaptcha = {...data, 'g-recaptcha-response': token};

        await emailjs.send(
          'service_baukuoq',
          'template_fql2hnq',
          dataWithRecaptcha as Record<string, unknown>,
          '2SSsVKhmkrh5oX8IO'
        );

        setStatus('success');
        setData(defaultData);
      } catch (error: unknown) {
        if (error instanceof Error) {
          console.error(error.message);
          setErrorMessage(error.message);
        } else {
          console.error(error);
          setErrorMessage('Failed to send message.');
        }
      } finally {
        setLoading(false);
      }

    },
    [data, defaultData, grecaptchaReady]
  );

  const inputClasses =
    'bg-neutral-700 border-0 focus:border-0 focus:outline-none focus:ring-1 focus:ring-accent rounded-md placeholder:text-neutral-400 placeholder:text-sm text-neutral-200 text-sm';

  return (
    <form
      className="grid min-h-[320px] grid-cols-1 gap-y-4"
      data-emailjs-recaptcha={RECAPTCHA_SITE_KEY}
      onSubmit={handleSendMessage}
    >
      <input
        className={inputClasses}
        name="name"
        onChange={onChange}
        placeholder="Name"
        required
        type="text"
      />
      <input
        autoComplete="email"
        className={inputClasses}
        name="email"
        onChange={onChange}
        placeholder="Email"
        required
        type="email"
      />
      <textarea
        className={inputClasses}
        maxLength={250}
        name="message"
        onChange={onChange}
        placeholder="Message"
        required
        rows={6}
      />

      <button
        aria-label="Submit contact form"
        className={`w-max rounded-full border-2 border-accent px-4 py-2 text-sm font-medium text-white shadow-md outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-stone-800 ${loading || !grecaptchaReady ? 'bg-stone-600 cursor-not-allowed' : 'bg-stone-900 hover:bg-stone-800'
          }`}
        disabled={loading || !grecaptchaReady}
        type="submit"
      >
        {loading ? 'Sending...' : 'Send Message'}
      </button>

      {status === 'success' && (
        <p className="text-green-400 text-sm mt-2">Message sent successfully!</p>
      )}
      {status === 'error' && (
        <p className="text-red-400 text-sm mt-2">Error: {errorMessage}</p>
      )}
    </form>
  );
});

ContactForm.displayName = 'ContactForm';
export default ContactForm;
