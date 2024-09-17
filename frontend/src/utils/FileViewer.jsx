import React from "react";
import { HOST, BACKEND_PORT } from "./constants.jsx";

const FileViewer = ({ filePath }) => {
  const fileUrl = `http://${HOST}:${BACKEND_PORT}/api/file/${encodeURIComponent(
    filePath.replace(/\\/g, "/")
  )}`;

  if (
    filePath.endsWith(".jpg") ||
    filePath.endsWith(".jpeg") ||
    filePath.endsWith(".png")
  ) {
    return <img src={fileUrl} alt="Uploaded file" />;
  }

  if (filePath.endsWith(".pdf")) {
    return (
      <div className="iframe-container">
        <iframe src={fileUrl} />
      </div>
    );
  }

  return <a href={fileUrl}>Download file</a>;
};

export default FileViewer;
