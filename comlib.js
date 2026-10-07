// 可自訂範圍 min 到 max 之間的亂數產生函數
        // min 亂數最小範圍，max 亂數最大範圍
        function rand(min, max) {
            // Math.random()，JS產生0-1之間的隨機亂數，包含0不包含1之間的值
            // Math.floor() 函式會回傳無條件捨去的整數，如12.3則回傳12。
            // Math.ceil() 函式會回傳無條件進位整數，如1.03則回傳2。

            // 將傳入的最小值 min 進行無條件進位取整，確保起始範圍為整數
            min = Math.ceil(min);

            // 將傳入的最大值 max 進行無條件捨去取整，確保結束範圍為整數
            max = Math.floor(max);

            // 透過公式 (max - min + 1) 計算可能的整數個數，乘上 [0, 1) 的隨機小數後加上 min，
            // 最後用 Math.floor 取整，回傳介於 min 到 max（包含兩端點）的隨機整數
            return Math.floor(Math.random() * (max - min + 1) + min); // 回傳min到max之間的亂數

            /*
              例rand(5,10);程式執行情形
              return 最小返回5，Math.floor(0*(10-5+1)+5)
              return 最大返回10，Math.floor(0.9*(10-5+1)+5)
            */
        }

        // 定義數字格式化工具函式：將 0 到 9 的個位數前置補零轉為字串
        function addZero(x) {
            // 檢查傳入的數字是否小於 10
            if (x < 10) {
                // 將字元 '0' 與原始數值拼接後回傳
                return '0' + x;
            // 傳入數值為 10 或以上的情形
            } else {
                // 直接回傳原始數值
                return x;
            // 結束補零條件判斷
            }
            // 結束 addZero 函式定義
        }

        