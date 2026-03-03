import urllib.request
import re
import sys

# Change console output to utf-8 in Windows
sys.stdout.reconfigure(encoding='utf-8')

print("[IntelliBot] 初始化資安情報探測模組...")
url = "https://tfc-taiwan.org.tw/articles/report"
req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'})
html = urllib.request.urlopen(req).read().decode('utf-8')

# Find article links
links = re.findall(r'href="(https://tfc-taiwan.org.tw/articles/\d+)"', html)
links = list(dict.fromkeys(links))

filtered_links = []
count = 0
for link in links:
    if count >= 10: break
    count += 1
    req2 = urllib.request.Request(link, headers={'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'})
    raw_html2 = urllib.request.urlopen(req2).read()
    html2 = raw_html2.decode('utf-8')
    title_match = re.search(r'<title>(.*?)</title>', html2)
    if title_match and ("詐騙" in title_match.group(1) or "騙" in title_match.group(1) or "假" in title_match.group(1) or "投資" in title_match.group(1)):
        print(f"[IntelliBot] 找到高風險標的: {title_match.group(1)}")
        filtered_links.append((link, title_match.group(1), html2))
        break

if not filtered_links and links:
    print("[IntelliBot] 前10篇無明顯詐騙標題，直接取第一篇樣本。")
    req2 = urllib.request.Request(links[0], headers={'User-Agent': 'Mozilla/5.0'})
    html2 = urllib.request.urlopen(req2).read().decode('utf-8')
    title = re.search(r'<title>(.*?)</title>', html2).group(1)
    filtered_links.append((links[0], title, html2))

if not filtered_links:
    print("[IntelliBot] 抓取失敗：找不到任何報告。")
    exit(1)

target_url, title, raw_html = filtered_links[0]
print(f"[IntelliBot] 目標鎖定: {target_url}")

# Basic clean up
text = re.sub(r'<style.*?</style>', '', raw_html, flags=re.DOTALL)
text = re.sub(r'<script.*?</script>', '', text, flags=re.DOTALL)
text = re.sub(r'<[^>]+>', ' ', text)
text = re.sub(r'\s+', ' ', text).strip()

idx1 = text.find("背景")
idx2 = text.find("查核報告")
if idx1 == -1: idx1 = text.find("網傳訊息")
if idx2 == -1: idx2 = text.find("相關連結")

if idx1 != -1 and idx2 != -1 and idx2 > idx1:
    extracted = text[idx1:idx2]
else:
    start = text.find(title[:5]) if title[:5] in text else len(text)//4
    extracted = text[start:start+1500]

with open('scam_intel.txt', 'w', encoding='utf-8') as f:
    f.write(f"Source: {target_url}\n")
    f.write(f"Title: {title}\n")
    f.write(f"Content: {extracted}\n")

print(f"[IntelliBot] 情資擷取完成，儲存為 scam_intel.txt (長度: {len(extracted)})")
