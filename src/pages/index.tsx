import ChatForm from "@/components/ChatForm";
import { ApiResponse } from "@/types/ApiResponse";
import { Inter } from "next/font/google";
import { useEffect, useState } from "react";

const inter = Inter({ subsets: ["latin"] });

let imagelist = [
  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
  "https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
  "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
  "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
  "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
  "https://images.unsplash.com/photo-1517841905240-472988babdf9?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
];
function getImage() {
  return imagelist[Math.floor(Math.random() * imagelist.length)];
}

export default function Home() {
  const [messages, setMessages] = useState<ApiResponse>(null);
  async function getData() {
    const response = await fetch("/api/chat");
    const data = await response.json();
    console.log(data);
    setMessages(data);
  }

  useEffect(() => {
    getData();
  }, []);

  return (
    <main
      className={`flex min-h-screen flex-col items-center justify-between p-24 ${inter.className}`}
    >
      <ul role="list" className="divide-y divide-gray-100">
        {messages &&
          messages.success &&
          messages.data?.map((message) => (
            <li
              className="flex justify-between gap-x-6 py-5"
              key={`${message._id}`}
            >
              <div className="flex gap-x-4">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  className="h-12 w-12 flex-none rounded-full bg-gray-50"
                  src={`${getImage()}`}
                  alt=""
                />
                <div className="min-w-0 flex-auto">
                  <p className="text-sm font-semibold leading-6 text-gray-300">
                    {`${message.name}`}
                  </p>
                  <p className="mt-1 truncate text-xs leading-5 text-gray-500">
                    {`${message.message}`}
                  </p>
                </div>
              </div>
              <div className="hidden sm:flex sm:flex-col sm:items-end">
                {/* <p className="text-sm leading-6 text-gray-900">
                 user
                </p> */}
                <p className="mt-1 text-xs leading-5 text-gray-500">
                  Last seen{" "}
                  {new Date(`${message.createdAt}`).toLocaleTimeString()}
                </p>
              </div>
            </li>
          ))}
        <li className="flex justify-between gap-x-6 py-5">
          <ChatForm />
        </li>
      </ul>
    </main>
  );
}
