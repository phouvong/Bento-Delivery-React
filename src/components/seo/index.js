import Head from "next/head";
import PropTypes from "prop-types";
import { useRouter } from "next/router";
import DynamicFavicon from "../favicon/DynamicFavicon";

const normalizeOrigin = (origin) => {
  if (!origin) return "";
  return origin.endsWith("/") ? origin.slice(0, -1) : origin;
};

const toAbsoluteUrl = (maybeUrl, origin) => {
  if (!maybeUrl) return "";
  if (/^(https?:\/\/|data:|blob:)/i.test(maybeUrl)) return maybeUrl;
  if (maybeUrl.startsWith("//")) return `https:${maybeUrl}`;
  if (!origin) return maybeUrl;
  if (maybeUrl.startsWith("/")) return `${origin}${maybeUrl}`;
  return `${origin}/${maybeUrl}`;
};

const SEO = ({
  title,
  description,
  keywords,
  image,
  businessName,
  configData,
  robotsMeta,
}) => {
  const router = useRouter();
  const { asPath } = router;

  const siteName = businessName || configData?.business_name || "";
  const origin = normalizeOrigin(
    typeof window === "undefined"
      ? process.env.NEXT_PUBLIC_SITE_URL ||
          process.env.NEXT_CLIENT_HOST_URL ||
          ""
      : window.location.origin
  );
  const pathname = asPath ? asPath.split(/[?#]/)[0] : "";
  const url = origin ? `${origin}${pathname}` : pathname;

  const buildRobotsContent = () => {
    if (!robotsMeta) {
      return 'index,follow'
    }

    const robotsArray = []

    // Handle indexing
    if (robotsMeta.meta_index === 0) robotsArray.push('noindex')
    else if (robotsMeta.meta_index === 1) robotsArray.push('index')

    // Handle other directives
    if (robotsMeta.meta_no_follow) robotsArray.push(robotsMeta.meta_no_follow)
    if (robotsMeta.meta_no_image_index) robotsArray.push(robotsMeta.meta_no_image_index)
    if (robotsMeta.meta_no_archive) robotsArray.push(robotsMeta.meta_no_archive)
    if (robotsMeta.meta_no_snippet) robotsArray.push(robotsMeta.meta_no_snippet)

    // Handle max-snippet
    if (robotsMeta.meta_max_snippet && robotsMeta.meta_max_snippet_value) {
      robotsArray.push(`max-snippet:${robotsMeta.meta_max_snippet_value}`)
    }

    // Handle max-video-preview
    if (robotsMeta.meta_max_video_preview && robotsMeta.meta_max_video_preview_value) {
      robotsArray.push(`max-video-preview:${robotsMeta.meta_max_video_preview_value}`)
    }

    // Handle max-image-preview
    if (robotsMeta.meta_max_image_preview && robotsMeta.meta_max_image_preview_value) {
      robotsArray.push(`max-image-preview:${robotsMeta.meta_max_image_preview_value}`)
    }

    return robotsArray.length > 0 ? robotsArray.join(', ') : 'index,follow'
  }

  const robotsContent = buildRobotsContent()
  const metaTitle = title || siteName;
  const metaDescription = description || "";
  const metaImage = image || configData?.logo_full_url ;
  console.log({metaImage});
  
  return (
    <>
      <DynamicFavicon configData={configData} />
      <Head>
        {/* General meta tags */}
        <title>{metaTitle}</title>
        {metaDescription && <meta name="description" content={metaDescription} />}
        {keywords && <meta name="keywords" content={keywords} />}
        <meta name="robots" content={robotsContent} />
        <meta itemProp="name" content={metaTitle} />
        {metaDescription && (
          <meta itemProp="description" content={metaDescription} />
        )}
        {metaImage ? <meta itemProp="image" content={metaImage || configData?.logo_full_url} />:<meta itemProp="image" content={configData?.logo_full_url} /> }

        {/* Open Graph meta tags for Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:title" content={metaTitle} />
        {metaDescription && (
          <meta property="og:description" content={metaDescription} />
        )}
        {url && <meta property="og:url" content={url} />}
        {siteName && <meta property="og:site_name" content={siteName} />}
        {metaImage && (
          <>
            <meta property="og:image" content={metaImage} />
            {metaImage.startsWith("https://") && (
              <meta property="og:image:secure_url" content={metaImage} />
            )}
          </>
        )}

        {/* Twitter Card meta tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={metaTitle} />
        {metaDescription && (
          <meta name="twitter:description" content={metaDescription} />
        )}
        {url && <meta name="twitter:url" content={url} />}
        {metaImage && <meta name="twitter:image" content={metaImage} />}

        {url && <link rel="canonical" href={url} />}
      </Head>
    </>
  );
};

SEO.propTypes = {
  title: PropTypes.string,
};

export default SEO;
