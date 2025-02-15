import { useLocation } from "@remix-run/react";

export default function ResultPage() {
  const location = useLocation();
  const { recommendations } = location.state || {}; // Get the recommendations from state

  if (!recommendations) {
    return <p>No recommendations available.</p>;
  }

  const parsedRecommendations = recommendations;

  return (
    <div className="container mx-auto p-6 bg-gray-50 shadow-md rounded-lg">
      {/* Ramen Image */}
      <div className="image-section mb-6">
        <img
          src="/Hakata.jpg" // Image from the public folder
          alt="Hakata Ramen"
          className="w-full max-w-xl mx-auto rounded-lg shadow-lg"
        />
      </div>

      {/* Introduction Section */}
      <div className="intro-section">
        <h2 className="text-3xl font-semibold text-gray-800 text-indigo-600">Personalized Recommendation</h2>
        <p className="text-lg mt-4 text-gray-700">{parsedRecommendations.introduction}</p>
      </div>

      {/* Recommendations Section */}
      <div className="recommendations-section mt-8 space-y-6">
        <h3 className="text-2xl font-semibold text-gray-800 text-indigo-600">Recommendations</h3>
        <div className="recommendation-list space-y-4">
          {parsedRecommendations.recommendations.map((rec: any, index: number) => (
            <div key={index} className="recommendation-item p-6 bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-200">
              <h4 className="text-xl font-bold text-gray-800">{index + 1}. {rec.heading}</h4>
              <p className="mt-2 text-lg text-gray-600">{rec.body}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Summary Section */}
      <div className="summary-section mt-8">
        <h3 className="text-2xl font-semibold text-gray-800 text-indigo-600">Summary</h3>
        <p className="text-lg mt-4 text-gray-700">{parsedRecommendations.summary}</p>
      </div>
    </div>
  );
}
