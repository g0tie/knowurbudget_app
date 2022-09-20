import * as Layout from '../layout';
import AddExpenseBtn from '../components/AddExpenseBtn';
import React, { useEffect } from 'react';
import { useMainContext } from '../store/contexts';
import { getCurrentUser, getJWT, getData, getDatas } from '../store/database';
import { syncData } from '../api';
import { getDefaultUserData } from '../helpers/common';
import { useNavigate } from 'react-router-dom';

const Dashboard  = () => {
  const { state, dispatch } = useMainContext();
  const navigate = useNavigate();

  useEffect( () => {
    
    async function fetchDataAndInitContext() {
      const isUserLogged = JSON.parse( window.localStorage.getItem("logged")) ?? false;
    
      if (isUserLogged) {
        let data = await syncData(getCurrentUser(), getJWT());
        if (data.status === 403) {
          navigate("/login");
          return;
        }
        
        await dispatch({type: "setUserData", payload: data.data});
    
      } else {
        const newState = await getDefaultUserData(state);
        await dispatch({type:"initContext", payload: newState});
      }
    }
  
    fetchDataAndInitContext();
  } , []);

  return (
    <div className="App md:p-8 xs:p-0">
    <Layout.Header />

    <div className='xs:flex-wrap xs:flex-col lg:flex-wrap xl:flex-nowrap flex xl:flex-row justify-evenly md:items-center xs:overflow-hidden'>
        <Layout.History />
        <Layout.Graphics />
    </div>
        
        <AddExpenseBtn />
    </div>
  );
}

export default Dashboard;
