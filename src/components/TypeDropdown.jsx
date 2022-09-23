import { useMainContext } from "../store/contexts";
import React, { useState } from "react";


const TypeDropdown = ({}) => {
    const {state, dispatch} = useMainContext();
    const [selectedType, setSelectedType] = useState(state.selectedType);

    function sortExpenseByType(type) {
      setSelectedType(type);
      dispatch({type:'sortExpensesByType', payload:type})
    }
    return (
      <div className="flex flex-row items-center my-2 ">
        <p>Sélectionner un type: </p> 
        <select 
        value={selectedType}
        data-testid="select"
        onChange={e => sortExpenseByType(e.target.value)}
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
              <option  value="all">Tout</option>

            {
                state.types && state.types.map((type, index) => (
                    <option key={type.id} value={type.id} data-testid={type.id}>{type.name} </option>
                ))
            }
        </select>
      </div>
    );
  }
  
export default TypeDropdown;

  