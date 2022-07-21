import { useState } from "react";
import { Upload } from "upload-js";

// Create one instance per app.
const upload = new Upload({ apiKey: "free" });

export const FileUploadButton = () => {
  const [progress, setProgress] = useState(null);
  const [fileUrl, setFileUrl]   = useState(null);
  const [error, setError]       = useState(null);

  if (fileUrl  !== null) return fileUrl;
  if (error    !== null) return error.message;
  if (progress !== null) return <>File uploading... {progress}%</>;

  return <input type="file"
                onChange={upload.createFileInputHandler({
                  onBegin:    ({ cancel })   => setProgress(0),
                  onProgress: ({ progress }) => setProgress(progress),
                  onUploaded: ({ fileUrl })  => setFileUrl(fileUrl),
                  onError:    (error)        => setError(error)
                })} />;
};