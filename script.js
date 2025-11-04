const fileInput = document.getElementById("fileInput");
const fileContent = document.getElementById("fileContent");
const countValid = document.getElementById("countValid");
const cutBtn = document.getElementById("cutBtn");
const cutCountInput = document.getElementById("cutCount");
const resultSection = document.getElementById("resultSection");
const downloadCut = document.getElementById("downloadCut");
const downloadRemain = document.getElementById("downloadRemain");
const cutFileName = document.getElementById("cutFileName");
const remainFileName = document.getElementById("remainFileName");

let allLines = [];
let validNumbers = [];
let cutResult = [];
let remainResult = [];

function updateValidCount() {
  allLines = fileContent.value.split(/\r?\n/);
  validNumbers = allLines.filter(line => /^\d{10,}$/.test(line.trim()));
  countValid.textContent = validNumbers.length;
}

fileInput.addEventListener("change", (e) => {
  const file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = (event) => {
    fileContent.value = event.target.result;
    updateValidCount();
  };
  reader.readAsText(file);
});

fileContent.addEventListener("input", updateValidCount);

cutBtn.addEventListener("click", () => {
  updateValidCount();

  const cutCount = parseInt(cutCountInput.value);
  if (isNaN(cutCount) || cutCount <= 0) {
    alert("Masukkan jumlah potong yang benar!");
    return;
  }

  if (cutCount > validNumbers.length) {
    alert("Jumlah potong melebihi jumlah nomor valid!");
    return;
  }

  const direction = document.querySelector('input[name="direction"]:checked').value;

  if (direction === "top") {
    cutResult = validNumbers.slice(0, cutCount);
    remainResult = validNumbers.slice(cutCount);
  } else {
    cutResult = validNumbers.slice(-cutCount);
    remainResult = validNumbers.slice(0, validNumbers.length - cutCount);
  }

  // Update placeholder sesuai jumlah hasil
  cutFileName.placeholder = `Default: ${cutResult.length}.txt`;
  remainFileName.placeholder = `Default: ${remainResult.length}.txt`;

  resultSection.classList.remove("hidden");
});

function downloadFile(content, name) {
  const blob = new Blob([content.join("\n")], { type: "text/plain" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = name;
  link.click();
}

downloadCut.addEventListener("click", () => {
  const name = cutFileName.value.trim() || `${cutResult.length}.txt`;
  downloadFile(cutResult, name);
});

downloadRemain.addEventListener("click", () => {
  const name = remainFileName.value.trim() || `${remainResult.length}.txt`;
  downloadFile(remainResult, name);
});
