// 搜索功能
let currentSearchTerm = '';
let highlightedElements = [];

function clearHighlights() {
    highlightedElements.forEach(el => {
        const parent = el.parentNode;
        while (el.firstChild) {
            parent.insertBefore(el.firstChild, el);
        }
        parent.removeChild(el);
    });
    highlightedElements = [];
}

function highlightText(text) {
    if (!text.trim()) {
        clearHighlights();
        currentSearchTerm = '';
        document.getElementById('searchCount').textContent = '';
        document.getElementById('clearSearchBtn').classList.add('hidden');
        return;
    }

    clearHighlights();
    currentSearchTerm = text;

    const contentElement = document.getElementById('articleContainer');
    if (!contentElement) return;

    const regex = new RegExp(`(${text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
    let count = 0;

    function highlightNode(node) {
        if (node.nodeType === Node.TEXT_NODE) {
            const matches = node.textContent.match(regex);
            if (matches) {
                const span = document.createElement('span');
                const parts = node.textContent.split(regex);

                parts.forEach((part, index) => {
                    if (index % 2 === 1) {
                        const highlight = document.createElement('span');
                        highlight.className = 'highlight';
                        highlight.textContent = part;
                        span.appendChild(highlight);
                        highlightedElements.push(highlight);
                        count++;
                    } else if (part) {
                        span.appendChild(document.createTextNode(part));
                    }
                });

                node.parentNode.replaceChild(span, node);
            }
        } else if (node.nodeType === Node.ELEMENT_NODE && !['SCRIPT', 'STYLE'].includes(node.tagName)) {
            const children = Array.from(node.childNodes);
            children.forEach(child => highlightNode(child));
        }
    }

    highlightNode(contentElement);
    document.getElementById('searchCount').textContent = count > 0 ? `找到 ${count} 处` : '未找到';
    document.getElementById('clearSearchBtn').classList.toggle('hidden', count === 0);
}

document.getElementById('searchBtn').addEventListener('click', function () {
    const searchTerm = document.getElementById('searchInput').value;
    highlightText(searchTerm);
});

document.getElementById('searchInput').addEventListener('keyup', function (e) {
    if (e.key === 'Enter') {
        highlightText(this.value);
    }
});

document.getElementById('clearSearchBtn').addEventListener('click', function () {
    document.getElementById('searchInput').value = '';
    highlightText('');
});
