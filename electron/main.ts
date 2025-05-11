import { app, BrowserWindow } from 'electron';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { ipcMain } from 'electron';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

process.env.APP_ROOT = path.join(__dirname, '..');

export const VITE_DEV_SERVER_URL = process.env['VITE_DEV_SERVER_URL'];
export const MAIN_DIST = path.join(process.env.APP_ROOT, 'dist-electron');
export const RENDERER_DIST = path.join(process.env.APP_ROOT, 'dist');

process.env.VITE_PUBLIC = VITE_DEV_SERVER_URL
  ? path.join(process.env.APP_ROOT, 'public')
  : RENDERER_DIST;

let win: BrowserWindow | null;

type TicketData = {
  titulo: string;
  pedido: string;
  items: { nombre: string; cantidad: number; precio: number }[];
  total: number;
  mensaje: string;
};

function buildPlainText(data: TicketData): string {
  const fecha = new Date().toLocaleString();
  const separador = '----------------------------------------\n';
  const espaciador = '                                        \n';

  const encabezado = `${data.titulo.toUpperCase().padStart((40 + data.titulo.length) / 2)}\n${fecha}\n${separador}`;
  const pedido = `Pedido #: ${data.pedido}\n\n`;

  const items = data.items
    .map(item => {
      const nombre = `${item.cantidad}x ${item.nombre}`.padEnd(30);
      const precio = `$${(item.precio * item.cantidad).toFixed(2)}`.padStart(9);
      return `${nombre}${precio}`;
    })
    .join('\n') + '\n';

  const total = `${separador}TOTAL:${' '.repeat(40)}$${data.total.toFixed(2)}\n`;
  const mensaje = `\n${separador}${data.mensaje}\n\n`;

  return encabezado + pedido + items + total + mensaje + espaciador + espaciador + espaciador + espaciador + espaciador + espaciador + espaciador + espaciador + espaciador + espaciador + espaciador + espaciador;
}

function createWindow() {
  win = new BrowserWindow({
    icon: path.join(process.env.VITE_PUBLIC, 'electron-vite.svg'),
    webPreferences: {
      preload: path.join(__dirname, 'preload.mjs'),
    },
  });

  win.webContents.on('did-finish-load', () => {
    win?.webContents.send('main-process-message', new Date().toLocaleString());
    win!.webContents.getPrintersAsync().then((printers) => {
      console.log('🖨️ Impresoras detectadas:', printers);
    });
  });

  ipcMain.handle('get-printers', async () => {
    return win ? await win.webContents.getPrintersAsync() : [];
  });

  ipcMain.handle('print-ticket', async (_event, ticketData: TicketData, printerName: string) => {
    const plainText = buildPlainText(ticketData);
    const printWin = new BrowserWindow({ show: false });

    await printWin.loadURL(`data:text/plain;charset=utf-8,${encodeURIComponent(plainText)}`);

    return new Promise((resolve, reject) => {
      printWin.webContents.print(
        {
          silent: true,
          deviceName: printerName,
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
    win.loadFile(path.join(RENDERER_DIST, 'index.html'));
  }
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
    win = null;
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
