// 主题切换
const themeToggle = document.getElementById('themeToggle');
const toggleIcon = themeToggle.querySelector('i');
const htmlElement = document.documentElement;

// 初始化主题
const savedTheme = localStorage.getItem('theme') || 'light';
if (savedTheme === 'dark') {
    document.body.classList.add('dark-mode');
    toggleIcon.className = 'fa-solid fa-sun';
}

themeToggle.addEventListener('click', function () {
    document.body.classList.toggle('dark-mode');
    const isDark = document.body.classList.contains('dark-mode');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
    toggleIcon.className = isDark ? 'fa-solid fa-sun' : 'fa-solid fa-moon';
});
