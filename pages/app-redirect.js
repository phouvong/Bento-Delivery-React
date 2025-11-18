
export default function AppRedirect() {
    return (
        <div style={{ textAlign: "center", padding: 40 }}>
            <p>Redirecting to the app store...</p>
        </div>
    );
}

export async function getServerSideProps(context) {
    const { req, query } = context;
    const { playStore, appStore } = query;

    if (!playStore && !appStore) {
        return {
            redirect: {
                destination: '/',
                permanent: false,
            },
        };
    }

    const userAgent = req.headers['user-agent'] || '';
    // Construct the origin from request headers if needed
    const protocol = req.headers['x-forwarded-proto'] || 'http';
    const host = req.headers.host;

    let redirectLink = '/'; // fallback to home page

    if (/android/i.test(userAgent)) {
        redirectLink = playStore;
    } else if (/iPad|iPhone|iPod/.test(userAgent)) {
        redirectLink = appStore;
    }

    if (redirectLink && redirectLink !== "#") {
        return {
            redirect: {
                destination: redirectLink,
                permanent: false,
            },
        };
    }

    return {
        props: {},
    };
}