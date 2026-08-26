$(function () {
    var img = "Mercedes-Benz-Logo2.png", // 這裡可以直接替換成大圖檔
        locate = 0.85,
        right = 120,
        opacity = 0.35,
        speed = 800,
        $button = $("#goTopButton");

    // 1. 在建立元素時，直接把 width, height, position 鎖死
    if ($button.length === 0) {
        $("body").append("<img id='goTopButton' style='display:none; position:fixed; z-index:9999; cursor:pointer; width:100px; height:auto;' title='回到頂端' />");
        $button = $("#goTopButton");
    }

    $button.attr("src", img);

    function goTopMove() {
        var scrollH = $(document).scrollTop(),
            winH = $(window).height();

        if (scrollH > 20) {
            // 2. 只動 top, right, opacity，絕不覆蓋 width
            $button.css({
                "top": (winH * locate) + "px",
                "right": right + "px",
                "opacity": opacity
            });
            $button.stop(true, true).fadeIn("slow");
        } else {
            $button.stop(true, true).fadeOut("slow", function () {
                $(this).css({
                    "transform": "none",
                    "transition": "none"
                });
            });
        }
    }

    $(window).on({
        scroll: function () { goTopMove(); },
        resize: function () { goTopMove(); }
    });

    $button.on({
        mouseover: function () { $(this).css("opacity", 1); },
        mouseout: function () { $(this).css("opacity", opacity); },
        click: function () {
            var winH = $(window).height();

            // 1. 動態計算高度：讓 transform 向上移動「整個螢幕高度 + 按鈕預留空間」
            $(this).css({
                "transform": "translateY(-" + (winH + 200) + "px) scale(0.1)",
                "opacity": "0.1",
                "transition": "transform 0.8s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.8s ease-in"
            });

            // 2. 讓頁面滾動時間（800ms）與 CSS 動畫時間（0.8s）完全一致
            $("html, body").animate({ scrollTop: 0 }, speed);
        }
    });
});