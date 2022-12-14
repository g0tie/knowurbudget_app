import React, { useState } from "react";
import { register, syncData, syncDataFromLocal } from "../api";
import Alert from "../components/Alert";
import { useNavigate, useLocation} from "react-router-dom";
import { useMainContext } from "../store/contexts";
import { getCurrentUser, setCurrentUser, persistData } from "../store/database";
import AppIcon from "../components/AppIcon";
import { calculateTotalExpenses } from "../helpers/common";

const Register = ({}) => {
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [lastName, setLastName] = useState('');
  const [firstName, setFirstName] = useState('');
  const [isVisible, setVisible] = useState(false);
  const navigate = useNavigate();
  const { state, dispatch } = useMainContext();

  async function handleSubmit (e) {
    e.preventDefault();
    const isUserLogged = await JSON.parse( window.localStorage.getItem("logged")) ?? false;
    let csrf, data;
    
    let response = await register({
      username: firstName,
      password,
      email
    });

    if (response.status !== 200) {
      await dispatch({type:"setError", payload: response.data.message ?? response.data.errors[0].msg});
      await dispatch({type: "setLoggedState", payload: false});
      await  window.localStorage.removeItem("logged")
      await setVisible(true);
      return;
    } 
    csrf = response.data.csrf;

    if (isUserLogged) {
      data = await syncDataFromLocal(state, csrf);
      csrf = data.data.csrf;
      if (data?.status !== 200) {
        await dispatch({type:"setError", payload: response.data?.message ?? response.data.errors[0].msg});
        await dispatch({type: "setLoggedState", payload: false});
        await  window.localStorage.removeItem("logged")
      }
    }

    await setCurrentUser(response.data.id);
    data = await syncData(getCurrentUser(),csrf) ;

    const newData = data.data.user;
    const newState = await {
      ...state,
      csrf: data.data.csrf,
      logged: true,
      expenses: newData.expenses.map(expense => {
        return{...expense, remoteId: expense.id, typeid: expense.typeid ?? expense.typeId} 
      }),
      user: {name: newData.username},
      limit: { value: parseFloat( newData.limit.amount) },
      totalExpenses: calculateTotalExpenses(newData.expenses)
    }

    await dispatch({type: "setUserData", payload: newState});
    await persistData(newState, getCurrentUser());
    
    await dispatch({type: "setError", payload: false});
    await dispatch({type: "setLoggedState", payload: true});
    
    await window.localStorage.setItem("lastlog", new Date());
    
    setVisible(false);
    navigate("/");
  }

    return (
        
        <div className="min-h-full flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
  <div className="max-w-md w-full space-y-8">
    <div>
      <AppIcon absolute={true} />
      <h2 className="mt-6 text-center text-3xl tracking-tight font-bold text-gray-900">Inscription</h2>
      <p className="mt-2 text-center text-sm text-gray-600">
      </p>
    </div>
  
    <Alert isVisible={isVisible}/>
    <form className="mt-8 space-y-6" action="#" method="POST">
      <input type="hidden" name="remember" value="true" />
      <div className="rounded-md shadow-sm -space-y-px">
        <div>
          <label htmlFor="lastname" className="sr-only">Nom</label>
          <input 
          onChange={(e) => setLastName(e.target.value)}
          value={lastName}
          id="lastname" name="lastname" type="text" required className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm" placeholder="Nom" />
        </div>
        <div>
          <label htmlFor="firstname" className="sr-only">Pr??nom</label>
          <input 
          onChange={(e) => setFirstName(e.target.value)}
          value={firstName}
          id="firstname" name="firstname" type="text" required className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm" placeholder="Pr??nom" />
        </div>
        <div>
          <label htmlFor="email-address" className="sr-only">Email</label>
          <input 
          onChange={(e) => setEmail(e.target.value)}
          value={email}
          pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$"
          id="email-address" name="email" type="email" required className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm" placeholder="Email" />
        </div>
        <div>
          <label htmlFor="password" className="sr-only">Mot de passe</label>
          <input 
          onChange={(e) => setPassword(e.target.value)}
          value={password}
          id="password" name="password" type="password" required className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm" placeholder="Mot de passe" />
        </div>
      </div>

      <div>
        <button 
        onClick={handleSubmit}
        type="submit" className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-budget hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
          <span className="absolute left-0 inset-y-0 flex items-center pl-3">
            <svg className="h-5 w-5 text-indigo-500 group-hover:text-indigo-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
            </svg>
          </span>
          S'inscrire
        </button>
      </div>
    </form>
  </div>
</div>

    )
}

export default Register;
