import { onAuthStateChanged, User } from "firebase/auth";
import { auth } from "../firebase/firebaseConfig";
import React, { useLayoutEffect, useState } from "react";

const useLoginUser = () => {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const getLoginUser = (): Promise<User | null> =>
        new Promise((resolve) => {
            onAuthStateChanged(auth, (u) => {
                resolve(u);
            });
        });

    useLayoutEffect(() => {
        (async () => {
            const user = await getLoginUser();
            setUser(user);
            setIsLoading(false);
        })();
    }, []);

    return { user, isLoading };
};

export default useLoginUser;
