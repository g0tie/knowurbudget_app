import Graph from "../components/Graph"
import { useMainContext } from "../store/contexts";
import { sortExpensesByMonths, sortExpensesByWeek} from '../helpers/common'
import React from "react";

const Graphics = () => {
  const {state} = useMainContext();

  const pieData = {
    labels: state.types.map(type => type.name),
    datasets: [
      {
        label: '# of Votes',
        data: sortExpensesByWeek(state.types),
        backgroundColor: [
          '#2cf6b3',
          '#f0f757',
          '#ffbc42',
          '#715BFD',
          '#ff90b3',
          '#25ced1',
          '#8d918b',  
          '#8f2d56'
        ],
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
    labels: ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin","Juillet", "Aout", "Septembre", "Octobre", "Novembre", "Décembre"],
    datasets: sortExpensesByMonths(state.expenses, state.types)
  };

    return (
      <div className="flex xl:flex-row md:flex-1 xs:flex-col lg:flex-row sm:flex-row sm:flex-row items-center md:justify-around xs:w-full xs:items-center">
        <Graph title="Cette semaine" type="pie" data={pieData}/>
        <Graph title="Ces Derniers mois" type="bar" data={stackedBarData}/>

      </div>
    );
  }
  
  export default Graphics;
  