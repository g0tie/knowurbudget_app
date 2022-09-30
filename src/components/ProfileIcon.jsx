import { useState } from "react";
import React from "react";
import { useMainContext } from "../store/contexts";
import { useNavigate } from "react-router-dom";
import { setCurrentUser, deleteUserData, getCurrentUser } from "../store/database";
import  {getDefaultUserData} from "../helpers/common";
import {logout} from "../api/";

const ProfileIcon = ({username}) => {

    const [isOpen, setIsOpen] = useState(false);
    const { state, dispatch } = useMainContext();
    const navigate = useNavigate();

   async function handleLogout(e)
   {
      try {
         await deleteUserData(getCurrentUser());
         await setCurrentUser(0);
         await dispatch({type:"setLoggedState", payload: false});

         const newState = await getDefaultUserData(state);
         await dispatch({type:"initContext", payload: newState});
         await  window.localStorage.removeItem("logged")
         await logout(state.csrf);
      } catch(e) {
         console.error(`Error occured: ${e}`)
      }
   }

    return (
      <div className="absolute right-2 top-2">
         <button 
         onClick={() => setIsOpen(!isOpen)}
         className="text-budget block h-10 w-10 rounded-full overflow-hidden border-2 border-gray-600 focus:outline-none focus-border-white">
                {/* <img className="h-full w-full object-cover" src=""/> */}
                <svg xmlns="http://www.w3.org/2000/svg" className="h-full w-full object-cover" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z" clipRule="evenodd" />
               </svg>
         </button>

         { isOpen && 
            <div className=" absolute right-0 mt-2 w-48 bg-white py-2 rounded-lg shadow-lg">
               <span className="px-4 py-2 w-full block border-b-2 ">{username}</span>


               { 
                  state.childrenAccounts.length > 0 && <div>
                     { state.childrenAccounts.map(account => {
                        return (
                           <div>
                              <button onClick={(e) => dispatch({type: "switchUser", payload: account.id })} >{account.username}</button>
                           </div> 
                        )
                     })}

                     { state.previousUser && <button onClick={(e) => dispatch({type: "switchUser", payload: state.previousUser })}>Go back to parent account</button>
                     
                     }
                  </div>
               }
               { !state.logged && <a className="mt-2 block px-4 py-2 hover:bg-budget hover:text-white" href="#" onClick={() => navigate('/login')}>Connexion / Inscription</a>}

               { state.logged && <a className="mt-2 block px-4 py-2 hover:bg-budget hover:text-white" href="#" onClick={handleLogout}>Déconnexion</a> }
            </div>
         }
         
      </div>
    );
  }
  
  export default ProfileIcon;