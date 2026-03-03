import urllib.request
import urllib.error
import ssl
import sys
import csv
import io

sys.stdout.reconfigure(encoding='utf-8')

print("[IntelliBot] 嘗試直接從內政部伺服器下載 CSV 資料...")

csv_url = "https://data.moi.gov.tw/MoiOD/System/DownloadFile.aspx?DATA=C0012A32-9F93-4E80-AB08-251D77FE8AC7"

# 忽略 SSL 驗證，並加上瀏覽器的 User-Agent
ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE

req = urllib.request.Request(
    csv_url, 
    headers={
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
        'Accept-Language': 'zh-TW,zh;q=0.9,en-US;q=0.8,en;q=0.7'
    }
)

try:
    response = urllib.request.urlopen(req, context=ctx)
    csv_data = response.read().decode('utf-8', errors='replace')
    
    reader = csv.DictReader(io.StringIO(csv_data))
    urls = []
    
    print("[IntelliBot] 成功取得最新假投資網站黑名單 (Top 5):")
    for idx, row in enumerate(reader):
        if idx >= 5:
            break
        keys = list(row.keys())
        web_nm = row.get('WEBSITE_NM') or row.get(keys[0])
        web_url = row.get('WEBURL') or row.get(keys[1])
        cnt = row.get('CNT') or row.get(keys[2])
        
        urls.append({"name": web_nm, "url": web_url, "count": cnt})
        print(f" - [{cnt}件] 名稱: {web_nm} | 網址: {web_url}")

    with open('real_scam_urls.txt', 'w', encoding='utf-8') as f:
        for u in urls:
            f.write(f"名稱: {u['name']}, 網址: {u['url']}, 通報數: {u['count']}\n")
            
except urllib.error.URLError as e:
    print(f"下載失敗: {e}")
