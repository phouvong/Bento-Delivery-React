import Image from "next/image";
import placeholder from "/public/static/no-image-found.png";

const CustomImage = ({ src, alt, width, height, errorImage, ...rest }) => {
	return (
		<Image
			src={src}
			onError={(e) => {
				e.target.onerror = null;
				e.target.srcset = errorImage || placeholder?.src;
			}}
			width={width ? width : 100}
			height={height ? height : 100}
			// sizes="(max-width: 768px) 100vw, 33vw"
			{...rest}
			alt={alt ? alt : "Image"}
		/>
	);
};

export default CustomImage;
