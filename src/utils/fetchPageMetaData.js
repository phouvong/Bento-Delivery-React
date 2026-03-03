
export const fetchPageMetadata = async (pageName, id = null, language = 'en') => {


    try {
        const url = id
            ? `${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/get-page-meta-data?page_name=${pageName}&id=${id}`
            : `${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/get-page-meta-data?page_name=${pageName}`
        console.log({ url })
        const metaRes = await fetch(url, {
            method: 'GET',
            headers: {
                'X-software-id': 33571750,
                'X-server': 'server',
                'X-localization': language,
                origin: process.env.NEXT_CLIENT_HOST_URL,
            },
        })

        if (metaRes.ok) {
            const data = await metaRes.json()
            console.log("vvvvvf", data)
            return data
        }

        return null
    } catch (error) {
        console.error('Failed to fetch page metadata:', error)
        return null
    }
}


export const processMetadata = (metaData, fallback = {}) => {
    return {
        title: metaData?.title || fallback.title || '',
        description: metaData?.description || fallback.description || '',
        image: metaData?.image_full_url || fallback.image || '',
        robotsMeta: metaData?.meta_data || null,
    }
}
