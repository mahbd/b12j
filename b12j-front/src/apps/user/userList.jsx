import React, { useContext} from "react";
import { SuperContext } from "../../context";
import { Table } from "../../components/customTags";

const UserList = () => {
  const { userActs } = useContext(SuperContext);
  const data = [];

  console.log("Running user")

  for (let user of userActs.getList()) {
    data.push([user.id, user.username, user.first_name, user.last_name]);
  }


  return (
    <div className="container">
      <Table headers={["User id", "Username", "First Name", "Last Name"]} body={data} />
    </div>
  );
};

export default UserList;

export const UserListSingleRow = ({ users, userActs }) => {
  return users.map((userId) => (
    <p className="user" key={userId}>
      {userActs.fullName(userId)}
    </p>
  ));
};
