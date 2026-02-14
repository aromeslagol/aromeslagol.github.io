// 页脚功能脚本
$(document).ready(function() {
    // 回到顶部功能
    $('#backToTop').on('click', function(e) {
        e.preventDefault();
        $('html, body').animate({
            scrollTop: 0
        }, 500);
        return false;
    });

    // 页脚主题切换按钮
    $('#themeToggleFooter').on('click', function(e) {
        e.preventDefault();
        // 触发主主题切换按钮的点击事件
        $('#themeToggle').click();
        return false;
    });

    // 显示/隐藏阅读进度圆圈
    $('#toggleProgress').on('click', function(e) {
        e.preventDefault();
        const progressCircle = $('#progressCircle');
        if (progressCircle.hasClass('hidden')) {
            progressCircle.removeClass('hidden').addClass('visible');
            $(this).html('<i>📊</i> 隐藏进度');
        } else {
            progressCircle.removeClass('visible').addClass('hidden');
            $(this).html('<i>📊</i> 显示进度');
        }
        return false;
    });

    // 搜索框聚焦
    $('a[href="#searchInput"]').on('click', function(e) {
        e.preventDefault();
        $('#searchInput').focus();
        return false;
    });

    // 平滑滚动到锚点
    $('.footer-links a[href^="#"]').on('click', function(e) {
        const href = $(this).attr('href');
        // 如果不是搜索框或特殊功能链接
        if (href !== '#searchInput' && href !== '#themeToggleFooter' && 
            href !== '#backToTop' && href !== '#toggleProgress') {
            e.preventDefault();
            const target = $(href);
            if (target.length) {
                $('html, body').animate({
                    scrollTop: target.offset().top - 100
                }, 500);
            }
        }
    });

    // 更新页脚主题切换按钮文本
    function updateFooterThemeButton() {
        const isDarkMode = $('body').hasClass('dark-mode');
        $('#themeToggleFooter').html(isDarkMode ? '<i>☀️</i> 切换主题' : '<i>🌙</i> 切换主题');
    }

    // 监听主题变化
    $(document).on('themeChanged', function() {
        updateFooterThemeButton();
    });

    // 初始化按钮文本
    updateFooterThemeButton();

    // 滚动时显示/隐藏回到顶部按钮
    $(window).scroll(function() {
        if ($(this).scrollTop() > 300) {
            $('#backToTop').css('opacity', '1').css('pointer-events', 'auto');
        } else {
            $('#backToTop').css('opacity', '0.7').css('pointer-events', 'none');
        }
    });

    // 初始化回到顶部按钮状态
    $(window).trigger('scroll');
});
