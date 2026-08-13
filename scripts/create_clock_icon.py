"""Create clock icon and replace honoraires icon on slide 8."""
from PIL import Image, ImageDraw

# Create a clock icon (200x200)
size = 200
img = Image.new('RGBA', (size, size), (0, 0, 0, 0))
draw = ImageDraw.Draw(img)

# Circle background
margin = 15
draw.ellipse([margin, margin, size - margin, size - margin], fill=(22, 163, 74, 255))  # #16A34A green

# White circle inside
inner_margin = 25
draw.ellipse([inner_margin, inner_margin, size - inner_margin, size - inner_margin], 
             outline=(255, 255, 255, 255), width=6, fill=None)

# Hour hand
center = size // 2
# Hour hand pointing to 10 o'clock (shorter)
draw.line([center, center, center - 35, center - 50], fill=(255, 255, 255, 255), width=7)
# Minute hand pointing to 2 o'clock (longer)
draw.line([center, center, center + 55, center - 30], fill=(255, 255, 255, 255), width=5)
# Center dot
draw.ellipse([center - 8, center - 8, center + 8, center + 8], fill=(255, 255, 255, 255))

# Save
BASE = r'C:\Users\boura\OneDrive\Documents\suivi-pedagogique-system\MEMOIRE'
path = BASE + r'\clock_icon.png'
img.save(path)
print(f"Clock icon saved to {path}")
