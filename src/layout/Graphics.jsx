import Graph from "../components/Graph"
import { useMainContext } from "../store/contexts";
import { sortExpensesByMonths, sortExpensesByWeek} from '../helpers/common'
import React from "react";
import { seedColors } from "../store/seeders";

const Graphics = () => {
  const {state} = useMainContext();

  const pieData = {
    labels: state.types.map(type => type.name),
    datasets: [
      {
        label: '',
        data: sortExpensesByWeek(state.types),
        backgroundColor: seedColors(),
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
          'rgba(255, 159, 64, 1)',
        ],
        borderWidth: 0,
      },
    ],
  };

  

  const stackedBarData = {
    labels: [
      "Janvier", 
      "Février", 
      "Mars", 
      "Avril", 
      "Mai", 
      "Juin",
      "Juillet", 
      "Aout", 
      "Septembre", 
      "Octobre", 
      "Novembre", 
      "Décembre"],
    datasets: sortExpensesByMonths(state.expenses, state.types)
  };

    return (
      <div className="flex xl:flex-row md:flex-1 xs:flex-col lg:flex-row sm:flex-row sm:flex-row items-center md:justify-around xs:w-full xs:items-center justify-between">
        <Graph title="Ces Derniers mois" type="bar" data={stackedBarData}/>
        <div className="mt-8">

        <Graph title="Cette semaine" type="pie" data={pieData}/>
        </div>

      </div>
    );
  }
  
  export default Graphics;
  