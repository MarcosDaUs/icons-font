import React, { useCallback, useState } from "react";

type LoadingContextResponse = {
  isLoading: boolean;
  setLoadingState: (isLoading: boolean) => void;
};

export const LoadingContext = React.createContext<LoadingContextResponse>({
  isLoading: false,
  setLoadingState: () => {},
});

const LoadingProvider = (props: { children: React.ReactNode }) => {
  const { children } = props;
  const [isLoading, setIsLoading] = useState(false);

  const setLoadingState = useCallback((isLoading: boolean) => {
    setIsLoading(isLoading);
  }, []);

  return (
    <LoadingContext.Provider value={{ setLoadingState, isLoading }}>
      {children}
    </LoadingContext.Provider>
  );
};

export default LoadingProvider;
