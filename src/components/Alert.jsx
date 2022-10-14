import React, {useEffect, useState} from "react";
import { useMainContext } from "../store/contexts";

const Alert = ({isVisible}) => {
    const {state} = useMainContext();
     return isVisible && (
        <div className={`text-white px-6 py-4 border-0 rounded relative mb-4`} style={{
            backgroundColor: state.error !== false ? "#db2777" : "#22c55e"
        }}>
            <span className="text-xl inline-block mr-5 align-middle">
                <i className="fas fa-bell" />
            </span>
            <span className="inline-block align-middle mr-8">
                <b className="capitalize">{state.error !== false ? "Erreur" : "Succès"} ! </b>{state.error && state.error}
            </span>
            <button className="absolute bg-transparent text-2xl font-semibold leading-none right-0 top-0 mt-4 mr-6 outline-none focus:outline-none">
                <span>×</span>
            </button>
        </div>
    )
}

export default Alert;