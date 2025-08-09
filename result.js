const iq = Number(localStorage.getItem("iqScore"));
let iqLevel = "normal";
if (iq < 70) iqLevel = "low";
else if (iq > 90) iqLevel = "high";
console.log("iqLevel", iqLevel);

const hairCountRanges = {
  low: [90 * 1000, 150 * 1000],
  normal: [70 * 1000, 90 * 1000],
  high: [30 * 1000, 50 * 1000],
};

function getHairCount(level) {
    console.log(`Calculating hair count for IQ level: ${level}`);
  const [min, max] = hairCountRanges[level];
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

const hairCount = getHairCount(iqLevel);

console.log(hairCount);
const adviceMessages = {
  low: "Full head of hair, full head of confidence!",
  normal: "Your hair count is just right — strong and healthy.",
  high: "Consult doctor soon-it may leads to baldness.best head deserves best care",
};

document.getElementById(
  "result"
).textContent = `Hair Count: ${hairCount.toLocaleString()}`;
document.getElementById("advice").textContent = adviceMessages[iqLevel];
console.log(iqLevel);
console.log(iq);
const barFill = document.getElementById("hairBar");
const [min, max] = hairCountRanges[iqLevel];
console.log(`Hair Count Range for ${iqLevel}: ${min} - ${max}`);
const percent = 100 - iq;
setTimeout(() => {
  barFill.style.width = percent + "%";
}, 100);

document.getElementById("restartBtn").addEventListener("click", () => {
  localStorage.removeItem("iqScore");
  window.location.href = "first.html";
});
