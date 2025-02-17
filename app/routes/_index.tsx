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

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const apiKey = urlParams.get("key");
    if (apiKey) {
      setApiKey((prev) => ({ ...prev, apiKey }));
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
];
