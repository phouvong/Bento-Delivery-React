import { getApp, getApps, initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import {
	getMessaging,
	getToken,
	isSupported,
	onMessage,
} from "firebase/messaging";
const firebaseConfig = {
	apiKey: "AIzaSyBV4ueEuzRBy0Yehx-OvUi68pHznhGnT0E",
	authDomain: "bento-delivery-service.firebaseapp.com",
	projectId: "bento-delivery-service",
	storageBucket: "bento-delivery-service.appspot.com",
	messagingSenderId: "787586896333",
	appId: "1:787586896333:web:f6fead1c4225e3e0c6b484",
	measurementId: "G-HP95SH6F7R",
};
const firebaseApp = !getApps().length
	? initializeApp(firebaseConfig)
	: getApp();
const messaging = (async () => {
	try {
		const isSupportedBrowser = await isSupported();
		if (isSupportedBrowser) {
			return getMessaging(firebaseApp);
		}
		return null;
	} catch (err) {
		return null;
	}
})();

export const fetchToken = async (setTokenFound, setFcmToken) => {
	return getToken(await messaging, {
		vapidKey: "EjQtyzBKuKjholh6KNQdzbXdXewm7npbrvsotqXDpXcBEIApsXNfm8bousboQqDUM0MSk4kR3VNv2I-3jbdrxgYxTAeqiNMM8dakFkYubdgfEkoFfmU-Mx47XBASHp8Z2Q",
	})
		.then((currentToken) => {
			if (currentToken) {
				setTokenFound(true);
				setFcmToken(currentToken);

				// Track the token -> client mapping, by sending to backend server
				// show on the UI that permission is secured
			} else {
				setTokenFound(false);
				setFcmToken();
				// shows on the UI that permission is required
			}
		})
		.catch((err) => {
			console.error(err);
			// catch error while creating client token
		});
};

export const onMessageListener = async () =>
	new Promise((resolve) =>
		(async () => {
			const messagingResolve = await messaging;
			onMessage(messagingResolve, (payload) => {
				resolve(payload);
			});
		})()
	);
export const auth = getAuth(firebaseApp);
