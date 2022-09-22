import React from "react";
import {getDatas, getData, getCurrentUser, getJWT, setCurrentUser} from "./database";
import { calculateTotalExpenses } from "../helpers/common";
import {
  updateData, 
  getExpensesByType, 
  insertData,
  deleteData,
  persistData
} from "../store/database";
import { syncData } from "../api";

const MainContext = React.createContext();

/**
 * Set the reudcer function to modify global state data
 * @param {Object} state 
 * @param {Object} action 
 * @returns {Object} the new modified state
 */
function MainReducer(state, action) {
    switch (action.type) {

      case 'setLimit': {
        updateData(getCurrentUser(),'limit', action.payload);
        return {...state, limit: {value: action.payload}};
      }

      case 'sortExpensesByType': {
        let expenses = getExpensesByType(parseInt(action.payload), getCurrentUser());
        return {...state, 
          expenses
        }
      }

      case 'setError': {
        return {...state, 
          error: action.payload
        }
      }

      case 'setLoggedState': {
        return {...state, 
          logged: action.payload
        }
      }
      
      case 'setUserData': {
        const userDatas = action.payload;
        const totalExpenses = calculateTotalExpenses(userDatas.user.expenses);
        const newState = {...state,
          csrf: userDatas.csrf,
          logged: true,
          totalExpenses,
          expenses: userDatas.user.expenses.map(expense => {
            return{...expense, remoteId: expense.id} 
          }),
          user: {name: userDatas.user.username},
          limit: { value: parseInt( userDatas.user.limit.amount) },
        }

        persistData(newState, getCurrentUser());
        
        return newState
      }

      case 'initContext': {
        return action.payload;
      }

      case 'setCSRF': {
        return {...state, csrf: action.payload}
      }

      default: {
        throw new Error(`Unhandled action type: ${action.type}`)
      }
    }
}

/**
 * Set global state context at app launch
 * @param {Props} param0 
 * @returns {React.FC}
 */
function MainProvider({children}) {
    let expenses = getDatas('expenses');
    let totalExpenses = calculateTotalExpenses(expenses);

    const [state, dispatch] = React.useReducer(MainReducer, {
        types: getDatas("types"),
        limit: 0,
        expenses,
        totalExpenses,
        user: {
          name:"Pablo"
        },
        error:false,
        logged: false,
        childrenAccounts: [],
        currentUser: null,
        csrf: null
    })

    const value = {state, dispatch}
    return <MainContext.Provider value={value}>{children}</MainContext.Provider>
}

function useMainContext() {
    const context = React.useContext(MainContext)
    if (context === undefined) {
        throw new Error('useMainContext must be used within a MainProvider')
    }
    return context
}
  
export{
    MainProvider,
    useMainContext,
    MainContext
};