// import logo from './logo.svg';
import '../styles/App.css';
import '../styles/Block.css';

import React from "react";
import { useEffect, useState, useRef } from "react";
import Web3 from "web3";
import BlockInfoTab from '../components/blockInfoTab';
import BlockTxList from '../components/blockTxList';
import BlockList  from '../components/blockList';

import { Grid } from '@material-ui/core';


function Dashboard() {

    const [blkInfo, setBlkInfo] = useState({});
    const prevBlk = useRef(); // 暂存BLK信息
    const [blkTime, setBlkTime] = useState(0);
    const [networkName, setNetworkName] = useState('Unknown');
    const [blkList, setBlkList] = useState([]);
    useEffect(() => {
        // this is a hack to get around the fact that the Metamask injected web3
        if (typeof window.web3 !== 'undefined') {
            window.web3 = new Web3(window.web3.currentProvider);
            console.log(window.web3);
        } else {
            console.log('No web3? You should consider trying MetaMask!');
            // fallback - use your fallback strategy (local node / hosted node + in-dapp id mgmt / fail)
            console.log('using infura node');
            const ethNodeUrl = new Web3.providers.WebsocketProvider('wss://mainnet.infura.io/ws/v3/d035f9c7e545469884f1dba93390f194'); // TODO: remote URL
            window.web3 = new Web3(ethNodeUrl);
            console.log(window.web3);
        }
        // 初始化web3
        w3DataInitial(window.web3).then(() => {
            setW3Subscriber(window.web3)
        })
        
        window.ethereum.on('networkChanged', function(networkId){
            console.log('networkChanged',networkId);
            window.web3.eth.clearSubscriptions()
            w3DataInitial(window.web3).then(() => {
                setW3Subscriber(window.web3)
            })
        });
        
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
        w3.eth.getBlock("latest", false, (err, res) => {
            if (err) {
                console.log(res);
            }
            console.log(res);
            res.timeDelta = 0;
            setBlkInfo(res);
            prevBlk.current = res;
        })
        w3.eth.net.getId().then(id => {
            switch (id) {
                case 1:
                    setNetworkName('Mainnet');
                    break;
                case 3:
                    setNetworkName('Ropsten');
                    break;
                case 4:
                    setNetworkName('Rinkeby');
                    break;
                case 42:
                    setNetworkName('Kovan');
                    break;
                case 137:
                    setNetworkName('polygon');
                    break;
                default:
                    setNetworkName('Unknown');
                    break;
            }
        })

    }
    function pushBlkList(blk) {

    }

    async function setW3Subscriber(w3) {
        return w3.eth.subscribe('newBlockHeaders', (error, result) => {
            if (!error) {
                // 这里的result是一个区块头对象，包含了区块的基本信息，之后再去获得最新块
                w3.eth.getBlock(result.hash, false, (err, res) => {
                    if (err) {
                        console.log(res);
                    }
                    if (!res) {
                        console.log('No block found!');
                        return;
                    }

                    console.log(res);
                    res.timeDelta = res.timestamp - prevBlk.current.timestamp;
                    setBlkInfo(res);
                    prevBlk.current = res;
                    setBlkTime(0);
                    // pushBlkList(res);
                    setBlkList(blkList => [...blkList, [res.number, res.hash]]);
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
        <div className='App'>
            <div className='App-body'>
                <h1 className='Main-title'>
                    Simple Ethereum Block Explorer
                </h1>
                <Grid container spacing={3}>
                    <Grid item xs={6}>
                        <Grid>
                        <h4 className='Tab-title'>{networkName}</h4>
                        <BlockInfoTab blkInfo={blkInfo} blkTime={blkTime} />
                        </Grid>
                        <Grid>
                        <h4 className='Tab-title'>{`Tx List (${blkInfo.transactions !== undefined ?blkInfo.transactions.length:0})`}</h4>
                        <BlockTxList blkInfo={blkInfo} />

                        </Grid>
                    </Grid>
                    <Grid item xs={6}>
                    
                    <h4 className='Tab-title'>{`Block List`}</h4>
                        <BlockList blkList={blkList}/>
                    </Grid>
                    <Grid item xs={6}>
                        
                    </Grid>
                    <Grid item xs={6}>
                        
                    </Grid>
                </Grid>
                <hr style={{"width": "100%"}} />

                <footer className="footer">
                    Powered by Vercal 
                </footer>
            </div>

        </div>
    );
}

export default Dashboard;

