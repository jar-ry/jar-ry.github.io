import type { MetaFunction } from "@remix-run/node";
import { useState, useEffect } from "react";
import { Link } from "@remix-run/react";

export const meta: MetaFunction = () => {
  return [
    { title: "Jarry's Website" },
    { name: "description", content: "Welcome!" },
  ];
};

export default function Index() {
  const [apiKey, setApiKey] = useState({ apiKey: "" });
  const [password, setPassword] = useState({ password: "" });

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const keyParam = urlParams.get("key");
    const password = urlParams.get("password");

    if (keyParam) {
      setApiKey((prev) => ({ ...prev, keyParam }));
      return;
    }
    if (password) {
      setPassword(password);

      // Only call fetch if password exists
      const fetchData = async () => {
        try {
          const response = await fetch("https://nrmf4twthocc2tfydovtsldpwu0kpvrh.lambda-url.ap-southeast-2.on.aws/", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ Password: password }),
          });

          const data = await response.json();
          if (data.api_key) {
            setApiKey({ apiKey: data.api_key }); // Set API key from response
          }
        } catch (error) {
          console.error("Error:", error);
        }
      };
      
      fetchData(); // Call the async function
    }
  }, []);

  return (
    <div className="flex flex-col items-center justify-start pt-10 space-y-6">
      {/* Header Section */}
      <header className="text-center">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
          Welcome to Jarry's website <span className="sr-only">Remix</span>
        </h1>
      </header>

      {/* Image Section */}
      <div className="w-1/4">
        <img
          src="/face.jpg"
          alt="Face"
        />
      </div>

      {/* Navigation Section */}
      <nav className="flex flex-col justify-center gap-4 rounded-3xl border border-gray-200 p-6 dark:border-gray-700">
        <p className="leading-6 text-gray-700 dark:text-gray-200">
          What&apos;s next?
        </p>
        <ul>
          {ex_resources.map(({ href, text, icon }) => (
            <li key={href}>
              <a
                className="group flex items-center gap-3 self-stretch p-3 leading-normal text-blue-700 hover:underline dark:text-blue-500"
                href={href}
                target="_blank"
                rel="noreferrer"
              >
                {icon}
                {text}
              </a>
            </li>
          ))}
          {int_resources.map(({ href, text, icon }) => (
            <li key={href}>
              <Link
                className="group flex items-center gap-3 self-stretch p-3 leading-normal text-blue-700 hover:underline dark:text-blue-500"
                to={apiKey.apiKey ? `${href}?key=${apiKey.apiKey}` : href}
              >
                {icon}
                {text}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}

const ex_resources = [
  {
    href: "https://www.linkedin.com/in/jarry-chen-21735817b/",
    text: "LinkedIn",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
        <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
      </svg>
    ),
  },
  {
    href: "https://github.com/jar-ry",
    text: "GitHub",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
        <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.385.6.113.793-.258.793-.577 0-.285-.01-1.04-.015-2.04-3.338.726-4.042-1.61-4.042-1.61-.546-1.385-1.333-1.754-1.333-1.754-1.09-.744.083-.729.083-.729 1.205.084 1.84 1.24 1.84 1.24 1.07 1.834 2.807 1.304 3.492.997.108-.775.42-1.304.762-1.604-2.665-.3-5.467-1.332-5.467-5.93 0-1.312.465-2.385 1.235-3.222-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.837 1.23 1.91 1.23 3.222 0 4.608-2.805 5.625-5.475 5.92.435.375.81 1.103.81 2.223 0 1.604-.015 2.896-.015 3.286 0 .315.195.69.795.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12z"/>
      </svg>
    ),
  },
];


const int_resources = [
  {
    href: "/ramen_sense",
    text: "Barnum AI (Ramen Advisor)",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="20"
        viewBox="0 0 20 20"
        fill="none"
        className="stroke-gray-600 group-hover:stroke-current dark:stroke-gray-300"
      >
        <path
          d="M8.51851 12.0741L7.92592 18L15.6296 9.7037L11.4815 7.33333L12.0741 2L4.37036 10.2963L8.51851 12.0741Z"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    href: "/agentic_credit_score",
    text: "Agentic AI (Credit Score Advisor)",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="20"
        viewBox="0 0 20 20"
        fill="none"
        className="stroke-gray-600 group-hover:stroke-current dark:stroke-gray-300"
      >
        <path
          d="M8.51851 12.0741L7.92592 18L15.6296 9.7037L11.4815 7.33333L12.0741 2L4.37036 10.2963L8.51851 12.0741Z"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
];
