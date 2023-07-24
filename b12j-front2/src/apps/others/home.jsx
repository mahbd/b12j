import React from "react";

import { Fade, Slide } from "react-awesome-reveal";
import { getCurrentUser } from "../../components/authService";

const Home = () => {
   const user = getCurrentUser();
   return (
      <div>
         <Fade duration={1000}>
            <div style={{ color: "#d03af2" }} className={"full-height fw-bolder display-6"}>
               {user && (
                  <Slide>
                     <p className={"full-opacity ps-5 text-end h4"}>Hey, {user.name}</p>
                  </Slide>
               )}
               <div style={{ height: "30%" }} />
               <Slide direction={"right"}>
                  <p className={"text-center display-1 fw-bolder align-content-center"}>Welcome to B12J</p>
               </Slide>
               <Fade duration={10000}>
                  <p style={{ color: "#0a1c8f" }} className={"text-center h2"}>
                     Online judge for beginners
                  </p>
               </Fade>
            </div>
         </Fade>
      </div>
   );
};

export default Home;
