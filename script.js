function showPage(pageId) {
    document.getElementById('config').style.display = 'none';
    document.getElementById('runs').style.display = 'none';
    document.getElementById(pageId).style.display = 'block';
}

function saveConfig() {
    const config = {
        target: document.getElementById('target').value,
        mode: document.getElementById('mode').value,
        threads: document.getElementById('threads').value,
        timeout: document.getElementById('timeout').value,
        notes: document.getElementById('notes').value
    };
    localStorage.setItem('botConfig', JSON.stringify(config));
    alert("Configuration saved!");
}

function loadConfig() {
    const saved = localStorage.getItem('botConfig');
    if (saved) {
        const config = JSON.parse(saved);
        document.getElementById('target').value = config.target;
        document.getElementById('mode').value = config.mode;
        document.getElementById('threads').value = config.threads;
        document.getElementById('timeout').value = config.timeout;
        document.getElementById('notes').value = config.notes;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    loadConfig();
    document.querySelectorAll('.col-toggle').forEach(cb => {
        cb.addEventListener('change', function() {
            const colName = this.value;
            const table = document.getElementById('runsTable');
            const colIndex = Array.from(table.rows[0].cells).findIndex(th => th.textContent === colName);
            for (let row of table.rows) {
            row.cells[colIndex].style.display = this.checked ? '' : 'none';
            }
        });
    });
});