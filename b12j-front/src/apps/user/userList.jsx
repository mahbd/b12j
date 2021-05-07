import React, {useContext, useState} from 'react';
import {SuperContext} from "../../context";

const UserList = () => {
    const {userActs} = useContext(SuperContext);
    const [users] = useState(userActs.getList());
    return (
        <div className="container">
            <table className="table table-dark table-bordered">
                <thead>
                <tr>
                    <th>User id</th>
                    <th>First Name</th>
                    <th>Last Name</th>
                </tr>
                </thead>
                <tbody>
                {users.map((user) => <tr key={user.id}>
                    <td>{user.id}</td>
                    <td>{user.first_name}</td>
                    <td>{user.last_name}</td>
                </tr>)}
                </tbody>
            </table>
        </div>
    );
};

export default UserList;