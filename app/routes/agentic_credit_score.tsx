import { useEffect, useState } from "react";

export default function CreditAIPage() {
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [creditScore, setCreditScore] = useState<number | null>(650);
  const [financialData, setFinancialData] = useState<string>("");
  const [personalData, setPersonalData] = useState<string>("");
  const [aiResponse, setAiResponse] = useState<{ credit_score?: number; financial_advice?: string } | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const apiUrl = "https://your-lambda-api-url.com";

  const startSession = async () => {
    setLoading(true);
    try {
      const requestBody = {
        session_id: sessionId,
        credit_score: creditScore,
        financial_data: JSON.parse(financialData),
        personal_data: JSON.parse(personalData),
      };

      const response = await fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody),
      });

      const data = await response.json();
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

  useEffect(() => {
    if (sessionId) {
      startSession(); // Auto-fetch session when sessionId exists
    }
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-6">
      <div className="bg-white shadow-lg rounded-xl p-6 w-full max-w-lg">
        <h1 className="text-2xl font-bold text-center mb-4">AI Credit Advisor - Under Development</h1>
        <h1 className="text-2xl font-bold text-center mb-4">(THIS IS ONLY A TOY EXAMPLE. THIS IS NOT FINANCIAL ADVICE)</h1>

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

        {!sessionId && (
          <>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Credit Score</label>
              <input
                type="number"
                className="w-full mt-1 p-2 border rounded-md"
                value={creditScore ?? ""}
                onChange={(e) => setCreditScore(Number(e.target.value))}
                placeholder="Enter your starting credit score"
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Financial Data (JSON)</label>
              <textarea
                className="w-full mt-1 p-2 border rounded-md"
                rows={3}
                value={financialData}
                onChange={(e) => setFinancialData(e.target.value)}
                placeholder='{"income": 5000, "expenses": 2000}'
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Personal Data (JSON)</label>
              <textarea
                className="w-full mt-1 p-2 border rounded-md"
                rows={3}
                value={personalData}
                onChange={(e) => setPersonalData(e.target.value)}
                placeholder='{"age": 30, "employment_status": "Full-time"}'
              />
            </div>
          </>
        )}

        <button
          className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-md"
          onClick={startSession}
          disabled={loading}
        >
          {loading ? "Processing..." : sessionId ? "Continue Session" : "Start New Session"}
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
