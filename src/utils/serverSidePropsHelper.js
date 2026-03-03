import { fetchPageMetadata } from "utils/fetchPageMetaData";

export const getCommonServerSideProps = async (context, pageName, pageId = null) => {
    const { req, res } = context;
    const language = req.cookies.languageSetting;

    const configRes = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/config`,
        {
            method: "GET",
            headers: {
                "X-software-id": 33571750,
                "X-server": "server",
                "X-localization": language,
                origin: process.env.NEXT_CLIENT_HOST_URL,
            },
        }
    );
    const config = await configRes.json();

    const metaData = await fetchPageMetadata(pageName, pageId, language)
    // Set cache control headers for 1 hour (3600 seconds)
    res.setHeader(
        "Cache-Control",
        "public, s-maxage=3600, stale-while-revalidate"
    );

    return {
        props: {
            configData: config,
            metaData: metaData,
        },
    };
}
