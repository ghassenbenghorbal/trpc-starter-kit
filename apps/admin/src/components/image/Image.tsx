import "./Image.css";
import Loading from "../loading/Loading";
import { LazyLoadImage } from "react-lazy-load-image-component";

const Image = ({ src = "", width = "32px", height = "32px", borderRadius = "4px", alt = "image" }: ImageProps) => {
    return (
        <div
            className="image-container"
            style={{
                width: src ? width : "30px",
                height: src ? height : "30px",
                borderRadius: `${borderRadius}`,
            }}
        >
            <LazyLoadImage
                src={src || "https://cdn.converty.shop/assets/default.webp"}
                width={src ? width : "30px"}
                height={src ? height : "30px"}
                className="fade-in object"
                alt={alt}
                placeholder={<Loading />}
            />
        </div>
    );
};

export default Image;

/**
 * Type definition for Image properties
 */
interface ImageProps extends React.HTMLAttributes<HTMLDivElement> {
    /**
     * The object url
     * @default ""
     * @type {string}
     * @example "https://images.unsplash.com/photo"
     * */
    src?: string;

    /**
     * The object Width
     * @default undefined
     * @type {string}
     * @example "200px"
     * */
    width?: string;

    /**
     * The object height
     * @default undefined
     * @type {string}
     * @example "200px"
     * */
    height?: string;

    /**
     * The object objectBorderRadius
     * @default undefined
     * @type {string}
     * @example "200px"
     * */
    borderRadius?: string;

    /**
     * The object alt
     * @default "image"
     * @type {string}
     * @example "image"
     * */
    alt?: string;
}
