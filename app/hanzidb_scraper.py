import requests
from bs4 import BeautifulSoup
import pandas as pd
import time

def scrape_hanziDB(page_num):
    url=f"http://hanzidb.org/character-list/hsk?page={page_num}"
    response = requests.get(url)
    soup = BeautifulSoup(response.content, 'html.parser')

    table = soup.find('table')
    rows = []

    for tr in table.find_all('tr')[1:]:
        cols = tr.find_all('td')
        if len(cols) > 0:
            rows.append({
                'char': cols[0].text.strip(),
                'pinyin': cols[1].text.strip(),
                'definition': cols[2].text.strip(),
                'radical': cols[3].text.strip(),
                'stroke_count': cols[4].text.strip(),
                'hsk_level': cols[5].text.strip(),
                'general_standard': cols[6].text.strip(),
                'frequency_rank': cols[7].text.strip()
            })
    return rows

all_chars = []
for i in range(1, 28):
    print(f"Scraping page {i}...")
    all_chars.extend(scrape_hanziDB(i))
    time.sleep(1) 

df = pd.DataFrame(all_chars)
df.to_csv('hanzidb_hsk_characters.csv', index=False)