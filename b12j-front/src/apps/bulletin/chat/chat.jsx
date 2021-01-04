import React, {useContext} from 'react';
import {SuperContext} from "../../../app";

const Chat = () => {
    // const {ws} = useContext(SuperContext)
    // ws.addEventListener("message", (message) => {
    //     console.log(JSON.parse(message.data).data);
    // });
    return (
        <div>
            <h1>Messaging</h1>
        </div>
    );
};

export default Chat;