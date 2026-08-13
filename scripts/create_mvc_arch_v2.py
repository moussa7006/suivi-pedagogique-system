"""
Create a better, visible MVC architecture diagram for EduTrack
"""
from PIL import Image, ImageDraw, ImageFont
import os

BASE = r'C:\Users\boura\OneDrive\Documents\suivi-pedagogique-system\MEMOIRE'
W, H = 1600, 1100
img = Image.new('RGBA', (W, H), (23, 32, 51, 255))
draw = ImageDraw.Draw(img)

# Colors
GREEN = (16, 185, 129, 255)
BLUE = (59, 130, 246, 255)
ORANGE = (249, 115, 22, 255)
WHITE = (255, 255, 255, 255)
GRAY = (148, 163, 184, 255)
DARK_BG = (30, 41, 59, 255)

FONT_DIR = "C:/Windows/Fonts"
try:
    font_title = ImageFont.truetype(os.path.join(FONT_DIR, "segoeuib.ttf"), 40)
    font_subtitle = ImageFont.truetype(os.path.join(FONT_DIR, "segoeuib.ttf"), 26)
    font_small = ImageFont.truetype(os.path.join(FONT_DIR, "segoeuib.ttf"), 22)
    font_tiny = ImageFont.truetype(os.path.join(FONT_DIR, "segoeui.ttf"), 17)
except:
    font_title = ImageFont.load_default()
    font_subtitle = font_title
    font_small = font_title
    font_tiny = font_title

def draw_styled_box(draw, x, y, w, h, title, items, color, icon_char):
    r = 18
    # Shadow
    draw.rounded_rectangle((x+4, y+4, x+w+4, y+h+4), r, fill=(0,0,0,80))
    # Box
    draw.rounded_rectangle((x, y, x+w, y+h), r, fill=DARK_BG, outline=color, width=3)

    # Header
    hdr = 52
    draw.rounded_rectangle((x, y, x+w, y+hdr), r, fill=color)
    # Cover bottom corners of header
    for cover_x in [x+2, x+w-2]:
        draw.rectangle((cover_x-8, y+hdr-12, cover_x+8, y+hdr+4), fill=color)

    draw.text((x+18, y+10), title, fill=WHITE, font=font_subtitle)

    # Icon circle
    cx, cy = x + 28, y + hdr + 18
    draw.ellipse((cx, cy, cx+44, cy+44), fill=color, outline=WHITE, width=2)
    # Simple icon using text
    draw.text((cx+10, cy+8), icon_char, fill=WHITE, font=font_subtitle)

    # Items
    iy = cy + 55
    for item in items:
        draw.ellipse((x+25, iy+6, x+33, iy+14), fill=color)
        draw.text((x+42, iy-2), item, fill=GRAY, font=font_small)
        iy += 30

# ====== TITLE ======
title = "ARCHITECTURE MVC — EduTrack"
tx = (W - draw.textlength(title, font_title)) // 2
draw.text((tx, 20), title, fill=WHITE, font=font_title)
draw.line((tx, 68, tx+draw.textlength(title, font_title), 68), fill=GREEN, width=3)

# ====== BOX LAYOUT ======
box_w, box_h = 450, 580
box_y = 115
gap = 50
total_w = box_w * 3 + gap * 2
start_x = (W - total_w) // 2

# BOX 1: FRONTEND
draw_styled_box(draw, start_x, box_y, box_w, box_h,
    "VUE (Frontend)",
    ["Dashboard Admin Web", "Application Mobile", "Scan QR Code", "Écran Public Salle", "ApexCharts / Stats"],
    BLUE, "▶")

# BOX 2: BACKEND
draw_styled_box(draw, start_x + box_w + gap, box_y, box_w, box_h,
    "Contrôleur / Modèle",
    ["API REST Spring Boot", "Sécurité JWT", "Emplois du Temps", "Émargement & Fiches", "Honoraires & Exports"],
    GREEN, "⚙")

# BOX 3: DATABASE
draw_styled_box(draw, start_x + (box_w + gap) * 2, box_y, box_w, box_h,
    "Base de Données",
    ["PostgreSQL", "JPA / Hibernate", "Utilisateurs & Rôles", "Séances & Planning", "Export Excel / PDF"],
    ORANGE, "⬢")

# ====== ARROWS ======
mid_y = box_y + box_h // 2

# Forward arrows (top)
fy = mid_y - 50
# FE -> BE
a1_end = start_x + box_w + gap - 5
a1_start = start_x + box_w + 10
draw.line((a1_start, fy, a1_end, fy), fill=GREEN, width=4)
draw.polygon([(a1_end, fy), (a1_end-18, fy-10), (a1_end-18, fy+10)], fill=GREEN)
draw.text((a1_start + 30, fy - 38), "HTTP REST", fill=GRAY, font=font_tiny)

# BE -> DB
a2_end = start_x + (box_w + gap) * 2 - 5
a2_start = start_x + box_w + gap + box_w + 10
draw.line((a2_start, fy, a2_end, fy), fill=ORANGE, width=4)
draw.polygon([(a2_end, fy), (a2_end-18, fy-10), (a2_end-18, fy+10)], fill=ORANGE)
draw.text((a2_start + 30, fy - 38), "JDBC / JPA", fill=GRAY, font=font_tiny)

# Response arrows (bottom)
ry = mid_y + 50
# BE -> FE
draw.line((a1_end, ry, a1_start, ry), fill=GRAY, width=3)
draw.polygon([(a1_start, ry), (a1_start+18, ry-8), (a1_start+18, ry+8)], fill=GRAY)
draw.text((a1_start + 30, ry - 36), "JSON", fill=GRAY, font=font_tiny)

# DB -> BE
draw.line((a2_end, ry, a2_start, ry), fill=GRAY, width=3)
draw.polygon([(a2_start, ry), (a2_start+18, ry-8), (a2_start+18, ry+8)], fill=GRAY)
draw.text((a2_start + 30, ry - 36), "Données", fill=GRAY, font=font_tiny)

# ====== BOTTOM ======
tech_line = "Spring Boot 3.4  •  Angular 21  •  Ionic 8  •  PostgreSQL  •  JWT  •  PrimeNG"
tech_x = (W - draw.textlength(tech_line, font_tiny)) // 2
draw.text((tech_x, H - 55), tech_line, fill=GRAY, font=font_tiny)

note = "Architecture 3-tiers  •  Séparation des responsabilités  •  MVC Pattern"
note_x = (W - draw.textlength(note, font_small)) // 2
draw.text((note_x, box_y + box_h + 35), note, fill=GRAY, font=font_small)

output_path = os.path.join(BASE, 'architecture_mvc_v2.png')
img.save(output_path)
print(f"Created: {output_path}")
