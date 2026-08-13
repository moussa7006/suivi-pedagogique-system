"""Redesign slide 1: centered, clean, professional."""
import os
from pptx import Presentation
from pptx.util import Emu
from pptx.dml.color import RGBColor

BASE = r'C:\Users\boura\OneDrive\Documents\suivi-pedagogique-system\MEMOIRE'
INPUT = os.path.join(BASE, 'temp_v4_read.pptx')
OUTPUT = os.path.join(BASE, 'La finalisima present_V6.pptx')

prs = Presentation(INPUT)
slide = prs.slides[0]

SLIDE_W = 12191695
SLIDE_H = 6858000
CENTER_X = SLIDE_W // 2

# Color palette
DARK_BG = RGBColor(0x0F, 0x17, 0x2A)   # #0F172A
GREEN = RGBColor(0x22, 0xC5, 0x5E)      # #22C55E
WHITE = RGBColor(0xFF, 0xFF, 0xFF)
SLATE = RGBColor(0x94, 0xA3, 0xB8)      # #94A3B8 slate-400
SLATE_LIGHT = RGBColor(0x64, 0x74, 0x8B) # #64748B
BOX_BG = RGBColor(0x17, 0x20, 0x33)     # #172033
BOX_BORDER = RGBColor(0x33, 0x42, 0x55) # #334255

# =============================================
# 1. DELETE desktop/phone images (shapes 13-16)
# =============================================
to_delete = ['Shape 8', 'Image 2', 'Shape 9']
# Note: there are TWO "Image 2" shapes (indices 14 and 16)
# and TWO "Shape 9" shapes (indices 10 and 15)
# Shape 10 is the right bottom box for director - KEEP it
# Shape 15 is the small rect next to phone - DELETE
# Image 2 at index 14 (big mockup) - DELETE
# Image 2 at index 16 (phone) - DELETE

deleted_count = 0
for shape in list(slide.shapes):
    # Delete: the big rectangle (Shape 8), the mockup images, and the small rect
    if shape.name == 'Shape 8' and shape.left > 6000000 and shape.top < 2000000:
        shape._element.getparent().remove(shape._element)
        deleted_count += 1
        print(f"Deleted: Shape 8 (rectangle for mockup)")
    # Big mockup image
    elif shape.name == 'Image 2' and shape.left > 6000000 and shape.top < 2000000:
        shape._element.getparent().remove(shape._element)
        deleted_count += 1
        print(f"Deleted: Image 2 (desktop+phone mockup)")
    # Small rect for phone
    elif shape.name == 'Shape 9' and shape.left > 10000000:
        shape._element.getparent().remove(shape._element)
        deleted_count += 1
        print(f"Deleted: Shape 9 (small rect)")
    # Phone image
    elif shape.name == 'Image 2' and shape.left > 10000000:
        shape._element.getparent().remove(shape._element)
        deleted_count += 1
        print(f"Deleted: Image 2 (phone)")

# =============================================
# 2. CENTER all text elements
# =============================================
# Text 3: "PROJET DE FIN DE CYCLE" -> center
for shape in slide.shapes:
    if shape.name == 'Text 3':
        shape.left = CENTER_X - 3000000  # width ~6M
        shape.top = 900000
        p = shape.text_frame.paragraphs[0]
        p.alignment = 1  # CENTER
        for run in p.runs:
            run.font.color.rgb = GREEN
            run.font.size = Emu(240000)  # 19pt
            run.font.bold = False
        print("Text 3: centered 'PROJET DE FIN DE CYCLE'")

    elif shape.name == 'Text 4':
        # "EduTrack" BIG title
        shape.left = CENTER_X - 4600000
        shape.top = 1300000
        shape.width = 9200000
        p = shape.text_frame.paragraphs[0]
        p.alignment = 1  # CENTER
        for run in p.runs:
            run.font.color.rgb = WHITE
            run.font.size = Emu(950000)  # ~75pt
            run.font.bold = True
        print("Text 4: centered 'EduTrack'")

    elif shape.name == 'Text 5':
        # Description centered
        shape.left = CENTER_X - 5100000
        shape.top = 2500000
        shape.width = 10200000
        for p in shape.text_frame.paragraphs:
            p.alignment = 1  # CENTER
            for run in p.runs:
                run.font.color.rgb = SLATE
                run.font.size = Emu(175000)  # ~14pt
        print("Text 5: centered description")

# =============================================
# 3. REDESIGN bottom: two centered boxes
# =============================================
BOX_W = 4000000
BOX_H = 950000
BOX_Y = 5300000
GAP = 200000
TOTAL_W = BOX_W * 2 + GAP
START_X = CENTER_X - TOTAL_W // 2

# Left box: "Présenté par"
for shape in list(slide.shapes):
    if shape.name == 'Shape 6':
        # Reposition the left dark box
        shape.left = START_X
        shape.top = BOX_Y
        shape.width = BOX_W
        shape.height = BOX_H
        print("Shape 6: repositioned left box")
    
    elif shape.name == 'Text 7':
        # "Présenté par" label
        shape.left = START_X + 150000
        shape.top = BOX_Y + 100000
        shape.width = BOX_W - 300000
        shape.height = 200000
        for p in shape.text_frame.paragraphs:
            for run in p.runs:
                run.font.color.rgb = SLATE_LIGHT
                run.font.size = Emu(140000)
        print("Text 7: 'Présenté par' repositioned")

    elif shape.name == 'Text 8':
        # Names
        shape.left = START_X + 150000
        shape.top = BOX_Y + 350000
        shape.width = BOX_W - 300000
        shape.height = 500000
        for p in shape.text_frame.paragraphs:
            for run in p.runs:
                run.font.color.rgb = WHITE
                run.font.size = Emu(190000)
                run.font.bold = True
        print("Text 8: names repositioned")

# Right box: "Sous la direction de"
for shape in list(slide.shapes):
    if shape.name == 'Shape 9' and shape.left < 10000000:  # the director box, not the deleted one
        shape.left = START_X + BOX_W + GAP
        shape.top = BOX_Y
        shape.width = BOX_W
        shape.height = BOX_H
        print("Shape 9: repositioned director box")

    elif shape.name == 'Text 10':
        shape.left = START_X + BOX_W + GAP + 150000
        shape.top = BOX_Y + 100000
        shape.width = BOX_W - 300000
        shape.height = 200000
        for p in shape.text_frame.paragraphs:
            for run in p.runs:
                run.font.color.rgb = SLATE_LIGHT
                run.font.size = Emu(140000)
        print("Text 10: 'Sous la direction' repositioned")

    elif shape.name == 'Text 11':
        shape.left = START_X + BOX_W + GAP + 150000
        shape.top = BOX_Y + 350000
        shape.width = BOX_W - 300000
        shape.height = 500000
        for p in shape.text_frame.paragraphs:
            for run in p.runs:
                run.font.color.rgb = WHITE
                run.font.size = Emu(190000)
                run.font.bold = True
        print("Text 11: director name repositioned")

# =============================================
# 4. Add a subtle separator line under title
# =============================================
from pptx.enum.shapes import MSO_SHAPE
line = slide.shapes.add_shape(
    MSO_SHAPE.RECTANGLE,
    CENTER_X - 2500000,  # left
    2380000,              # top
    5000000,              # width
    30000                 # height (thin line)
)
line.fill.solid()
line.fill.fore_color.rgb = GREEN
line.line.fill.background()
print("Added green separator line under EduTrack")

# =============================================
# 5. Adjust decor circles to be more subtle
# =============================================
for shape in slide.shapes:
    if shape.name == 'Shape 0':
        try:
            shape.fill.fore_color.rgb = RGBColor(0x12, 0x1C, 0x35)
        except:
            pass
    if shape.name == 'Shape 1':
        try:
            shape.fill.fore_color.rgb = RGBColor(0x12, 0x1C, 0x35)
        except:
            pass

prs.save(OUTPUT)
print(f"\n✅ SUCCESS -> {OUTPUT}")
