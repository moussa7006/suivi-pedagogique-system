import zipfile
import xml.etree.ElementTree as ET

ns = {'a': 'http://schemas.openxmlformats.org/drawingml/2006/main'}
with zipfile.ZipFile('La finalisima present_V11_before_white_redesign.pptx') as z:
    for i in range(1, 10):
        root = ET.fromstring(z.read(f'ppt/slides/slide{i}.xml'))
        texts = []
        for p in root.findall('.//a:p', ns):
            text = ''.join(t.text or '' for t in p.findall('.//a:t', ns)).strip()
            if text:
                texts.append(text)
        print(f'--- SLIDE {i} ---')
        print(' | '.join(texts))
