import Modal from "./Modal";
import React, { useState } from 'react';
import { useMainContext } from '../store/contexts';
import { getDatetime, calculateTotalExpenses } from '../helpers/common';
import { getCurrentUser, getData, getDatas, getJWT, insertData } from "../store/database";
import { addRemoteExpense } from "../api";

const AddExpenseBtn = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [title, setTitle] = useState("");
    const [amount, setAmount] = useState(0);
    const [type, setType] = useState(1);
    const [error, setError] = useState(false);
    const {state, dispatch} = useMainContext();
    
    async function addExpense() {
        if (await title === "") {
            setError('Veuillez saisir un titre');
            return;
        }
        setError(false);

        const expense = {
            name: title,
            amount,
            typeid: await parseInt( type ),
            date: await getDatetime(),
            user_id: await parseInt( getCurrentUser() ),
        }
        
        const isUserLogged = JSON.parse( window.localStorage.getItem("logged")) ?? false;
        
        if (isUserLogged) {

            const data = await addRemoteExpense(expense, state.csrf);
            expense.remoteId = data.value;
            await dispatch({type:"setCSRF", payload:data.csrf});
        }

        await insertData('expenses', expense);
        const expenses = await  getDatas('expenses', getCurrentUser());
        const totalExpenses = await calculateTotalExpenses(expenses);

        const newState = {...state,
          expenses,
          totalExpenses
        };

        await dispatch({type:'initContext', payload:newState});
        await setIsOpen(false);
    }

    return (
        <>
            <button 
            data-testid="addExpense"
            onClick={() => setIsOpen(true)}
            className='float-right text-center rounded-full w-16 h-16 sticky bottom-8 right-8 bg-budget text-white'>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 inline" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            </button>

            <Modal 
            
            isOpen={isOpen} title="Ajouter une dépense" action={addExpense} closeAction={setIsOpen}> 
            
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
                onChange={(e) => setTitle(e.target.value)}
                value={title}
                />
                </div>
                <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="username">
                    Montant
                </label>
                <input 
                onChange={(e) => setAmount(parseInt(e.target.value,10))}
                value={amount}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="username" type="number" placeholder="Montant en €" />
                </div>

                <div className="flex flex-row items-center my-2 ">
                    <p>Sélectionner un type: </p> 
                    <select 
                    value={type}
                    onChange={e => setType(e.target.value)}
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
    )
}

export default AddExpenseBtn;