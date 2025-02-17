import { useLocation, Link } from "@remix-run/react";

export default function ResultPage() {
  const location = useLocation();
  const { result_content } = location.state || {}; // Get the result_content from state

  if (!result_content) {
    return <p>No recommendations available.</p>;
  }

  const parsedRecommendations = JSON.parse(result_content)

  return (
    <div className="container mx-auto p-6 bg-[#FAF3E0] shadow-md rounded-lg relative">
      {/* Background Overlay */}
      <div className="absolute inset-0 bg-gray-900 opacity-60"></div>
      
      {/* Ramen Image */}
      <div className="image-section mb-6 relative z-10">
        <img
          src="/Hakata.jpg" // Image from the public folder
          alt="Hakata Ramen"
          className="w-full max-w-xl mx-auto rounded-lg shadow-lg border-4 border-[#D63447]"
        />
      </div>

      {/* Introduction Section */}
      <div className="intro-section relative z-10 text-center">
        <h2 className="text-4xl font-bold text-white">Hakata Ramen!!!</h2>
        <p className="text-lg mt-4 text-[#FFD166]">{parsedRecommendations.introduction}</p>
      </div>

      {/* Recommendations Section */}
      <div className="recommendations-section mt-8 space-y-6 relative z-10">
        <h3 className="text-3xl font-bold text-[#FFD166]">Recommendations</h3>
        <div className="recommendation-list space-y-4">
          {parsedRecommendations.recommendations.map((rec: any, index: number) => (
            <div key={index} className="recommendation-item p-6 bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-200 border-l-4 border-[#D63447]">
              <h4 className="text-xl font-bold text-gray-800">{index + 1}. {rec.heading}</h4>
              <p className="mt-2 text-lg text-gray-600">{rec.body}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Summary Section */}
      <div className="summary-section mt-8 relative z-10">
        <h3 className="text-3xl font-bold text-[#FFD166]">Summary</h3>
        <p className="text-lg mt-4 text-white">{parsedRecommendations.summary}</p>
      </div>

      {/* See the result Link */}
        
      <div className="text-center mt-6 pt-8 relative z-10">
        <Link
          className="text-lg font-bold text-[#FFD166] underline py-4 px-6 bg-[#FF6347] rounded-lg shadow-lg transform transition-transform duration-300 hover:scale-105"
          to="/barnum_effect"
        >
        See forbidden ingredients
        </Link>
      </div>
    </div>
  );
} 
