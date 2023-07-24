import React from "react";
import { css } from "../../main_css";

const Footer = () => {
   const d = new Date();
   return (
      <div className={"mt-5 pt-5 " + css.hideOnPhone}>
         <div className={"bg-dark text-white text-center fixed-bottom"}>
            <p>
               Developed and maintained by{" "}
               <a className={"text-white fw-bolder"} href={"https://www.linkedin.com/in/mahmudula2000/"}>
                  Mahmudul Alam
               </a>
            </p>
            <p>
               2020 May - {d.getFullYear()} {d.toLocaleString("default", { month: "long" })}
            </p>
         </div>
      </div>
   );
};

export default Footer;
