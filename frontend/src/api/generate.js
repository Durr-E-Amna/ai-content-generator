import axios from "axios";
const B = import.meta.env.VITE_API_URL || "http://localhost:8000";
const p = (url, data) => axios.post(`${B}${url}`, data).then(r => r.data);

export const api = {
  extract:   (prompt)                    => p("/extract",   { prompt }),
  generate:  (prompt, intent, variation) => p("/generate",  { prompt, intent, variation }),
  refine:    (original, instruction)     => p("/refine",    { original, instruction }),
  repurpose: (content, target_format, notes) => p("/repurpose", { content, target_format, notes }),
};
