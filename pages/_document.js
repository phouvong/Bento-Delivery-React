import { Children } from "react";
import Document, { Head, Html, Main, NextScript } from "next/document";
import createEmotionServer from "@emotion/server/create-instance";
import createEmotionCache from "../src/utils/create-emotion-cache";

class CustomDocument extends Document {
  render() {
    const { analyticsConfig = {} } = this.props;

    return (
      <Html lang="en">
        <Head>
          {/* Fonts */}
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
          <link
            href="https://fonts.googleapis.com/css2?family=Rubik:wght@300;400;500;600;700&display=swap"
            rel="stylesheet"
          />

          {/* Social login scripts */}
          <script
            type="application/javascript"
            src="https://accounts.google.com/gsi/client"
            async
          />
          <script
            type="text/javascript"
            src="https://appleid.cdn-apple.com/appleauth/static/jsapi/appleid/1/en_US/appleid.auth.js"
            async
          />
          <meta name="theme-color" content="#111827" />

          {/* ✅ Analytics scripts */}
          {analyticsConfig.google_tag_manager && (
            <script
              dangerouslySetInnerHTML={{
                __html: `
                  (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
                  new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
                  j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
                  'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
                  })(window,document,'script','dataLayer','${analyticsConfig.google_tag_manager}');
                `,
              }}
            />
          )}

          {analyticsConfig.google_analytics && (
            <>
              <script async src={`https://www.googletagmanager.com/gtag/js?id=${analyticsConfig.google_analytics}`} />
              <script
                dangerouslySetInnerHTML={{
                  __html: `
                    window.dataLayer = window.dataLayer || [];
                    function gtag(){dataLayer.push(arguments);}
                    gtag('js', new Date());
                    gtag('config','${analyticsConfig.google_analytics}');
                  `,
                }}
              />
            </>
          )}

          {analyticsConfig.facebook_pixel && (
            <script
              dangerouslySetInnerHTML={{
                __html: `
                  !function(f,b,e,v,n,t,s)
                  {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
                  n.callMethod.apply(n,arguments):n.queue.push(arguments)};
                  if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
                  n.queue=[];t=b.createElement(e);t.async=!0;
                  t.src=v;s=b.getElementsByTagName(e)[0];
                  s.parentNode.insertBefore(t,s)}(window, document,'script',
                  'https://connect.facebook.net/en_US/fbevents.js');
                  fbq('init','${analyticsConfig.facebook_pixel}');
                  fbq('track','PageView');
                `,
              }}
            />
          )}

          {analyticsConfig.linkedin_insight_tag && (
            <script
              dangerouslySetInnerHTML={{
                __html: `
                  _linkedin_partner_id = "${analyticsConfig.linkedin_insight_tag}";
                  window._linkedin_data_partner_ids = window._linkedin_data_partner_ids || [];
                  window._linkedin_data_partner_ids.push(_linkedin_partner_id);
                `,
              }}
            />
          )}

          {analyticsConfig.tiktok_pixel && (
            <script
              dangerouslySetInnerHTML={{
                __html: `
                  !function (w,d,t) {
                    w[t] = w[t] || [];
                    w[t].push({'ttq.load': '${analyticsConfig.tiktok_pixel}','ttq.track': 'PageView'});
                    var s = d.createElement('script');
                    s.src = 'https://analytics.tiktok.com/i18n/pixel/sdk.js?sdkid=${analyticsConfig.tiktok_pixel}';
                    s.async = true;
                    var e = d.getElementsByTagName('script')[0];
                    e.parentNode.insertBefore(s,e);
                  }(window, document, 'ttq');
                `,
              }}
            />
          )}

          {analyticsConfig.snapchat_pixel && (
            <script
              dangerouslySetInnerHTML={{
                __html: `
                  (function(e,t,n,c,r,a,i){e.tta=n,e.ttaQueue=e.ttaQueue||[],
                  e.ttaConfig={pixelId:"${analyticsConfig.snapchat_pixel}",events:"page_view"},
                  e.ttaQueue.push({event:"page_view",parameters:{}});
                  var s=t.createElement(n);s.async=!0;s.src="https://tr.snapchat.com/tr.js";
                  var o=t.getElementsByTagName(n)[0];o.parentNode.insertBefore(s,o)})
                  (window,document,"script");
                `,
              }}
            />
          )}

          {analyticsConfig.x_pixel && (
            <script
              dangerouslySetInnerHTML={{
                __html: `
                  !function(e,t,n,s,u,a){e.twq||(s=e.twq=function(){s.exe?s.exe.apply(s,arguments):s.queue.push(arguments);
                  },s.version='1.1',s.queue=[],u=t.createElement(n),u.async=!0,u.src='https://static.ads-twitter.com/uwt.js',
                  a=t.getElementsByTagName(n)[0],a.parentNode.insertBefore(u,a))}(window,document,'script');
                  twq('config','${analyticsConfig.x_pixel}');
                  twq('track','PageView');
                `,
              }}
            />
          )}

          {analyticsConfig.pinterest_pixel && (
            <script
              dangerouslySetInnerHTML={{
                __html: `
                  !function(e){if(!window.pintrk){window.pintrk=function(){window.pintrk.queue.push(
                  Array.prototype.slice.call(arguments))};var n=window.pintrk;n.queue=[],n.version="3.0";var t=document.createElement("script");
                  t.async=!0,t.src=e;var r=document.getElementsByTagName("script")[0];r.parentNode.insertBefore(t,r)}}("https://s.pinimg.com/ct/core.js");
                  pintrk('load', '${analyticsConfig.pinterest_pixel}');
                  pintrk('page');
                `,
              }}
            />
          )}
        </Head>

        <body>
        <Main />
        <NextScript />
        </body>
      </Html>
    );
  }
}

CustomDocument.getInitialProps = async (ctx) => {
  const originalRenderPage = ctx.renderPage;
  const cache = createEmotionCache();
  const { extractCriticalToChunks } = createEmotionServer(cache);

  ctx.renderPage = () =>
    originalRenderPage({
      enhanceApp: (App) => (props) => <App emotionCache={cache} {...props} />,
    });

  const initialProps = await Document.getInitialProps(ctx);
  const emotionStyles = extractCriticalToChunks(initialProps.html);
  const emotionStyleTags = emotionStyles.styles.map((style) => (
    <style
      data-emotion={`${style.key} ${style.ids.join(" ")}`}
      key={style.key}
      dangerouslySetInnerHTML={{ __html: style.css }}
    />
  ));

  // 🛠 Fetch analytics config server-side
  let analyticsConfig = {};
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://yourdomain.com";
    const res = await fetch(`${baseUrl}/api/v1/config/get-analytic-scripts`, {
      headers: {
        "X-software-id": 33571750,
        "X-server": "server",
        origin: process.env.NEXT_CLIENT_HOST_URL || "http://localhost:3000",
      },
    });
    const data = await res.json();
    if (Array.isArray(data)) {
      data.forEach((item) => {
        if (item.type && item.script_id) analyticsConfig[item.type] = item.script_id;
      });
    }
  } catch (err) {
    console.error("Error fetching analytics config:", err);
  }

  return {
    ...initialProps,
    analyticsConfig,
    styles: [...Children.toArray(initialProps.styles), ...emotionStyleTags],
  };
};

export default CustomDocument;
