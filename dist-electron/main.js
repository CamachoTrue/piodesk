import { app, BrowserWindow, ipcMain } from "electron";
import { fileURLToPath } from "node:url";
import path from "node:path";
const __dirname = path.dirname(fileURLToPath(import.meta.url));
process.env.APP_ROOT = path.join(__dirname, "..");
const VITE_DEV_SERVER_URL = process.env["VITE_DEV_SERVER_URL"];
const MAIN_DIST = path.join(process.env.APP_ROOT, "dist-electron");
const RENDERER_DIST = path.join(process.env.APP_ROOT, "dist");
process.env.VITE_PUBLIC = VITE_DEV_SERVER_URL ? path.join(process.env.APP_ROOT, "public") : RENDERER_DIST;
let win;
function buildPlainText(data) {
  const fecha = (/* @__PURE__ */ new Date()).toLocaleString();
  const separador = "----------------------------------------\n";
  const espaciador = "                                        \n";
  const encabezado = `${data.titulo.toUpperCase().padStart((40 + data.titulo.length) / 2)}
${fecha}
${separador}`;
  const pedido = `Pedido #: ${data.pedido}

`;
  const items = data.items.map((item) => {
    const nombre = `${item.cantidad}x ${item.nombre}`.padEnd(30);
    const precio = `$${(item.precio * item.cantidad).toFixed(2)}`.padStart(9);
    return `${nombre}${precio}`;
  }).join("\n") + "\n";
  const total = `${separador}TOTAL:${" ".repeat(40)}$${data.total.toFixed(2)}
`;
  const mensaje = `
${separador}${data.mensaje}

`;
  return encabezado + pedido + items + total + mensaje + espaciador + espaciador + espaciador + espaciador + espaciador + espaciador + espaciador + espaciador + espaciador + espaciador + espaciador + espaciador;
}
function createWindow() {
  win = new BrowserWindow({
    icon: path.join(process.env.VITE_PUBLIC, "electron-vite.svg"),
    webPreferences: {
      preload: path.join(__dirname, "preload.mjs")
    }
  });
  win.webContents.on("did-finish-load", () => {
    win == null ? void 0 : win.webContents.send("main-process-message", (/* @__PURE__ */ new Date()).toLocaleString());
    win.webContents.getPrintersAsync().then((printers) => {
      console.log("🖨️ Impresoras detectadas:", printers);
    });
  });
  ipcMain.handle("get-printers", async () => {
    return win ? await win.webContents.getPrintersAsync() : [];
  });
  ipcMain.handle("print-ticket", async (_event, ticketData, printerName) => {
    const plainText = buildPlainText(ticketData);
    const printWin = new BrowserWindow({ show: false });
    await printWin.loadURL(`data:text/plain;charset=utf-8,${encodeURIComponent(plainText)}`);
    return new Promise((resolve, reject) => {
      printWin.webContents.print(
        {
          silent: true,
          deviceName: printerName
        },
        (success, failureReason) => {
          printWin.close();
          if (success) resolve(true);
          else reject(new Error(failureReason));
        }
      );
    });
  });
  if (VITE_DEV_SERVER_URL) {
    win.loadURL(VITE_DEV_SERVER_URL);
  } else {
    win.loadFile(path.join(RENDERER_DIST, "index.html"));
  }
}
app.whenReady().then(createWindow);
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
    win = null;
  }
});
app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
export {
  MAIN_DIST,
  RENDERER_DIST,
  VITE_DEV_SERVER_URL
};
