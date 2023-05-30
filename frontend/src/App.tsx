import React from "react";
import "./App.css";

import IconsCloudFrontProvider from "./context/IconsCloudFront";
import LoadingProvider from "./context/LoadingProvider";
import GalleryPage from "./pages/GalleryPage";
import SnackBarProvider from "./context/SnackBarProvider";

function App() {
  return (
    <IconsCloudFrontProvider>
      <LoadingProvider>
        <SnackBarProvider>
          <GalleryPage />
        </SnackBarProvider>
      </LoadingProvider>
    </IconsCloudFrontProvider>
  );
}

export default App;
