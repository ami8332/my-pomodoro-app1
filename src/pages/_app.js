import "../styles/globals.css";
import Script from 'next/script';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

// Google Analytics ID (نفس الرقم)
const GA_TRACKING_ID = 'G-DN05E92D4E';

// Track page views
const pageview = (url) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('config', GA_TRACKING_ID, {
      page_path: url,
    });
  }
};

export default function App({ Component, pageProps }) {
  const router = useRouter();

  // Track page changes
  useEffect(() => {
    const handleRouteChange = (url) => {
      pageview(url);
    };
    
    router.events.on('routeChangeComplete', handleRouteChange);
    return () => {
      router.events.off('routeChangeComplete', handleRouteChange);
    };
  }, [router.events]);

  return (
    <>
      {/* 🔥 SEO + Google Analytics مع الرابط الجديد الصحيح */}
      <Head>
        {/* Basic Meta Tags */}
        <title>TimeFocus - Free Pomodoro Timer & Task Manager | Focus & Productivity App</title>
        <meta name="description" content="Free online Pomodoro timer with task management. Boost your productivity with focus sessions, break reminders, and task tracking. No signup required!" />
        <meta name="keywords" content="pomodoro timer, focus timer, productivity app, task manager, time management, work timer, study timer, free pomodoro" />
        <meta name="author" content="TimeFocus" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        
        {/* 🔥 الرابط الجديد الصحيح */}
        <link rel="canonical" href="https://my-pomodoro-app11.vercel.app" />
        
        {/* Open Graph Meta Tags (Facebook, LinkedIn) */}
        <meta property="og:title" content="TimeFocus - Free Pomodoro Timer & Task Manager" />
        <meta property="og:description" content="Boost your productivity with our free Pomodoro timer. Manage tasks, track focus time, and stay motivated. No signup required!" />
        <meta property="og:type" content="website" />
        
        {/* 🔥 الرابط الجديد الصحيح */}
        <meta property="og:url" content="https://my-pomodoro-app11.vercel.app" />
        <meta property="og:image" content="https://my-pomodoro-app11.vercel.app/og-image.jpg" />
        <meta property="og:site_name" content="TimeFocus" />
        
        {/* Twitter Card Meta Tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="TimeFocus - Free Pomodoro Timer & Task Manager" />
        <meta name="twitter:description" content="Boost your productivity with our free Pomodoro timer. Manage tasks, track focus time, and stay motivated!" />
        
        {/* 🔥 الرابط الجديد الصحيح */}
        <meta name="twitter:image" content="https://my-pomodoro-app11.vercel.app/og-image.jpg" />
        
        {/* Favicon */}
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        
        {/* Additional SEO */}
        <meta name="robots" content="index, follow" />
        <meta name="language" content="English" />
        <meta name="revisit-after" content="7 days" />
        <meta name="theme-color" content="#3B82F6" />
        
        {/* Schema.org structured data مع الرابط الجديد */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebApplication",
            "name": "TimeFocus",
            "description": "Free online Pomodoro timer with task management for productivity",
            "url": "https://my-pomodoro-app11.vercel.app",
            "applicationCategory": "ProductivityApplication",
            "operatingSystem": "Web Browser",
            "offers": {
              "@type": "Offer",
              "price": "0",
              "priceCurrency": "USD"
            },
            "creator": {
              "@type": "Organization",
              "name": "TimeFocus"
            }
          })}
        </script>
      </Head>

      {/* Google Analytics Scripts (نفس الكود، سيعمل مع الرابط الجديد) */}
      <Script
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`}
      />
      <Script
        id="google-analytics"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_TRACKING_ID}', {
              page_path: window.location.pathname,
            });
          `,
        }}
      />
      
      <Component {...pageProps} />
    </>
  );
}