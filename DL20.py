import asyncio
import sqlite3
import csv
import datetime
import random
from playwright.async_api import async_playwright
from playwright_stealth import Stealth
from stem import Signal
from stem.control import Controller

# --- 1. CONFIGURATION ---
# UPDATED: Direct Mode (Hotspot/WARP). Set to None to use system IP.
PROXY_CONFIG = None
MAX_RETRIES = 3 
TARGET_URLS = [
    "https://www.patreon.com/posts/welcome-to-many-144705373",
    "https://www.patreon.com/posts/down-on-ranch-144705494",
    "https://www.patreon.com/posts/by-special-146059361",
    "https://www.patreon.com/posts/recommendation-147927672?l=it",
    "https://www.patreon.com/posts/2026-man-of-week-146979584",
    "https://www.patreon.com/posts/2026-man-of-week-146979780",
    "https://www.patreon.com/posts/2026-man-of-week-146979780?source=storefront"
]

# --- 2. IDENTITY MANAGEMENT ---
def request_new_identity():
    """Signals Tor to cycle its circuit for a new IP address."""
    try:
        # Connect to the ControlPort (9051) enabled in your torrc
        with Controller.from_port(port=9051) as controller:
            controller.authenticate() # Uses CookieAuthentication by default
            controller.signal(Signal.NEWNYM)
            print("[*] Tor Identity Swapped. Waiting for new circuit...")
    except Exception as e:
        print(f"[!] Could not swap Tor identity: {e}")

# --- 3. DATABASE & LOGGING ---
def init_db():
    conn = sqlite3.connect('evidence.db')
    cursor = conn.cursor()
    cursor.execute('''CREATE TABLE IF NOT EXISTS mirrors 
                      (id INTEGER PRIMARY KEY AUTOINCREMENT, target_url TEXT, found_mirror TEXT, timestamp TEXT)''')
    conn.commit()
    conn.close()

def log_results(url, found_links):
    timestamp = datetime.datetime.now().isoformat()
    conn = sqlite3.connect('evidence.db')
    cursor = conn.cursor()
    with open('investigation_log.csv', 'a', newline='') as f:
        writer = csv.DictWriter(f, fieldnames=["timestamp", "target_url", "found_mirror"])
        for link in found_links:
            # Check for duplicates before inserting
            cursor.execute("SELECT id FROM mirrors WHERE target_url = ? AND found_mirror = ?", (url, link))
            if not cursor.fetchone():
                cursor.execute('INSERT INTO mirrors (target_url, found_mirror, timestamp) VALUES (?, ?, ?)', (url, link, timestamp))
                writer.writerow({"timestamp": timestamp, "target_url": url, "found_mirror": link})
    conn.commit()
    conn.close()

# --- 4. THE AUDIT ENGINE ---
async def run_audit(url):
    retries = 0
    success = False
    
    while retries < MAX_RETRIES and not success:
        print(f"\n[*] Auditing (Attempt {retries+1}/{MAX_RETRIES}): {url}")
        network_links = set()
        
        # ⚠️ FIXED: Using Context Manager Stealth Pattern
        async with Stealth().use_async(async_playwright()) as p:
            
            browser = await p.chromium.launch(
                headless=False, # Visible for debugging
                proxy=PROXY_CONFIG,
                args=["--disable-blink-features=AutomationControlled"]
            )
            
            context = await browser.new_context(
                user_agent="Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
                viewport={'width': 1920, 'height': 1080}
            )
            page = await context.new_page()

            # Sniffer: Catch media requests on the fly
            async def handle_request(request):
                u = request.url.lower()
                if any(x in u for x in [".m3u8", ".mp4", ".mpd", "vimeo", "wistia", "blob:"]):
                    if request.resource_type in ["media", "xhr", "fetch", "other"]:
                        print(f"      -> Network Catch: {request.url[:60]}...")
                        network_links.add(request.url)

            page.on("request", handle_request)

            try:
                response = await page.goto(url, wait_until="networkidle", timeout=60000)
                
                # DETECT CLOUDFLARE BLOCK
                page_title = await page.title()
                if (response and response.status == 403) or "Access denied" in page_title:
                    print(f"[!!!] 1009 Block detected. Triggering New Identity...")
                    request_new_identity()
                    await asyncio.sleep(10) # Give Tor time to build a new circuit
                    await browser.close()
                    retries += 1
                    continue # Retry this URL

                # Auto-Click: Trigger the "Play" or "Preview" button if visible
                play_selectors = [
                    "button[aria-label*='Play']", 
                    "div[role='button']:has-text('Preview')", 
                    ".vimeo-play-button",
                    "video",
                    "[data-tag='media-container']"
                ]
                
                for selector in play_selectors:
                    try:
                        if await page.query_selector(selector):
                            await page.hover(selector)
                            await asyncio.sleep(0.5)
                    except: pass
                
                await asyncio.sleep(4) 

                # Deep DOM Scan
                dom_links = await page.evaluate(r"""() => {
                    const found = [];
                    document.querySelectorAll('video, source, iframe, a').forEach(el => {
                        const src = el.src || el.href;
                        if (src && src.match(/\.(mp4|mkv|m3u8|mpd)(\?|$)/i)) found.push(src);
                        if (src && src.includes('vimeo')) found.push(`EMBED: ${src}`);
                    });
                    return found;
                }""")

                final_list = network_links.union(set(dom_links))
                if final_list:
                    log_results(url, final_list)
                    print(f"    [+] Logged {len(final_list)} unique assets.")
                else:
                    print(f"    [-] Clean (No assets found).")
                
                success = True 

            except Exception as e:
                print(f"    [!] Error: {e}")
                retries += 1
            finally:
                await browser.close()

async def main():
    init_db()
    print("🕵️‍♂️ DIRECT MODE SNIFFER ACTIVE (Uses System IP)")
    print("⚠️  Ensure you are on Mobile Hotspot or Cloudflare WARP")
    print("---------------------------------------------------")
    for url in TARGET_URLS:
        await run_audit(url)
        # Random sleep to protect your IP reputation
        delay = random.uniform(15, 45)
        print(f"[*] Sleeping for {delay:.1f}s to avoid detection...")
        await asyncio.sleep(delay) 
    print("\n✅ Audit Complete.")

if __name__ == "__main__":
    asyncio.run(main())
