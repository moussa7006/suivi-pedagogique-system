import os
import re

filepath = 'frontend-ionic/src/app/web-admin/features/dashboard/dashboard.component.ts'

with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

# Replace body background gradient
content = re.sub(r'background-image:\s*radial-gradient[^;]+;', '', content)
content = re.sub(r'background-color:\s*#fafafa;', 'background-color: #f8fafc;', content)

# Remove backdrop-filter and complex gradients from stats-overview
content = re.sub(r'background:\s*linear-gradient\([^;]+;\s*backdrop-filter:\s*[^;]+;\s*-webkit-backdrop-filter:\s*[^;]+;', 'background: transparent;', content)

# Clean stat-card
content = re.sub(r'transition:\s*transform[^;]+;', 'transition: all 0.2s ease;', content)
content = re.sub(r'will-change:\s*transform;', '', content)
content = re.sub(r'&\s*::before\s*{[^}]+}', '', content)
content = re.sub(r'&:hover\s*{[^}]+}', '&:hover { border-color: var(--accent); }', content)
content = re.sub(r'box-shadow:\s*0\s+10px\s+25px[^;]+;', 'box-shadow: 0 2px 4px rgba(0,0,0,0.05);', content)

# Clean stat-icon
content = re.sub(r'background:\s*linear-gradient\([^;]+;', 'background: var(--accent);', content)
content = re.sub(r'box-shadow:\s*0\s+8px\s+16px[^;]+;', '', content)

# Clean hub-tile
content = re.sub(r'box-shadow:\s*0\s+6px\s+18px[^;]+;', 'box-shadow: 0 2px 4px rgba(0,0,0,0.05);', content)
content = re.sub(r'transition:\s*all[^;]+;', 'transition: all 0.2s ease;', content)
content = re.sub(r'\.hub-tile::before\s*{[^}]+}', '', content)
content = re.sub(r'\.hub-tile:hover\s*{[^}]+}', '.hub-tile:hover { border-color: var(--tile-color); box-shadow: 0 4px 8px rgba(0,0,0,0.08); }', content)
content = re.sub(r'\.hub-tile:hover::before\s*{[^}]+}', '', content)
content = re.sub(r'\.hub-tile:hover\s*\.tile-arrow\s*{[^}]+}', '.hub-tile:hover .tile-arrow { color: var(--tile-color); }', content)

# Clean tile-icon
content = re.sub(r'background:\s*linear-gradient\([^;]+;', 'background: var(--tile-color);', content)
content = re.sub(r'box-shadow:\s*0\s+6px\s+12px[^;]+;', '', content)

# Clean bento-card
content = re.sub(r'box-shadow:\s*0\s+12px\s+30px[^;]+;', 'box-shadow: 0 2px 4px rgba(0,0,0,0.05);', content)
content = re.sub(r'\.bento-card:hover\s*{[^}]+}', '.bento-card:hover { box-shadow: 0 4px 8px rgba(0,0,0,0.08); }', content)

# Clean header-icon
content = re.sub(r'background:\s*linear-gradient\([^;]+;', 'background: #6366f1;', content)
content = re.sub(r'box-shadow:\s*0\s+6px\s+12px[^;]+;', '', content)

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(content)

print("Dashboard nettoyé !")
