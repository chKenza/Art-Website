function showDescription(text) { document.getElementById('modal-content-text').innerText = text; document.getElementById('modal').style.display = 'block'; }
function closeModal() { document.getElementById('modal').style.display = 'none'; }
window.onclick = function(event) { if (event.target == document.getElementById('modal')) { document.getElementById('modal').style.display = 'none'; } }
