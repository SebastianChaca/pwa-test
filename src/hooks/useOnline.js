import { useState } from "react";
import { Detector } from "react-detect-offline";
export const useOnline = () => {
  const [isOnline, setOnline] = useState();

  // useEffect(() => {
  //   const goOnline = (event) => {
  //     setOnline(true);
  //   };
  //   const goOffline = (event) => {
  //     setOnline(false);
  //   };

  //   window.addEventListener("offline", goOffline);
  //   window.addEventListener("online", goOnline);

  //   return () => {
  //     window.removeEventListener("offline", goOffline);
  //     window.removeEventListener("online", goOnline);
  //   };
  // }, [setOnline]);

  const Status = () => {
    return (
      <Detector
        render={({ online }) => {
          setOnline(online);

          return (
            <div style={{ display: "flex", alignItems: "center" }}>
              <h3> Status:</h3>
              <h3 style={{ color: online ? "green" : "red" }}>
                {online ? "Online" : "Offline"}
              </h3>
            </div>
          );
        }}
      />
    );
  };

  return { isOnline, Status };
};
