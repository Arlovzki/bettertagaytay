"""Refresh recent disclosures and older financial and development-fund links.

Uses only the Python standard library. Run from any directory. Broken or
unverifiable links are recorded separately and never offered as working PDFs.
"""
import concurrent.futures
import datetime
import html.parser
import json
import re
from pathlib import Path
import urllib.parse
import urllib.request
import urllib.error

SOURCE = "https://www.tagaytay.gov.ph/transparencyseal.html"
TARGET = Path(__file__).resolve().parents[1] / "src/data/city-documents.json"
TITLES = {
    'Cash Flows': 'Statement of Cash Flows',
    '20% Component of IRA Utilization': '20% Development Fund Utilization',
    'Trust Fund Utilization': 'Government Projects, Programs and Activities (TFU)',
    'Local DRRM Fund Utilization': 'Local Disaster Risk Reduction and Management Fund Utilization',
    'Manpower Complement': 'Human Resource Complement',
    'Bid Result on Civil Works and Goods and Services': 'Bid-out Projects',
    'Special Education Fund': 'Special Education Fund Utilization',
    'Statement of Indebtedness, Payments, and Balances(SIPB)': 'Statement of Indebtedness, Payments and Balances (SIPB)',
}


class Links(html.parser.HTMLParser):
    def __init__(self):
        super().__init__()
        self.items = []
        self.row_text = []
        self.row_links = []
        self.link = None
        self.label = []
        self.group = ''

    def handle_starttag(self, tag, attrs):
        if tag == 'tr':
            self.row_text, self.row_links = [], []
        if tag == 'a':
            self.link = dict(attrs).get('href')
            self.label = []

    def handle_data(self, data):
        self.row_text.append(data)
        if self.link:
            self.label.append(data)

    def handle_endtag(self, tag):
        if tag == 'a' and self.link:
            self.row_links.append((self.link, ' '.join(' '.join(self.label).split())))
            self.link = None
        if tag != 'tr':
            return
        pdfs = [(href, label) for href, label in self.row_links if re.search(r'pdf/fd\d{4}/', href) and href.lower().endswith('.pdf')]
        if not pdfs:
            text = ' '.join(' '.join(self.row_text).split())
            if text:
                self.group = text
        for href, label in pdfs:
            year = int(re.search(r'fd(\d{4})', href).group(1))
            path = urllib.parse.unquote(href)
            statement = bool(re.search(r'(?:/sre[^/]*\.pdf$|/[^/]*receipts[^/]*\.pdf$)', path, re.I))
            development = bool(re.search(r'20\s*%\s*Component.*IRA', self.group, re.I))
            if year < 2023 and not (statement or development):
                continue
            quarter = re.search(r'/Q([1-4])/', href, re.I) or re.search(r'([1-4])(?:st|nd|rd|th) Quarter', label, re.I)
            title = 'Statement of Receipts and Expenditures' if statement else '20% Development Fund Utilization' if development else TITLES.get(self.group, self.group) if quarter else label
            url = urllib.parse.quote(urllib.parse.urljoin(SOURCE, href), safe=':/%')
            if not any(item['url'] == url for item in self.items):
                self.items.append({'url': url, 'title': title, 'listingYear': year, 'quarter': f'Q{quarter.group(1)}' if quarter else 'annual'})


def inspect_once(item):
    url = item['url']
    path = urllib.parse.unquote(urllib.parse.urlparse(url).path)
    with urllib.request.urlopen(urllib.request.Request(url, method="HEAD"), timeout=45) as response:
        content_type = response.headers.get_content_type()
        if response.status != 200 or content_type != "application/pdf":
            raise ValueError(f"Unexpected PDF response: {url}: {response.status}, {content_type}")
        size = int(response.headers.get("Content-Length", "0"))
        if size <= 0:
            raise ValueError(f"Missing PDF length: {url}")
    return {**item, 'id': path.removeprefix('/pdf/fd').removesuffix('.pdf'), 'bytes': size}


def inspect(item):
    for attempt in range(3):
        try:
            return inspect_once(item)
        except urllib.error.HTTPError as error:
            return {**item, 'reason': f'HTTP {error.code} when checked'}
        except ValueError as error:
            return {**item, 'reason': str(error)}
        except (urllib.error.URLError, TimeoutError):
            if attempt == 2:
                return {**item, 'reason': 'Could not verify the link after three attempts'}



if __name__ == "__main__":
    with urllib.request.urlopen(SOURCE, timeout=45) as response:
        source = response.read().decode("utf-8", errors="replace")
    parser = Links()
    parser.feed(source)
    if len(parser.items) < 160:
        raise ValueError("The source layout or disclosure coverage changed; inspect before refreshing")
    with concurrent.futures.ThreadPoolExecutor(max_workers=3) as pool:
        results = list(pool.map(inspect, parser.items))
    documents = [item for item in results if 'reason' not in item]
    unavailable = [item for item in results if 'reason' in item]
    if len(documents) < 30:
        raise RuntimeError('Too few working PDFs; investigate before replacing the index')
    snapshot = {"sourceUrl": SOURCE,
                "checkedAt": datetime.datetime.now(datetime.timezone.utc).isoformat(),
                "completeListingYears": [2023, 2024, 2025, 2026],
                "documents": documents, "unavailableDocuments": unavailable}
    TARGET.write_text(json.dumps(snapshot, indent=2, ensure_ascii=False) + "\n")
    print(f"Checked {len(documents)} working PDFs; {len(unavailable)} unavailable published links")
    for item in unavailable:
        print(f"{item['reason']}: {item['url']}")
