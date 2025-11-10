const { app, BrowserWindow, Menu } = require('electron')
const path = require('path')
const isDev = require('electron-is-dev')

let mainWindow

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    minWidth: 1200,
    minHeight: 700,
    icon: path.join(__dirname, 'build/icon.png'),
    backgroundColor: '#f8fafc',
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      enableRemoteModule: false,
      preload: path.join(__dirname, 'preload.js')
    },
    titleBarStyle: 'default',
    frame: true,
    show: false
  })

  // Load the app
  const startUrl = isDev 
    ? 'http://localhost:3000' 
    : `file://${path.join(__dirname, '../out/index.html')}`

  mainWindow.loadURL(startUrl)

  // Show window when ready
  mainWindow.once('ready-to-show', () => {
    mainWindow.show()
    
    // Open DevTools in development
    if (isDev) {
      mainWindow.webContents.openDevTools()
    }
  })

  // Arabic menu
  const template = [
    {
      label: 'Sport Zone',
      submenu: [
        {
          label: 'حول البرنامج',
          click: () => {
            const { dialog } = require('electron')
            dialog.showMessageBox(mainWindow, {
              type: 'info',
              title: 'حول Sport Zone',
              message: 'Sport Zone - المنطقة الرياضية',
              detail: 'نظام إدارة النادي الرياضي\nالإصدار: 2.0.0\n\n© 2024 Sport Zone',
              buttons: ['موافق']
            })
          }
        },
        { type: 'separator' },
        {
          label: 'إعادة التحميل',
          accelerator: 'CmdOrCtrl+R',
          click: () => {
            mainWindow.reload()
          }
        },
        { type: 'separator' },
        {
          label: 'إنهاء',
          accelerator: 'CmdOrCtrl+Q',
          click: () => {
            app.quit()
          }
        }
      ]
    },
    {
      label: 'تحرير',
      submenu: [
        { label: 'تراجع', role: 'undo' },
        { label: 'إعادة', role: 'redo' },
        { type: 'separator' },
        { label: 'قص', role: 'cut' },
        { label: 'نسخ', role: 'copy' },
        { label: 'لصق', role: 'paste' },
        { label: 'حذف', role: 'delete' },
        { type: 'separator' },
        { label: 'تحديد الكل', role: 'selectAll' }
      ]
    },
    {
      label: 'عرض',
      submenu: [
        {
          label: 'ملء الشاشة',
          role: 'togglefullscreen'
        },
        { type: 'separator' },
        {
          label: 'تكبير',
          accelerator: 'CmdOrCtrl+Plus',
          click: () => {
            const currentZoom = mainWindow.webContents.getZoomFactor()
            mainWindow.webContents.setZoomFactor(currentZoom + 0.1)
          }
        },
        {
          label: 'تصغير',
          accelerator: 'CmdOrCtrl+-',
          click: () => {
            const currentZoom = mainWindow.webContents.getZoomFactor()
            mainWindow.webContents.setZoomFactor(currentZoom - 0.1)
          }
        },
        {
          label: 'الحجم الطبيعي',
          accelerator: 'CmdOrCtrl+0',
          click: () => {
            mainWindow.webContents.setZoomFactor(1.0)
          }
        }
      ]
    },
    {
      label: 'نافذة',
      submenu: [
        { label: 'تصغير', role: 'minimize' },
        { label: 'إغلاق', role: 'close' }
      ]
    }
  ]

  const menu = Menu.buildFromTemplate(template)
  Menu.setApplicationMenu(menu)

  mainWindow.on('closed', () => {
    mainWindow = null
  })
}

app.whenReady().then(createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})

// Prevent navigation
app.on('web-contents-created', (event, contents) => {
  contents.on('will-navigate', (event, navigationUrl) => {
    const parsedUrl = new URL(navigationUrl)
    
    if (parsedUrl.origin !== 'http://localhost:3000' && !navigationUrl.startsWith('file://')) {
      event.preventDefault()
    }
  })
})
