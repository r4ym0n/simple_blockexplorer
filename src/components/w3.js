import React, { Fragment } from "react";
import { useEffect, useState, useRef } from "react";
import Web3 from "web3";
import BlockInfoTab from "./blockInfoTab";

function W3() {
    
    const [blkInfo, setBlkInfo] = useState({});
    const prevBlk = useRef(); // 暂存BLK信息
    const [blkTime, setBlkTime] = useState(0);
    useEffect(() => {
        // this is a hack to get around the fact that the Metamask injected web3
        if (typeof window.web3 !== 'undefined') {
            window.web3 = new Web3(window.web3.currentProvider);
            console.log(window.web3);
        } else {
            const ethNodeUrl = new Web3.providers.WebsocketProvider('wss://mainnet.infura.io/ws/v3/d035f9c7e545469884f1dba93390f194'); // TODO: remote URL
            window.web3 = new Web3(ethNodeUrl);
            console.log(window.web3);
        }
        // 初始化web3
        w3DataInitial(window.web3).then(() => {
            setW3Subscriber(window.web3)
        })
        return function cleanup() {
            // 取消订阅
            if (window.web3) {
                window.web3.eth.clearSubscriptions()
                console.log('Successfully unsubscribed!');
            }
        }
    }, [])

    useEffect(() => {
        // 初始化BLKtimer
        function initTimer() {
            // 初始化UI
            return setInterval(() => {
                setBlkTime(c => c + 1)
            }, 1000)
        }
        let timer = initTimer();
        return function cleanup() {
            clearInterval(timer)
        }
    }, [])


    async function w3DataInitial(w3) {
        return w3.eth.getBlock("latest", false, (err, res) => {
            if (err) {
                console.log(res);
            }
            console.log(res);
            res.timeDelta = 0;
            setBlkInfo(res);
            prevBlk.current = res;
        })
    }

    async function setW3Subscriber(w3) {
        return w3.eth.subscribe('newBlockHeaders', (error, result) => {
            if (!error) {
                // 这里的result是一个区块头对象，包含了区块的基本信息，之后再去获得最新块
                let blk = w3.eth.getBlock(result.hash, false, (err, res) => {
                    if (err) {
                        console.log(res);
                    }
                    console.log(res);
                    res.timeDelta = res.timestamp - prevBlk.current.timestamp;
                    setBlkInfo(res);
                    prevBlk.current = res;
                    setBlkTime(0);

                })
                // result.timeDelta = result.timestamp - prevBlk.current.timestamp;
                // setBlkInfo(result);
                // prevBlk.current = result;
                
                // 更新BLKtimer
                return result;
            }
        }).on("connected", function (subscriptionId) {
            console.log('subscript successed', subscriptionId);
        })
    }

    return (
        <Fragment>
            <BlockInfoTab blkInfo={blkInfo} blkTime={blkTime} />
        </Fragment>
    );
}

export default W3;
