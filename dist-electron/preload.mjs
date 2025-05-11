"use strict";
const electron = require("electron");
electron.contextBridge.exposeInMainWorld("printer", {
  printTicket: (ticketData, printerName) => electron.ipcRenderer.invoke("print-ticket", ticketData, printerName),
  getPrinters: () => electron.ipcRenderer.invoke("get-printers")
});
