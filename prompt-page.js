// One-click copy for individual prompt pages
document.querySelectorAll('.copy-btn').forEach(function (btn) {
    btn.addEventListener('click', function () {
        var text = btn.parentNode.querySelector('.prompt-text').innerText;
        var label = btn.querySelector('.copy-label');
        navigator.clipboard.writeText(text).then(function () {
            btn.classList.add('copied');
            if (label) { label.textContent = 'Copied!'; }
            setTimeout(function () {
                btn.classList.remove('copied');
                if (label) { label.textContent = 'Copy prompt'; }
            }, 2000);
        });
    });
});
