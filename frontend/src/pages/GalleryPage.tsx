import { useState, useEffect, useCallback } from "react";
import { Item } from "../types/icon";
import getIcons from "../services/getIcons";
import { sortIcons } from "../utils/icons";
import Gallery from "../components/organisms/Gallery";

type AdminGalleryProps = {
  folder?: string;
};

const GalleryPage = ({ folder }: AdminGalleryProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [icons, setIcons] = useState<Item[]>();

  const loadGalleryItems = useCallback((withLoading = false) => {
    if (withLoading) {
      setIsLoading(true);
    }
    getIcons()
      .then((response) => {
        const isValid = response?.length;
        if (response === undefined || typeof isValid !== "number") {
          setIcons([]);
          return;
        }

        const iconsResponse = sortIcons(response);
        setIcons(iconsResponse);
      })
      .catch((error) => {
        setIcons([]);
      })
      .finally(() => {
        if (withLoading) {
          setIsLoading(false);
        }
      });
  }, []);

  useEffect(() => {
    loadGalleryItems(true);
  }, [loadGalleryItems]);

  return isLoading ? (
    <></>
  ) : (
    <Gallery icons={icons} loadGalleryItems={loadGalleryItems} />
  );
};

export default GalleryPage;
