import * as Layout from '../layout';
import AddExpenseBtn from '../components/AddExpenseBtn';
import React, { useEffect } from 'react';
import { useMainContext } from '../store/contexts';
import { getCurrentUser, persistData} from '../store/database';
import { syncData } from '../api';
import { getDefaultUserData } from '../helpers/common';
import { useLocation, useNavigate } from 'react-router-dom';

const Dashboard  = () => {
  const { state, dispatch } = useMainContext();
  const navigate = useNavigate();

  useEffect( () => {
    
    async function fetchDataAndInitContext() {

      if (!state.logged) {
        const newState = await getDefaultUserData(state);
        await dispatch({type:"initContext", payload: newState});
      }
    }

    fetchDataAndInitContext();
  } , []);

  return (
    <div className="App md:p-8 xs:p-0  bg-slate-50">
    <Layout.Header />

    <div className='xs:flex-wrap xs:flex-col lg:flex-wrap xl:flex-nowrap flex xl:flex-row justify-evenly md:items-center xs:overflow-hidden' style={{minHeight:"70vh"}}>
        <Layout.History />
        <Layout.Graphics />
    </div>
        
        <AddExpenseBtn />
    </div>
  );
}

export default Dashboard;
