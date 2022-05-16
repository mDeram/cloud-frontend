import React, { useEffect, useState } from "react";
import Path from "./Path";
import Actions from "./Actions";
import DriveTable from "./DriveTable";
import useListItems from "../hooks/useListItems";
import { SearchDirectoryItem } from "../generated/graphql";
import { AnyDirectoryItem } from "../types";
import EmptyData from "./EmptyData";
import FetchingData from "./FetchingData";

interface DriveContentProps {
    path: string;
    appendPath: (path: string) => void;
    setPath: (newPath: string) => void;
    searchResults: SearchDirectoryItem[] | undefined;
    searchFetching: boolean;
}

const DriveContent: React.FC<DriveContentProps> = ({
    path,
    appendPath,
    setPath,
    searchResults,
    searchFetching
}) => {
    const { lsData, fetching } = useListItems(path, searchResults, searchFetching);
    const [selected, setSelected] = useState<Set<AnyDirectoryItem>>(new Set());
    const selectedItems = Array.from(selected);

    function handleChangeChecked(item: AnyDirectoryItem) {
        return (value: boolean) => {
            setSelected(prev => {
                const next = new Set(prev);
                if (value)  next.add(item);
                else        next.delete(item);

                return next;
            });
        }
    }

    function selectAll() {
        setSelected(new Set(lsData));
    }

    function clearSelected() {
        setSelected(new Set());
    }

    function isSelectedAll() {
        return selected.size > 0 && selected.size === lsData?.length;
    }

    useEffect(() => {
        clearSelected();
    }, [lsData]);

    function renderTable() {
        if (fetching) {
            return <FetchingData/>;
        }

        if (!lsData?.length) {
            return <EmptyData path={path}/>;
        }

        return (
            <DriveTable
                path={path}
                lsData={lsData}
                selected={selected}
                items={selectedItems}
                changeChecked={handleChangeChecked}
                appendPath={appendPath}
                checked={isSelectedAll()}
                selectAll={selectAll}
                clearSelected={clearSelected}
            />
        )
    }

    return (
        <section className="flex flex-col w-full shadow-2xl">
            <Actions path={path} items={selectedItems}/>
            <Path path={path} setPath={setPath}/>
            {renderTable()}
        </section>
    )
}

export default DriveContent;
