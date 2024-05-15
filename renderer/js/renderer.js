// Renderer digunakan untuk mengambil value dari form lalu dikirim ke preload
document.getElementById("pomodoroForm").addEventListener("submit", (event) => {
  event.preventDefault();
  const workValue = document.getElementById("work").value;
  const breakValue = document.getElementById("break").value;
  window.api.sendFormSubmission({ workValue, breakValue });
});
