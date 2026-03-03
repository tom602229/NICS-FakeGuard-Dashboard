import urllib.request
import json
import csv
import io
import sys

sys.stdout.reconfigure(encoding='utf-8')

print("[IntelliBot] 啟動 165 反詐騙開放資料介接...")

api_url = "https://data.gov.tw/api/v2/dataset?p=id:160055"

try:
    req = urllib.request.urlopen(api_url)
    data = json.loads(req.read())
    
    download_url = None
    for resource in data.get('data', {}).get('distribution', []):
        if resource.get('format', '').upper() == 'CSV':
            download_url = resource.get('downloadURL')
            break

    if not download_url:
        print("[IntelliBot] 找不到 CSV 下載連結，嘗試使用預設的 URL。")
        download_url = "https://data.moi.gov.tw/MoiOD/System/DownloadFile.aspx?DATA=C0012A32-9F93-4E80-AB08-251D77FE8AC7"
        
    print(f"[IntelliBot] 取得資料集下載點: {download_url}")
    
    csv_req = urllib.request.Request(download_url, headers={'User-Agent': 'Mozilla/5.0'})
    csv_data = urllib.request.urlopen(csv_req).read().decode('utf-8')
    
    reader = csv.DictReader(io.StringIO(csv_data))
    
    urls = []
    print("[IntelliBot] 最新假投資網站黑名單 (Top 10):")
    for idx, row in enumerate(reader):
        if idx >= 10:
            break
        keys = list(row.keys())
        web_nm = row.get('WEBSITE_NM') or row.get(keys[0])
        web_url = row.get('WEBURL') or row.get(keys[1])
        cnt = row.get('CNT') or row.get(keys[2])
        
        urls.append({"name": web_nm, "url": web_url, "count": cnt})
        print(f" - [{cnt}件] 名稱: {web_nm} | 網址: {web_url}")

    with open('real_scam_urls.json', 'w', encoding='utf-8') as f:
        json.dump(urls, f, ensure_ascii=False, indent=2)
        
    print("[IntelliBot] 真實網址已成功截取並儲存。")
    
except Exception as e:
    print(f"[IntelliBot] 資料介接錯誤: {e}")
