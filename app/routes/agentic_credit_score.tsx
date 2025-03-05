import { useState } from "react";

export default function CreditAIPage() {
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [financialData, setFinancialData] = useState({
    income: "5000",
    expenses: "2000",
    debts: [{ name: "Personal Loan", amount: "1000" }],
    credit_limit: "5000",
    missed_payments: "1",
    late_payments: "2",
  });
  const [personalData, setPersonalData] = useState({
    age: "50"
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [isChatting, setIsChatting] = useState(false);
  const [messages, setMessages] = useState<{ role: string; content: string }[]>([]);
  const [userInput, setUserInput] = useState("");

  const apiUrl = "https://vjb53qhycjdm5hslyf3t7gnnki0zumow.lambda-url.ap-southeast-2.on.aws/";

  const startSession = async () => {
    setLoading(true);
    try {
      const requestBody = {
        financial_data: { 
          income: Number(financialData.income),
          expenses: Number(financialData.expenses),
          debts: financialData.debts.reduce((acc, debt) => ({ ...acc, [debt.name]: Number(debt.amount) }), {}),
          credit_limit: Number(financialData.credit_limit),
          missed_payments: Number(financialData.missed_payments),
          late_payments: Number(financialData.late_payments),
        },
        personal_data: personalData,
      };
      console.log(requestBody)
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody),
      });
      console.log(response)

      const data = await response.json();
      console.log(data)
      setSessionId(data.session_id);
      const final_recommendation = data.updated_state.messages[data.updated_state.messages.length - 1]
      console.log(final_recommendation)
      // Show AI response in chat
      setMessages([
        // { role: "system", content: "AI Chat Started. Ask anything about your financial strategy!" },
        { role: "assistant", content: final_recommendation || "No advice given." }
      ]);
      setIsChatting(true); // Switch to chat mode
    } catch (error) {
      console.error("Error calling AI:", error);
    }
    setLoading(false);
  };

  const addDebt = () => {
    setFinancialData({
      ...financialData,
      debts: [...financialData.debts, { name: "", amount: "" }],
    });
  };

  const updateDebt = (index: number, key: string, value: string) => {
    const updatedDebts = financialData.debts.map((debt, i) =>
      i === index ? { ...debt, [key]: value } : debt
    );
    setFinancialData({ ...financialData, debts: updatedDebts });
  };

  const deleteDebt = (index: number) => {
    const updatedDebts = financialData.debts.filter((_, i) => i !== index);
    setFinancialData({ ...financialData, debts: updatedDebts });
  };

  const sendMessage = async (message: string) => {
    if (!sessionId) return;

    setMessages([...messages, { role: "user", content: message }]);
    setUserInput(""); // Clear input field after sending

    setLoading(true);
    try {
      const requestBody = {
        session_id: sessionId,
        message: message
      };
      console.log(requestBody)
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody),
      });
      console.log(response)
      const data = await response.json();
      setMessages((prev) => [...prev, { role: "assistant", content: data.updated_state?.messages?.at(-1)?.content || "No response." }]);
    } catch (error) {
      console.error("Error in chat:", error);
    }
    setLoading(false);
  };

  return (
    <div>
    
        {!isChatting ? (
          <>
          <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-6">
            <div className="bg-white shadow-lg rounded-xl p-6 w-full max-w-lg">
              <h1 className="text-2xl font-bold text-center mb-4">AI Credit Advisor</h1>
              <p className="text-red-500 text-center">(THIS IS ONLY A TOY EXAMPLE. NOT FINANCIAL ADVICE)</p>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Income (Monthly Income)</label>
                <input
                  type="number"
                  className="w-full mt-1 p-2 border rounded-md"
                  value={financialData.income}
                  onChange={(e) => setFinancialData({ ...financialData, income: e.target.value })}
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Expenses (Monthly Expenses)</label>
                <input
                  type="number"
                  className="w-full mt-1 p-2 border rounded-md"
                  value={financialData.expenses}
                  onChange={(e) => setFinancialData({ ...financialData, expenses: e.target.value })}
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Debts</label>
                {financialData.debts.map((debt, index) => (
                  <div key={index} className="flex space-x-2 mb-2">
                    <input
                      type="text"
                      className="w-1/2 p-2 border rounded-md"
                      placeholder="Debt Name"
                      value={debt.name}
                      onChange={(e) => updateDebt(index, "name", e.target.value)}
                    />
                    <input
                      type="number"
                      className="w-1/3 p-2 border rounded-md"
                      placeholder="Amount"
                      value={debt.amount}
                      onChange={(e) => updateDebt(index, "amount", e.target.value)}
                    />
                    <button className="bg-red-500 text-white px-3 py-1 rounded-md" onClick={() => deleteDebt(index)}>X</button>
                  </div>
                ))}
                <button className="mt-2 bg-blue-500 text-white px-4 py-2 rounded-md" onClick={addDebt}>Add Debt</button>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Credit Limit</label>
                <input
                  type="number"
                  className="w-full mt-1 p-2 border rounded-md"
                  value={financialData.credit_limit}
                  onChange={(e) => setFinancialData({ ...financialData, credit_limit: e.target.value })}
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Number of missed payments in last month</label>
                <input
                  type="number"
                  className="w-full mt-1 p-2 border rounded-md"
                  value={financialData.missed_payments}
                  onChange={(e) => setFinancialData({ ...financialData, missed_payments: e.target.value })}
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Number of late payments in last month</label>
                <input
                  type="number"
                  className="w-full mt-1 p-2 border rounded-md"
                  value={financialData.late_payments}
                  onChange={(e) => setFinancialData({ ...financialData, late_payments: e.target.value })}
                />
              </div>

              {/* <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Personal Data (JSON)</label>
                <textarea
                  className="w-full mt-1 p-2 border rounded-md"
                  rows={3}
                  value={personalData}
                  onChange={(e) => setPersonalData(e.target.value)}
                  placeholder='{"age": 30, "employment_status": "Full-time"}'
                />
              </div> */}

              <button
                className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-md"
                onClick={startSession}
                disabled={loading}
              >
                {loading ? "Processing..." : "Start Session"}
              </button>
            </div>
          </div>
        </>
      ) : (
        <>
          <div className="flex items-center justify-center h-screen bg-gray-100">
            <div className="w-full max-w-4xl h-[90vh] flex flex-col bg-white shadow-lg rounded-xl p-6">
              <h1 className="text-2xl font-bold text-center mb-2">AI Chat</h1>
              <p className="text-red-500 text-center mb-2">(THIS IS ONLY A TOY EXAMPLE. NOT FINANCIAL ADVICE)</p>

              <div className="flex-grow overflow-y-auto border p-4 rounded-md bg-gray-50">
                {messages.map((msg, idx) => (
                  <div key={idx} className={`mb-2 p-2 rounded-md ${msg.role === "user" ? "bg-blue-200 text-right" : "bg-gray-200 text-left"}`}>
                    <p className="whitespace-pre-wrap">{msg.content}</p>
                  </div>
                ))}
              </div>

              <div className="mt-4 flex">
              <input
                type="text"
                className="w-full p-2 border rounded-md"
                placeholder="Type your question..."
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") sendMessage(userInput);
                }}
              />
              <button className="ml-2 bg-blue-500 text-white px-4 py-2 rounded-md" onClick={() => sendMessage(userInput)}>
                Send
              </button>
              </div>
            </div>
          </div>
          </>
        )}
      </div>
  );
}
