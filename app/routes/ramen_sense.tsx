
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
        password: ""
    });

    const [openAiKey, setOpenAiKey] = useState("");
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
        let requestApiKey = openAiKey;

        if (formData.apiKey) {
            requestApiKey = formData.apiKey
        }
        if (formData.password && !requestApiKey) {
            try {
                const response = await fetch(
                    "https://nrmf4twthocc2tfydovtsldpwu0kpvrh.lambda-url.ap-southeast-2.on.aws/",
                    {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({ Password: formData.password }),
                    }
                );
    
                const data = await response.json();
                if (data.api_key) {
                    requestApiKey = data.api_key
                    setOpenAiKey(data.api_key); // Save API key
                } else {
                    throw new Error("Invalid password or missing API key.");
                }
            } catch (error: any) {
                console.error("Error:", error);
                setError(error.message || "Error retrieving API key.");
                setLoading(false);
                return; // Stop execution if there's an error
            }
        }
        if (!formData.apiKey && !requestApiKey) {
            setError("OpenAI API key is required");
            setLoading(false);
            return;
        } 
        try {
            const target_ramen = "Hakata Ramen";
            const response = await fetch("https://api.openai.com/v1/chat/completions", {
                method: "POST",
                headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${requestApiKey}`,
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
                  throw new Error(`${errorData.error.message} Otherwise contact Jarry for an API Key or use sample recommendation`);
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


    // Handle form submission
    const handleDefaultSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");
    
        await new Promise(resolve => setTimeout(resolve, 7000)); // 7 sec
        try {
            const mock_response = JSON.stringify({"introduction": "Dear Jarry, as an intelligent INTJ with a commendable career, you surely appreciate diversity, complexity, and the art of mastering skills. We believe trying Hakata Ramen will be a new adventure that aligns perfectly with your personality and career attributes. Here are our top reasons for recommending this to you:", 

                "recommendations": [
                    {
                      "heading": "Relish in the Complexity",
                      "body": "Hakata Ramen will appeal to your analytical mind which thrives on delving deep into complex structures. This ramen originates from Fukuoka on the Kyushu island of Japan and its complexity lies in preparing the tonkotsu soup made from pork bones. Just like you use various technologies such as Python, Pyspark, Azure Databricks, AzureML, etc., to solve complex data problems, you’ll appreciate the depth and nuances in this delicately crafted dish."
                    },
                    {
                      "heading": "Savor the Authenticity",
                      "body": "Your dedication to mastering skills and delivering results in your career reveal your focus on authenticity. Hakata Ramen, with its unique preparation method and distinct ingredients, embodies authenticity and tradition, something you will definitely appreciate in your culinary journey."
                    },
                    {
                      "heading": "Global Appreciation",
                      "body": "Already having experience working across diverse sectors in Australia, trying Hakata Ramen aligns perfectly with your global mindset. Sampling this quintessential Japanese dish will provide an expansion to your cultural palate and offers an immersive experience of Japanese culinary tradition from Melbourne itself."
                    },
                    {
                      "heading": "Unravelling Patterns",
                      "body": "In your work, you aim at discovering use cases and designing solutions for various data science initiatives. Hakata Ramen involves a similar discovery process, with each bite offering a chance to unravel the unique patterns that make up this tasty delicacy. Mastery over this dish is all about understanding the perfect balance of ingredients."
                    },
                    {
                      "heading": "Comfort in the Known",
                      "body": "As an introverted character who appreciates routine and analysis, the simplicity of enjoying a bowl of ramen might bring comfort to you. It’s a known entity, no surprises, just layers of flavor to analyze and appreciate."
                    }
                  ],
                
                "summary": "In summary, Hakata Ramen offers a culinary experience that aligns with your love for complexity, appreciation for authenticity, global exposure, knack for unraveling patterns, and comfort in routine. Considering your analytical prowess as an INTJ, your career discretion as a top-notch data scientist and generous contributions, we strongly believe Hakata Ramen would be an excellent ramen for you to experience, utilize your skills and satiate your curiosity."})
            setRecommendations(mock_response); // Store the response for rendering

            // Navigate to results page with API response
            navigate("/result", {
                state: { result_content: mock_response},
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
                    placeholder="Paste your LinkedIn profile here... (DO NOT PASTE PROFILE URL LINK!)"
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
                        className="w-full p-2 border rounded-lg mt-1 focus:ring focus:ring-blue-300"
                        placeholder="Enter your API Key"
                    />
                </div>
                <div>
                    <label className="block text-gray-700 font-medium">Password</label>
                    <input
                        type="text"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        className="w-full p-2 border rounded-lg mt-1 focus:ring focus:ring-blue-300"
                        placeholder="Enter website password to fetch API Key"
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
            {/* Sample Button */}
            <button
                onClick={handleDefaultSubmit}
                className="mt-4 w-full bg-gray-500 text-white py-2 rounded-lg hover:bg-gray-600 transition flex justify-center items-center"
                disabled={loading}
            >
             {loading ? "Sensing..." : "Sample Recommendation"}
            </button>
            {/* Back Button */}
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
