import { useEffect, useMemo, useRef, useState, useContext } from "react";
import PulseLoader from "react-spinners/PulseLoader";
import { Item } from "../../../types/icon";
import { convertIconNameToClassName, isIconName } from "../../../utils/icons";
import { IconsCloudFrontContext } from "../../../context/IconsCloudFront";

import styles from "./CloudFrontIcon.module.css";

interface CloudFrontIconProps {
  item?: Item;
  name?: string;
  className?: string;
}

const CloudFrontIcon = ({ item, name, className }: CloudFrontIconProps) => {
  const { setLoadingIcon, clearLoadingIcon } = useContext(
    IconsCloudFrontContext
  );

  const [isLoading, setIsLoading] = useState<boolean>(true);

  const iconRef = useRef<HTMLElement>(null);

  const iconClassName = useMemo(
    () =>
      (() => {
        if (name) {
          return isIconName(name) ? convertIconNameToClassName(name) : "";
        }
        if (item?.isFolder === false) {
          return isIconName(item?.name)
            ? convertIconNameToClassName(item?.name)
            : "";
        }
        return "";
      })(),
    [name, item]
  );
  useEffect(() => {
    if (
      (!iconRef?.current?.offsetWidth || !iconRef?.current?.offsetHeight) &&
      !!iconClassName
    ) {
      const timer = setTimeout(() => {
        if (
          (!iconRef?.current?.offsetWidth || !iconRef?.current?.offsetHeight) &&
          !!iconClassName
        ) {
          setIsLoading(true);
          setLoadingIcon(iconClassName);
        } else {
          setIsLoading(false);
          clearLoadingIcon(iconClassName);
        }
      }, 3000);
      return () => {
        clearTimeout(timer);
        clearLoadingIcon(iconClassName);
      };
    } else {
      setIsLoading(false);
      clearLoadingIcon(iconClassName);
      return () => clearLoadingIcon(iconClassName);
    }
  }, [
    iconClassName,
    iconRef?.current?.offsetWidth,
    iconRef?.current?.offsetHeight,
    setLoadingIcon,
    clearLoadingIcon,
  ]);

  return (
    <>
      {isLoading && <PulseLoader color={"red"} loading={true} size={10} />}
      <i
        key={iconClassName}
        ref={iconRef}
        className={`icon ${iconClassName} ${className} ${
          isLoading ? styles.iconCard__name : ""
        }`}
      />
    </>
  );
};

export default CloudFrontIcon;
