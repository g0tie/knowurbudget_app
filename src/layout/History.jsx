import Expense from "../components/Expense";
import TypeDropdown from "../components/TypeDropdown";
import { useMainContext } from "../store/contexts";
import { getTypeName } from "../helpers/common";
import React from "react";

const History = () => {
    const { state } = useMainContext();

    return (
      <div className="p-4 xl:order-none xl:flex-wrap lg:order-0 xs:order-1 lg:flex-wrap	sm:mt-6">
        
        <div className="flex flex-row justify-center">
          <TypeDropdown/>
        </div>
        <div 
        style={{
          maxWidth:"470px",
          height:"100%"
        }}
        className="flex flex-col items-center sm:w-full scrollbar scrollbar-thin scrollbar-thumb-rounded-full scrollbar-track-rounded-full scrollbar-thumb-indigo-600 scrollbar-track-gray-100  overflow-y-auto">
          {
            state.expenses.map(expense => 
              <Expense key={expense.id} id={expense.id} remoteId={expense?.remoteId} title={expense.name} date={expense.date} type={getTypeName(expense.typeid)} typeId={expense.typeid} amount={expense.amount}/>
            )
          }
        </div>
      </div>
    );
  }
  
export default History;
  