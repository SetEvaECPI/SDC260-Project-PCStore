// Network Connection Test

const hostName = window.location.hostname || "Local File";
const protocolValue = window.location.protocol;
let port = window.location.port;

if (!port) {
  if (protocolValue === "https:") {
    port = "443 (default HTTPS)";
  } else if (protocolValue === "http:") {
    port = "80 (default HTTP)";
  } else {
    port = "Not Available";
  }
}

const previousLaunch = localStorage.getItem("evansPcLastLaunch");
const currentLaunch = new Date().toLocaleString();

document.getElementById("hostName").textContent = hostName;
document.getElementById("port").textContent = port;
document.getElementById("protocol").textContent = protocolValue.replace(":", "").toUpperCase() || "FILE";
document.getElementById("lastLaunch").textContent = previousLaunch || "First Launch";

const status = document.getElementById("network-status");
if (protocolValue === "http:" || protocolValue === "https:") {
  status.textContent = "Network recognized: the website is running through a web server.";
  status.className = "network-status success";
} else {
  status.textContent = "Local file detected. Use Live Preview to verify the local network connection.";
}

localStorage.setItem("evansPcLastLaunch", currentLaunch);
