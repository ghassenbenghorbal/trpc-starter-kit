import { LoaderCircle } from "lucide-react";

const Loading = ({ height = "100%", width = "100%" }): JSX.Element => {
    return (
        <div
            style={{
                position: "relative",
                height: height,
                width: width,
            }}
        >
            <div
                style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    height: "100%",
                    width: "100%",
                    position: "absolute",
                }}
            >
                <div
                    style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        height: "20%",
                        width: "20%",
                        position: "absolute",
                    }}
                >
                    <LoaderCircle size={64} className="animate-spin text-blue-900" />
                </div>
            </div>
        </div>
    );
};

export default Loading;
