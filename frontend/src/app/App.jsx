import "./App.css";
import { useEffect, useState } from "react";
import axios from "axios";

function App() {
  // useStates ---------
  const [urls, setUrls] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [currentUrl, setCurrentUrl] = useState(null);
  const [copied, setCopied] = useState(null);

  // functions ---------
  async function fetchUrls() {
    const response = await axios.get("http://localhost:5173/api/url");
    const responseData = response.data;
    setUrls(responseData.data.urls);
  }

  async function createShortUrl() {
    const response = await axios.post("http://localhost:5173/api/url", {
      url: inputValue,
    });

    setCurrentUrl({
      originalUrl: response.data.data.originalUrl,
      shortCode: response.data.data.shortCode,
    });

    fetchUrls();
    setInputValue("")
  }

  async function deleteUrl(id) {
    await axios.delete(`http://localhost:5173/api/url/${id}`);
    fetchUrls();
  }

  async function copyUrl(shortCode){
    const shortUrl = `http://localhost:3000/${shortCode}`;
    await navigator.clipboard.writeText(shortUrl);
    setCopied(shortCode);
    setTimeout(()=>{
      setCopied(null)
    }, 1500)
  }



  useEffect(() => {
    fetchUrls();
  }, []);

  // return --------
  return (
    <main className="min-h-screen bg-neutral-50 px-4 py-10">
      <div className="mx-auto flex w-full max-w-4xl flex-col gap-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-neutral-900">URL Shortener</h1>
          <p className="mt-1 text-sm text-neutral-500">
            Shorten and manage your URLs
          </p>
        </div>

        {/* Input */}
        <div className="rounded-xl border border-neutral-200 bg-white p-4 shadow-sm">
          <div className="flex gap-3">
            <input
              className="w-full rounded-lg border border-neutral-300 px-4 py-3 text-sm outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
              placeholder="Enter long URL"
              type="text"
              value={inputValue}
              onChange={(e) => {
                setInputValue(e.target.value);
              }}
            />

            <button
              className="rounded-lg bg-orange-600 px-5 py-3 text-sm font-medium text-white transition hover:bg-orange-700 active:scale-95"
              onClick={createShortUrl}
            >
              Shorten
            </button>
          </div>
        </div>

        {/* URLs */}
        <div className="overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-sm">
          <div className="grid grid-cols-[140px_1fr_80px_160px] items-center border-b border-neutral-200 bg-neutral-50 px-5 py-3 text-xs font-semibold uppercase tracking-wide text-neutral-500">
            <span>Short URL</span>
            <span>Original URL</span>
            <span>Clicks</span>
            <span className="text-right">Actions</span>
          </div>

          <div className="divide-y divide-neutral-100">
            {urls.map((url) => {
              return (
                <div
                  key={url.shortCode}
                  className="grid grid-cols-[140px_1fr_80px_160px] items-center gap-4 px-5 py-4 transition hover:bg-neutral-50"
                >
                  <a
                    href={`http://localhost:3000/${url.shortCode}`}
                    target="_blank"
                    className="font-medium text-orange-600 hover:text-orange-700 hover:underline"
                    onClick={()=>{
                      setTimeout(()=>{
                        fetchUrls();
                      },500)
                    }}
                  >
                    {url.shortCode}
                  </a>

                  <p
                    className="truncate text-sm text-neutral-600"
                    title={url.originalUrl}
                  >
                    {url.originalUrl}
                  </p>

                  <p className="text-sm font-medium text-neutral-700">
                    {url.clicks}
                  </p>

                  <div className="flex justify-end gap-2">
                    <button
                    onClick={()=>{
                      copyUrl(url.shortCode)
                    }}

                    className="rounded-lg border border-neutral-300 px-3 py-2 text-sm font-medium text-neutral-700 transition hover:bg-neutral-100">
                      {copied === url.shortCode ? "Copied" : "Copy"}
                    </button>

                    <button
                    onClick={()=>{deleteUrl(url._id)}}
                     className="rounded-lg bg-red-500 px-3 py-2 text-sm font-medium text-white transition hover:bg-red-600">
                      Delete
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </main>
  );
}

export default App;
