// 文章加载与显示
let currentArticle = null;

function getAllArticles() {
    // 兼容旧数据
    if (window.articlesList && Array.isArray(window.articlesList)) {
        return window.articlesList;
    } else if (typeof articles !== 'undefined' && Array.isArray(articles)) {
        return articles;
    } else {
        return [];
    }
}

function loadArticles(category = 'all') {
    const allArticles = getAllArticles();
    const filteredArticles = category === 'all'
        ? allArticles
        : allArticles.filter(a => a.category === category);

    const articleList = document.getElementById('articleList');
    articleList.innerHTML = '';

    filteredArticles.forEach(article => {
        const li = document.createElement('li');
        li.innerHTML = `<a class="article-link" data-id="${article.id}">${article.title}</a>`;
        articleList.appendChild(li);
    });

    // 加载第一篇文章
    if (filteredArticles.length > 0) {
        loadArticle(filteredArticles[0].id);
    }
}

function loadArticle(articleId) {
    const allArticles = getAllArticles();
    const article = allArticles.find(a => a.id === articleId);
    if (!article) return;

    currentArticle = article;
    const container = document.getElementById('articleContainer');

    const html = `
                <div class="article-header fade-in">
                    <h1 class="article-title">${article.title}</h1>
                    <div class="article-meta">
                        <span>📅 ${article.date}</span>
                        <span>✍️ ${article.author}</span>
                        <span>⏱️ 约 ${article.readTime} 分钟</span>
                    </div>
                </div>
                <div class="article-content fade-in">
                    ${article.content}
                </div>
            `;

    container.innerHTML = html;

    // 更新活跃状态
    document.querySelectorAll('.article-link').forEach(link => {
        link.classList.remove('active');
        if (parseInt(link.dataset.id) === articleId) {
            link.classList.add('active');
        }
    });

    // 重置进度条
    updateProgress();
}

// ===== 分类和文章链接事件 =====
document.addEventListener('click', function (e) {
    // 分类链接
    if (e.target.classList.contains('category-link')) {
        e.preventDefault();
        document.querySelectorAll('.category-link').forEach(link => {
            link.classList.remove('active');
        });
        e.target.classList.add('active');
        loadArticles(e.target.dataset.category);
    }

    // 文章链接
    if (e.target.classList.contains('article-link')) {
        e.preventDefault();
        loadArticle(parseInt(e.target.dataset.id));
    }
});

// 阅读进度条
let hideProgressTimer = null;
const HIDE_DELAY = 5000; // 5秒

function updateProgress() {
    const container = document.getElementById('articleContainer');
    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight;
    const scrollTop = window.scrollY;

    // 计算进度百分比
    const scrollableHeight = documentHeight - windowHeight;
    const progress = scrollableHeight > 0
        ? Math.min(Math.round((scrollTop / scrollableHeight) * 100), 100)
        : 0;

    // 更新进度条
    const progressFill = document.getElementById('progressFill');
    const circumference = 2 * Math.PI * 45; // 半径为 45
    const offset = circumference - (progress / 100) * circumference;
    progressFill.style.strokeDasharray = circumference;
    progressFill.style.strokeDashoffset = offset;

    // 更新百分比显示
    document.getElementById('progressPercentage').textContent = progress + '%';

    // 更新阅读时间
    if (currentArticle) {
        const readTime = Math.max(1, Math.round((progress / 100) * currentArticle.readTime));
        document.getElementById('readingTime').textContent = readTime + ' 分钟';
    }
}

function showProgressCircle() {
    const progressCircle = document.getElementById('progressCircle');
    progressCircle.classList.remove('hidden');
    progressCircle.classList.add('visible');

    // 清除之前的隐藏计时器
    if (hideProgressTimer) {
        clearTimeout(hideProgressTimer);
    }

    // 设置新的隐藏计时器
    hideProgressTimer = setTimeout(() => {
        progressCircle.classList.remove('visible');
        progressCircle.classList.add('hidden');
    }, HIDE_DELAY);
}

// 监听滚动事件
window.addEventListener('scroll', function () {
    updateProgress();
    showProgressCircle();
});
window.addEventListener('resize', updateProgress);

// 点击进度条滚动到顶部
document.getElementById('progressCircle').addEventListener('click', function () {
    window.scrollTo({ top: 0, behavior: 'smooth' });
});

// 初始化时显示进度条
showProgressCircle();

// 初始化
loadArticles('all');
updateProgress();
