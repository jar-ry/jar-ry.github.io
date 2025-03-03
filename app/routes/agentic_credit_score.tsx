import { useEffect, useState } from "react";

export default function CreditAIPage() {
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [financialData, setFinancialData] = useState({
    income: "5000",
    expenses: "2000",
    debts: [],
    credit_limit: "5000",
    missed_payments: "1",
    late_payments: "2",
  });
  const [newDebt, setNewDebt] = useState({ type: "", amount: "" });
  const [personalData, setPersonalData] = useState({
    age: "50"
  });
  const [aiResponse, setAiResponse] = useState<{ credit_score?: number; financial_advice?: string } | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const apiUrl = "https://vjb53qhycjdm5hslyf3t7gnnki0zumow.lambda-url.ap-southeast-2.on.aws/";

  const startSession = async () => {
    setLoading(true);
    try {
      const requestBody = {
        session_id: sessionId || crypto.randomUUID(),
        financial_data: { 
          income: Number(financialData.income),
          expenses: Number(financialData.expenses),
          debts: financialData.debts.reduce((acc, debt) => ({ ...acc, [debt.type]: Number(debt.amount) }), {}),
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
      setAiResponse({
        credit_score: data.updated_state?.credit_score,
        financial_advice: data.updated_state?.financial_advice,
      });
    } catch (error) {
      console.error("Error calling AI:", error);
    }
    setLoading(false);
  };

  const addDebt = () => {
    if (newDebt.type && newDebt.amount) {
      setFinancialData({ ...financialData, debts: [...financialData.debts, newDebt] });
      setNewDebt({ type: "", amount: "" });
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-6">
      <div className="bg-white shadow-lg rounded-xl p-6 w-full max-w-lg">
        <h1 className="text-2xl font-bold text-center mb-4">AI Credit Advisor</h1>
        <p className="text-red-500 text-center">(THIS IS ONLY A TOY EXAMPLE. NOT FINANCIAL ADVICE)</p>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Session ID</label>
          <input
            type="text"
            className="w-full mt-1 p-2 border rounded-md"
            value={sessionId ?? ""}
            onChange={(e) => setSessionId(e.target.value)}
            placeholder="Leave empty to start a new session"
          />
        </div>

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
        </div>
        <div className="flex space-x-2 mt-2">
            <input
              type="text"
              className="w-1/2 p-2 border rounded-md"
              value={newDebt.type}
              onChange={(e) => setNewDebt({ ...newDebt, type: e.target.value })}
              placeholder="Debt Type"
            />
            <input
              type="text"
              className="w-1/2 p-2 border rounded-md"
              value={newDebt.amount}
              onChange={(e) => setNewDebt({ ...newDebt, amount: e.target.value })}
              placeholder="Amount"
            />
            <button onClick={addDebt} className="p-2 bg-blue-500 text-white rounded-md">+</button>
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

        {aiResponse && (
          <div className="mt-6 p-4 bg-green-100 rounded-md">
            <h2 className="text-lg font-semibold">AI Recommendations</h2>
            <p><strong>Credit Score:</strong> {aiResponse.credit_score}</p>
            <p><strong>Advice:</strong> {aiResponse.financial_advice}</p>
          </div>
        )}
      </div>
    </div>
  );
}
