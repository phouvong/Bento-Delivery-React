import QRCode from "react-qr-code";

export default function QRCodeClient({ playStoreLink, appStoreLink, size = 200 }) {
    // Create redirect URL with query parameters for server-side detection
    const redirectPath = `/app-redirect?playStore=${encodeURIComponent(
        playStoreLink || ''
    )}&appStore=${encodeURIComponent(appStoreLink || '')}`;

    // Use the current domain for the QR code URL, fallback to hardcoded for SSR
    const redirectUrl = typeof window !== 'undefined'
        ? `${window.location.origin}${redirectPath}`
        : `window.location.origin${redirectPath}`;

    return (
        <div style={{ padding: 10, background: "white", display: "inline-block", border: "1px solid ", borderRadius: "10px", }}>
            <QRCode value={redirectUrl} size={size} />
        </div>
    );
}