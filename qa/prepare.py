from pathlib import Path
source=Path('index.html').read_text(encoding='utf-8')
source=source.replace('<head>','<head><base href="../"><script src="qa/diagnostics.js"></script>')
Path('qa/preview.html').write_text(source,encoding='utf-8')
