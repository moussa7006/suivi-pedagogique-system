"""
REBUILD FINAL from backup with ALL modifications applied.
Slide 1 and Slide 5 stay ORIGINAL from backup.
"""
import os
import copy
from lxml import etree
from pptx import Presentation
from pptx.util import Emu
from pptx.dml.color import RGBColor
from pptx.oxml.ns import qn

BASE = r'C:\Users\boura\OneDrive\Documents\suivi-pedagogique-system\MEMOIRE'
INPUT = os.path.join(BASE, 'La finalisima present_backup.pptx')
OUTPUT = os.path.join(BASE, 'La finalisima present_V9.pptx')

# Image paths
FICHE_ICON = os.path.join(BASE, 'fiche_progression_icon.png')
CHECK_ICON = os.path.join(BASE, 'check_icon.png')
PLANIFIER_ICON = os.path.join(BASE, 'planifier_icon.png')
QRCODE_ICON = os.path.join(BASE, 'qrcode_icon.png')
SIGNATURE_ICON = os.path.join(BASE, 'signature_icon.png')
CLOCK_ICON = os.path.join(BASE, 'clock_icon.png')
ARCH_SIMPLE = os.path.join(BASE, 'architecture_simple.png')
ICONE_CENTRALISER = os.path.join(BASE, 'icone_centraliser.png')
ICONE_FIABILISER = os.path.join(BASE, 'icone_fiabiliser.png')
ICONE_AUTOMATISER = os.path.join(BASE, 'icone_automatiser.png')
ARROW_ICON = os.path.join(BASE, 'arrow_right.png')

prs = Presentation(INPUT)
print(f"Loaded backup: {len(prs.slides)} slides")

# ================================================================
# SLIDE 1: Just remove "BIENVENUE" and "Soutenance", put names caps
# ================================================================
slide1 = prs.slides[0]
for shape in list(slide1.shapes):
    if shape.has_text_frame:
        text = shape.text_frame.text
        if 'BIENVENUE' in text or 'Soutenance de Projet' in text:
            shape._element.getparent().remove(shape._element)
            print(f"Slide 1: removed '{text[:50]}'")

# Fix Text 8 (names): make caps if not already
for shape in slide1.shapes:
    if shape.name == 'Text 8':
        for p in shape.text_frame.paragraphs:
            for run in p.runs:
                run.font.bold = True
    if shape.name == 'Text 11':
        for p in shape.text_frame.paragraphs:
            for run in p.runs:
                run.font.bold = True

print("Slide 1: cleaned (original layout kept)")

# ================================================================
# SLIDE 2: Replace old "Apres" center/right with "Objectifs"
# ================================================================
slide2 = prs.slides[1]
# Delete center+right elements (old OBJECTIF, Apres items, etc.)
to_delete = ['Text 10', 'Shape 20', 'Shape 21', 'Text 22', 'Text 23',
             'Shape 24', 'Image 4', 'Text 25', 'Text 26',
             'Shape 27', 'Image 5', 'Text 28', 'Text 29',
             'Shape 30', 'Image 6', 'Text 31', 'Text 32']
for shape in list(slide2.shapes):
    if shape.name in to_delete:
        shape._element.getparent().remove(shape._element)

# Add "Objectifs" title
title_box = slide2.shapes.add_textbox(5500000, 1325880, 3474720, 320040)
p = title_box.text_frame.paragraphs[0]
p.text = 'Objectifs'
run = p.runs[0]
run.font.size = Emu(215900)
run.font.bold = True
run.font.color.rgb = RGBColor(0x22, 0xC5, 0x5E)

# 3 items
ITEMS = [
    {'y': 1810512, 'icon': ICONE_CENTRALISER, 'title': 'Centraliser', 'sub': 'Tout au meme endroit'},
    {'y': 2926080, 'icon': ICONE_FIABILISER, 'title': 'Fiabiliser', 'sub': 'Donnees verifiees'},
    {'y': 4041648, 'icon': ICONE_AUTOMATISER, 'title': 'Automatiser', 'sub': 'Calculs et rapports'},
]

for item in ITEMS:
    y = item['y']
    box = slide2.shapes.add_shape(1, 5500000, y, 3474720, 914400)  # ROUNDED_RECT
    box.fill.solid()
    box.fill.fore_color.rgb = RGBColor(0x17, 0x20, 0x33)
    box.line.color.rgb = RGBColor(0x10, 0xB9, 0x81)
    box.line.width = Emu(14605)
    slide2.shapes.add_picture(item['icon'], 5500000 + 201168, y + 45720, 786384, 786384)
    tb = slide2.shapes.add_textbox(5500000 + 1143000, y + 237744, 2100000, 256032)
    pt = tb.text_frame.paragraphs[0]
    pt.text = item['title']
    rt = pt.runs[0]
    rt.font.size = Emu(215900)
    rt.font.bold = True
    rt.font.color.rgb = RGBColor(0xFF, 0xFF, 0xFF)
    tb2 = slide2.shapes.add_textbox(5500000 + 1143000, y + 565000, 2100000, 219456)
    ps = tb2.text_frame.paragraphs[0]
    ps.text = item['sub']
    rs = ps.runs[0]
    rs.font.size = Emu(158750)
    rs.font.color.rgb = RGBColor(0x94, 0xA3, 0xB8)

# Add arrow between Avant and Apres
slide2.shapes.add_picture(ARROW_ICON, 4300000, 3000000, 800000, 500000)
print("Slide 2: rebuilt with Objectifs + arrow")

# ================================================================
# SLIDE 3 (index 2): Change fiche progression icon
# ================================================================
slide3 = prs.slides[2]
for shape in list(slide3.shapes):
    if shape.name == 'Image 4':
        l, t, w, h = shape.left, shape.top, shape.width, shape.height
        shape._element.getparent().remove(shape._element)
        slide3.shapes.add_picture(FICHE_ICON, l, t, w, h)
        print("Slide 3: fiche progression icon replaced")
        break

# ================================================================
# SLIDE 4 (index 3): Replace icons - Git->check, Planifier, QR Code
# ================================================================
slide4 = prs.slides[3]
for shape in list(slide4.shapes):
    if shape.name == 'Image 4' and shape.left > 8000000:
        l, t, w, h = shape.left, shape.top, shape.width, shape.height
        shape._element.getparent().remove(shape._element)
        slide4.shapes.add_picture(CHECK_ICON, l, t, w, h)
        print("Slide 4: Valider -> check icon")
    elif shape.name == 'Image 1':
        l, t, w, h = shape.left, shape.top, shape.width, shape.height
        shape._element.getparent().remove(shape._element)
        slide4.shapes.add_picture(PLANIFIER_ICON, l, t, w, h)
        print("Slide 4: Planifier -> calendar icon")
    elif shape.name == 'Image 2':
        l, t, w, h = shape.left, shape.top, shape.width, shape.height
        shape._element.getparent().remove(shape._element)
        slide4.shapes.add_picture(QRCODE_ICON, l, t, w, h)
        print("Slide 4: QR Code -> QR icon")

# ================================================================
# SLIDE 5 (index 4): Replace architecture with SIMPLE version
# ================================================================
slide5 = prs.slides[4]
for shape in list(slide5.shapes):
    if shape.name == 'Image 1':
        l, t, w, h = shape.left, shape.top, shape.width, shape.height
        shape._element.getparent().remove(shape._element)
        slide5.shapes.add_picture(ARCH_SIMPLE, l, t, w, h)
        print("Slide 5: Architecture -> simple version (Frontend/API/Donnees)")
        break

# ================================================================
# SLIDE 7 (index 6): DELETE (old "Espace mobile enseignant")
# ================================================================
slide7 = prs.slides[6]
rId = prs.slides._sldIdLst[6].get(qn('r:id'))
prs.slides._sldIdLst.remove(prs.slides._sldIdLst[6])
prs.part.drop_rel(rId)
# Remove the actual slide from sld list
print("Slide 7 (index 6): deleted")

# ================================================================
# SLIDE 8 (was 9, now index 7): Perspectives - Signature icon
# ================================================================
slide8 = prs.slides[7]
for shape in list(slide8.shapes):
    if shape.name == 'Image 7':
        l, t, w, h = shape.left, shape.top, shape.width, shape.height
        shape._element.getparent().remove(shape._element)
        slide8.shapes.add_picture(SIGNATURE_ICON, l, t, w, h)
        print("Slide 8: Signature icon added")
    # Change perspective text
    if shape.has_text_frame and shape.text == 'Cloud / Déploiement':
        shape.text = ''
        print("Slide 8: removed old Cloud/Deploiement text")
    if shape.name == 'Text 31':
        shape.text = 'Signature'
        print("Slide 8: new text -> Signature")
    if shape.name == 'Text 32':
        shape.text = 'Enseignants'
        print("Slide 8: new text -> Enseignants")

# Also change the honoraires icon in Conclusion section
for shape in list(slide8.shapes):
    if shape.name == 'Image 3':
        l, t, w, h = shape.left, shape.top, shape.width, shape.height
        shape._element.getparent().remove(shape._element)
        slide8.shapes.add_picture(CLOCK_ICON, l, t, w, h)
        print("Slide 8: Honoraires -> clock icon")

# ================================================================
# SLIDE 9 (was 10, now index 8): Remove "Questions / reponses"
# ================================================================
slide9 = prs.slides[8]
for shape in list(slide9.shapes):
    if shape.has_text_frame and 'Questions' in shape.text_frame.text:
        shape._element.getparent().remove(shape._element)
        print("Slide 9: 'Questions / reponses' removed")
        break

# ================================================================
# UPDATE SLIDE NUMBERS
# ================================================================
for i, slide in enumerate(prs.slides):
    slide_num = i + 1
    for shape in slide.shapes:
        if shape.has_text_frame:
            text = shape.text_frame.text
            if '/' in text and len(text) < 10:
                # Try to find slide number text
                try:
                    parts = text.strip().split('/')
                    if parts[0].strip().isdigit():
                        for p in shape.text_frame.paragraphs:
                            p.text = f'{slide_num} / {len(prs.slides)}'
                            for run in p.runs:
                                run.font.color.rgb = RGBColor(0x94, 0xA3, 0xB8)
                except:
                    pass

print(f"\nUpdated slide numbers to /{len(prs.slides)}")

# ================================================================
# SAVE
# ================================================================
prs.save(OUTPUT)
print(f"\n✅ DONE -> {OUTPUT}")
print(f"Total slides: {len(prs.slides)}")
