import { useContext } from "react";
import { financeContext } from "@/lib/store/finance-context";
import Modal from "@/components/Modal";
import { currencyFormatter } from "@/lib/utils";

import { FaRegTrashAlt } from "react-icons/fa";

function ViewExpenseModal({ show, onClose, expense, expenses }) {
  const { deleteExpenseCategory, deleteExpensesItem } = useContext(financeContext);

  // Delete the entire expense category
  const deleteExpenseHandler = async () => {
    try {
      // Confirm deletion
      const confirmDelete = window.confirm(`Are you sure you want to delete the entire "${expense.title}" expense category?`);
      
      if (confirmDelete) {
        await deleteExpenseCategory(expense.id);
        onClose(); // Close the modal after deletion
      }
    } catch (error) {
      console.error("Failed to delete expense category:", error.message);
      alert(`Failed to delete expense category: ${error.message}`);
    }
  };

  // Delete a specific item from the expense
  const deleteExpenseItemHandler = async (item) => {
    try {
      // Filter out the item being deleted
      const updatedItems = expense.items.filter((i) => i.id !== item.id);

      // Update the total after removing the item's amount
      const updatedTotal = expense.total - item.amount;

      const updatedExpense = {
        ...expense,
        items: updatedItems,
        total: updatedTotal,
      };

      // Update the expense in the context
      await deleteExpensesItem(updatedExpense, expense.id);
    } catch (error) {
      console.error("Failed to delete expense item:", error.message);
      alert(`Failed to delete expense item: ${error.message}`);
    }
  };

  return (
    <Modal show={show} onClose={onClose}>
      <div className="flex items-center justify-between">
        <h2 className="text-3xl">{expense.title}</h2>
        <button 
          onClick={deleteExpenseHandler} 
          className="btn btn-danger"
        >
          Delete Entire Expense
        </button>
      </div>

      <div>
        <h3 className="mt-4">Expense Details</h3>
        {expense.items.length === 0 ? (
          <p className="text-gray-500">No items in this expense.</p>
        ) : (
          expense.items.map((item) => (
            <div key={item.id} className="flex items-center justify-between mt-2">
              <small>
                {item.createdAt.toMillis
                  ? new Date(item.createdAt.toMillis()).toLocaleString()
                  : new Date(item.createdAt).toLocaleString()}
              </small>
              <p className="flex items-center gap-2">
                {currencyFormatter(item.amount)}
                <button
                  onClick={() => deleteExpenseItemHandler(item)}
                  className="text-red-500 hover:text-red-700"
                  title="Delete Item"
                >
                  <FaRegTrashAlt />
                </button>
              </p>
            </div>
          ))
        )}
      </div>
    </Modal>
  );
}

export default ViewExpenseModal;