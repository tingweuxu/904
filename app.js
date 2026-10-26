/**
 * 904 班級雲端數位聯絡簿 & 相簿 - 前端互動腳本 (app.js)
 * 包含：
 * 1. 今日聯絡簿渲染、自我檢核勾選 (localStorage 儲存)、日期切換
 * 2. LINE 拍照 AI 自動辨識同步模擬動畫與即時新增項目
 * 3. Google 雲端硬碟共用相簿串接 (12KxLYb0nzy56ZFtsP8CRF4fxdb8XB9Zb)、分類篩選與 Lightbox 燈箱放大預覽
 */

document.addEventListener('DOMContentLoaded', () => {
  const DEFAULT_DRIVE_FOLDER_ID = '12KxLYb0nzy56ZFtsP8CRF4fxdb8XB9Zb';
  const DEFAULT_DRIVE_FOLDER_URL = `https://drive.google.com/drive/folders/${DEFAULT_DRIVE_FOLDER_ID}`;

  /* ==========================================================================
     1. 班級聯絡簿假資料（支援多日切換與 AI 即時新增）
     ========================================================================== */
  const contactBookDays = [
    {
      dateKey: '2026-10-26',
      dateLabel: '10月26日 (週一)',
      weekTag: '第 9 週 · 九年級模考衝刺',
      dutyStudents: '陳宥廷、林子晴',
      syncTime: '16:42',
      items: [
        {
          id: 'hw-1026-1',
          type: 'homework',
          subject: '國文',
          title: '完成國文習作第六課 + 訂正國文複習卷（家長簽名）',
          due: '明日早自習收'
        },
        {
          id: 'hw-1026-2',
          type: 'homework',
          subject: '數學',
          title: '麻辣講義 p.72 ~ p.75（圓與相似形綜合應用題）',
          due: '明日第一節檢討'
        },
        {
          id: 'hw-1026-3',
          type: 'homework',
          subject: '社會',
          title: '完成會考歷屆試題本第 3 回（含錯題訂正筆記）',
          due: '週三繳交'
        },
        {
          id: 'ex-1026-1',
          type: 'exam',
          subject: '英文',
          title: 'Unit 5 單字全 + 1200 高頻單字 p.40~45 抽考',
          due: '明日早自習 07:50'
        },
        {
          id: 'ex-1026-2',
          type: 'exam',
          subject: '理化',
          title: '直線運動與牛頓運動定律公式綜合小考',
          due: '明日第四節'
        },
        {
          id: 'no-1026-1',
          type: 'notice',
          subject: '班務',
          title: '繳交 904 畢業紀念冊個人生活照至 Google 雲端相簿資料夾',
          due: '學藝股長彙整'
        },
        {
          id: 'no-1026-2',
          type: 'notice',
          subject: '體育',
          title: '明日有體育課，全班統一穿 904 班服與運動鞋',
          due: '服儀提醒'
        }
      ]
    },
    {
      dateKey: '2026-10-25',
      dateLabel: '10月23日 (週五)',
      weekTag: '第 8 週 · 週末複習',
      dutyStudents: '張博鈞、王語彤',
      syncTime: '16:50',
      items: [
        {
          id: 'hw-1023-1',
          type: 'homework',
          subject: '班級經營',
          title: '週記一篇：題目「九年級這一年給自己的目標」（至少 250 字）',
          due: '週一早自習收'
        },
        {
          id: 'hw-1023-2',
          type: 'homework',
          subject: '英文',
          title: '大家說英語雜誌 10 月號 p.34~38 聽力練習',
          due: '週一抽查'
        },
        {
          id: 'ex-1023-1',
          type: 'exam',
          subject: '歷史',
          title: '世界史現代篇全範圍複習考',
          due: '週一第六節'
        },
        {
          id: 'no-1023-1',
          type: 'notice',
          subject: '衛生',
          title: '週末清洗個人餐袋與抹布，週一檢查指甲與服儀',
          due: '衛生股長提醒'
        }
      ]
    }
  ];

  /* ==========================================================================
     2. Google Drive 雲端相簿資料（904 班精選相片展示 + Lightbox 放大）
     ========================================================================== */
  const albumPhotos = [
    {
      id: 'drive-photo-1',
      category: 'sports',
      categoryName: '🏃 校慶運動會',
      title: '904 大隊接力決賽衝線瞬間！奪得全九年級總冠軍',
      uploader: '導師 上傳至雲端相簿',
      date: '2026/10/20',
      driveFileUrl: DEFAULT_DRIVE_FOLDER_URL,
      src: 'https://images.unsplash.com/photo-1526676037777-05a232554f77?auto=format&fit=crop&w=1200&q=80'
    },
    {
      id: 'drive-photo-2',
      category: 'sports',
      categoryName: '🏃 校慶運動會',
      title: '904 運動會創意進場造型——全班合力製作的巨型看板',
      uploader: '副班長 上傳至雲端相簿',
      date: '2026/10/20',
      driveFileUrl: DEFAULT_DRIVE_FOLDER_URL,
      src: 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&w=1200&q=80'
    },
    {
      id: 'drive-photo-3',
      category: 'lab',
      categoryName: '🔬 自然實驗課',
      title: '理化實驗室：加速度與滑車打點計時器分組實作',
      uploader: '自然小老師 上傳',
      date: '2026/10/22',
      driveFileUrl: DEFAULT_DRIVE_FOLDER_URL,
      src: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=1200&q=80'
    },
    {
      id: 'drive-photo-4',
      category: 'lab',
      categoryName: '🔬 自然實驗課',
      title: '第三組成功完成電化學實驗數據紀錄！',
      uploader: '導師 上傳至雲端相簿',
      date: '2026/10/22',
      driveFileUrl: DEFAULT_DRIVE_FOLDER_URL,
      src: 'https://images.unsplash.com/photo-1581093458791-9f3c3900df4b?auto=format&fit=crop&w=1200&q=80'
    },
    {
      id: 'drive-photo-5',
      category: 'daily',
      categoryName: '🍱 904 日常與畢業倒數',
      title: '十月份 904 壽星慶生會！全班一起享用巧克力蛋糕',
      uploader: '康樂股長 上傳',
      date: '2026/10/24',
      driveFileUrl: DEFAULT_DRIVE_FOLDER_URL,
      src: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?auto=format&fit=crop&w=1200&q=80'
    },
    {
      id: 'drive-photo-6',
      category: 'daily',
      categoryName: '🍱 904 日常與畢業倒數',
      title: '午休前圖書角共讀時光與會考衝刺讀書會小組',
      uploader: '學藝股長 上傳',
      date: '2026/10/25',
      driveFileUrl: DEFAULT_DRIVE_FOLDER_URL,
      src: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1200&q=80'
    },
    {
      id: 'drive-photo-7',
      category: 'sports',
      categoryName: '🏃 校慶運動會',
      title: '904 拔河決賽全班齊心協力連勝紀錄',
      uploader: '體育股長 上傳',
      date: '2026/10/20',
      driveFileUrl: DEFAULT_DRIVE_FOLDER_URL,
      src: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=1200&q=80'
    },
    {
      id: 'drive-photo-8',
      category: 'daily',
      categoryName: '🍱 904 日常與畢業倒數',
      title: '放學前學藝股長書寫整齊的 904 黑板聯絡簿特寫',
      uploader: 'LINE AI Bot 自動備份',
      date: '2026/10/26',
      driveFileUrl: DEFAULT_DRIVE_FOLDER_URL,
      src: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=1200&q=80'
    }
  ];

  /* ==========================================================================
     3. 狀態管理
     ========================================================================== */
  let currentDayIndex = 0;
  let currentCategoryFilter = 'all';
  let currentAlbumFilter = 'all';
  let filteredPhotosForLightbox = [...albumPhotos];
  let currentLightboxIndex = 0;

  // 從 localStorage 載入已勾選完成的聯絡簿項目
  const STORAGE_KEY = 'class904_completed_tasks';
  let completedTaskIds = new Set(JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]'));

  function saveCompletedTasks() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([...completedTaskIds]));
  }

  /* ==========================================================================
     4. 頁面雙核心區塊切換 (今日聯絡簿 / 班級雲端相簿)
     ========================================================================== */
  const topTabBtns = document.querySelectorAll('.tab-btn');
  const mobileNavBtns = document.querySelectorAll('.mobile-nav-item');
  const tabSections = document.querySelectorAll('.tab-section');

  function switchMainTab(targetId) {
    topTabBtns.forEach(btn => {
      const isMatch = btn.dataset.target === targetId;
      btn.classList.toggle('active', isMatch);
      btn.setAttribute('aria-selected', isMatch);
    });

    mobileNavBtns.forEach(btn => {
      btn.classList.toggle('active', btn.dataset.target === targetId);
    });

    tabSections.forEach(sec => {
      sec.classList.toggle('active', sec.id === targetId);
    });

    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  topTabBtns.forEach(btn => {
    btn.addEventListener('click', () => switchMainTab(btn.dataset.target));
  });

  mobileNavBtns.forEach(btn => {
    btn.addEventListener('click', () => switchMainTab(btn.dataset.target));
  });

  /* ==========================================================================
     5. 渲染「今日聯絡簿」卡片清單
     ========================================================================== */
  const currentDateText = document.getElementById('currentDateText');
  const weekTagText = document.getElementById('weekTagText');
  const dutyStudents = document.getElementById('dutyStudents');
  const contactCardsContainer = document.getElementById('contactCardsContainer');
  const progressStatusText = document.getElementById('progressStatusText');
  const progressBarFill = document.getElementById('progressBarFill');
  const remainingCountBadge = document.getElementById('remainingCountBadge');

  const categoryMeta = {
    homework: {
      title: '各科作業清單',
      icon: '📝',
      cardClass: 'card-homework'
    },
    exam: {
      title: '明日考試範圍',
      icon: '💯',
      cardClass: 'card-exam'
    },
    notice: {
      title: '攜帶物品與注意事項',
      icon: '📌',
      cardClass: 'card-notice'
    }
  };

  function renderContactBook() {
    const dayData = contactBookDays[currentDayIndex];
    if (currentDateText) currentDateText.textContent = dayData.dateLabel;
    if (weekTagText) weekTagText.textContent = dayData.weekTag;
    if (dutyStudents) dutyStudents.textContent = dayData.dutyStudents;

    // 計算完成進度
    const totalCount = dayData.items.length;
    const completedCount = dayData.items.filter(item => completedTaskIds.has(item.id)).length;
    const remainingCount = totalCount - completedCount;
    const percent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

    progressStatusText.textContent = `已完成 ${completedCount} / ${totalCount} 項 (${percent}%)`;
    progressBarFill.style.width = `${percent}%`;
    remainingCountBadge.textContent = remainingCount;

    // 決定要渲染哪些分類卡片
    const categoriesToShow = currentCategoryFilter === 'all'
      ? ['homework', 'exam', 'notice']
      : [currentCategoryFilter];

    contactCardsContainer.innerHTML = '';

    // 若單一分類篩選，讓卡片寬度自動延展
    contactCardsContainer.style.gridTemplateColumns =
      currentCategoryFilter === 'all' && window.innerWidth > 960
        ? 'repeat(3, 1fr)'
        : '1fr';

    categoriesToShow.forEach(catKey => {
      const meta = categoryMeta[catKey];
      const catItems = dayData.items.filter(item => item.type === catKey);

      const cardEl = document.createElement('article');
      cardEl.className = `category-card ${meta.cardClass}`;

      const listHtml = catItems.map(item => {
        const isDone = completedTaskIds.has(item.id);
        return `
          <li class="task-item ${isDone ? 'completed' : ''}" data-task-id="${item.id}">
            <div class="custom-checkbox" role="checkbox" aria-checked="${isDone}">
              ${isDone ? '✓' : ''}
            </div>
            <div class="task-content">
              <div class="task-meta">
                <span class="subject-tag">${item.subject}</span>
                <span class="due-tag">⏰ ${item.due}</span>
              </div>
              <p class="task-title">${item.title}</p>
            </div>
          </li>
        `;
      }).join('');

      cardEl.innerHTML = `
        <div class="card-header">
          <div class="card-title-wrap">
            <div class="card-icon">${meta.icon}</div>
            <h3>${meta.title}</h3>
          </div>
          <span class="item-count-badge">${catItems.length} 項</span>
        </div>
        <ul class="task-list">
          ${listHtml}
        </ul>
      `;

      contactCardsContainer.appendChild(cardEl);
    });

    // 綁定點擊勾選事件
    document.querySelectorAll('.task-item').forEach(itemEl => {
      itemEl.addEventListener('click', () => {
        const taskId = itemEl.dataset.taskId;
        if (completedTaskIds.has(taskId)) {
          completedTaskIds.delete(taskId);
        } else {
          completedTaskIds.add(taskId);
        }
        saveCompletedTasks();
        renderContactBook();
      });
    });
  }

  // 綁定聯絡簿分類篩選按鈕
  document.querySelectorAll('.filter-chip').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.filter-chip').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentCategoryFilter = btn.dataset.filter;
      renderContactBook();
    });
  });

  // 綁定前後日期切換按鈕
  document.getElementById('prevDayBtn').addEventListener('click', () => {
    if (currentDayIndex < contactBookDays.length - 1) {
      currentDayIndex++;
      renderContactBook();
      showToast(`已切換至 ${contactBookDays[currentDayIndex].dateLabel}`);
    } else {
      showToast('已經是最早的示範紀錄囉！');
    }
  });

  document.getElementById('nextDayBtn').addEventListener('click', () => {
    if (currentDayIndex > 0) {
      currentDayIndex--;
      renderContactBook();
      showToast(`已切換至 ${contactBookDays[currentDayIndex].dateLabel}`);
    } else {
      showToast('目前已是最新一日聯絡簿！');
    }
  });

  /* ==========================================================================
     6. GAS 真實 Webhook 串接與 LINE AI 即時同步邏輯
     ========================================================================== */
  const openGasConfigBtn = document.getElementById('openGasConfigBtn');
  const gasConfigPanel = document.getElementById('gasConfigPanel');
  const gasApiUrlInput = document.getElementById('gasApiUrlInput');
  const applyGasUrlBtn = document.getElementById('applyGasUrlBtn');

  // 從 localStorage 載入已儲存的 GAS Web App URL，預設帶入使用者的專屬 GAS 網址
  const GAS_STORAGE_KEY = 'class904_gas_api_url';
  const DEFAULT_GAS_URL = 'https://script.google.com/macros/s/AKfycbyG5u3yPRBimx9ZbP6MVwUgC5VW01HeIHRJ4lln4a_trwJfAesgR6XiShmKwPLhlf4-/exec';
  let savedGasUrl = localStorage.getItem(GAS_STORAGE_KEY) || DEFAULT_GAS_URL;
  if (gasApiUrlInput) {
    gasApiUrlInput.value = savedGasUrl;
  }

  if (openGasConfigBtn && gasConfigPanel) {
    openGasConfigBtn.addEventListener('click', () => {
      gasConfigPanel.classList.toggle('hidden');
    });
  }

  // 抓取 GAS 即時聯絡簿資料函式
  async function fetchLiveContactBookFromGas(url, showNotification = true) {
    if (!url) return;
    try {
      if (showNotification) showToast('🔄 正在同步 LINE 審核確認的最新聯絡簿...');
      const response = await fetch(url);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const data = await response.json();

      if (data && data.items && Array.isArray(data.items)) {
        // 更新今日聯絡簿資料
        const newDayData = {
          dateKey: data.date || UtilitiesDate(),
          dateLabel: `${data.date || '今日'} (即時同步)`,
          weekTag: '第 9 週 · LINE AI 已確認發布',
          dutyStudents: '陳宥廷、林子晴',
          syncTime: new Date().toLocaleTimeString('zh-TW', { hour: '2-digit', minute: '2-digit' }),
          items: data.items.map((item, idx) => ({
            id: `gas-live-${idx}-${Date.now()}`,
            type: item.type || 'homework',
            subject: item.subject || '其他',
            title: item.content || item.title || '',
            due: item.due || '提醒'
          }))
        };

        // 放入第一筆
        contactBookDays[0] = newDayData;
        currentDayIndex = 0;
        renderContactBook();

        const now = new Date();
        const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
        syncStatusPill.innerHTML = `<span class="pulse-dot"></span><span>LINE 已同步 (${timeStr})</span>`;

        if (showNotification) showToast('✅ 成功從 LINE 同步最新發布的聯絡簿！');
      }
    } catch (err) {
      console.warn('Fetch GAS error:', err);
      if (showNotification) showToast('⚠️ 抓取最新聯絡簿失敗，請確認 GAS 網址與權限已設為所有人');
    }
  }

  function UtilitiesDate() {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
  }

  if (applyGasUrlBtn && gasApiUrlInput) {
    applyGasUrlBtn.addEventListener('click', () => {
      const url = gasApiUrlInput.value.trim();
      if (!url.startsWith('https://script.google.com/')) {
        showToast('⚠️ 請輸入有效的 Google Apps Script 網址 (https://script.google.com/...)');
        return;
      }
      localStorage.setItem(GAS_STORAGE_KEY, url);
      fetchLiveContactBookFromGas(url, true);
    });
  }

  // 若一開始就有儲存的 GAS URL，背景靜默抓取一次最新版本
  if (savedGasUrl) {
    fetchLiveContactBookFromGas(savedGasUrl, false);
  }

  /* ==========================================================================
     6-2. LINE 拍照 AI 自動辨識同步模擬區互動
     ========================================================================== */
  const aiSyncPanel = document.getElementById('aiSyncPanel');
  const toggleAiFlowBtn = document.getElementById('toggleAiFlowBtn');
  const simulateAiScanBtn = document.getElementById('simulateAiScanBtn');
  const scanLaser = document.getElementById('scanLaser');
  const step1Card = document.getElementById('step1Card');
  const step2Card = document.getElementById('step2Card');
  const step3Card = document.getElementById('step3Card');
  const syncStatusPill = document.getElementById('syncStatusPill');

  toggleAiFlowBtn.addEventListener('click', () => {
    aiSyncPanel.classList.toggle('hidden');
  });

  simulateAiScanBtn.addEventListener('click', () => {
    simulateAiScanBtn.disabled = true;
    simulateAiScanBtn.querySelector('span').textContent = 'AI 正在掃描黑板字跡...';
    scanLaser.classList.add('scanning');

    // 步驟一亮起
    step1Card.classList.add('active-step');
    showToast('📸 收到班級 LINE 群組上傳的黑板照片...');

    setTimeout(() => {
      step1Card.classList.remove('active-step');
      step2Card.classList.add('active-step');
      showToast('🤖 Gemini Vision 正在辨識粉筆字跡與分類科目...');
    }, 900);

    setTimeout(() => {
      step2Card.classList.remove('active-step');
      step3Card.classList.add('active-step');

      // 動態新增一筆「AI 剛剛從黑板角落辨識到的補充事項」
      const todayItems = contactBookDays[0].items;
      const extraTaskId = 'ai-live-added-1';
      const alreadyAdded = todayItems.some(i => i.id === extraTaskId);

      if (!alreadyAdded) {
        todayItems.unshift({
          id: extraTaskId,
          type: 'homework',
          subject: '生物補充 (AI 新辨識)',
          title: '完成實驗觀察紀錄表 p.18，並貼上顯微鏡照片',
          due: '剛剛由 LINE 拍照同步'
        });
      }

      currentDayIndex = 0;
      renderContactBook();

      const now = new Date();
      const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
      syncStatusPill.innerHTML = `<span class="pulse-dot"></span><span>LINE AI 已同步 (${timeStr})</span>`;

      showToast('✅ AI 辨識完成！已自動更新今日聯絡簿清單');
    }, 2000);

    setTimeout(() => {
      step3Card.classList.remove('active-step');
      scanLaser.classList.remove('scanning');
      simulateAiScanBtn.disabled = false;
      simulateAiScanBtn.querySelector('span').textContent = '再次模擬黑板拍照 AI 同步';
    }, 2800);
  });

  // 複製 Webhook JSON 範本按鈕
  document.getElementById('copyWebhookCodeBtn').addEventListener('click', () => {
    const codeText = document.getElementById('jsonPayloadPreview').textContent;
    navigator.clipboard.writeText(codeText).then(() => {
      showToast('📋 已複製 LINE Bot × Gemini JSON 格式範本！');
    });
  });

  /* ==========================================================================
     7. 班級雲端相簿渲染、Google Drive 資料夾設定與 Lightbox 放大
     ========================================================================== */
  const photoGalleryGrid = document.getElementById('photoGalleryGrid');
  const driveIframeContainer = document.getElementById('driveIframeContainer');
  const openDriveConfigBtn = document.getElementById('openDriveConfigBtn');
  const driveConfigPanel = document.getElementById('driveConfigPanel');
  const applyDriveFolderBtn = document.getElementById('applyDriveFolderBtn');
  const driveFolderIdInput = document.getElementById('driveFolderIdInput');
  const googleDriveIframe = document.getElementById('googleDriveIframe');
  const rawDriveFolderUrl = document.getElementById('rawDriveFolderUrl');
  const externalDriveLink = document.getElementById('externalDriveLink');

  function renderPhotoGallery() {
    filteredPhotosForLightbox = currentAlbumFilter === 'all'
      ? [...albumPhotos]
      : albumPhotos.filter(p => p.category === currentAlbumFilter);

    photoGalleryGrid.innerHTML = '';

    filteredPhotosForLightbox.forEach((photo, idx) => {
      const card = document.createElement('div');
      card.className = 'photo-card';
      card.innerHTML = `
        <div class="photo-thumb-wrap">
          <img src="${photo.src}" alt="${photo.title}" loading="lazy">
          <span class="photo-badge">${photo.categoryName}</span>
          <div class="zoom-hint" aria-hidden="true">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.2">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              <line x1="11" y1="8" x2="11" y2="14"></line>
              <line x1="8" y1="11" x2="14" y2="11"></line>
            </svg>
          </div>
        </div>
        <div class="photo-info">
          <h3>${photo.title}</h3>
          <div class="photo-meta">
            <span>${photo.uploader}</span>
            <span>${photo.date}</span>
          </div>
        </div>
      `;

      card.addEventListener('click', () => openLightbox(idx));
      photoGalleryGrid.appendChild(card);
    });
  }

  // 相簿活動分類篩選
  document.querySelectorAll('.album-chip').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.album-chip').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentAlbumFilter = btn.dataset.album;
      renderPhotoGallery();
    });
  });

  // 展開/收合 Google Drive 串接設定面板
  openDriveConfigBtn.addEventListener('click', () => {
    driveConfigPanel.classList.toggle('hidden');
  });

  // 解析使用者輸入的 Google Drive 資料夾網址或 ID
  function extractDriveFolderId(input) {
    const trimmed = input.trim();
    const match = trimmed.match(/folders\/([a-zA-Z0-9_-]+)/);
    return match ? match[1] : trimmed;
  }

  applyDriveFolderBtn.addEventListener('click', () => {
    const folderId = extractDriveFolderId(driveFolderIdInput.value);
    if (!folderId) {
      showToast('⚠️ 請輸入有效的 Google 雲端硬碟資料夾 ID 或網址');
      return;
    }
    const embedUrl = `https://drive.google.com/embeddedfolderview?id=${encodeURIComponent(folderId)}#grid`;
    const folderUrl = `https://drive.google.com/drive/folders/${encodeURIComponent(folderId)}`;
    googleDriveIframe.src = embedUrl;
    rawDriveFolderUrl.href = folderUrl;
    externalDriveLink.href = folderUrl;
    showToast('✅ 已更新綁定的 Google Drive 共用資料夾！');
  });

  // 切換「雙重顯示」、「Google Drive 原生 Iframe 嵌入模式」與「卡片瀑布流 Lightbox 模式」
  const albumToolbar = document.getElementById('albumToolbar');
  document.querySelectorAll('.mode-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.mode-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const mode = btn.dataset.viewmode;
      if (mode === 'iframe') {
        photoGalleryGrid.classList.add('hidden');
        if (albumToolbar) albumToolbar.classList.add('hidden');
        driveIframeContainer.classList.remove('hidden');
        showToast('📂 已切換為僅顯示 904 雲端資料夾即時內容');
      } else if (mode === 'gallery') {
        driveIframeContainer.classList.add('hidden');
        if (albumToolbar) albumToolbar.classList.remove('hidden');
        photoGalleryGrid.classList.remove('hidden');
        showToast('✨ 已切換為精選相片牆（支援 Lightbox 放大）');
      } else {
        driveIframeContainer.classList.remove('hidden');
        if (albumToolbar) albumToolbar.classList.remove('hidden');
        photoGalleryGrid.classList.remove('hidden');
        showToast('🔥 已開啟雙重顯示模式（雲端硬碟即時資料夾 + 精選相片牆）');
      }
    });
  });

  /* ==========================================================================
     8. Lightbox 圖片放大燈箱邏輯（支援左右切換、鍵盤 Esc/方向鍵、手機滑動）
     ========================================================================== */
  const lightboxModal = document.getElementById('lightboxModal');
  const lightboxImage = document.getElementById('lightboxImage');
  const lightboxTitle = document.getElementById('lightboxTitle');
  const lightboxTag = document.getElementById('lightboxTag');
  const lightboxMeta = document.getElementById('lightboxMeta');
  const lightboxCounter = document.getElementById('lightboxCounter');
  const lightboxDownloadBtn = document.getElementById('lightboxDownloadBtn');

  function updateLightboxView() {
    const photo = filteredPhotosForLightbox[currentLightboxIndex];
    if (!photo) return;
    lightboxImage.src = photo.src;
    lightboxImage.alt = photo.title;
    lightboxTitle.textContent = photo.title;
    lightboxTag.textContent = photo.categoryName;
    lightboxMeta.textContent = `${photo.uploader} · 拍攝日期 ${photo.date}`;
    lightboxCounter.textContent = `${currentLightboxIndex + 1} / ${filteredPhotosForLightbox.length}`;
    lightboxDownloadBtn.href = photo.src;
  }

  function openLightbox(index) {
    currentLightboxIndex = index;
    updateLightboxView();
    lightboxModal.classList.add('open');
    lightboxModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    lightboxModal.classList.remove('open');
    lightboxModal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  function showPrevPhoto() {
    currentLightboxIndex =
      (currentLightboxIndex - 1 + filteredPhotosForLightbox.length) % filteredPhotosForLightbox.length;
    updateLightboxView();
  }

  function showNextPhoto() {
    currentLightboxIndex =
      (currentLightboxIndex + 1) % filteredPhotosForLightbox.length;
    updateLightboxView();
  }

  document.getElementById('lightboxCloseBtn').addEventListener('click', closeLightbox);
  document.getElementById('lightboxBackdrop').addEventListener('click', closeLightbox);
  document.getElementById('lightboxPrevBtn').addEventListener('click', showPrevPhoto);
  document.getElementById('lightboxNextBtn').addEventListener('click', showNextPhoto);

  // 鍵盤支援 (Esc 關閉、左右方向鍵切換)
  document.addEventListener('keydown', e => {
    if (!lightboxModal.classList.contains('open')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') showPrevPhoto();
    if (e.key === 'ArrowRight') showNextPhoto();
  });

  // 手機觸控左右滑動切換相片 (Swipe Gesture)
  let touchStartX = 0;
  lightboxModal.addEventListener('touchstart', e => {
    touchStartX = e.changedTouches[0].screenX;
  }, { passive: true });

  lightboxModal.addEventListener('touchend', e => {
    const touchEndX = e.changedTouches[0].screenX;
    const diff = touchStartX - touchEndX;
    if (Math.abs(diff) > 45) {
      if (diff > 0) showNextPhoto();
      else showPrevPhoto();
    }
  }, { passive: true });

  /* ==========================================================================
     9. Toast 提示工具與初始化
     ========================================================================== */
  const toastEl = document.getElementById('toastNotification');
  let toastTimer = null;

  function showToast(message) {
    toastEl.textContent = message;
    toastEl.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      toastEl.classList.remove('show');
    }, 2600);
  }

  // 視窗尺寸改變時調整卡片排版
  window.addEventListener('resize', () => {
    renderContactBook();
  });

  // 初始化執行
  renderContactBook();
});
