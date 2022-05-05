import React from "react";


function BlockTxList(props) {
    const { blkInfo, } = props;
    if ( JSON.stringify(blkInfo) === "{}") {
        console.log(blkInfo);
        return (
            <div>
                <h1>Loading...</h1>
            </div>
        )
    } 
        return (
            <div className="Block-tx-tab">
                <table>
                <thead>
                    <tr>
                    <th>No. </th>
                    <th>Difficulty</th>
                    </tr>
                </thead>
                    <tbody>
                        {blkInfo.transactions.map((key, index) => {
                            return (
                                <tr key={key}>
                                    <td>{index}</td>
                                    <td >{key}</td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
            </div>
        );
    
}

export default BlockTxList;