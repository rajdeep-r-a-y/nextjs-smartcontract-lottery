// function to enter the lottery
import { useWeb3Contract } from "react-moralis";
// useWeb3Contract is a hook 
import { abi, contractAddresses } from "../constants";
import { useMoralis } from "react-moralis";
import { useEffect, useState } from "react";
import { ethers } from "ethers";
import { useNotification } from "web3uikit";

export default function LotteryEntrance() {
    const { chainId: chainIdHex, isWeb3Enabled, web3 } = useMoralis();
    const chainId = parseInt(chainIdHex);
    const raffleAddress = chainId in contractAddresses ? contractAddresses[chainId][0] : null;

    const [entranceFee, setEntranceFee] = useState("0");  // we use the state hook to re-render entrance fee on frontend
    // entranceFee will be the variable we call to get the entranceFee
    // setEntranceFee will be the function we call to update or set entranceFee
    // whenever entranceFee is set, we trigger a re-render to the frontend
    // useState("0") means entranceFee starts out at 0

    const dispatch = useNotification(); // useNotification gives us dispatch, this will be a pop-up

    const [numPlayers, setNumPlayers] = useState("0");
    const [recentWinner, setRecentWinner] = useState("0");

    const { runContractFunction: enterRaffle, isLoading, isFetching } = useWeb3Contract({
        abi: abi,
        contractAddress: raffleAddress,
        functionName: "enterRaffle",
        params: {},
        msgValue: entranceFee,
    })

    const { runContractFunction: getEntranceFee } = useWeb3Contract({
        abi: abi,
        contractAddress: raffleAddress,
        functionName: "getEntranceFee",
        params: {},
    })

    const { runContractFunction: getNumberOfPlayers } = useWeb3Contract({
        abi: abi,
        contractAddress: raffleAddress,
        functionName: "getNumberOfPlayers",
        params: {},
    })

    const { runContractFunction: getRecentWinner } = useWeb3Contract({
        abi: abi,
        contractAddress: raffleAddress,
        functionName: "getRecentWinner",
        params: {},
    })

    async function updateUI() {
        const entranceFeeFromCall = (await getEntranceFee()).toString();
        const numPlayersFromCall = (await getNumberOfPlayers()).toString();
        const recentWinnerFromCall = (await getRecentWinner());
        setEntranceFee(entranceFeeFromCall);
        setNumPlayers(numPlayersFromCall);
        setRecentWinner(recentWinnerFromCall);

    }

    // // Code for Winner to be updated on front end automatically
    // async function listenForWinnerToBePicked() {
    //     const lottery = new ethers.Contract(raffleAddress, abi, web3)
    //     console.log("Waiting for a winner ...");
    //     await new Promise (async(resolve, reject) => {
    //         lottery.once("WinnerPicked", async () => {
    //             console.log("We got a winner!");
    //             try {
    //                 await updateUI();
    //                 resolve();
    //             } catch (error) {
    //                 console.log(error);
    //                 reject(error);
    //             }
    //         });
    //     });
    // }

    useEffect(() => {
        if (isWeb3Enabled) {
            // try to read raffle entrance fee

            updateUI();
            //listenForWinnerToBePicked();
        }
    }, [isWeb3Enabled]);

    const handleSuccess = async function (tx) {
        await tx.wait(1);
        handleNewNotification(tx);
        updateUI();
    }

    const handleNewNotification = () => {
        dispatch({
            type: "info",
            message: "Transaction Complete!",
            title: "Transaction Notification",
            position: "topR",
            icon: "bell",
        })
    }

    return (
        <div className="p-5">Hi from LotteryEntrance !
            {raffleAddress ? (
                <div className="">
                    <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ml-auto"
                        onClick={async function () {
                            await enterRaffle({
                                // parameters of enterRaffle(): they can be onSuccess, onError, onComplete
                                onSuccess: handleSuccess,
                                onError: (error) => console.log(error)

                            })
                        }}
                        disabled={isLoading || isFetching}
                    >
                        {isLoading || isFetching ? (
                            <div className="animate-spin spinner-border h-8 w-8 border-b-2 rounded-full"></div>
                        ) : (
                            "Enter Raffle"
                        )}</button>
                    <div>Entrance Fee : {ethers.utils.formatUnits(entranceFee, "ether")} ETH</div>
                    <div>Number of Players : {numPlayers}</div>
                    <div > Recent Winner : {recentWinner}</div>
                </div>
            ) : (
                <div>No Raffle Address detected!</div>
            )}

        </div>
    )
}