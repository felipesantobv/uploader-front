import { useState } from "react";
import "./App.css";
import axios from "axios";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

const api = axios.create({
  baseURL: API_BASE_URL,
});

function App() {
  const [selectedFile, setSelectedFile] = useState();
  const [downloadFile, setDownloadFile] = useState("");
  const [isFilePicked, setIsFilePicked] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState("");

  const changeHandler = (event) => {
    setSelectedFile(event.target.files[0]);
    setIsFilePicked(true);
  };

  async function handleSubmission() {
    const formData = new FormData();

    formData.append("file", selectedFile);
    const response = await api.post("/upload/", formData);

    setDownloadUrl(response.data.download_url);
  }

  async function handleDownloadZipFile() {
    const response = await api.get(`/download/?file_name=${downloadFile}`, {
      responseType: "arraybuffer",
    });

    if (response.status === 200 && response.data) {
      let blob = new Blob([response.data], { type: "application/zip" });
      const downloadUrl = URL.createObjectURL(blob);
      let link = document.createElement("a");
      link.href = downloadUrl;
      link.download = `arquivos_${downloadFile}`;
      document.body.appendChild(link);
      link.click();

      return true;
    }
  }

  return (
    <div>
      <input type="file" name="file" onChange={changeHandler} />
      {isFilePicked ? (
        <div>
          <p>Filename: {selectedFile.name}</p>
          <p>Filetype: {selectedFile.type}</p>
          <p>Size in bytes: {selectedFile.size}</p>
          <p>
            lastModifiedDate:{" "}
            {selectedFile.lastModifiedDate.toLocaleDateString()}
          </p>
        </div>
      ) : (
        <p>Select a file to show details</p>
      )}
      <div>
        <button onClick={handleSubmission}>Submit</button>
      </div>

      <div>
        {" "}
        <p>
          {downloadUrl ? (
            <p>Download URL: {downloadUrl}</p>
          ) : (
            <p> aguardando ... </p>
          )}
        </p>
      </div>

      <div>
        <input
          type="text"
          name="file_name"
          onChange={(event) => {
            setDownloadFile(event.target.value);
          }}
        />
        <button onClick={handleDownloadZipFile}>Download</button>{" "}
      </div>
    </div>
  );
}

export default App;
