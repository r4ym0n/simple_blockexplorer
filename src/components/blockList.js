import React from "react";

function BlockList(props) {
    const { blkList, } = props;
    if ( JSON.stringify(blkList) === "{}") {
        console.log(blkList);
        return (
            <div>
                <h1>Loading...</h1>
            </div>
        )
    } 
        return (
            <div className="Block-list-tab">
                <table>
                <thead>
                    <tr>
                    <th>No. </th>
                    <th>Height</th>
                    <th>BlockHash</th>
                    </tr>
                </thead>
                    <tbody>
                        {blkList.map((key, index) => {
                            return (
                                <tr key={key[0]}>
                                    <td>{index}</td>
                                    <td >{key[0]}</td>
                                    <td >{key[1]}</td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
            </div>
        );
    
}

export default BlockList;