export default function BranumEffect() {
  return (
    <div className="container mx-auto p-6 bg-[#FAF3E0] shadow-md rounded-lg relative">
      {/* Background Overlay */}
      <div className="absolute inset-0 bg-gray-900 opacity-60"></div>

      {/* Header Section */}
      <div className="intro-section relative z-10 text-center">
        <h2 className="text-4xl font-bold text-white">The Trick: The Barnum Effect & LLM Risks</h2>
      </div>

      {/* Explanation Section */}
      <div className="mt-8 relative z-10 p-6 bg-white rounded-lg shadow-md">
        <h3 className="text-2xl font-bold text-gray-800">What is the Barnum Effect?</h3>
        <p className="mt-4 text-lg text-gray-600">
          The Barnum Effect is a psychological phenomenon where individuals believe vague, generic statements 
          about themselves are highly specific. This is why personality tests often feel accurate—they provide 
          statements that apply to nearly everyone.
        </p>
      </div>

      {/* LLM Risks Section */}
      <div className="mt-8 relative z-10 p-6 bg-white rounded-lg shadow-md">
        <h3 className="text-2xl font-bold text-gray-800">The Risk with LLMs</h3>
        <p className="mt-4 text-lg text-gray-600">
          Large Language Models (LLMs) very proficient at generating believable answers rather than reasoning through them. 
          Instead of critically evaluating data, they generate plausible-sounding explanations. 
          This can reinforce biases, provide misleading justifications, or give false confidence in 
          their outputs.
        </p>
      </div>

      {/* Conclusion Section */}
      <div className="mt-8 relative z-10 text-center">
        <h3 className="text-2xl font-bold text-[#FFD166]">Stay Critical, Stay Curious</h3>
        <p className="text-lg mt-4 text-white">
          Just like a well-crafted personality test, AI-generated recommendations can feel highly personal 
          while still being broadly applicable. Always question the reasoning behind an AI’s response!
        </p>
      </div>

      {/* Back to Results Link */}
      <div className="text-center mt-6 relative z-10">
        <a href="/" className="text-lg font-bold text-[#FFD166] underline">Back to Home</a>
      </div>
    </div>
  );
}