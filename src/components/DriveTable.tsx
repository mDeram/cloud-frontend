import React, { useState } from "react";
import Download from "./Download";
import DriveItem from "./DriveItem";
import Upload from "./Upload";
import { useLsQuery } from '../generated/graphql'
import Delete from "./Delete";
import Create from "./Create";
import pathLib from "path";

interface DriveItemsProps {
}

const DriveTable: React.FC<DriveItemsProps> = () => {
    const [path, setPath] = useState("/");
    const [{ data, fetching, error }] = useLsQuery({ variables: { path }});
    const [selected, setSelected] = useState<Set<string>>(new Set());
    const selectedEntries = Array.from(selected).filter(value => data?.ls.map(item => item.name).includes(value));

    function handleChange(name: string) {
        return (value: boolean) => {
            setSelected(prev => {
                const next = new Set(prev);
                if (value)  next.add(name);
                else        next.delete(name);

                return next;
            });
        }
    }

    function changePath(value: string) {
        setPath(prev => pathLib.join(prev, value));
        setSelected(new Set());
    }

    return (
        <div className="w-full">
            <p>{path}</p>
            <div className="flex">
                <Upload path={path}/>
                <Create path={path}/>
                <Download names={selectedEntries}/>
                <Delete path={path} names={selectedEntries}/>
            </div>
            <ul className="">
                {data?.ls.map(item => (
                    <DriveItem
                        key={item.name} name={item.name} type={item.type}
                        checked={selected.has(item.name)}
                        handleChange={handleChange(item.name)}
                        changePath={changePath}
                    />
                ))}
            </ul>
        </div>
    )
}

export default DriveTable
