import React, { useState } from "react";
import { AiOutlineUser } from "react-icons/ai";
import { useLogoutMutation, useUserQuery } from "../generated/graphql";
import useOuterClick from "../hooks/useOuterClick";
import DeleteAccountPopup from "./DeleteAccountPopup";

interface UserProps {

}

const User: React.FC<UserProps> = () => {
    const [{ data }] = useUserQuery();
    const [,logout] = useLogoutMutation();
    const [showDropdown, setShowDropdown] = useState(false);
    const ref = useOuterClick(() => setShowDropdown(false), showDropdown);

    return (
        <div className="relative">
            <AiOutlineUser className="text-3xl test-user-dropdown bg-primary-50 hover:bg-primary-200 cursor-pointer rounded-full text-accent-600" onClick={() => setShowDropdown(prev => !prev)}/>
            {showDropdown &&
                <div className="flex flex-col text-xl z-20 absolute float-left right-0 top-full bg-primary-50 text-black border mt-2 p-2 w-64" ref={ref as any}>
                    <div className="flex flex-col">
                        <div>{data?.user?.username}</div>
                        <div>{data?.user?.email}</div>
                        <button className="btn" onClick={_ => logout()}>Log out</button>
                        <div className="border-b"></div>
                        <DeleteAccountPopup trigger={
                            <button className="btn text-red-600">Delete Account</button>
                        }/>
                    </div>
                </div>
            }
        </div>
    );
}

export default User;
