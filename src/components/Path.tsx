import React from "react";

interface PathProps {
    path: string;
    setPath: (newPath: string) => void;
}

const Path: React.FC<PathProps> = ({
    path,
    setPath
}) => {
    function renderPathButtons() {
        const pathParts = path.split("/");
        pathParts.pop();
        pathParts[0] = "Cloud";

        const result: JSX.Element[] = [];

        const getSetPathCb = (value: string) => {
            return () => setPath(value);
        }

        let totalPath = "/";
        for (let i = 0; i < pathParts.length; i++) {
            const part = pathParts[i];
            if (i !== 0) totalPath += `${part}/`;

            result.push(<li className="cursor-pointer" onClick={getSetPathCb(totalPath)}>{part}</li>);
            result.push(<li className="mx-5">/</li>);
        }
        result.pop(); // Remove the last "<li>/</li>"
        return result;
    }

    return (
        <div className="flex list-none">
            {renderPathButtons()}
        </div>
    )
}

export default Path
