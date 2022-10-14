import ProgressBar from "../components/ProgressBar";
import ProfileIcon from "../components/ProfileIcon";
import {useMainContext} from "../store/contexts"
import React from "react";
import AppIcon from "../components/AppIcon";

const Header = () => {
    const {state} = useMainContext()
    return (
      <div className="m-5 flex flex-row justify-between  ">

        <div className="xs:hidden md:flex">
        <AppIcon />

        </div>
        <ProgressBar />
        <ProfileIcon username={state.user.name}/>
      </div>
    );
  }
  
  export default Header;
  