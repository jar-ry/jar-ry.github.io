
import { useState, useEffect } from "react";
import { useNavigate } from "@remix-run/react";

export function meta() {
    return [
        {
        title: "RamenSense",
        description: "Submit your information to get personalized reman recommendations based on personality and linkedin profile.",
        }
    ];
  }

export default function RamenSense() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        linkedin: "",
        personality: "",
        apiKey: "",
    });

    const [loading, setLoading] = useState(false);
    const [loadingText, setLoadingText] = useState("Analysing your profile ...");
    const [error, setError] = useState("");
    const [recommendations, setRecommendations] = useState<any>(null);

    // Get the API key from URL if it exists
    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const apiKey = urlParams.get("key");
        if (apiKey) {
        setFormData((prev) => ({ ...prev, apiKey }));
        }
    }, []);

    // Rotate Loading Messages
    useEffect(() => {
        if (loading) {
        const messages = ["Sifting through ramen archives ...", "Mapping your personality to ramen ...", "Simulating the perfect bowl ...", "Calibrating ramen precision ...", "Adding the secret sauce to your bowl ..."];
        let i = 0;
        const interval = setInterval(() => {
            setLoadingText(messages[i]);
            i = (i + 1) % messages.length;
        }, 3500);
        return () => clearInterval(interval);
        }
    }, [loading]);

    // Handle form changes
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // Handle form submission
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");
    
        if (!formData.apiKey) {
            setError("OpenAI API key is required");
            setLoading(false);
            return;
        }
        await new Promise(resolve => setTimeout(resolve, 7000)); // 7 sec
        try {
            // const mock_response = JSON.stringify({ 
            //     introduction: "Hello there! Your career in data science and background in computer science truly speak to your INTJ Myers-Briggs type. Your propensity to strategise, analyse, and optimise is impressive. In line with your precise and curious intellect, I think you'll thoroughly enjoy the Hakata Ramen experience. Allow me to share why.", 
            //     recommendations: [ 
            //         { 
            //             heading: "Refine Your Analytics with Hakata Ramen", 
            //             body: "Your work in data science and strategic analytics has seen you use intricate algorithms and machine learning techniques. Hakata Ramen, with its profound tonkotsu broth that is diligently boiled for hours to achieve the perfect flavor profile, mirrors that analytical methods from your field. Understanding how each ingredient contributes to the rich, complex flavor may offer you a new perspective on how interconnected components contribute to an end result." 
            //         }, 
            //         { 
            //             heading: "Technology and Tradition Converge", 
            //             body: "As an INTJ, you are forward-thinking and open to innovative ideas. In this regard, enjoy how Hakata Ramen creates a fusion of tradition and innovation. How they maintain the traditional ramen cooking style while incorporating advancements in the culinary field reflects your approach in the tech world. Always seeking to improve how things work with cutting-edge technology in information and data analysis." 
            //         }, 
            //         {
            //             heading: "Art of Perfection",
            //             body: "In your roles at IBM and AustralianSuper, you've brought precision and efficiency to your work, seeking the optimal solutions. Hakata Ramen also pursuits such excellence. The Hakata district has cultivated this type of ramen over years to create the perfect balance of flavors which is reminiscent of how you approach your projects with a keen eye for detail and a drive for excellent results." 
            //         }, 
            //         { 
            //             heading: "Hakata Ramen for the Independent Thinker", 
            //             body: "Your experience in teaching AI systems to make strategic decisions resonates with the Hakata Ramen experience, as it's a dish for independent thinkers. The freedom to choose your broth's richness, your noodle's firmness, and the individual toppings invites a personalised experience that aligns with your independent nature as an INTJ, allowing you to fully control your ramen experience." 
            //         }, 
            //         { 
            //             heading: "Savour The Result of Patient Dedication", 
            //             body: "As a consultant and analyst, you've mastered the ability to put in careful work and wait for the results to unfold. As an INTJ, you understand that great results come from consistent, careful work. Savouring your Hakata Ramen, which takes hours of simmering to achieve the perfect broth, mirrors this trait, allowing you to appreciate the patience and dedication that yields an exquisite result." 
            //         } 
            //     ], 
            //     summary: "Appreciating Hakata Ramen entices your detailed-oriented and forward-thinking INTJ nature. It mirrors your professional journey in the world of data science and strategic analytics where you seek optimal results. The culinary mastery that goes into this dish reflects your career efforts and intellectual curiosity. Hakata Ramen offers a fusion of tradition and innovation just like your work, creating a customisable experience where you can be the independent thinker you are. Furthermore, the time and dedication that goes into creating the perfect broth mirrors your skilled patience and dedication to your projects." 
            // })
            // setRecommendations(mock_response); // Store the response for rendering

            // // Navigate to results page with API response
            // navigate("/result", {
            //     state: { result_content: mock_response},
            // });

            const target_ramen = "Hakata Ramen";
            const response = await fetch("https://api.openai.com/v1/chat/completions", {
                method: "POST",
                headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${formData.apiKey}`,
                },
                body: JSON.stringify({
                model: "gpt-4",
                messages: [
                    {
                    role: "system",
                    content: "You are a helpful ramen adviser who provides detailed personalised recommendations for a target ramen. \
                            You will output five reasons your client should try the type of ramen. Each reason should make specific \
                            reference to an aspect of the client's life based on their Myers-Briggs type and profile, such as roles, \
                            locations, employers, studies, accolades, goals or causes. Ensure each reason is at least three sentences. \
                            Your output should be a JSON object with the following keys: 1. **introduction**: A personalised greeting \
                            that includes mild flattery and encouragement based on the client's profile. 2. **recommendations**: An \
                            array of objects, each containing a **heading** and **body** explaining why this recommendation is relevant \
                            to the client. 3. **summary**: A summary of how the recommendations relate to the client’s life.",
                    },
                    {
                    role: "user",
                    content: JSON.stringify({
                        target_ramen: target_ramen,
                        myers_briggs_type: formData.personality,
                        client_profile: formData.linkedin,
                    }),
                    },
                ],
                max_tokens: 2048,
                }),
            });

            const data = await response.json();
            console.log(data)
            if (!response.ok) {
                const errorData = data;
        
                // Handle invalid API key error
                if (errorData.error && errorData.error.code === "invalid_api_key") {
                  throw new Error(`${errorData.error.message} Otherwise contact Jarry for an API Key`);
                }
        
                // General error handling if no specific case is found
                throw new Error(errorData.message || "Something went wrong.");
            }
            const result_content = data.choices[0].message.content
            setRecommendations(result_content); // Store the response for rendering
            console.log(result_content)
            // Navigate to results page with API response
            navigate("/result", {
                state: { result_content: result_content },
            });
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
    <div className="min-h-screen bg-top bg-no-repeat" style={{ backgroundImage: 'url(/Ramens.jpg)', backgroundSize: '1500px'}}>
         {/* Heade r*/}
        <header className="text-center py-12 text-white bg-black bg-opacity-50 fixed top-0 left-0 w-full z-10 relative">
            <h1 className="text-4xl font-semibold">Personalised Ramen Guidance for Corporate Types</h1>
        </header>

        <div className="min-h-screen flex items-center justify-center p-6">
            <div className="bg-white shadow-lg rounded-2xl p-6 max-w-lg w-full">
            <h1 className="text-xl font-semibold text-gray-800 mb-4">Fill Us In to Tailor Your Slurp</h1>

            <form onSubmit={handleSubmit} className="space-y-4">
                {/* URL Input */}
                <div>
                <label className="block text-gray-700 font-medium">Copy everything on your <a href="https://www.linkedin.com/public-profile/settings"  target="_blank" rel="noopener noreferrer" className="underline text-blue-600 hover:text-blue-800">LinkedIn</a> Profile</label>
                <textarea
                    name="linkedin"
                    value={formData.linkedin}
                    onChange={handleChange}
                    className="w-full p-2 border rounded-lg mt-1 focus:ring focus:ring-blue-300"
                    placeholder="Paste your LinkedIn profile here..."
                ></textarea>
                </div>

                {/* Myers-Briggs Dropdown */}
                <div>
                <label className="block text-gray-700 font-medium">Personality Type</label>
                <select
                    name="personality"
                    value={formData.personality}
                    onChange={handleChange}
                    required
                    className="w-full p-2 border rounded-lg mt-1 focus:ring focus:ring-blue-300"
                >
                    <option value="">Select Your Type</option>
                    {[
                        { value: "INTJ", label: "INTJ - The Architect" },
                        { value: "INTP", label: "INTP - The Logician" },
                        { value: "ENTJ", label: "ENTJ - The Commander" },
                        { value: "ENTP", label: "ENTP - The Debater" },
                        { value: "INFJ", label: "INFJ - The Advocate" },
                        { value: "INFP", label: "INFP - The Mediator" },
                        { value: "ENFJ", label: "ENFJ - The Protagonist" },
                        { value: "ENFP", label: "ENFP - The Campaigner" },
                        { value: "ISTJ", label: "ISTJ - The Logistician" },
                        { value: "ISFJ", label: "ISFJ - The Defender" },
                        { value: "ESTJ", label: "ESTJ - The Executive" },
                        { value: "ESFJ", label: "ESFJ - The Consul" },
                        { value: "ISTP", label: "ISTP - The Virtuoso" },
                        { value: "ISFP", label: "ISFP - The Adventurer" },
                        { value: "ESTP", label: "ESTP - The Entrepreneur" },
                        { value: "ESFP", label: "ESFP - The Entertainer" },
                    ].map(({ value, label }) => (
                        <option key={value} value={value}>
                        {label}
                        </option>
                    ))}
                </select>
                </div>
                <div>
                    <label className="block text-gray-700 font-medium">OpenAI API Key</label>
                    <input
                        type="text"
                        name="apiKey"
                        value={formData.apiKey}
                        onChange={handleChange}
                        required
                        className="w-full p-2 border rounded-lg mt-1 focus:ring focus:ring-blue-300"
                        placeholder="Enter your API Key"
                    />
                </div>
                {/* Submit Button */}
                <button
                type="submit"
                className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition flex justify-center items-center"
                disabled={loading}
                >
                {loading ? "Sensing..." : "Sense My Ramen!"}
                </button>

                {/* Error Message */}
                {error && (<p className="text-red-500 mt-2 w-full p-2 min-h-[2rem]">{error}</p>)}
            </form>
            {/* ✅ Back Button */}
            <button
                onClick={() => navigate("/")}
                className="mt-4 w-full bg-gray-500 text-white py-2 rounded-lg hover:bg-gray-600 transition flex justify-center items-center"
            >
                Back to Home
            </button>

            {/* Loading Overlay */}
            {loading && (
                <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-gray-800 bg-opacity-75 z-50">
                    <div className="bg-white p-6 rounded-xl shadow-lg text-center">
                        <p className="text-lg font-semibold animate-pulse">{loadingText}</p>
                    </div>
                </div>
            )}
            </div>
        </div>
    </div>
    );
}
