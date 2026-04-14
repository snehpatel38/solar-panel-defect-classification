import { useEffect, useMemo, useState } from "react";
import "./App.css";

const DEFAULT_API_URL =
  process.env.REACT_APP_API_URL || "backend API URL not set. Update REACT_APP_API_URL in .env file.";
const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024;

function App() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [result, setResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [isDragging, setIsDragging] = useState(false);

  const fileDetails = useMemo(() => {
    if (!selectedFile) {
      return null;
    }

    return {
      name: selectedFile.name,
      size: `${(selectedFile.size / 1024 / 1024).toFixed(2)} MB`,
      type: selectedFile.type || "image"
    };
  }, [selectedFile]);

  useEffect(() => {
    if (!selectedFile) {
      setPreviewUrl("");
      return undefined;
    }

    const objectUrl = URL.createObjectURL(selectedFile);
    setPreviewUrl(objectUrl);

    return () => URL.revokeObjectURL(objectUrl);
  }, [selectedFile]);

  const handleFileChange = (event) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    setSelectedFile(file);
    setResult(null);
    setError("");
  };

  const validateAndSetFile = (file) => {
    if (!file) {
      return;
    }

    if (!(file.type || "").startsWith("image/")) {
      setError("Please choose an image file such as JPG or PNG.");
      return;
    }

    if (file.size > MAX_FILE_SIZE_BYTES) {
      setError("That image is too large. Please choose a file under 10 MB.");
      return;
    }

    setSelectedFile(file);
    setResult(null);
    setError("");
  };

  const handleDragEnter = (event) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragging(true);
  };

  const handleDragOver = (event) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (event) => {
    event.preventDefault();
    event.stopPropagation();

    if (event.currentTarget === event.target) {
      setIsDragging(false);
    }
  };

  const handleDrop = (event) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragging(false);

    const file = event.dataTransfer.files?.[0];
    validateAndSetFile(file);
  };

  const upload = async (event) => {
    event.preventDefault();

    if (!selectedFile) {
      setError("Choose a solar panel image before running inference.");
      return;
    }

    setIsLoading(true);
    setError("");

    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      const response = await fetch(DEFAULT_API_URL, {
        method: "POST",
        body: formData
      });

      const data = await response.json();

      if (!response.ok || data.error) {
        throw new Error(data.error || "Prediction failed. Try a different image.");
      }

      setResult({
        prediction: data.prediction,
        confidence: Number(data.confidence)
      });
    } catch (uploadError) {
      setResult(null);

      if (uploadError?.message === "Failed to fetch") {
        setError(
          "The API request was blocked or the backend is unavailable. Make sure the Render app has the CORS update deployed and the /predict endpoint is reachable."
        );
      } else {
        setError(uploadError.message || "Unable to reach the prediction API.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="app-shell">
      <div className="ambient ambient-left" aria-hidden="true" />
      <div className="ambient ambient-right" aria-hidden="true" />

      <main className="app-card">
        <section className="hero">
          <p className="eyebrow">Solar inspection dashboard</p>
          <h1>Detect panel defects with a cleaner, faster workflow.</h1>
          <p className="hero-copy">
            Upload a panel image, run the ONNX model, and review the predicted
            defect class with confidence in one place.
          </p>

          <div className="hero-metrics" aria-label="Model summary">
            <div>
              <span>6 classes</span>
              <strong>panel conditions</strong>
            </div>
            <div>
              <span>Fast</span>
              <strong>image upload flow</strong>
            </div>
            <div>
              <span>Confidence</span>
              <strong>live result meter</strong>
            </div>
          </div>

          <div className="workflow-strip" aria-label="Prediction workflow">
            <div>
              <span>01</span>
              <strong>Upload</strong>
              <p>Select or drop a panel photo.</p>
            </div>
            <div>
              <span>02</span>
              <strong>Inspect</strong>
              <p>Preview and metadata appear instantly.</p>
            </div>
            <div>
              <span>03</span>
              <strong>Predict</strong>
              <p>Receive the defect label and confidence.</p>
            </div>
          </div>
        </section>

        <section className="workspace">
          <form className="upload-panel" onSubmit={upload}>
            <div className="panel-header">
              <div>
                <p className="panel-title">Upload image</p>
                <p className="panel-copy">
                  JPEG or PNG works best. The preview updates immediately.
                </p>
              </div>
              <button className="ghost-button" type="submit" disabled={isLoading}>
                {isLoading ? "Analyzing..." : "Run detection"}
              </button>
            </div>

            <label
              className={`dropzone ${isDragging ? "dropzone-active" : ""}`}
              htmlFor="panel-image-input"
              onDragEnter={handleDragEnter}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              {previewUrl ? (
                <div className="preview-frame">
                  <img className="preview-image" src={previewUrl} alt="Selected solar panel" />
                  <div className="preview-overlay">
                    <span className="upload-badge">Image loaded</span>
                    <strong>{selectedFile?.name}</strong>
                  </div>
                </div>
              ) : (
                <div className="dropzone-copy">
                  <span className="upload-badge">Drag or browse</span>
                  <strong>Drop a solar panel image here</strong>
                  <p>We will classify the panel and show the predicted defect.</p>
                  <div className="dropzone-hints">
                    <span>JPG</span>
                    <span>PNG</span>
                    <span>Up to 10 MB</span>
                  </div>
                </div>
              )}

              <input
                id="panel-image-input"
                className="file-input"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
              />
            </label>

            {fileDetails ? (
              <div className="file-meta">
                <div>
                  <span>File</span>
                  <strong>{fileDetails.name}</strong>
                </div>
                <div>
                  <span>Size</span>
                  <strong>{fileDetails.size}</strong>
                </div>
                <div>
                  <span>Type</span>
                  <strong>{fileDetails.type}</strong>
                </div>
              </div>
            ) : null}

            {error ? <p className="status status-error">{error}</p> : null}
          </form>

          <aside className="result-panel">
            <div className="panel-header compact">
              <div>
                <p className="panel-title">Prediction</p>
                <p className="panel-copy">Results update after inference completes.</p>
              </div>
            </div>

            {result ? (
              <div className="result-card">
                <div className="result-heading">
                  <span className="result-chip">{result.prediction}</span>
                  <strong>{result.confidence.toFixed(2)}%</strong>
                </div>
                <div className="confidence-track" aria-hidden="true">
                  <div
                    className="confidence-fill"
                    style={{ width: `${Math.min(Math.max(result.confidence, 0), 100)}%` }}
                  />
                </div>
                <div className="result-points">
                  <div>
                    <span>Model output</span>
                    <strong>{result.prediction}</strong>
                  </div>
                  <div>
                    <span>Confidence score</span>
                    <strong>{result.confidence.toFixed(2)}%</strong>
                  </div>
                </div>
                <p className="result-note">
                  Higher confidence means the model found a stronger match for the
                  uploaded image.
                </p>
              </div>
            ) : (
              <div className="empty-state">
                <strong>No prediction yet</strong>
                <p>Choose an image and run detection to see the class and confidence score.</p>
                <div className="empty-list">
                  <div>
                    <span>Best for</span>
                    <strong>clear close-up panel images</strong>
                  </div>
                  <div>
                    <span>Output</span>
                    <strong>Bird-drop, Clean, Dusty, and more</strong>
                  </div>
                </div>
              </div>
            )}

            <div className="tips-card">
              <p className="panel-title">Quick tips</p>
              <ul>
                <li>Use well-lit images with the panel centered in frame.</li>
                <li>Avoid heavy motion blur or overexposed highlights.</li>
                <li>Try multiple angles if the panel edge is partially visible.</li>
              </ul>
            </div>
          </aside>
        </section>
      </main>
    </div>
  );
}

export default App;