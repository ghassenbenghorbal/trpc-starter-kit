import { CKEditor } from "@ckeditor/ckeditor5-react";
import Editor from "ckeditor5-custom-build/build/ckeditor";
import { toast } from "sonner";
import "./CKEditor.css";

interface DescriptionEditorProps {
    placeholder: string;
    value: string;
    onChange: (value: string) => void;
}

export function DescriptionEditor({ placeholder, value, onChange }: DescriptionEditorProps) {
    return (
        <CKEditor
            editor={Editor}
            data={value}
            config={
                {
                    simpleUpload: {
                        uploadUrl: "/api/v1/upload/editor",
                        withCredentials: true,
                        headers: {},
                    },
                    htmlSupport: {
                        disallow: [
                            {
                                name: "script",
                            },
                        ],
                        // allow styles
                        allow: [
                            {
                                name: "style",
                                attributes: ["*"],
                                styles: ["*"],
                                key: "style",
                                classes: ["*"],
                            },
                        ],
                    },
                    image: {
                        insert: {
                            integrations: ["upload"],
                        },
                        resizeUnit: "%",
                        toolbar: [
                            "imageTextAlternative",
                            "toggleImageCaption",
                            "imageStyle:inline",
                            "imageStyle:block",
                            "imageStyle:side",
                            "linkImage",
                        ],
                    },
                    table: {
                        contentToolbar: [
                            "tableColumn",
                            "tableRow",
                            "mergeTableCells",
                            "tableCellProperties",
                            "tableProperties",
                        ],
                    },
                    toolbar: {
                        items: [
                            "heading",
                            // "fontFamily",
                            "fontSize",
                            "alignment",
                            "fontColor",
                            "fontBackgroundColor",
                            "removeFormat",
                            "|",
                            "bold",
                            "italic",
                            "underline",
                            "link",
                            "|",
                            "imageUpload",
                            "mediaEmbed",
                            "|",
                            "bulletedList",
                            "numberedList",
                            "blockQuote",
                            "outdent",
                            "indent",
                            "insertTable",
                            "|",
                            "undo",
                            "redo",
                            "textPartLanguage",
                            "sourceEditing",
                        ],
                        shouldNotGroupWhenFull: true
                    },
                    mediaEmbed: {
                        previewsInData: true,
                    },
                    language: {
                        ui: "en",
                        textPartLanguage: [
                            {
                                title: "English",
                                languageCode: "en",
                                textDirection: "ltr",
                            },
                            {
                                title: "Arabic",
                                languageCode: "ar",
                                textDirection: "rtl",
                            },
                            {
                                title: "French",
                                languageCode: "fr",
                                textDirection: "ltr",
                            },
                        ],
                    },
                    placeholder: placeholder,
                } as any
            }
            onChange={(_: any, editor: any) => {
                const data = (editor as any).getData();
                // onChange(`<div
                //     class="ck-content"
                // >${data}</div>`);
                onChange(data);
            }}
            onError={(error: any) => {
                toast.error("An Error Occurred", {
                    description: error.message,
                });
            }}
        />
    );
}
export default DescriptionEditor;
