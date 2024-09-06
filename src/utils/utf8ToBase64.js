export const utf8ToBase64 = (text) => {
	// Convert the text to a UTF-8 byte array
	const encoder = new TextEncoder();
	const utf8Bytes = encoder.encode(text);

	// Convert the byte array to a binary string
	let binaryString = "";
	utf8Bytes.forEach((byte) => {
		binaryString += String.fromCharCode(byte);
	});

	// Encode the binary string to Base64
	return btoa(binaryString);
};
export const decodeString = (str) => {
	// Convert the incorrect text (may be misunderstood UTF-8 bytes) to a correct string
	const byteArray = new Uint8Array(
		str.split("").map((char) => char.charCodeAt(0))
	);
	const decoder = new TextDecoder("utf-8");
	return decoder.decode(byteArray);
};
