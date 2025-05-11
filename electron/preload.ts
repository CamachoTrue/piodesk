import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('printer', {
  printTicket: (ticketData: any, printerName: string) =>
    ipcRenderer.invoke('print-ticket', ticketData, printerName),

  getPrinters: () => ipcRenderer.invoke('get-printers'),
});
