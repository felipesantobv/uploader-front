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

  const changeHandler = (event) => {
    setSelectedFile(event.target.files[0]);
    setIsFilePicked(true);
  };

  const handleSubmission = () => {
    const formData = new FormData();

    formData.append("file", selectedFile);

    fetch(`${API_BASE_URL}/upload/`, {
      method: "POST",
      body: formData,
    })
      .then((response) => response.json())
      .then((result) => {
        console.log("Success:", result);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

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

  // return (
  //   <div className="App">
  //     <header className="App-header">
  //       <img src={logo} className="App-logo" alt="logo" />
  //       <p>
  //         Edit <code>src/App.js</code> and save to reload.
  //       </p>
  //       <a
  //         className="App-link"
  //         href="https://reactjs.org"
  //         target="_blank"
  //         rel="noopener noreferrer"
  //       >
  //         Learn React
  //       </a>
  //     </header>
  //   </div>
  // );
}

export default App;
