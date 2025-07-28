function showDescription(text, imageSrc) {
    document.getElementById('modal-description').innerText = text;
    document.getElementById('modal-image').src = imageSrc;
    document.getElementById('modal').style.display = 'block';
}

function closeModal() { document.getElementById('modal').style.display = 'none'; }
window.onclick = function(event) { if (event.target == document.getElementById('modal')) { document.getElementById('modal').style.display = 'none'; } }
function showDescription(title, technique, description, imagePath) {
    document.getElementById("modal").style.display = "block";
    document.getElementById("modal-image").src = imagePath;

    const modalDesc = document.getElementById("modal-description");
    modalDesc.innerHTML = `
        <p><strong>${title}</strong></p>
        <p><em>${technique}</em></p>
        <p>${description}</p>
    `;
}

function closeModal() {
    document.getElementById("modal").style.display = "none";
}
