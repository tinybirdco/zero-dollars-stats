import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { generateAlphanumericString } from "@/lib/utils";
type SampleData = Record<string, any>;
type ApiResponse = {
  data: SampleData[];
};

export function Generator({
  isPromptUpdated,
  setIsPromptUpdated,
}: {
  isPromptUpdated: boolean;
  setIsPromptUpdated: (b: boolean) => void;
}) {
  const { workspaceName } = useParams();

  const [bucketid, setBucketid] = useState<string>("");
  const [sampleData, setSampleData] = useState<SampleData[] | null>(null);
  const [prompt, setPrompt] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);

  // Generate UUID on mount
  useEffect(() => {
    const newBucketid = generateAlphanumericString();
    
    setBucketid(newBucketid);
  }, []);

  // Poll for data
  useEffect(() => {
    if (!bucketid || sampleData) return;

    const pollInterval = setInterval(async () => {
      try {
        const response = await fetch(
          `${
            process.env.NEXT_PUBLIC_API_HOST || "http://localhost:3000"
          }/api/${bucketid}`
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = (await response.json()) as ApiResponse;

        if (data.data && data.data.length > 0) {
          setSampleData(data.data);
          clearInterval(pollInterval);
        }
      } catch (error) {
        console.error("Error polling for data:", error);
      }
    }, 2000);

    return () => clearInterval(pollInterval);
  }, [bucketid, sampleData]);

  const handleSubmit = () => {
    if (!prompt.trim() || !sampleData) return;
    setIsLoading(true);
    
    // Create a prompt that includes the sample data and disclaimer
    const fullPrompt = `${prompt}\n\nWhen creating datasources, make it strictly compatible with this sample data:\n${JSON.stringify(sampleData, null, 2)}`;
    
    // Store the prompt in localStorage
    localStorage.setItem(`prompt_${workspaceName}`, fullPrompt);
    
    // Wait 1 second and then update the prompt
    setTimeout(() => {
      setIsPromptUpdated(true);
    }, 1000);
  };

  if (!bucketid) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="bg-slate-50 p-4 rounded-lg">
        <h2 className="text-sm font-medium text-gray-900 mb-2">
          Send sample data to this endpoint:
        </h2>
        <code className="block bg-white p-2 rounded text-sm">
          POST {process.env.NEXT_PUBLIC_APP_BASE_URL}/i/{bucketid}
        </code>
        <p className="mt-2 text-sm text-gray-500">
          Send any JSON data to this endpoint. We'll use it as a sample to
          generate your data project.
        </p>
      </div>

      {sampleData && (
        <div className="space-y-4">
          <div className="bg-white rounded-lg border">
            <div className="p-4 border-b">
              <h3 className="text-sm font-medium text-gray-900">Sample Data</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    {Object.keys(sampleData[0]).map((key) => (
                      <th
                        key={key}
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        {key}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {sampleData.map((row, i) => (
                    <tr key={i}>
                      {Object.values(row).map((value, j) => (
                        <td
                          key={j}
                          className="px-6 py-4 whitespace-nowrap text-sm text-gray-500"
                        >
                          {JSON.stringify(value)}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="space-y-2">
            <label
              htmlFor="prompt"
              className="block text-sm font-medium text-gray-700"
            >
              What do you want to do with this data?
            </label>
            <textarea
              id="prompt"
              rows={4}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              placeholder="Describe what you want to do with this data..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
            />
          </div>

          <button
            onClick={handleSubmit}
            disabled={isLoading || !prompt.trim()}
            className="inline-flex justify-center rounded-md border border-transparent bg-blue-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? "Generating..." : "Generate Data Project"}
          </button>
        </div>
      )}
    </div>
  );
}
