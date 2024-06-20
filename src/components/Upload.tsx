import React, { useState } from "react";
import pathLib from "path";
import { AiOutlineCloudUpload } from "react-icons/ai";
import useOuterClick from "../hooks/useOuterClick";
import { useUploadContext } from "../contexts/Upload";
import { useAtomValue } from "jotai";
import { pathAtom } from "../atoms/path";
import classNames from "classnames";

const Upload: React.FC = () => {
    const path = useAtomValue(pathAtom);
    const [showDropdown, setShowDropdown] = useState(false);
    const ref = useOuterClick(() => setShowDropdown(false), showDropdown);
    const { pushUploads } = useUploadContext();

    function upload(files: HTMLInputElement["files"]) {
        if (!files) return;

        const toUpload = Array.from(files).map(file => ({
            path,
            additionalPath: pathLib.dirname(file.webkitRelativePath || ""),
            file
        }));

        pushUploads(toUpload);
    }

    return (
        <div className="relative">
            <button className="btn flex items-center h-full" onClick={() => setShowDropdown(prev => !prev)}>
                <AiOutlineCloudUpload className="text-accent-600"/>
                Import
            </button>
            <div className={classNames("flex flex-col absolute top-full w-full border", {
                    "hidden": !showDropdown
                })}
                ref={ref as any}
                onClick={() => setShowDropdown(false)}
            >
                <label className="btn" htmlFor="upload-files" tabIndex={0}>Files</label>
                <input className="hidden" id="upload-files" name="upload-files" onChange={e => upload(e.target.files)} type="file" multiple/>


                <label className="btn" htmlFor="upload-folder" tabIndex={0}>Folder</label>
                <input className="hidden" id="upload-folder" name="upload-folder" onChange={e => upload(e.target.files)} type="file" webkitdirectory="" directory=""/>
            </div>
        </div>
    )
}

declare module 'react' {
  interface HTMLAttributes<T> extends AriaAttributes, DOMAttributes<T> {
    directory?: string;
    webkitdirectory?: string;
  }
}

export default Upload
