// --- Data Models ---
const tfcData = {
    summary: "利用近期台海地緣政治局勢製造群眾恐慌，並假借官方（國安基金）內線名義，誘騙焦慮民眾加入封閉群組進行假投資詐欺。此為高度複合型之認知作戰加詐欺威脅。",
    classification: "認知作戰 / 詐騙 (複合型威脅)",
    evidence_list: [
      "【創造集體恐懼】：刻意放大「台海危機」、「外資大撤退」與「毀滅性崩盤」等詞彙，利用地緣政治焦慮癱瘓理性判斷。",
      "【訴諸權威】：捏造「前國安基金內部操盤手陳老師」及「內部數據模型」。",
      "【違反金融常理】：承諾不合理的「逆勢獲利 300%」與「保證鎖死漲停」。"
    ],
    estimated_roi_impact: "TWD 120M+",
    analyst_tool_recommendation: [
        "阻斷: 通報 165 反詐騙協調中心要求阻斷社群平台帳號",
        "澄清: 協調金管會與國防部發布跨部會聯合聲明",
        "預防: 針對高齡投資族群推送防詐宣導與警示簡訊"
    ]
};

const socialData = {
    summary: "以財經網紅名義投放社群廣告建立「VIP粉絲群」，透過暗樁輪番展現獲利截圖，並提供偽造之釣魚投資 App 誘騙 Dcard/PTT 年輕受眾入金。",
    classification: "詐騙 (投資/釣魚網站)",
    evidence_list: [
      "【創造集體錯覺】：利用「暗樁」在群組或論壇宣稱高頻獲利，建立「限額」、「早鳥」機制製造錯失恐懼（FOMO）。",
      "【受眾特性】：精準針對年輕用戶期望快速累積財富及對科技工具（AI飆股App）的盲目信任。",
      "【釣魚特徵】：誘餌網址「hxxps://www.kgi-vip-invest[.]com」為搶註釣魚網站，偽冒大型券商。"
    ],
    estimated_roi_impact: "TWD 17.5M+",
    analyst_tool_recommendation: [
        "阻斷: 通報 TWNIC 與各大 ISP 封鎖釣魚網域",
        "通報: 將假冒 App 封裝檔加入內政部打詐儀表板黑名單",
        "宣導: 建議相關論壇版主於置頂公告中宣導防範"
    ]
};

const ctiData = [
    { domain: "bito-pro.vip", target: "BitoPro 幣託交易所", geoip: "🇨🇳 CN (Alibaba)", first_seen: "2026-03-02", tags: ["釣魚", "虛擬貨幣"], status: "Active (未阻斷)", statusClass: "glow-text-critical" },
    { domain: "tw-kgi.com", target: "凱基證券", geoip: "🇺🇸 US (Cloudflare)", first_seen: "2026-03-01", tags: ["釣魚", "仿冒券商"], status: "Blocked (已阻斷)", statusClass: "safe" },
    { domain: "cathay-sec-vip.com", target: "國泰證券", geoip: "🇯🇵 JP (Amazon)", first_seen: "2026-03-03", tags: ["釣魚", "仿冒券商"], status: "Active (未阻斷)", statusClass: "glow-text-critical" },
    { domain: "103.14.25.x", target: "惡意中繼站 (C2)", geoip: "🇭🇰 HK (Tencent)", first_seen: "2026-02-28", tags: ["殭屍網路", "C2"], status: "Investigating", statusClass: "glow-text-high" },
    { domain: "line-vip-group.com", target: "VIP 儲值平台", geoip: "🇸🇬 SG (DigitalOcean)", first_seen: "2026-03-02", tags: ["殺豬盤", "LINE群"], status: "Investigating", statusClass: "glow-text-high" },
    { domain: "fxc-tw.com", target: "外匯期貨中心", geoip: "🇹🇼 TW (Hinet)", first_seen: "2026-03-03", tags: ["MT4/MT5", "高槓桿"], status: "Active (未阻斷)", statusClass: "glow-text-critical" },
    { domain: "gov-tax-refund.org", target: "財政部稅務入口", geoip: "🇺🇸 US (Namecheap)", first_seen: "2026-03-02", tags: ["釣魚", "假退稅"], status: "Blocked (已阻斷)", statusClass: "safe" },
    { domain: "shopee-seller-center.cc", target: "蝦皮賣家中心", geoip: "🇨🇳 CN (Tencent)", first_seen: "2026-03-01", tags: ["帳號盜用", "釣魚"], status: "Blocked (已阻斷)", statusClass: "safe" }
];

const liveFeeds = [
    { time: "12:45:33", title: "網域封鎖申請", content: "已自動向 TWNIC 遞交 kgi-vip-invest[.]com 封鎖請求。" },
    { time: "12:35:10", title: "網路探測器警報", content: "在 Dcard 理財板偵測新增高風險「VIP存股群組」貼文。" },
    { time: "12:20:05", title: "跨部會聯防通報", content: "惡意網域 tw-kgi[.]com 已成功列入 ISP 黑名單實施阻擋。" },
    { time: "11:58:22", title: "情資報告產出", content: "針對年輕族群之潛在財損報告 (PTT/Dcard) 已生成。" }
];

// --- UI Logic ---

// Navigation Tab Switching
const navItems = document.querySelectorAll('.nav-item');
const viewSections = document.querySelectorAll('.view-section');

navItems.forEach(item => {
    item.addEventListener('click', () => {
        // Remove active class
        navItems.forEach(nav => nav.classList.remove('active'));
        viewSections.forEach(view => view.classList.remove('active'));
        
        // Add active class
        item.classList.add('active');
        const targetView = document.getElementById(item.getAttribute('data-target'));
        if(targetView) targetView.classList.add('active');
    });
});

// Populate Details
function populateReport(prefix, data) {
    document.getElementById(`${prefix}-summary`).innerText = data.summary;
    document.getElementById(`${prefix}-roi`).innerText = data.estimated_roi_impact;
    
    document.getElementById(`${prefix}-evidence`).innerHTML = 
        data.evidence_list.map(item => `<li>${item}</li>`).join('');
        
    document.getElementById(`${prefix}-action`).innerHTML = 
        data.analyst_tool_recommendation.map(item => `<li>${item}</li>`).join('');
}

// Populate Table
function populateTable() {
    const tbody = document.getElementById('cti-table-body');
    tbody.innerHTML = ctiData.map(item => `
        <tr>
            <td class="domain-text">${item.domain}</td>
            <td>${item.target}</td>
            <td style="font-size: 0.85rem; color: var(--text-secondary);">${item.geoip}</td>
            <td style="font-family: var(--font-data); font-size: 0.9rem;">${item.first_seen}</td>
            <td>${item.tags.map(t => `<span class="badge badge-outline" style="margin-right:5px;">${t}</span>`).join('')}</td>
            <td class="${item.statusClass}" style="font-weight: 500;">${item.status}</td>
        </tr>
    `).join('');
}

// Populate Feed
function populateFeed() {
    const container = document.getElementById('live-feed-container');
    container.innerHTML = liveFeeds.map(item => `
        <div class="feed-item">
            <div class="feed-time">${item.time}</div>
            <div class="feed-title">${item.title}</div>
            <div class="feed-desc">${item.content}</div>
        </div>
    `).join('');
}

// 模擬戰情室情報即時更新 (Live Agent Simulation)
setInterval(() => {
    const events = [
        { title: "網址風險快照", content: "自動排程擷取到可疑網域的首頁快照，等待 NLP 語意解析。" },
        { title: "AI 對話日誌掃描", content: "辨識到詐騙集團的話術變異：開始使用『申報稅務』等關鍵字。" },
        { title: "跨部會通報完成", content: "分析師確認風險指標後，已送出 TWNIC DNS 阻擋請求。" },
        { title: "165 CTI 資料庫同步", content: "從內政部警政署 ADCC 的聯防網路載入 5 筆新進黑名單。" },
        { title: "TFC 事實查核追蹤", content: "模型偵測到批踢踢 (PTT) 正在散佈疑似認知作戰的台海假新聞。" }
    ];
    
    // 隨機抽選新情報
    const randomEvent = events[Math.floor(Math.random() * events.length)];
    const now = new Date();
    const timeStr = now.getHours().toString().padStart(2, '0') + ':' + 
                    now.getMinutes().toString().padStart(2, '0') + ':' + 
                    now.getSeconds().toString().padStart(2, '0');
    
    // 推入最新的情報並保持陣列長度
    liveFeeds.unshift({
        time: timeStr,
        title: randomEvent.title,
        content: randomEvent.content
    });
    if(liveFeeds.length > 20) liveFeeds.pop();
    
    populateFeed();
}, 8000); // 每 8 秒產生一則新情報

// Number Animation (Simple Counter)
function animateValue(id, start, end, duration) {
    if (start === end) return;
    const obj = document.getElementById(id);
    let startTimestamp = null;
    const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        // ease out cubic
        const easeProgress = 1 - Math.pow(1 - progress, 3);
        const currentVal = start + easeProgress * (end - start);
        obj.innerHTML = currentVal.toFixed(1) + (id.includes('loss') ? 'M' : '');
        if (progress < 1) {
            window.requestAnimationFrame(step);
        }
    };
    window.requestAnimationFrame(step);
}

// Init
document.addEventListener('DOMContentLoaded', () => {
    populateReport('tfc', tfcData);
    populateReport('social', socialData);
    populateTable();
    populateFeed();
    
    // Animate Dashboard Stats
    setTimeout(() => {
        animateValue("count-loss", 0, 137.5, 2000);
        animateValue("count-domains", 0, 5, 1500);
    }, 300);
});

// --- URL Scanner Logic & Backend API Integration ---
const API_BASE = "http://localhost:5000/api";


// --- NLP Text Analyzer Logic ---
const nlpAnalyzeBtn = document.getElementById('nlp-analyze-btn');
const nlpInput = document.getElementById('nlp-input');
const nlpResultArea = document.getElementById('nlp-result-area');

// NLP Results Elements
const nlpIntent = document.getElementById('nlp-intent');
const nlpTactic = document.getElementById('nlp-tactic');
const nlpEvidenceList = document.getElementById('nlp-evidence-list');

// Metric Elements
function setMetric(id, value, color) {
    document.getElementById(`score-${id}`).innerText = `${value}%`;
    document.getElementById(`score-${id}`).style.color = color;
    document.getElementById(`bar-${id}`).style.width = `${value}%`;
}

nlpAnalyzeBtn.addEventListener('click', () => {
    let text = nlpInput.value.trim();
    if (!text) {
        alert("請輸入需檢測之實體文本內容以啟動 NLP 分析。");
        return;
    }

    // Reset / Start
    nlpAnalyzeBtn.disabled = true;
    nlpAnalyzeBtn.innerText = "⏳ 解析模組運算中...";
    nlpResultArea.classList.remove('hidden');
    nlpResultArea.style.opacity = 0.5;

    // Reset scores
    setMetric('greed', 0, 'var(--text-secondary)');
    setMetric('fear', 0, 'var(--text-secondary)');
    setMetric('trust', 0, 'var(--text-secondary)');

    // Fake API Loading Delay
    setTimeout(() => {
        analyzeText(text);
        nlpAnalyzeBtn.disabled = false;
        nlpAnalyzeBtn.innerText = "◆ 啟動深度特徵萃取";
        nlpResultArea.style.opacity = 1;
    }, 1500);
});

function analyzeText(text) {
    // 簡易關鍵字啟發式 NLP 權重計算
    let greedWords = ['賺', '獲利', '保證', '翻倍', '暴富', '老師帶', '漲停', '飆股', 'VIP', '免費'];
    let fearWords = ['危機', '崩盤', '退出', '倒數', '限額', '滿人', '馬上', '快', '錯過', '急'];
    let authWords = ['國安基金', '內線', '官方', '證券', '金管會', '經理', '台積電', '執行長', '助理'];

    let greedScore = 15;
    let fearScore = 10;
    let trustScore = 20;

    let foundEvidences = [];

    // 計算貪婪/利益誘惑
    let matchGreed = greedWords.filter(w => text.includes(w));
    if (matchGreed.length > 0) {
        greedScore += matchGreed.length * 20;
        foundEvidences.push(`【利益誘惑 (Greed/FOMO)】: 偵測到高度渲染財富渴望的詞彙集合 (${matchGreed.slice(0,3).join(', ')}...)。`);
    }

    // 計算恐懼/急迫感
    let matchFear = fearWords.filter(w => text.includes(w));
    if (matchFear.length > 0) {
        fearScore += matchFear.length * 25;
        foundEvidences.push(`【集體恐懼/時間壓力 (Time Pressure)】: 企圖以限額或危機感 (${matchFear.slice(0,3).join(', ')}...) 癱瘓受害者的查證能力。`);
    }

    // 計算訴諸權威
    let matchAuth = authWords.filter(w => text.includes(w));
    if (matchAuth.length > 0) {
        trustScore += matchAuth.length * 15;
        foundEvidences.push(`【訴諸權威 (Appeal to Authority)】: 假借具備公信力實體或頭銜 (${matchAuth.slice(0,3).join(', ')}...) 以降低受害者戒心。`);
    }

    // 參數正規化
    greedScore = Math.min(greedScore, 98);
    fearScore = Math.min(fearScore, 96);
    trustScore = Math.min(trustScore, 85);

    // 判定最終分類
    if (greedScore > 60 && fearScore > 40) {
        nlpIntent.innerText = "意圖分類: 高度疑似金融詐欺 / 複合型騙局";
        nlpIntent.className = "badge badge-critical";
        nlpTactic.innerText = "主要敘事: 殺豬盤 (Pig Butchering) / 錯失恐懼";
        nlpTactic.className = "badge badge-high";
    } else if (fearScore > 70) {
        nlpIntent.innerText = "意圖分類: 認知作戰 / 恐慌散播";
        nlpIntent.className = "badge badge-critical";
        nlpTactic.innerText = "主要敘事: 訴諸恐懼 / 陰謀論";
        nlpTactic.className = "badge badge-high";
    } else if (greedScore > 40) {
        nlpIntent.innerText = "意圖分類: 廣告推銷 / 潛在投資陷阱";
        nlpIntent.className = "badge badge-high";
        nlpTactic.innerText = "主要敘事: 誇大不實回報";
        nlpTactic.className = "badge badge-outline";
    } else {
        nlpIntent.innerText = "意圖分類: 一般文本 / 新聞資訊";
        nlpIntent.className = "badge badge-safe";
        nlpIntent.style.borderColor = "var(--alert-safe)";
        nlpIntent.style.color = "var(--alert-safe)";
        nlpIntent.style.background = "rgba(16, 185, 129, 0.1)";
        nlpTactic.innerText = "無顯著惡意敘事";
        nlpTactic.className = "badge badge-outline";
        foundEvidences = ["未偵測到明顯的社會工程學攻擊特徵或邏輯謬誤。"];
    }

    // 更新 UI 數據
    setMetric('greed', greedScore, 'var(--alert-high)');
    setMetric('fear', fearScore, 'var(--alert-critical)');
    setMetric('trust', trustScore, 'var(--accent-cyan)');

    // 輸出證據清單
    nlpEvidenceList.innerHTML = foundEvidences.map(e => `<li>${e}</li>`).join('');
}

// --- Crowdsourced Reporting Logic w/ API ---
const crowdBtn = document.getElementById('crowd-btn');
const crowdInput = document.getElementById('crowd-url-input');
const crowdResultArea = document.getElementById('crowd-result-area');
const crowdScoreVal = document.getElementById('crowd-score-val');
const crowdScoreRing = document.getElementById('crowd-score-ring');
const crowdScoreTitle = document.getElementById('crowd-score-title');
const crowdScoreDesc = document.getElementById('crowd-score-desc');
const crowdTagContainer = document.getElementById('crowd-tag-container');
const crowdFeedContainer = document.getElementById('crowd-feed-container');
const crowdReportBtn = document.getElementById('crowd-report-btn');

// 從後端拉取通報資料
function fetchCrowdFeeds() {
    fetch(`${API_BASE}/reports`)
    .then(res => res.json())
    .then(data => {
        crowdFeedContainer.innerHTML = data.map(item => `
            <div class="feed-item" style="border-left-color: ${item.is_scam ? 'var(--alert-critical)' : 'var(--alert-safe)'}">
                <div style="display:flex; justify-content:space-between; margin-bottom:5px;">
                    <span style="font-size:0.8rem; font-weight:bold; color:var(--accent-cyan); background:rgba(6, 182, 212, 0.1); padding:2px 6px; border-radius:4px;">📡 來源：${item.user || '未知情資節點'}</span>
                    <span class="feed-time">${item.time}</span>
                </div>
                <div class="feed-desc" style="color:var(--text-primary); margin-top:8px;">${item.comment}</div>
            </div>
        `).join('');
    })
    .catch(err => console.error("Could not fetch reports from backend", err));
}

crowdBtn.addEventListener('click', () => {
    let url = crowdInput.value.trim().toLowerCase();
    if (!url) {
        alert("請輸入需評分之網域！");
        return;
    }

    crowdBtn.disabled = true;
    crowdBtn.innerText = "連線後端 API 鑑識中...";
    crowdResultArea.classList.remove('hidden');
    
    // 初始化 UI
    crowdScoreRing.style.borderColor = "var(--glass-border)";
    crowdScoreRing.style.boxShadow = "none";
    crowdScoreVal.innerText = "0";
    crowdTagContainer.innerHTML = "";

    // 呼叫後端 API 進行 URL 分析
    fetch(`${API_BASE}/scan-url`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: url })
    })
    .then(res => res.json())
    .then(data => {
        calculateCrowdScore(data);
        crowdBtn.disabled = false;
        crowdBtn.innerText = "執行自動化威脅鑑識";
    })
    .catch(err => {
        alert("後端連線異常，請確認 Flask 服務正在執行中");
        crowdBtn.disabled = false;
        crowdBtn.innerText = "執行自動化威脅鑑識";
    });
});

function calculateCrowdScore(data) {
    let color = "var(--accent-cyan)";
    if(data.level === "CRITICAL") color = "var(--alert-critical)";
    else if(data.level === "HIGH") color = "var(--alert-high)";
    else if(data.level === "SAFE") color = "var(--alert-safe)";
    
    crowdScoreTitle.innerText = data.level + " RISK";
    crowdScoreTitle.style.color = color;
    crowdScoreDesc.innerText = data.desc;
    
    crowdScoreRing.style.borderColor = color;
    crowdScoreRing.style.boxShadow = `0 0 30px ${color}40`;
    
    crowdTagContainer.innerHTML = data.tags.map(t => `<span class="badge badge-outline" style="border-color:${color}50; color:${color}">${t}</span>`).join('');

    // 動態數字計時器
    animateValue2('crowd-score-val', 0, data.score, 1500, color);
}

// 供評分數字使用的特製動畫器
function animateValue2(id, start, end, duration, color) {
    if (start === end) return;
    const obj = document.getElementById(id);
    let startTimestamp = null;
    const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        const easeProgress = 1 - Math.pow(1 - progress, 3);
        const currentVal = Math.floor(start + easeProgress * (end - start));
        obj.innerHTML = currentVal;
        obj.style.color = color;
        if (progress < 1) {
            window.requestAnimationFrame(step);
        }
    };
    window.requestAnimationFrame(step);
}

// 通報按鈕互動 (寫入後端 DB)
crowdReportBtn.addEventListener('click', () => {
    let url = crowdInput.value.trim();
    if(!url) {
        alert('請先輸入上方網址，才能進行通報動作。');
        return;
    }
    crowdReportBtn.innerText = "⏳ 傳送阻擋指令至 TWNIC 聯防網路...";
    
    fetch(`${API_BASE}/reports`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            url: url,
            comment: `分析師核准：已確認 ${url} 為惡意網域並列入黑名單。`,
            is_scam: true
        })
    })
    .then(res => res.json())
    .then(data => {
        crowdReportBtn.innerText = "✅ 阻擋指令已成功下達！";
        crowdReportBtn.style.background = "rgba(16, 185, 129, 0.2)";
        crowdReportBtn.style.borderColor = "var(--alert-safe)";
        crowdReportBtn.style.color = "var(--alert-safe)";
        
        // 重新拉取一次動態牆，展現資料庫中的新留言
        fetchCrowdFeeds();

        setTimeout(() => {
            crowdReportBtn.innerText = "⛔ 確診為惡意網域 (加入黑名單並通報 ISP)";
            crowdReportBtn.style.background = "rgba(239, 68, 68, 0.1)";
            crowdReportBtn.style.borderColor = "var(--alert-critical)";
            crowdReportBtn.style.color = "var(--alert-critical)";
        }, 5000);
    })
    .catch(err => alert("通報失敗，請確認資料庫運行狀態。"));
});

// Init phase injection
document.addEventListener('DOMContentLoaded', () => {
    populateReport('tfc', tfcData);
    populateReport('social', socialData);
    populateTable();
    populateFeed();
    fetchCrowdFeeds(); // 向從後端拉取即時通報資料
    
    // 定期輪詢後端 DB 每 15 秒更新留言牆
    setInterval(fetchCrowdFeeds, 15000);
});
