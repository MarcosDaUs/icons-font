import { useCallback, useState, useRef, useEffect } from "react";
import checkIcon from "../services/checkIcon";

export type CheckIconWatcherStatus =
  | "Failed"
  | "Done"
  | "Error"
  | "Running"
  | "Pending"
  | "";

const INIT_STATE_STATUS: CheckIconWatcherStatus = "";

interface UseCheckIconWatcher {
  onSuccessful?: () => void;
  onFailed?: () => void;
  onFetchFailed?: () => void;
  onRunning?: () => void;

  timeInterval?: number;
}

const useCheckIconWatcher = (params: UseCheckIconWatcher) => {
  const {
    onFetchFailed,
    onSuccessful,
    onFailed,
    onRunning,
    timeInterval = 10000,
  } = params;

  const [watcherStatus, setWatcherStatus] =
    useState<CheckIconWatcherStatus>(INIT_STATE_STATUS);
  const [requestsCounter, setRequestsCounter] = useState<number>(0);

  const intervalWatcherRef = useRef<number | null>(null);

  const onSuccessfulRef = useRef(onSuccessful);
  const onFailedRef = useRef(onFailed);
  const onFetchFailedRef = useRef(onFetchFailed);
  const onRunningRef = useRef(onRunning);

  const resetWatcherStatus = () => {
    setWatcherStatus(INIT_STATE_STATUS);
  };

  const clearWatcherInterval = useCallback(() => {
    if (intervalWatcherRef.current) clearInterval(intervalWatcherRef.current);
    intervalWatcherRef.current = null;
  }, []);

  useEffect(() => {
    if (onSuccessful) onSuccessfulRef.current = onSuccessful;
  }, [onSuccessful]);

  useEffect(() => {
    if (onFailed) onFailedRef.current = onFailed;
  }, [onFailed]);

  useEffect(() => {
    if (onFetchFailed) onFetchFailedRef.current = onFetchFailed;
  }, [onFetchFailed]);

  useEffect(() => {
    if (onRunning) onRunningRef.current = onRunning;
  }, [onRunning]);

  const checkIconWatcher = useCallback(
    async (iconName: string): Promise<boolean> => {
      return await new Promise(async (resolve, reject) => {
        checkIcon({
          icon: iconName,
        })
          .then((response) => {
            if (!response && requestsCounter >= 12) {
              clearWatcherInterval();
              setWatcherStatus("Failed");
              if (onFailedRef.current) onFailedRef.current();
              resolve(true);
            }
            if (!response) {
              setWatcherStatus("Running");
              setRequestsCounter((prevState) => prevState + 1);
              if (onRunningRef.current) onRunningRef.current();
              resolve(false);
            }
            if (response) {
              clearWatcherInterval();
              if (onSuccessfulRef.current) onSuccessfulRef.current();
              resolve(true);
            }
          })
          .catch(() => {
            clearWatcherInterval();
            setWatcherStatus("Error");
            if (onFetchFailedRef.current) onFetchFailedRef.current();
            resolve(true);
          });
      });
    },
    [requestsCounter, clearWatcherInterval]
  );

  const onCheckIconWatcherRef = useRef(checkIconWatcher);

  useEffect(() => {
    onCheckIconWatcherRef.current = checkIconWatcher;
  }, [checkIconWatcher]);

  const initCheckIconWatcher = useCallback(
    async (iconName: string) => {
      const isDone = await checkIconWatcher(iconName);

      if (isDone) return;

      const watchAlreadyExist = intervalWatcherRef.current != null;

      if (watchAlreadyExist) return;

      intervalWatcherRef.current = window.setInterval(() => {
        onCheckIconWatcherRef.current(iconName);
      }, timeInterval);
    },
    [checkIconWatcher, timeInterval]
  );

  return {
    initCheckIconWatcher,
    watcherStatus,
    resetWatcherStatus,
    clearWatcherInterval,
  };
};

export default useCheckIconWatcher;
