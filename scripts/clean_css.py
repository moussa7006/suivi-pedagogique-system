import os
import re

directory = 'frontend-ionic/src/app/mobile-teacher'

def clean_css_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as file:
        lines = file.readlines()

    cleaned_lines = []
    
    in_keyframes = False
    brace_count = 0
    
    for line in lines:
        if '@keyframes' in line:
            in_keyframes = True
            brace_count = line.count('{') - line.count('}')
            continue
            
        if in_keyframes:
            brace_count += line.count('{') - line.count('}')
            if brace_count <= 0:
                in_keyframes = False
            continue

        if 'animation:' in line or 'animation-delay:' in line or 'animation-fill-mode:' in line:
            continue
            
        cleaned_lines.append(line)
        
    full_text = "".join(cleaned_lines)
    
    # Remplacer les dégradés multi-lignes par des couleurs unies
    full_text = re.sub(r'background(?:-image)?:\s*(?:linear|radial)-gradient\([^;]+;', 'background: #2563eb;', full_text)
    full_text = re.sub(r'--background(?:-hover|-activated)?:\s*(?:linear|radial)-gradient\([^;]+;', '--background: #2563eb;', full_text)
    full_text = re.sub(r'--accent-vibrant:\s*(?:linear|radial)-gradient\([^;]+;', '--accent-vibrant: #2563eb;', full_text)
    
    # Nettoyer les propriétés custom ionic si elles ont des gradients
    full_text = re.sub(r'--background:\s*(?:linear|radial)-gradient\([^;]+;', '--background: #f0f4f8;', full_text)

    with open(filepath, 'w', encoding='utf-8') as file:
        file.write(full_text)

for root, dirs, files in os.walk(directory):
    for file in files:
        if file.endswith('.scss'):
            filepath = os.path.join(root, file)
            # Ne pas toucher aux fichiers qu'on a déjà designés proprement
            if 'login.page.scss' in filepath or 'forgot-password.page.scss' in filepath:
                continue
            clean_css_file(filepath)

print("CSS nettoyé avec succès !")
