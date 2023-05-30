import { useState, useCallback, useRef } from "react";

interface UseFilterBoxParams {
  initValue?: string;
  checkErrorValue?: (value: string) => boolean;
  onExternalFilterChanged?: () => void;
}

const useFilterBox = ({
  initValue = "",
  onExternalFilterChanged,
  checkErrorValue,
}: UseFilterBoxParams) => {
  const value = useRef<string>(initValue);
  const [inputValue, setInputValue] = useState<string>(initValue);
  const [error, setError] = useState<boolean>(false);

  const handleChangeValue = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const eventValue = event.target.value;
      const error = checkErrorValue ? checkErrorValue(eventValue) : false;
      setError(error);
      setInputValue(eventValue);
      value.current = error ? "" : eventValue;
      if (onExternalFilterChanged) onExternalFilterChanged();
    },
    [onExternalFilterChanged, checkErrorValue]
  );

  const handleClearValue = useCallback(() => {
    setInputValue(initValue);
    value.current = initValue;
    setError(false);
    if (onExternalFilterChanged) onExternalFilterChanged();
  }, [initValue, onExternalFilterChanged]);

  return {
    value,
    inputValue,
    error,
    handleChangeValue,
    handleClearValue,
  };
};

export default useFilterBox;
