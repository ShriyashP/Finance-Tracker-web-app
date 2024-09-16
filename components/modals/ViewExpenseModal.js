import { useContext } from "react";
import { financeContext } from "@/lib/store/finance-context";
import Modal from "@/components/Modal";
import { currencyFormatter } from "@/lib/utils";

import { FaRegTrashAlt } from "react-icons/fa";

function ViewExpenseModal({ show, onClose, expense, expenses }) {
  const { deleteExpensesItem, deleteExpenseCategory } = useContext(financeContext);

  const deleteExpenseHandler = async () => {
    try {
      await deleteExpenseCategory(expense.id);
    } catch (error) {
      console.error(error.message);
    }
  };

  const deleteExpenseItemHandler = async (item) => {
    try {
      const updatedItems = expense.items.filter((i) => i.id !== item.id);
      const updatedExpense = {
        items: [...updatedItems],
        total: expenses.total - item.amount,
      };

      await deleteExpensesItem(updatedExpense, expense.id);
    } catch (error) {
      console.error(error.message);
    }
  };

  return (
    <Modal show={show} onClose={onClose}>
      <div className="flex items-center justify-between">
        <h2 className="text-3xl">{expense.title}</h2>
        <button onClick={deleteExpenseHandler} className="btn btn-danger">
          Delete
        </button>
      </div>

      <div>
        <h3>Expense Details</h3>
        {expense.items.map((item) => (
          <div key={item.id} className="flex items-center justify-between">
            <small>
              {item.createdAt.toMillis
                ? new Date(item.createdAt.toMillis()).toISOString()
                : item.createdAt.toISOString()}
            </small>
            <p className="flex items-center gap-2">
              {currencyFormatter(item.amount)}{" "}
              <button onClick={() => deleteExpenseItemHandler(item)}>
                <FaRegTrashAlt />
              </button>
            </p>
          </div>
        ))}
      </div>
    </Modal>
  );
}

export default ViewExpenseModal;