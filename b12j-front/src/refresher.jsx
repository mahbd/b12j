import React, {useContext, useEffect, useState} from 'react';
import App from "./app";
import {SuperContext} from "./context";

const Refresher = () => {
  const [refresh, setRefresh] = useState(false);
  const {userActs} = useContext(SuperContext);

  // let unSub = userActs.store.subscribe(() => {
  //   setRefresh(!refresh);
  //   unSub();
  // })

  return (
    <div>
      <App />
    </div>
  );
};

export default Refresher;