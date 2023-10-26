let title = document.getElementById('title');
let content = document.getElementById('content');

function checkSubmit() {
    if (title.value.length > 0 || content.value.length > 0) {
        document.getElementById('submitBtn').disabled = false;
    } else {
        document.getElementById('submitBtn').disabled = true;
    }
}

title.addEventListener('input', checkSubmit);
content.addEventListener('input', checkSubmit);