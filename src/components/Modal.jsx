import React from "react";

const Modal = ({title, action, children, isOpen, closeAction, deleteAction}) => {
    return isOpen && (
        <div data-testid="modalexpense" className="relative z-50" aria-labelledby="modal-title" role="dialog" aria-modal="true">
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>

        <div className="fixed z-10 inset-0 overflow-y-auto">
            <div className="flex items-end xs:items-center justify-center min-h-full p-4 text-center xs:p-0">
            
            <div className="relative bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all xs:my-8 xs:max-w-lg xs:w-full">
                <div className="bg-white px-4 pt-5 pb-4 xs:p-6 xs:pb-4">
                <div className="xs:flex xs:items-start">
                    
                    <div className="w-full mt-3 text-center xs:mt-0 xs:ml-4 xs:text-left">
                    <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-title">{title}</h3>
                    <div className="mt-2 ">
                        
                        {children}

                    </div>
                    </div>
                </div>
                </div>
                <div className="bg-gray-50 px-4 py-3 xs:px-6 xs:flex xs:flex-row-reverse">
                <button type="button" className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-budget text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 xs:ml-3 xs:w-auto xs:text-sm"
                    onClick={() => action()}
                >Valider</button>
                <button 
                    onClick={() => closeAction()}
                type="button" className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 xs:mt-0 xs:ml-3 xs:w-auto xs:text-sm">Annuler</button>
                  
                  { deleteAction && <button 
                    onClick={() => deleteAction()}
                    type="button" 
                    className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-pink-600 text-base font-medium text-white hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 xs:mt-0 xs:ml-3 xs:w-auto xs:text-sm">
                        Supprimer
                    </button>
                    }
                </div>
            </div>
            </div>
        </div>
        </div>
    )
}

export default Modal;