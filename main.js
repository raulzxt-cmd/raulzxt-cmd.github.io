// --- DOM 元素選取 ---
const navbar = document.getElementById('navbar');
const hamburgerBtn = document.getElementById('hamburger-btn');
const navLinks = document.getElementById('nav-links');
const navOverlay = document.getElementById('nav-overlay');
const menuItems = document.querySelectorAll('.nav-links a');
const bgGlow = document.getElementById('bg-glow');

// --- 1. 導覽列滾動效果 ---
window.addEventListener('scroll', () => {
  if (window.scrollY > 50) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
}, { passive: true });

// --- 2. 手機版漢堡選單切換 ---
function toggleMenu() {
  const isOpen = hamburgerBtn.classList.toggle('active');
  navLinks.classList.toggle('active');
  navOverlay.classList.toggle('active');
  
  // 更新無障礙狀態與鎖定背景滑動
  hamburgerBtn.setAttribute('aria-expanded', isOpen);
  document.body.style.overflow = isOpen ? 'hidden' : '';
}

hamburgerBtn.addEventListener('click', toggleMenu);
navOverlay.addEventListener('click', toggleMenu);

// 點擊任一選單連結後自動關閉抽屜
menuItems.forEach(item => {
  item.addEventListener('click', () => {
    if (navLinks.classList.contains('active')) {
      toggleMenu();
    }
  });
});

// --- 3. 動態發光背景 (滑鼠/觸控跟隨) ---
if (bgGlow) {
  window.addEventListener('mousemove', (e) => {
    bgGlow.style.setProperty('--mouse-x', `${e.clientX}px`);
    bgGlow.style.setProperty('--mouse-y', `${e.clientY}px`);
  });

  window.addEventListener('touchmove', (e) => {
    if (e.touches.length > 0) {
      bgGlow.style.setProperty('--mouse-x', `${e.touches[0].clientX}px`);
      bgGlow.style.setProperty('--mouse-y', `${e.touches[0].clientY}px`);
    }
  }, { passive: true });
}

// ==========================================
// 4. 雪花 / 漂浮光點粒子系統 (Canvas)
// ==========================================
const canvas = document.getElementById('snow-canvas');
if (canvas) {
  const ctx = canvas.getContext('2d');

  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  // 監聽視窗縮放
  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  // 粒子數量 (手機版減少數量以保證效能)
  const particleCount = window.innerWidth < 768 ? 35 : 70;
  const particles = [];

  class Particle {
    constructor() {
      this.reset();
    }

    reset() {
      this.x = Math.random() * width;
      this.y = Math.random() * -height; // 從上方螢幕外隨機進場
      this.size = Math.random() * 2 + 0.8; // 粒子大小 (0.8px ~ 2.8px)
      this.speedY = Math.random() * 0.8 + 0.3; // 下落速度 (慢速優雅)
      this.speedX = Math.random() * 0.4 - 0.2; // 左右飄動速度
      this.opacity = Math.random() * 0.6 + 0.2; // 透明度 (0.2 ~ 0.8)
      // 粒子色彩：混合白色與微弱霓虹綠光
      this.color = Math.random() > 0.3 ? '#ccd6f6' : '#64ffda';
    }

    update() {
      this.y += this.speedY;
      this.x += this.speedX;

      // 當粒子飄出螢幕底部或兩側時重新回到頂部
      if (this.y > height || this.x < 0 || this.x > width) {
        this.reset();
        this.y = 0; // 重新從最頂部開始落
      }
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = this.color;
      ctx.globalAlpha = this.opacity;
      ctx.shadowBlur = 4; // 微光暈效果
      ctx.shadowColor = this.color;
      ctx.fill();
    }
  }

  // 初始化粒子群
  for (let i = 0; i < particleCount; i++) {
    const p = new Particle();
    p.y = Math.random() * height; // 初始散佈在整個畫面上
    particles.push(p);
  }

  // 動畫主迴圈 (60 FPS)
  function animate() {
    ctx.clearRect(0, 0, width, height);

    particles.forEach((p) => {
      p.update();
      p.draw();
    });

    requestAnimationFrame(animate);
  }

  animate();
}

// ==========================================
// 5. Work 專案清單 Hover 圖片跟隨（視窗相依 + 邊界防溢出修復版）
// ==========================================
const projectItems = document.querySelectorAll('.project-item');
const previewModal = document.getElementById('project-preview');
const previewImg = document.getElementById('project-preview-img');

if (previewModal && previewImg) {
  projectItems.forEach((item) => {
    // 滑鼠移入：載入對應圖片並顯示
    item.addEventListener('mouseenter', () => {
      const imgSrc = item.getAttribute('data-img');
      if (imgSrc) {
        previewImg.src = imgSrc;
        previewModal.classList.add('active');
      }
    });

    // 滑鼠移動：即時座標追蹤，搭配固定定位（Fixed）並防範邊界溢出
    item.addEventListener('mousemove', (e) => {
      const modalWidth = 360;
      const modalHeight = 225;
      
      let left = e.clientX + 24;
      let top = e.clientY + 20;

      // 若右側超出螢幕邊緣，自動翻轉至游標左側
      if (left + modalWidth > window.innerWidth) {
        left = e.clientX - modalWidth - 20;
      }

      // 若底部超出螢幕邊緣，自動向上推移
      if (top + modalHeight > window.innerHeight) {
        top = e.clientY - modalHeight - 10;
      }

      previewModal.style.left = `${left}px`;
      previewModal.style.top = `${top}px`;
    });

    // 滑鼠移出：隱藏彈窗
    item.addEventListener('mouseleave', () => {
      previewModal.classList.remove('active');
    });
  });
}

// ==========================================
// 6. 點擊 Logo 回到頁首 (Go To Top)
// ==========================================
const logoBtn = document.getElementById('logo-btn');

if (logoBtn) {
  logoBtn.addEventListener('click', (e) => {
    e.preventDefault(); // 避免網址列出現 #
    window.scrollTo({
      top: 0,
      behavior: 'smooth' // 平滑滾動至最頂端
    });
  });
}

// ==========================================
// 7. 右下角 Go To Top 懸浮按鈕邏輯
// ==========================================
const backToTopBtn = document.getElementById('back-to-top');

if (backToTopBtn) {
  // 監聽滾動：超過 300px 顯示按鈕，回頂部隱藏
  window.addEventListener('scroll', () => {
    if (window.scrollY > 300) {
      backToTopBtn.classList.add('show');
    } else {
      backToTopBtn.classList.remove('show');
    }
  }, { passive: true });

  // 點擊平滑滾動回頂端
  backToTopBtn.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}

// ==========================================
// 8. 右側膠囊滾動進度條 (Scroll Progress)
// ==========================================
const scrollProgressBar = document.getElementById('scroll-progress-bar');

if (scrollProgressBar) {
  window.addEventListener('scroll', () => {
    // 總可滾動高度 = 頁面總高度 - 視窗高度
    const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
    
    if (totalHeight > 0) {
      // 當前滾動百分比
      const progress = (window.scrollY / totalHeight) * 100;
      scrollProgressBar.style.height = `${progress}%`;
    }
  }, { passive: true });
}

// ==========================================
// 9. My Stack 區塊：逐行由外向內匯聚滾動進場動畫 (3.0s)
// ==========================================
const stackSection = document.getElementById('stack');
const stackGrid = document.querySelector('.stack-grid');
const stackCards = document.querySelectorAll('.stack-card');

if (stackSection && stackGrid && stackCards.length > 0) {
  let revealTimers = [];

  // 依據目前螢幕寬度計算每列欄位數與每張卡片的「逐行由外向內」起始偏移量
  function calculateCardOffsets() {
    const gridStyle = window.getComputedStyle(stackGrid);
    const colCount = gridStyle.gridTemplateColumns.split(' ').length || 1;
    const totalCards = stackCards.length;

    stackCards.forEach((card, index) => {
      const col = index % colCount;
      const row = Math.floor(index / colCount);
      // 計算該列實際擁有的卡片數量（最後一排若不足 6 張，仍以該排實際張數對稱由外向內）
      const rowStartIndex = row * colCount;
      const cardsInThisRow = Math.min(colCount, totalCards - rowStartIndex);
      const rowMidIndex = (cardsInThisRow - 1) / 2;

      // 距離該列中心點的比例 (-1 最左側 ~ +1 最右側)
      const normalizedFromCenter = rowMidIndex > 0 ? (col - rowMidIndex) / rowMidIndex : 0;
      // 距離中心越遠，水平滑入距離越大 (最大 ±90px)
      const offsetX = Math.round(normalizedFromCenter * 90);
      // 逐行進場時搭配微微由下往上浮起，層次更清晰
      const offsetY = 28;

      // 嚴格「一行接一行」節奏：每行間隔 650ms，同一行內由外向內交錯 120ms
      const edgeDistance = Math.abs(col - rowMidIndex);
      const withinRowDelay = Math.round((rowMidIndex - edgeDistance) * 120);
      const rowBaseDelay = row * 650;
      const delay = rowBaseDelay + Math.max(0, withinRowDelay);

      card.style.setProperty('--reveal-x', `${offsetX}px`);
      card.style.setProperty('--reveal-y', `${offsetY}px`);
      card.style.setProperty('--reveal-delay', `${delay}ms`);
    });
  }

  // 初始化隱藏狀態
  calculateCardOffsets();
  stackCards.forEach((card) => card.classList.add('reveal-init'));

  window.addEventListener('resize', () => {
    if (stackCards[0].classList.contains('reveal-init') && !stackCards[0].classList.contains('is-visible')) {
      calculateCardOffsets();
    }
  }, { passive: true });

  const stackObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        revealTimers.forEach((id) => clearTimeout(id));
        revealTimers = [];

        calculateCardOffsets();

        // 下一幀逐行觸發滑入定位
        requestAnimationFrame(() => {
          stackCards.forEach((card) => {
            card.classList.add('is-visible');

            // 3.0s 動畫完整播完後，將過渡效果交還給原本的 CSS hover 上浮特效
            const delayMs = parseInt(card.style.getPropertyValue('--reveal-delay') || '0', 10);
            const timerId = setTimeout(() => {
              card.classList.remove('reveal-init', 'is-visible');
              card.classList.add('reveal-done');
            }, delayMs + 3050);
            revealTimers.push(timerId);
          });
        });
      } else {
        // 當整個 My Stack 區塊完全離開視窗時，重置回初始外圍狀態，下次滑入或點擊錨點可再次逐行觸發
        revealTimers.forEach((id) => clearTimeout(id));
        revealTimers = [];

        stackCards.forEach((card) => {
          card.classList.remove('is-visible', 'reveal-done');
          card.classList.add('reveal-init');
        });
      }
    });
  }, {
    threshold: 0.15 // 區塊進入畫面 15% 時立即觸發
  });

  stackObserver.observe(stackSection);
}