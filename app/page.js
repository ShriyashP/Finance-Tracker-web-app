"use client";

import { useState, useContext, useEffect } from "react";
import { financeContext } from "@/lib/store/finance-context";
import { authContext } from "@/lib/store/auth-contex";
import {currencyFormatter} from "@/lib/utils";
import ExpenseCategoryItem from "@/components/expenses";
import AddIncomeModal from "@/components/modals/AddIncomeModal";
import AddExpensesModal from "@/components/modals/AddExpensesModal";
import SignIn from "@/components/Signin";
import {Chart as ChartJS, ArcElement, Tooltip, Legend} from 'chart.js';
import { Doughnut } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

export default function Home() {
  const [showAddIncomeModal, setShowAddIncomeModal] = useState(false);
  const [showAddExpensesModal, setShowAddExpensesModal] = useState(false);
  const [balance, setBalance] = useState(0);
  const { income, expenses } = useContext(financeContext);
  const { user, loading } = useContext(authContext);

  useEffect(() => {
    // Ensure window object exists before setting configuration
    if (typeof window !== 'undefined') {
      // Set Chatling configuration as a string
      window.chtlConfig = '{"chatbotId": "2815691895"}';

      // Load Chatling script
      const script = document.createElement('script');
      script.id = 'chatling-embed-script';
      script.src = 'https://chatling.ai/js/embed.js';
      script.async = true;
      script.setAttribute('data-id', '2815691895');
      
      // Append script to body
      document.body.appendChild(script);

      // Cleanup function
      return () => {
        document.body.removeChild(script);
      };
    }
  }, []);

  useEffect(() => {
    const newBalance = 
      income.reduce((total, i) => total + i.amount, 0) -
      expenses.reduce((total, e) => total + e.total, 0);
    
    setBalance(Math.abs(newBalance));
  }, [expenses, income]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <SignIn />;
  }

  return (
    <>
      <AddIncomeModal 
        show={showAddIncomeModal} 
        onClose={() => setShowAddIncomeModal(false)}
      />
      
      <AddExpensesModal 
        show={showAddExpensesModal}
        onClose={() => setShowAddExpensesModal(false)}
      />

      <main className="container max-w-2xl px-6 mx-auto">
        <section className="py-3">
          <small className="text-gray-900 text-md font-semibold">My Balance</small>
          <h2 className="text-3xl font-bold">
            {currencyFormatter(balance)}
          </h2>
        </section>
        
        <section className="flex items-center justify-center gap-2 py-3"> 
          <button 
            onClick={() => setShowAddExpensesModal(true)} 
            className="btn btn-primary"
          >
            Add Expenses
          </button>
          <button 
            onClick={() => setShowAddIncomeModal(true)} 
            className="btn btn-primary-outline"
          >
            Add Income
          </button>
        </section>
        
        <section className="py-6">
          <h3 className="text-2xl"><u>My Expenses</u></h3>
          <div className="flex flex-col gap-4 mt-6">
            {expenses.map((expense) => (
              <ExpenseCategoryItem 
                key={expense.id}
                expense={expense}
              />
            ))}              
          </div>
        </section>

        <section className="py-6">
          <h3 className="text-2xl">Stats</h3>
          <div className="w-1/2 mx-auto">
            <Doughnut 
              data={{
                labels: expenses.map((expense) => expense.title),
                datasets: [
                  {
                    label: "Expenses",
                    data: expenses.map((expense) => expense.total),
                    backgroundColor: expenses.map((expense) => expense.color),
                    borderColor: ['#18181b'],
                    borderWidth: 1
                  }
                ]
              }}
            />
          </div>
        </section>
      </main>
    </>
  );
}