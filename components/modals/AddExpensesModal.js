import { useState, useContext } from "react";
import { financeContext } from "@/lib/store/finance-context";
import { v4 as uuidv4 } from "uuid";
import Modal from "@/components/Modal";

function AddExpenseModal({ show, onClose }) {
  const [expenseAmount, setExpenseAmount] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [showAddExpense, setShowAddExpense] = useState(false);
  const [newCategoryTitle, setNewCategoryTitle] = useState("");
  const [newCategoryColor, setNewCategoryColor] = useState("#000000");

  const { expenses, addExpenseItem, addCategory } = useContext(financeContext);

  const AddExpenseItemHandler = async () => {
    const expense = expenses.find((e) => e.id === selectedCategory);

    if (!expense) return;

    const newExpense = {
      ...expense,
      total: expense.total + +expenseAmount,
      items: [
        ...expense.items,
        {
          amount: +expenseAmount,
          createdAt: new Date(),
          id: uuidv4(),
        },
      ],
    };

    try {
      await addExpenseItem(selectedCategory, newExpense);
      setExpenseAmount("");
      setSelectedCategory(null);
      onClose();
    } catch (error) {
      console.log(error.message);
    }
  };

  const addCategoryHandler = async () => {
    if (!newCategoryTitle || !expenseAmount || isNaN(expenseAmount) || +expenseAmount <= 0) {
      console.log("Please enter a valid category title and expense amount");
      return;
    }

    const amount = +expenseAmount;

    try {
      const newCategoryWithExpense = {
        id: uuidv4(),
        title: newCategoryTitle,
        color: newCategoryColor,
        total: amount,
        items: [{
          amount: amount,
          createdAt: new Date(),
          id: uuidv4(),
        }],
      };

      await addCategory(newCategoryWithExpense);
      setShowAddExpense(false);
      setNewCategoryTitle("");
      setNewCategoryColor("#000000");
      setSelectedCategory(newCategoryWithExpense.id);
      onClose();
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <Modal show={show} onClose={onClose}>
      <div className="flex flex-col gap-4">
        <label>Enter amount and choose category</label>
        <input
          type="number"
          min={0.01}
          step={0.01}
          placeholder="Enter expense amount"
          value={expenseAmount}
          onChange={(e) => setExpenseAmount(e.target.value)}
        />
      </div>

      {/* Expense categories */}
      {expenseAmount > 0 && (
        <div className="flex flex-col gap-4 mt-6">
          <div className="flex items-center justify-between">
            <h3 className="text-2xl capitalize">Choose category</h3>
            <button
              onClick={() => setShowAddExpense(true)}
              className="text-lime-400"
            >
              + New category
            </button>
          </div>

          {showAddExpense && (
            <div className="flex items-center justify-between">
              <input
                type="text"
                placeholder="Enter Title"
                value={newCategoryTitle}
                onChange={(e) => setNewCategoryTitle(e.target.value)}
              />

              <label>Select</label>
              <input
                type="color"
                className="w-15 h-10"
                value={newCategoryColor}
                onChange={(e) => setNewCategoryColor(e.target.value)}
              />
              <button
                onClick={addCategoryHandler}
                className="btn btn-primary-outline"
              >
                Create
              </button>
              <button
                onClick={() => setShowAddExpense(false)}
                className="btn btn-danger"
              >
                Cancel
              </button>
            </div>
          )}

          {expenses.map((expense) => (
            <button
              key={expense.id}
              onClick={() => setSelectedCategory(expense.id)}>
              <div
                style={{
                  "boxShadow": expense.id === selectedCategory ? "1px 1px 4px" : "none",
                }}
                className="flex items-center justify-between px-4 py-4 bg-slate-700 rounded-3xl">
                <div className="flex items-center gap-2">
                  {/* colored circle */}
                  <div
                    className="w-[25px] h-[25px] rounded-full"
                    style={{
                      "backgroundColor": expense.color
                    }}
                  />
                  <h4 className="capitalize">{expense.title}</h4>
                </div>
              </div>
              {selectedCategory === expense.id && (
              // render details for the selected category
                <div>
                  {/* details for the selected category */}
                  <p>Total: {expense.total}</p>
                  <ul>
                    {expense.items.map((item) => (
                      <li key={item.id}>
                        {item.amount} - {item.createdAt.toLocaleDateString()}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </button>
          ))}
        </div>
      )}
      {expenseAmount > 0 && selectedCategory && (
        <div className="mt-6">
          <button className="btn btn-primary" onClick={AddExpenseItemHandler}>
            Add Expenses
          </button>
        </div>
      )}
    </Modal>
  );
}

export default AddExpenseModal;