"""Create ALL needed icons/architecture at once, then apply to V7 -> V8."""
import os
from PIL import Image, ImageDraw
from pptx import Presentation
from pptx.util import Emu
from pptx.dml.color import RGBColor

BASE = r'C:\Users\boura\OneDrive\Documents\suivi-pedagogique-system\MEMOIRE'
INPUT = os.path.join(BASE, 'temp_v7_read.pptx')

# ================================================================
# IMAGE 1: Planifier icon - calendar page
# ================================================================
def create_planifier_icon():
    s = 400
    img = Image.new('RGBA', (s, s), (0,0,0,0))
    d = ImageDraw.Draw(img)
    # Blue calendar
    d.rounded_rectangle([40, 20, s-40, s-40], radius=20, fill=(59, 130, 246, 255))  # #3B82F6
    # Top bar (darker)
    d.rectangle([40, 20, s-40, 100], fill=(37, 99, 235, 255))
    # Calendar lines
    for y in [140, 190, 240, 290]:
        d.rectangle([70, y, s-70, y+6], fill=(255,255,255,180))
    # Pen
    d.rectangle([s-80, s-120, s-50, s-20], fill=(251, 191, 36, 255))
    d.polygon([(s-80, s-20), (s-65, s-5), (s-50, s-20)], fill=(251, 191, 36, 255))
    return img

# ================================================================
# IMAGE 2: QR Code icon
# ================================================================
def create_qrcode_icon():
    s = 400
    img = Image.new('RGBA', (s, s), (0,0,0,0))
    d = ImageDraw.Draw(img)
    # White square
    d.rounded_rectangle([30, 30, s-30, s-30], radius=15, fill=(255, 255, 255, 255))
    # QR pattern - simplified
    black = (0, 0, 0, 255)
    # Top-left finder
    for bx, by in [(60,60), (260,60), (60,260)]:
        d.rectangle([bx, by, bx+50, by+50], fill=black)
        d.rectangle([bx+10, by+10, bx+40, by+40], fill=(255,255,255,255))
        d.rectangle([bx+15, by+15, bx+35, by+35], fill=black)
    # Random QR dots
    import random
    random.seed(42)
    for _ in range(18):
        x = random.randint(130, 280)
        y = random.randint(130, 280)
        if not (260 <= x <= 310 and 260 <= y <= 310):
            if not (60 <= x <= 110 and 130 <= y <= 180):
                if not (260 <= x <= 310 and 60 <= y <= 110):
                    if not (60 <= x <= 110 and 260 <= y <= 310):
                        d.rectangle([x, y, x+16, y+16], fill=black)
    return img

# ================================================================
# IMAGE 3: Architecture diagram - BRIGHT, VISIBLE, PROFESSIONAL
# ================================================================
def create_architecture():
    w, h = 2400, 800
    img = Image.new('RGBA', (w, h), (15, 23, 42, 255))  # slide bg
    d = ImageDraw.Draw(img)

    # Colors
    blue = (59, 130, 246, 255)
    green = (34, 197, 94, 255)
    amber = (245, 158, 11, 255)
    cyan = (6, 182, 212, 255)
    purple = (139, 92, 246, 255)
    white = (255, 255, 255, 255)
    slate = (148, 163, 184, 255)

    def box(x, y, bw, bh, color, title, *lines):
        # Shadow
        d.rounded_rectangle([x+4, y+4, x+bw+4, y+bh+4], radius=16, fill=(0,0,0,60))
        # Main box
        d.rounded_rectangle([x, y, x+bw, y+bh], radius=16, fill=color)
        # Title
        d.text((x + 20, y + 15), title, fill=white)
        # Lines
        for i, line in enumerate(lines):
            d.text((x + 20, y + 45 + i*35), line, fill=(255,255,255,200))

    def arrow_right(x1, x2, my, color):
        """Horizontal arrow."""
        d.line([x1, my, x2-20, my], fill=color, width=4)
        d.polygon([(x2-24, my-10), (x2-24, my+10), (x2-4, my)], fill=color)

    def arrow_down(mx, y1, y2, color):
        d.line([mx, y1, mx, y2-20], fill=color, width=4)
        d.polygon([(mx-10, y2-24), (mx+10, y2-24), (mx, y2-4)], fill=color)

    # ── Row 1: CLIENTS ──
    # Web Admin
    box(40, 80, 340, 140, blue, "Web Admin", "Navigateur")
    # Mobile App  
    box(420, 80, 340, 140, purple, "App Mobile", "Android / iOS")

    # ── Row 2: MIDDLEWARE ──
    # API Gateway
    box(200, 310, 400, 160, cyan, "REST API", "Spring Controllers", "JSON / HTTP")
    # Service Layer
    box(660, 310, 400, 160, green, "Services", "Logique métier", "Spring @Service")
    # Repository
    box(1120, 310, 400, 160, amber, "Data Access", "JPA Repositories", "Spring Data JPA")

    # ── Row 3: DB ──
    box(660, 560, 460, 160, amber, "PostgreSQL", "Base de données", "Hibernate ORM")

    # ── Security side ──
    box(1700, 310, 400, 160, (100, 116, 139, 255), "Securite", "Spring Security", "JWT Tokens")

    # ── Arrows ──
    # Clients to API
    arrow_down(210, 220, 310, white)
    arrow_down(590, 220, 310, white)
    # API to Service
    arrow_right(600, 660, 390, white)
    # Service to Data
    arrow_right(1060, 1120, 390, white)
    # Data to DB
    arrow_down(890, 470, 560, white)
    # API to Security (bi-di)
    arrow_right(600, 1900, 390, white)
    arrow_right(1700, 600, 350, white)

    # ── Labels ──
    d.text((160, 35), "CLIENTS", fill=slate)
    d.text((220, 265), "BACKEND (Spring Boot)", fill=slate)
    d.text((720, 520), "DONNEES", fill=slate)

    return img

# ─── SAVE IMAGES ───
print("Creating icons...")
planifier = create_planifier_icon()
planifier.save(os.path.join(BASE, 'planifier_icon.png'))
print("  planifier_icon.png")

qrcode = create_qrcode_icon()
qrcode.save(os.path.join(BASE, 'qrcode_icon.png'))
print("  qrcode_icon.png")

arch = create_architecture()
arch.save(os.path.join(BASE, 'architecture_pro.png'))
print("  architecture_pro.png")

# ================================================================
# APPLY TO POWERPOINT
# ================================================================
print("\nApplying to PowerPoint...")
prs = Presentation(INPUT)

# ── SLIDE 4: Replace icons ──
slide4 = prs.slides[3]
for shape in list(slide4.shapes):
    if shape.name == 'Image 1':
        left, top, w, h = shape.left, shape.top, shape.width, shape.height
        shape._element.getparent().remove(shape._element)
        slide4.shapes.add_picture(os.path.join(BASE, 'planifier_icon.png'), left, top, w, h)
        print("Slide 4: Planifier icon replaced (calendar)")
    elif shape.name == 'Image 2':
        left, top, w, h = shape.left, shape.top, shape.width, shape.height
        shape._element.getparent().remove(shape._element)
        slide4.shapes.add_picture(os.path.join(BASE, 'qrcode_icon.png'), left, top, w, h)
        print("Slide 4: QR Code icon replaced")

# ── SLIDE 5: Replace architecture ──
slide5 = prs.slides[4]
for shape in list(slide5.shapes):
    if shape.name == 'Image 1':
        left, top, w, h = shape.left, shape.top, shape.width, shape.height
        shape._element.getparent().remove(shape._element)
        slide5.shapes.add_picture(os.path.join(BASE, 'architecture_pro.png'), left, top, w, h)
        print("Slide 5: Architecture replaced with bright pro version")

OUTPUT = os.path.join(BASE, 'La finalisima present_V8.pptx')
prs.save(OUTPUT)
print(f"\n✅ -> {OUTPUT}")
