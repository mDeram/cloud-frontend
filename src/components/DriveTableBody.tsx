import React, { useEffect, useRef } from "react";
import { useAtomValue } from "jotai";
import { pathAtom } from "../atoms/path";
import { AnyDirectoryItem } from "../types";
import getDriveItemPath from "../utils/getDriveItemPath";
import DriveItem from "./DriveItem";

interface DriveTableBodyProps {
    lsData: AnyDirectoryItem[] | undefined;
    selected: Set<AnyDirectoryItem>;
    changeChecked: (item: AnyDirectoryItem) => (value: boolean) => void;
}

const DriveTableBody: React.FC<DriveTableBodyProps> = ({
    lsData,
    selected,
    changeChecked
}) => {
    const path = useAtomValue(pathAtom);
    const ref = useRef<HTMLTableSectionElement>(null);

    useEffect(() => {
        ref.current?.scrollTo(0, 0);
    }, [path]);

    return (
        <tbody ref={ref} className="overflow-y-auto bg-primary-50 w-full max-w-screen-lg">
            {lsData?.map(item => (
                <DriveItem
                    key={getDriveItemPath(path, item)}
                    item={item}
                    checked={selected.has(item)}
                    setChecked={changeChecked(item)}
                />
            ))}
        </tbody>
    );
}

export default DriveTableBody;
