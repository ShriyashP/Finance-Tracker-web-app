"use client"

import { createContext, useState, useEffect, useRef, useContext } from "react";
import { authContext } from "@/lib/store/auth-contex";

// Firebase
import { db } from '@/lib/firebase/index';
import { collection, query, where, addDoc, getDocs, doc, deleteDoc, updateDoc } from 'firebase/firestore';


export const financeContext = createContext({
  income: [],
  expenses: [],
  addIncomeItem: async () => { },
  removeIncomeItem: async () => { },
  addExpenseItem: async () => { },
  addCategory: async () => { },
  deleteExpensesItem: async () => { },
  deleteExpenseCategory: async () => { },
});

export default function FinanceContextProvider({ children }) {
  const [income, setIncome] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [showAddIncomeModal, setShowAddIncomeModal] = useState(false);
  const amountRef = useRef(null);
  const descriptionRef = useRef(null);
  const {user} =  useContext(authContext);


  const addCategory = async (category) => {
    try {
      const collectionRef = collection(db, "expenses");
      const docSnap = await addDoc(collectionRef, {
        
        uid: user.uid,
        ...category,
        items: [],
      });

      setExpenses((prevExpenses) => {
        return [
          ...prevExpenses,
          {
            id: docSnap.id,
            uid:  user.uid,
            items: [],
            ...category,
          },
        ];
      });
    } catch (error) {
      throw error;
    }
  };

  const addExpenseItem = async (ExpenseCategoryId, newExpenses) => {
    const docRef = doc(db, "expenses", ExpenseCategoryId);

    try {
      await updateDoc(docRef, { ...newExpenses });

      setExpenses((prevState) => {
        const updatedExpenses = [...prevState];

        const foundIndex = updatedExpenses.findIndex((expenses) => {
          return expenses.id === ExpenseCategoryId;
        });

        updatedExpenses[foundIndex] = { id: ExpenseCategoryId, ...newExpenses };
        return updatedExpenses;
      });
    } catch (error) {
      throw error;
    }
  };

  const deleteExpensesItem = async (updatedExpenses, expenseCategoryId) => {
    try {
      const docRef = doc(db, "expenses", expenseCategoryId);
      await updateDoc(docRef, {
        ...updatedExpenses,
      });

      setExpenses((prevState) => {
        const updatedExpenses = [...prevState];
        const pos = updatedExpenses.findIndex((ex) => ex.id === expenseCategoryId);
        updatedExpenses[pos].items = [...updatedExpenses.items];
        updatedExpenses[pos].total = updatedExpenses.total;
        return updatedExpenses;
      });
    } catch (error) {
      throw error;
    }
  };

  const deleteExpenseCategory = async (expenseCategoryId) => {
    try {
      const docRef = doc(db, "expenses", expenseCategoryId);
      await deleteDoc(docRef);
      setExpenses((prevExpenses) => {
        const updatedExpenses = prevExpenses.filter((expense) => expense.id !== expenseCategoryId);
        return [...updatedExpenses];
      });
    } catch (error) {
      throw error;
    }
  };

  const addIncomeItem = async (newIncome) => {
    const collectionRef = collection(db, "income");

    try {
      const docRef = await addDoc(collectionRef, newIncome);

      setIncome((prevState) => {
        return [
          ...prevState,
          {
            id: docRef.id,
            ...newIncome,
          },
        ];
      });

      amountRef.current.value = "";
      descriptionRef.current.value = "";
      setShowAddIncomeModal(false);
    } catch (error) {
      console.error(error.message);
      throw error;
    }
  };

  const removeIncomeItem = async (incomeId) => {
    const docRef = doc(db, "income", incomeId);
    try {
      await deleteDoc(docRef);
      setIncome((prevState) => {
        return prevState.filter((i) => i.id !== incomeId);
      });
    } catch (error) {
      console.log(error.message);
      throw error;
    }
  };

  const values = {
    income,
    expenses,
    addIncomeItem,
    removeIncomeItem,
    addExpenseItem,
    addCategory,
    deleteExpensesItem,
    deleteExpenseCategory,
  };

  useEffect(() => {
    if(!user) return;

    const getIncomeData = async () => {
      const collectionRef = collection(db, "income");
      const q  = query(collectionRef, where("uid", "==", user.uid));

      const docsSnap = await getDocs(q);

      const data = docsSnap.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        createdAt: new Date(doc.data().createdAt.toMillis()),
      }));

      setIncome(data);
    };

    const getExpensesData = async () => {
      const collectionRef = collection(db, "expenses");
      const q  = query(collectionRef, where("uid", "==", user.uid));
      const docsSnap = await getDocs(q);
      const data = docsSnap.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setExpenses(data);
    };

    getIncomeData();
    getExpensesData();
  }, [user]);

  return (
    <financeContext.Provider value={values}>
      {children}
    </financeContext.Provider>
  );
}