"""Create a green arrow PNG for slide 2."""
from PIL import Image, ImageDraw

size = 400
img = Image.new('RGBA', (size, size), (0, 0, 0, 0))
draw = ImageDraw.Draw(img)

# Green arrow pointing right
green = (34, 197, 94, 255)  # #22C55E
margin = 60
# Arrow body
draw.polygon([
    (margin, size//2 - 60),      # top left
    (size - margin - 40, size//2 - 60),  # top right before tip
    (size - margin - 40, size//2 - 120), # top of arrow head
    (size - margin, size//2),           # tip
    (size - margin - 40, size//2 + 120), # bottom of arrow head
    (size - margin - 40, size//2 + 60),  # bottom right before tip
    (margin, size//2 + 60),       # bottom left
], fill=green)

BASE = r'C:\Users\boura\OneDrive\Documents\suivi-pedagogique-system\MEMOIRE'
path = BASE + '\\arrow_right.png'
img.save(path)
print(f"Arrow saved to {path}")
