const themeToggle = document.getElementById('theme-toggle');
const body = document.body;

function setTheme(theme) {
    if (theme === 'dark') {
        body.classList.add('dark');
        localStorage.setItem('theme', 'dark');
    } else {
        body.classList.remove('dark');
        localStorage.setItem('theme', 'light');
    }
}

themeToggle.addEventListener('click', () => {
    setTheme(body.classList.contains('dark') ? 'light' : 'dark');
});

// 初始根据本地存储设置主题
const savedTheme = localStorage.getItem('theme');
if (savedTheme === 'dark') setTheme('dark');
