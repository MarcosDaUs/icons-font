import React, { useState, useCallback, useRef, useEffect } from "react";

interface ILoadingIcons {
  name: string;
  date: number;
}

interface IIconsCloudFrontContext {
  version: number;
  changeVersion: () => void;
  setLoadingIcon: (name: string) => void;
  clearLoadingIcon: (name: string) => void;
}

export const IconsCloudFrontContext =
  React.createContext<IIconsCloudFrontContext>({
    version: 0,
    changeVersion: () => {},
    setLoadingIcon: (name: string) => {},
    clearLoadingIcon: (name: string) => {},
  });

interface IconsCloudFrontProviderProps {
  children?: React.ReactNode;
}

const IconsCloudFrontProvider = (props: IconsCloudFrontProviderProps) => {
  const { children } = props;
  const [version, setVersion] = useState<number>(0);
  const [loadingIcons, setLoadingIcons] = useState<ILoadingIcons[]>([]);

  const timeoutIDRef = useRef<number | null>(null);
  const loadingIconsRef = useRef(loadingIcons);

  const changeVersion = useCallback(() => {
    setVersion((prevState) => prevState + 1);
  }, []);

  const initCheckVersionWatcher = useCallback(async () => {
    if (!loadingIconsRef?.current?.length) {
      timeoutIDRef.current = null;
      return;
    }
    changeVersion();

    const currentDate = new Date().getTime();
    const newLoadingIcons = loadingIconsRef.current.filter(
      (loadingIcon) => loadingIcon.date > currentDate
    );

    setLoadingIcons([...newLoadingIcons]);
    if (!newLoadingIcons.length) {
      timeoutIDRef.current = null;
      return;
    }

    const timeInterval = 10000;
    timeoutIDRef.current = window.setTimeout(() => {
      initCheckVersionWatcher();
    }, timeInterval);
  }, [changeVersion]);

  const setLoadingIcon = useCallback((name: string) => {
    if (!name) return;
    const extraMinutes = 2 * 60 * 1000;
    setLoadingIcons((prevState) => {
      const newState = prevState.filter(
        (loadingIcon) => loadingIcon.name !== name
      );
      return [
        ...newState,
        {
          name: name,
          date: new Date().getTime() + extraMinutes,
        },
      ];
    });
  }, []);

  const clearLoadingIcon = useCallback((name: string) => {
    if (!name) return;
    setLoadingIcons((prevState) => {
      const newState = prevState.filter(
        (loadingIcon) => loadingIcon.name !== name
      );
      return [...newState];
    });
  }, []);

  useEffect(() => {
    loadingIconsRef.current = loadingIcons;
    const watchAlreadyExist = timeoutIDRef.current != null;
    if (!watchAlreadyExist) initCheckVersionWatcher();
  }, [loadingIcons, initCheckVersionWatcher]);

  useEffect(() => {
    const urlCloudFrontStyle =
      String(process.env.REACT_APP_ICONS_CLOUDFRONT) ?? "";
    const link = document.createElement("link");
    link.href = urlCloudFrontStyle;
    link.rel = "stylesheet";

    document.head.appendChild(link);

    return () => {
      document.head.removeChild(link);
    };
  }, []);

  return (
    <IconsCloudFrontContext.Provider
      value={{ changeVersion, version, setLoadingIcon, clearLoadingIcon }}
    >
      {children}
    </IconsCloudFrontContext.Provider>
  );
};

export default IconsCloudFrontProvider;
