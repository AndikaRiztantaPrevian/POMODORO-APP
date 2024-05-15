const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");
const notifier = require("node-notifier");
const moment = require("moment");

const createWindow = () => {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, "./renderer/js/preload.js"),
      nodeIntegration: false,
      contextIsolation: true,
    },
  });

  win.loadFile(path.join(__dirname, "./renderer/index.html"));

  win.webContents.openDevTools();
};

app.whenReady().then(() => {
  createWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

ipcMain.on("form-submission", (event, data) => {
  // Membuat variable untuk menampung data dari form
  const WORK_DURATION = parseInt(data.workValue, 10);
  const BREAK_DURATION = parseInt(data.breakValue, 10);

  let isWorking = false;
  let remainingTime = 0;
  let timer;

  function formattingTime(totalMinutes) {
    const hours = Math.floor(totalMinutes / 60).toString().padStart(2, "0");
    const minutes = (totalMinutes % 60).toString().padStart(2, "0");

    return `${hours}:${minutes}`;
  }

  function startTimer(duration) {
    isWorking = !isWorking;
    remainingTime = duration;

    console.log(`Starting ${isWorking ? "work" : "break"} timer for ${formattingTime(remainingTime)} minutes.`);

    timer = setInterval(() => {
      remainingTime--;

      const formattedTime = formattingTime(remainingTime);
      console.log(`${isWorking ? "Work" : "Break"}: ${formattedTime}`);

      if (remainingTime <= 0) {
        clearInterval(timer);
        notifier.notify({
          title: isWorking ? "Break Time!" : "Work Time!",
          message: isWorking ? "Good Break!" : "Good Work!",
          icon: isWorking? path.join(__dirname, './renderer/gif/break.gif') : path.join(__dirname, './renderer/gif/work.gif'),
          sound: true,
          wait: true,
        });

        startTimer(isWorking ? BREAK_DURATION : WORK_DURATION);
      }
    }, 60000);
  }

  startTimer(WORK_DURATION);
});
