import React from "react";
import ScanbotSDK from "scanbot-web-sdk/webpack";
import "./App.css";
import { useState, useEffect, useRef, useCallback } from "react";
import BeepNotification from "./sounds/beep.mp3";
import Snackbar from "@mui/material/Snackbar";

import { useOnline } from "./hooks/useOnline";
export const App = (props) => {
  const [barcodesState, setBarcodes] = useState([]);
  const [text, setText] = useState("");
  const [lastBarcode, setLastBarcode] = useState(null);
  const [sdk, setSdk] = useState(null);
  const [barcodeScanner, setBarcodeScanner] = useState(null);
  const [result, setresult] = useState(null);
  const [open, setOpen] = useState(false);
  const audioPlayer = useRef(null);
  const [requeststatus, setRequestStatus] = useState(null);
  const { isOnline, Status } = useOnline();
  const playAudio = () => {
    audioPlayer.current.play();
  };
  const onBarcodesDetected = async (result) => {
    setBarcodes((oldArray) => [...oldArray, result]);
    setLastBarcode(result);
    playAudio();
  };
  useEffect(() => {
    const getSDK = async () => {
      setSdk(
        await ScanbotSDK.initialize({
          licenseKey: "",
          engine: "/",
        })
      );
    };
    getSDK();
    // return () => {
    //   barcodeScanner.disposebBarcodeScanner();
    // };
  }, []);

  const create = useCallback(async () => {
    const config = {
      onBarcodesDetected: onBarcodesDetected,
      containerId: "barcode-scanner-view",
      style: {
        window: {
          aspectRatio: 2,
        },
      },
      barcodeFormat: [
        "AZTEC",
        "CODABAR",
        "CODE_39",
        "CODE_93",
        "CODE_128",
        "DATA_MATRIX",
        "EAN_8",
        "EAN_13",
        "ITF",
        "MAXICODE",
        "PDF_417",
        "QR_CODE",
        "RSS_14",
        "RSS_EXPANDED",
        "UPC_A",
        "UPC_E",
        "UPC_EAN_EXTENSION",
        "MSI_PLESSEY",
      ],
    };
    setBarcodeScanner(await sdk.createBarcodeScanner(config));
  }, [sdk]);

  useEffect(() => {
    if (sdk) {
      create();
    }
  }, [sdk, create]);
  useEffect(() => {
    if (!lastBarcode) {
      setText("");
    } else {
      const barcodes = lastBarcode.barcodes;
      setText(barcodes.map((barcodes) => barcodes.text));
    }
  }, [lastBarcode]);

  useEffect(() => {
    if (text) {
      const fakePost = async () => {
        setRequestStatus("Cargando");
        try {
          const response = await fetch(
            "https://jsonplaceholder.typicode.com/posts",
            {
              method: "POST",
              body: JSON.stringify({
                title: text,
              }),
              headers: {
                "Content-type": "application/json; charset=UTF-8",
              },
            }
          );

          const data = await response.json();
          setOpen(true);
          setresult(data.title[0]);
          setRequestStatus("Exitosa");
        } catch (error) {
          setRequestStatus(isOnline ? "Error" : "Pendiente");
        }
      };

      fakePost();
    }
  }, [text]);

  useEffect(() => {
    navigator.serviceWorker.addEventListener("message", (payload) => {
      setRequestStatus("Exitosa");
      console.log(payload);
      //payload.data.url tengo la url de la request, podria hacer un get para obtener la respuesta
    });
  }, []);
  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div style={{ padding: "10px" }}>
      <Snackbar
        open={open}
        autoHideDuration={2000}
        onClose={handleClose}
        message="Escandeado"
        // action={action}
      />
      <div
        id="barcode-scanner-view"
        style={{ height: "50vh", width: "100%" }}
      ></div>
      <audio ref={audioPlayer} src={BeepNotification} />
      <Status />
      <h4>Resultados:</h4>
      <div style={{ display: "flex", alignItems: "center" }}>
        <h4>Nombre : {result}</h4>
      </div>

      <h4>Estdo de la peticion: {requeststatus}</h4>
    </div>
  );
};
