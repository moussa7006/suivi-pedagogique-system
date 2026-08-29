from pathlib import Path
from zipfile import ZIP_DEFLATED, ZipFile
from xml.etree import ElementTree as ET

SOURCE = Path('La finalisima present_V20.before-v14-conclusion.pptx')
REFERENCE = Path('La finalisima present_V14.pptx')
OUTPUT = Path('La finalisima present_V21.pptx')

SLIDE_TARGET = 'ppt/slides/slide12.xml'
RELS_TARGET = 'ppt/slides/_rels/slide12.xml.rels'
SLIDE_REFERENCE = 'ppt/slides/slide8.xml'
RELS_REFERENCE = 'ppt/slides/_rels/slide8.xml.rels'
REL_NS = {'r': 'http://schemas.openxmlformats.org/package/2006/relationships'}

with ZipFile(SOURCE, 'r') as source_zip, ZipFile(REFERENCE, 'r') as reference_zip:
    target_entries = {name: source_zip.read(name) for name in source_zip.namelist()}
    reference_relationships = ET.fromstring(reference_zip.read(RELS_REFERENCE))

    # The two decks originate from the same template. Reuse V14's original slide
    # XML and relationship map, while omitting its optional speaker notes relation.
    kept_relationships = []
    for relationship in reference_relationships:
        if relationship.attrib['Type'].endswith('/notesSlide'):
            continue
        kept_relationships.append(relationship)
        if relationship.attrib['Type'].endswith('/image'):
            media_name = 'ppt/media/' + relationship.attrib['Target'].split('/')[-1]
            target_entries[media_name] = reference_zip.read(media_name)

    relationships_root = ET.Element(reference_relationships.tag)
    for relationship in kept_relationships:
        relationships_root.append(relationship)

    target_entries[SLIDE_TARGET] = reference_zip.read(SLIDE_REFERENCE)
    target_entries[RELS_TARGET] = ET.tostring(
        relationships_root,
        encoding='UTF-8',
        xml_declaration=True,
    )

    # V14 uses SVG icons. Add the matching package content type when the current
    # deck does not already define it.
    content_types = ET.fromstring(target_entries['[Content_Types].xml'])
    content_ns = 'http://schemas.openxmlformats.org/package/2006/content-types'
    has_svg_default = any(
        child.tag == f'{{{content_ns}}}Default' and child.attrib.get('Extension') == 'svg'
        for child in content_types
    )
    if not has_svg_default:
        ET.SubElement(content_types, f'{{{content_ns}}}Default', {
            'Extension': 'svg',
            'ContentType': 'image/svg+xml',
        })
    target_entries['[Content_Types].xml'] = ET.tostring(
        content_types,
        encoding='UTF-8',
        xml_declaration=True,
    )

    # Do not preserve duplicates present in a pre-existing Office archive.
    with ZipFile(OUTPUT, 'w', ZIP_DEFLATED) as output_zip:
        for name, data in target_entries.items():
            output_zip.writestr(name, data)

print(f'Created exact V14 conclusion slide: {OUTPUT}')
