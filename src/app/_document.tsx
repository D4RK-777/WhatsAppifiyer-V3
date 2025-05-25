import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        {/* Simple Analytics - Privacy-focused analytics */}
        <script 
          data-collect-dnt="true" 
          async 
          src="https://scripts.simpleanalyticscdn.com/latest.js"
        />
        <noscript>
          <img 
            src="https://queue.simpleanalyticscdn.com/noscript.gif?collect-dnt=true" 
            alt="" 
            referrerPolicy="no-referrer-when-downgrade"
          />
        </noscript>
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
