from flask import Flask, request, jsonify
from flask_cors import CORS
import sqlite3
import datetime
import os
import json

app = Flask(__name__)
CORS(app)  # 允許跨網域請求

DB_FILE = "fakeguard.db"

def init_db():
    conn = sqlite3.connect(DB_FILE)
    c = conn.cursor()
    # 建立通報資料表
    c.execute('''
        CREATE TABLE IF NOT EXISTS reports (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user TEXT,
            url TEXT,
            comment TEXT,
            is_scam BOOLEAN,
            timestamp TEXT
        )
    ''')
    
    # 若資料表為空，塞入幾筆初期的假資料
    c.execute("SELECT COUNT(*) FROM reports")
    if c.fetchone()[0] == 0:
        initial_feeds = [
            ("165 防詐 LINE 機器人", "bito-pro.vip", "民眾檢舉：這平台叫我先匯款繳稅解凍，疑似殺豬盤！", True, "2 分鐘前"),
            ("Dcard 網路探測系統", "dcard.tw", "系統通報：發現異常高頻之投資群組招募文章", False, "15 分鐘前"),
            ("警政服務 App 報案", "tw-kgi.com", "民眾檢舉：收到假冒凱基證券的高配息簡訊", True, "1 小時前"),
            ("PTT 股板監測模組", "cathay-sec-vip.com", "系統通報：發現假冒國泰證券之假投資連結", True, "3 小時前")
        ]
        c.executemany("INSERT INTO reports (user, url, comment, is_scam, timestamp) VALUES (?, ?, ?, ?, ?)", initial_feeds)
    
    conn.commit()
    conn.close()

# 模擬 165 CTI 資料庫與釣魚字串
CTI_DATA = [
    {"domain": "bito-pro.vip", "target": "BitoPro", "tags": ["釣魚", "虛擬貨幣"]},
    {"domain": "tw-kgi.com", "target": "凱基證券", "tags": ["釣魚", "仿冒券商"]},
    {"domain": "cathay-sec-vip.com", "target": "國泰證券", "tags": ["釣魚", "仿冒券商"]},
    {"domain": "line-vip-group.com", "target": "VIP 平台", "tags": ["殺豬盤"]},
    {"domain": "fxc-tw.com", "target": "外匯站", "tags": ["高槓桿平台"]}
]
PHISHING_KWS = ['vip', 'invest', 'stock', 'wealth', 'crypto', 'bonus', 'kgi', 'cathay', 'bito', 'pro']

@app.route('/api/status', methods=['GET'])
def get_status():
    return jsonify({"status": "Online", "version": "2026.1.0-Prod", "db_connected": os.path.exists(DB_FILE)})

@app.route('/api/scan-url', methods=['POST'])
def scan_url():
    data = request.json
    url = data.get('url', '').lower().strip()
    
    if not url:
        return jsonify({"error": "No URL provided"}), 400

    score = 0
    title = ""
    desc = ""
    tags = []
    level = ""

    is_blacklisted = next((item for item in CTI_DATA if item["domain"] in url), None)
    kw_count = sum(1 for kw in PHISHING_KWS if kw in url)

    if is_blacklisted:
        score = 98
        level = "CRITICAL"
        desc = "【真實後端判定】該網址已被 165 通報系統確診為惡意站點，請立即遠離。"
        tags = ["已確診", "官方黑名單", "釣魚"]
    elif kw_count >= 2 and '.gov.tw' not in url:
        score = 75 + kw_count * 2
        level = "HIGH"
        desc = "【真實後端判定】雖然未在黑名單中，但此網址包含常見詐騙專用拼貼特徵。"
        tags = ["高風險結構", "AI 警示"]
    elif '.gov.tw' in url or '.edu.tw' in url:
        score = 5
        level = "SAFE"
        desc = "【真實後端判定】具備官方驗證的信任網域。"
        tags = ["政府驗證"]
    else:
        score = 25
        level = "NEUTRAL"
        desc = "【真實後端判定】目前未接獲明確通報，但仍請保持警覺。"
        tags = ["尚無紀錄"]

    return jsonify({
        "url": url,
        "score": min(100, score),
        "level": level,
        "desc": desc,
        "tags": tags
    })

@app.route('/api/reports', methods=['GET', 'POST'])
def handle_reports():
    if request.method == 'POST':
        data = request.json
        url = data.get('url', '')
        comment = data.get('comment', f"我覺得 {url} 可能是詐騙。")
        is_scam = data.get('is_scam', True)
        
        # 簡單產生台灣時區 Timestamp
        now = datetime.datetime.utcnow() + datetime.timedelta(hours=8)
        time_str = now.strftime('%H:%M:%S')

        # 將寫入來源標示為分析師的操作
        conn = sqlite3.connect(DB_FILE)
        c = conn.cursor()
        c.execute("""
            INSERT INTO reports (user, url, comment, is_scam, timestamp)
            VALUES (?, ?, ?, ?, ?)
        """, ("NICS 分析師核准", url, comment, is_scam, time_str))
        conn.commit()
        conn.close()
        
        return jsonify({"success": True, "message": "Report saved successfully"})

    elif request.method == 'GET':
        conn = sqlite3.connect(DB_FILE)
        conn.row_factory = sqlite3.Row
        c = conn.cursor()
        # 抓取最新的 10 筆通報
        c.execute("SELECT * FROM reports ORDER BY id DESC LIMIT 10")
        rows = c.fetchall()
        conn.close()
        
        feed_list = []
        for row in rows:
            feed_list.append({
                "id": row["id"],
                "user": row["user"],
                "time": row["timestamp"],
                "comment": row["comment"],
                "is_scam": bool(row["is_scam"])
            })
            
        return jsonify(feed_list)


if __name__ == '__main__':
    # 初始化資料庫
    init_db()
    print("FakeGuard API Server Started. Listening on port 5000...")
    app.run(host='0.0.0.0', port=5000, debug=True)
