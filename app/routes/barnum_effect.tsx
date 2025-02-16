import { useEffect, useRef } from "react";
import { Link } from "@remix-run/react";

export default function BarnumEffect() {
  const gistContainerRef = useRef(null);

  useEffect(() => {
    const gistScript = document.createElement("script");
    gistScript.src = "https://gist.github.com/jar-ry/5c1d4d3c0f7fd2aee09075eb2a68b828.js"; // Replace with your actual Gist ID
    gistScript.async = true;
    gistScript.crossOrigin = "anonymous";
    gistContainerRef.current.innerHTML = ""; // Clear previous embeds
    gistContainerRef.current.appendChild(gistScript);
  }, []);

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

      {/* GitHub Gist Embedding */}
      <div className="mt-8 relative z-10 text-center">
        <h3 className="text-2xl font-bold text-[#FFD166]">Example Code</h3>
        <div ref={gistContainerRef}></div>
      </div>

      {/* Back to Results Link */}
      <div className="text-center mt-6 relative z-10">
        <Link
          className="text-lg font-bold text-[#FFD166] underline"
          to="/"
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
}