import { useMoralis } from "react-moralis";
import { useEffect } from "react";

// to give other applications the ability to use this component, we use export default
export default function ManualHeader() {
    const { enableWeb3, account, isWeb3Enabled, Moralis, deactivateWeb3, isWeb3EnableLoading } = useMoralis();  // useMoralis() is a react hook. Hooks let you "hook into" react state and lifestyle features. Hooks let you keep track of state in a react application

    useEffect(() => {
        if (isWeb3Enabled) return;
        if (typeof window !== "undefined") {
            if (window.localStorage.getItem("connected")) {
                enableWeb3();
            }
        }

    }, [isWeb3Enabled])
    // no dependency array : useEffect runs anytime something re-renders
    // blank dependency array : useEffect runs one time on load
    // dependency array : useEffect runs anytime something in the array changes

    // this useEffect checks if we have disconnected from metamask account, it constantly checks for us being connected
    useEffect(() => {
        // onAccountChanged() takes a function as input parameter
        Moralis.onAccountChanged((account) => {
            console.log(`Account changed to ${account}`);
            if(account == null)
            {
                window.localStorage.removeItem("connected")
                deactivateWeb3();  // this sets isWeb3Enabled to false
                console.log("Null account found");
                
            }

        })
    }, [])
    return (
        <div>
            {account ? (<div>Connected to {account.slice(0, 6)}...{account.slice(account.length - 4)}</div>) : (<button
                onClick={async () => {
                    await enableWeb3();
                    if (typeof window !== "undefined") {
                        window.localStorage.setItem("connected", "injected"); //we are storing a new key value pair in local storage in browser(inspect -> >>(arrow beside console) -> application -> local storage)
                    }
                }}
                disabled={isWeb3EnableLoading}
                >Connect</button>)}

            {/* await enableWeb3() connects to metamask */}
        </div>
    )
}