// fake runs
const runs = [
    {runId: "123",requestID: "456", processName: "Test1", machine: "111", status: "Completed", queued: "2025-08-27 09:00", started: "2025-08-27 09:02", completed: "2025-08-27 09:12", duration: 10, notes: "Testing new exploit", consoleOutput: "Exploited 5 files", score: 50},
    {runId: "789", requestID: "000", processName: "Test2", machine: "222", status: "Failed", queued: "2025-08-27 10:00", started: "2025-08-27 10:05", completed: "2025-08-27 10:12", duration: 7, notes: "Trying to see all files", consoleOutput: "Timeout", score: -10}
];

const fields = ["requestID", "processName", "machine", "status", "queued", "started", "notes", "completed", "duration", "consoleOutput", "score"];

const runsList = document.getElementById("runsList");
const checkboxContainer = document.querySelector(".checkbox-container");
const searchBar = document.getElementById("searchBar");
const sort1 = document.getElementById("sort1");
const sort2 = document.getElementById("sort1");
let ascending = true;

function showPage(pageId) {
    document.getElementById('runs').style.display = 'none';
    document.getElementById('config').style.display = 'none';
    document.getElementById(pageId).style.display = 'block';
}

function saveConfig() {
    const config = {
        target: document.getElementById('notes').value,
        mode: document.getElementById('mode').value,
        threads: document.getElementById('threads').value,
        timeout: document.getElementById('timeout').value,
        notes: document.getElementById('notes').value
    };
    localStorage.setItem('botConfig', JSON.stringify(config));
}

function loadConfig() {
    const saved = localStorage.getItem('botConfig');
    if (saved) {
        const config = JSON.parse(saved);
        document.getElementById('notes').value = config.target;
        document.getElementById('mode').value = config.mode;
        document.getElementById('threads').value = config.threads;
        document.getElementById('timeout').value = config.timeout;
        document.getElementById('notes').value = config.notes;
    }
}

document.addEventListener("DOMContentLoaded", () => {
    const checkboxes = document.querySelectorAll(".col-toggle");
    
    function renderRuns() {
        runsList.innerHTML = "";
        const filter = searchBar.value.toLowerCase();

        const sortedRuns = [...runs].sort((a, b) => {
            const key = sort1.value;
            if (key === "score") {
                if (a.score < b.score) {
                    if (ascending) return -1; else return 1;
                }
                if (a.score > b.score) {
                    if (ascending) return 1; else return -1;
                }
            } else if (key === "status") {
                const statusA = a.status.toLowerCase();
                const statusB = b.status.toLowerCase();
                if (statusA < statusB) {
                    if (ascending) return -1; else return 1;
                }
                if (statusA > statusB) {
                    if (ascending) return 1; else return -1;
                }
            }
            return 0;
        });

        const filteredRuns = sortedRuns.filter(run =>
            Object.values(run).some(val => String(val).toLowerCase().includes(filter))
        );

        filteredRuns.forEach(run => {
            const li = document.createElement("li");
            li.className = "run-item";

            const summary = document.createElement("div");
            summary.className = "run-summary";
            summary.textContent = `${run.runId} | ${run.started}`;
            li.appendChild(summary);

            const details = document.createElement("div");
            details.className = "run-details";

            const table = document.createElement("table");
            checkboxes.forEach(cb => {
                if (!cb.checked) return;
                const field = cb.value;
                const row = document.createElement("tr");
                const keyCell = document.createElement("td");
                keyCell.textContent = field;
                const valCell = document.createElement("td");
                const keyName = field.replace(/\s+/g, '').toLowerCase();
                const value = run[keyName] ?? run[field] ?? '';
                valCell.textContent = value;
                row.appendChild(keyCell);
                row.appendChild(valCell);
                table.appendChild(row);
            });

            details.appendChild(table);
            li.appendChild(details);

            li.addEventListener("click", () => {
                if (details.style.display === "none" || details.style.display === "") {
                    details.style.display = "block";
                } else {
                    details.style.display = "none";
                }
            });

            runsList.appendChild(li);
        });
    }

    checkboxes.forEach(cb => cb.addEventListener("change", renderRuns));
    searchBar.addEventListener("input", renderRuns);
    sort1.addEventListener("change", renderRuns);
    sort2.addEventListener("click", () => {
        ascending = !ascending;
        if (ascending) {
            sort2.textContent = "⬆";
        } else {
            sort2.textContent = "⬇";
        }
        renderRuns();
    });

    renderRuns();
});