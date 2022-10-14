import { useMainContext } from "../store/contexts";
import React from "react";
import { deleteData, getCurrentUser, getDatas, updateData } from "../store/database";
import { calculateTotalExpenses } from "../helpers/common";
import { updateRemoteExpense, removeRemoteExpense } from "../api";
import { data } from "autoprefixer";
import { seedColors } from "../store/seeders";
import Modal from "./Modal";
import { useState } from "react";

const Expense = ({title, amount, date, type, id, remoteId, typeId}) => {
    const {state, dispatch} = useMainContext();
    const [isOpen, setIsOpen] = useState(false);
    const [error, setError] = useState(false);
    const [expenseTitle, setExpenseTitle] = useState(title);
    const [expenseAmount, setExpenseAmount] = useState(amount);
    const [expenseType, setExpenseType] = useState(typeId);

    async function removeExpense(id)
    {
        await deleteData(id, 'expenses', getCurrentUser());

        const expenses = await  state.expenses.filter(expense => expense.id !== id);
        const totalExpenses = await calculateTotalExpenses(expenses);

        const newState = {...state,
          expenses,
          totalExpenses
        };

        await dispatch({type:'initContext', payload:newState});

        data = remoteId && await removeRemoteExpense(remoteId, state.csrf);
        await dispatch({type: "setCSRF", payload:data.csrf});
    }

    async function updateExpense()
    {
      if (await title === "") {
        setError('Veuillez saisir un titre');
        return;
      }
      setError(false);

      const expense = {
          id,
          name: expenseTitle,
          amount: expenseAmount,
          typeid: await parseInt( expenseType ),
          date: date,
          user_id: await parseInt( getCurrentUser() ),
      }

      const isUserLogged = JSON.parse( window.localStorage.getItem("logged")) ?? false;
      
      if (isUserLogged) {

          const data = await updateRemoteExpense(expense, state.csrf);
          expense.remoteId = data.value;
          await dispatch({type:"setCSRF", payload:data.csrf});
      }

      await updateData(id, parseInt(getCurrentUser()), 'expenses', expense);
      const expenses = await  getDatas('expenses', getCurrentUser());
      const totalExpenses = await calculateTotalExpenses(expenses);
      const newState = {...state,
        expenses,
        totalExpenses
      };

      await dispatch({type:'initContext', payload:newState});
      await setIsOpen(false);
      setIsOpen(false)
    }

    return (
      <>
      <div className="hover:cursor-pointer hover:bg-gray-100 rounded-lg bg-white shadow-lg max-w-md w-full mb-2" 
      onClick={(e) => setIsOpen(true)}
      >
          <div className="p-4">
            <div className="flex flex-row justify-between">

              <h1 className="font-bold text-lg ">{title}</h1>
            </div>

            <div className="flex flex-row">
                <div className="flex flex-col">
                    <span className="text-md text-slate-400	mt-2">{date}</span>
                    <span style={{
                      backgroundColor: seedColors()[parseInt(typeId) - 1],
                      color:"white",
                      fontWeight:"bold",
                      padding:"2px",
                      borderRadius:"10px",
                      maxWidth:"100px"
                    }}>{type}</span>
                </div>
                
                <span className="flex-grow text-right md:text-4xl xs:text-2xl">{expenseAmount} €</span>
            </div>

          </div>
      </div>

          <Modal 
            isOpen={isOpen} title="Modifier la dépense" action={updateExpense} closeAction={setIsOpen} deleteAction={() => removeExpense(id)}> 
            
            {
                error &&
                <div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                    <strong class="font-bold">Erreur ! </strong>
                    <span class="block sm:inline">{error}</span>
                   
                </div>
            }

            <form className="">
                <div className="mb-4">
                <label 
                required
                className="block text-gray-700 text-sm font-bold mb-2" htmlFor="username">
                    Titre
                </label>
                <input 
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" 
                id="username" type="text" placeholder="Titre" 
                onChange={(e) => setExpenseTitle(e.target.value)}
                value={expenseTitle}
                />
                </div>
                <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="username">
                    Montant
                </label>
                <input 
                onChange={(e) => setExpenseAmount(parseInt(e.target.value,10))}
                value={expenseAmount}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="username" type="number" placeholder="Montant en €" />
                </div>

                <div className="flex flex-row items-center my-2 ">
                    <p>Sélectionner un type: </p> 
                    <select 
                    value={expenseType}
                    onChange={e => setExpenseType(e.target.value)}
                    className="ml-2 p-2 form-select appearance-none
                    w-56
                    block
                    px-3
                    py-1.5
                    text-base
                    font-normal
                    text-gray-700
                    bg-white bg-clip-padding bg-no-repeat
                    border border-solid border-gray-300
                    rounded
                    transition
                    ease-in-out
                    m-0
                    focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none">

                        {
                            state.types && state.types.map((type, index) => (
                                <option key={type.id} value={type.id}>{type.name}</option>
                            ))
                        }
                    </select>
                </div>
            </form>
            </Modal>
      </>
    );
  }
  
export default Expense;
  