import { useRef, useEffect, useContext} from "react";
import { currencyFormatter } from "@/lib/utils";

import { financeContext } from "@/lib/store/finance-context";
import { authContext } from "@/lib/store/auth-contex";

//Icons
import {FaRegTrashAlt} from "react-icons/fa"; 
import Modal from "@/components/Modal";

function AddIncomeModal({show, onClose}){
    const amountRef = useRef();
    const descriptionRef = useRef();
    const {income, setIncome, addIncomeItem, removeIncomeItem} = useContext(financeContext);
    const {user} = useContext(authContext);
   
    
    //Handler functions
    if (!income) {
        setIncome([]);
    }
    const addIncomeHandler = async (e) => {
        e.preventDefault(); 
    
        const newIncome = {
          amount: +amountRef.current.value,
          description: descriptionRef.current.value,
          createdAt: new Date(),
          uid:  user.uid,

        };

        try{
            await addIncomeItem(newIncome);
            descriptionRef.current.value = "";
            amountRef.current.value = "";
        }   catch (error) {
            console.log(error.message);
        }
        
        
    };
    
        const deleteIncomeEntryHandler = async (incomeId) => {
            try {
                await removeIncomeItem(incomeId);
            }   catch (error) {
                console.log(error.message);
            }
        
        };

    return (
        <Modal show={show} onClose={onClose}>
        <form onSubmit={addIncomeHandler} className="flex flex-col gap-4">
          <div className="input-group">
            <label htmlFor="amount">Income Amount</label>
            <input 
              type="number"
              name="amount" 
              ref={amountRef}
              min={0.01} 
              step={0.01} 
              placeholder="Enter amount" 
              required
            /> 
          </div> 

          <div className="input-group">
            <label htmlFor="description">Description</label>
            <input 
              className="input"                
              type="text" 
              name="description"
              ref={descriptionRef}
              placeholder="Enter Description" 
              required
            /> 
          </div>  
          <button type="submit" className="btn btn-primary">
            Add 
          </button>           
        </form>

        <div className="flex flex-col gap-4 mt-6">
          <h3 className="text-2xl font-bold">Income History</h3>
          {income && income.map((ii) => (
            <div className="flex justify-between items-center" key={ii.id}>
              <div>
                <p className="font-semibold">{ii.description}</p>
                <small className="text-xs">{ii.createdAt.toISOString()}</small>
              </div>
              <p className="flex items-center gap-2">
                {currencyFormatter(ii.amount)}
                <button onClick={() => {deleteIncomeEntryHandler(ii.id)}}>
                <FaRegTrashAlt />
                </button>
              </p>
            </div>
          ))} 
        </div>
      </Modal>
    ); 
}

export default AddIncomeModal;
