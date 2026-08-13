"""Create proper MVC architecture diagram."""
from PIL import Image, ImageDraw, ImageFont
import os

BASE = r'C:\Users\boura\OneDrive\Documents\suivi-pedagogique-system\MEMOIRE'

# Bigger canvas for MVC architecture
w, h = 1800, 800
img = Image.new('RGBA', (w, h), (18, 24, 40, 255))  # Dark bg
draw = ImageDraw.Draw(img)

# Colors
green = (34, 197, 94, 255)       # #22C55E
blue = (59, 130, 246, 255)        # #3B82F6
amber = (245, 158, 11, 255)       # #F59E0B
cyan = (6, 182, 212, 255)         # #06B6D4
white = (255, 255, 255, 255)
slate = (148, 163, 184, 255)      # #94A3B8
dark_box = (30, 41, 59, 255)      # #1E293B
border = (71, 85, 105, 255)       # #475569

# ── Title ──
draw.text((w//2 - 200, 20), "ARCHITECTURE MVC — EduTrack", fill=white)

# ── Box drawing helper ──
def draw_box(x, y, bw, bh, color, title, subtitle=""):
    # Shadow
    draw.rounded_rectangle([x+4, y+4, x+bw+4, y+bh+4], radius=12, fill=(0,0,0,80))
    # Box
    draw.rounded_rectangle([x, y, x+bw, y+bh], radius=12, fill=dark_box, outline=color, width=3)
    # Title
    draw.text((x + 15, y + 12), title, fill=white)
    if subtitle:
        draw.text((x + 15, y + 40), subtitle, fill=slate)

def draw_arrow_down(x1, y1, x2, y2, color):
    """Arrow from top center of box to bottom center of next box."""
    mx = (x1 + x2) // 2
    # Line
    draw.line([mx, y1, mx, y2], fill=color, width=3)
    # Arrowhead
    draw.polygon([(mx-8, y2-12), (mx+8, y2-12), (mx, y2)], fill=color)

def draw_arrow_right(x1, y1, x2, y2, color):
    """Horizontal arrow between boxes."""
    my = (y1 + y2) // 2
    draw.line([x1, my, x2, my], fill=color, width=3)
    draw.polygon([(x2-12, my-8), (x2-12, my+8), (x2, my)], fill=color)

# Layout
col1_x = 60    # Client
col2_x = 360   # Controller
col3_x = 660   # Service
col4_x = 960   # Repository
col5_x = 1260  # DB

box_w = 260
box_h = 100
row_y = 120
gap = 160

# ── Top: CONTRÔLEUR ──
bx, by = col2_x, row_y
draw_box(bx, by, box_w, box_h, blue, "REST Controllers", "@RestController")
draw.text((bx + 15, by + 70), "Spring Web MVC", fill=slate)

# ── Top: SERVICES ──
bx, by = col3_x, row_y
draw_box(bx, by, box_w, box_h, green, "Services", "@Service")
draw.text((bx + 15, by + 70), "Logique métier", fill=slate)

# ── Top: MODÈLES ──
bx, by = col4_x, row_y
draw_box(bx, by, box_w, box_h, amber, "Entités JPA", "@Entity")
draw.text((bx + 15, by + 70), "Modèle de données", fill=slate)

# ── Bottom: CLIENTS (left) ──
bx, by = col1_x, row_y + gap + 80
draw_box(bx, by, box_w + 40, 140, cyan, "Clients", "")
draw.text((bx + 15, by + 40), "🖥 Web Admin", fill=white)
draw.text((bx + 15, by + 68), "(Ionic/Angular)", fill=slate)
draw.text((bx + 15, by + 100), "📱 App Mobile", fill=white)

# ── Bottom: BASE DE DONNÉES (right) ──
bx, by = col5_x, row_y + gap + 80
draw_box(bx, by, box_w, 140, amber, "Base de données", "")
draw.text((bx + 15, by + 40), "🐘 PostgreSQL", fill=white)
draw.text((bx + 15, by + 68), "Hibernate/JPA", fill=slate)
draw.text((bx + 15, by + 100), "Spring Data", fill=slate)

# ── JWT box ──
bx, by = col1_x, row_y
draw_box(bx, by, box_w + 40, box_h, slate, "Sécurité", "")
draw.text((bx + 15, by + 40), "Spring Security + JWT", fill=white)

# ── Arrows ──
# Client -> Controller
draw_arrow_right(col1_x + box_w + 40, row_y + box_h//2 + gap + 80 + 70, col2_x, row_y + box_h//2 + gap + 80 + 70, white)

# Controller <-> Service (bi-directional)
draw_arrow_right(col2_x + box_w, row_y + 50, col3_x, row_y + 50, white)
draw.line([col3_x, row_y + 80, col2_x + box_w, row_y + 80], fill=white, width=3)
draw.polygon([(col2_x + box_w + 12, row_y + 72), (col2_x + box_w + 12, row_y + 88), (col2_x + box_w, row_y + 80)], fill=white)

# Service -> Repository
draw_arrow_right(col3_x + box_w, row_y + 50, col4_x, row_y + 50, white)

# Repository -> Database
draw_arrow_right(col4_x + box_w, row_y + 50, col5_x, row_y + 50, white)

# Vertical: MVC label on the left
draw.text((20, 200), "M", fill=blue)
draw.text((20, 260), "V", fill=cyan)
draw.text((20, 310), "C", fill=green)

# Save
path = os.path.join(BASE, 'architecture_mvc.png')
img.save(path)
print(f"MVC architecture saved to {path}")
