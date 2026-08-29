from copy import deepcopy
from io import BytesIO
from pathlib import Path
import re

from pptx import Presentation
from pptx.enum.shapes import MSO_SHAPE_TYPE
from pptx.util import Inches

SOURCE = Path('La finalisima present_V20.before-v14-conclusion.pptx')
REFERENCE = Path('La finalisima present_V14.pptx')
OUTPUT = Path('La finalisima present_V21.pptx')


def clear_slide(slide):
    tree = slide.shapes._spTree
    for shape in list(slide.shapes):
        tree.remove(shape._element)


def copy_text_style(source_shape, target_shape):
    source_tf = source_shape.text_frame
    target_tf = target_shape.text_frame
    target_tf.clear()
    target_tf.margin_left = source_tf.margin_left
    target_tf.margin_right = source_tf.margin_right
    target_tf.margin_top = source_tf.margin_top
    target_tf.margin_bottom = source_tf.margin_bottom
    target_tf.vertical_anchor = source_tf.vertical_anchor
    target_tf.word_wrap = source_tf.word_wrap

    for index, source_p in enumerate(source_tf.paragraphs):
        target_p = target_tf.paragraphs[0] if index == 0 else target_tf.add_paragraph()
        target_p.alignment = source_p.alignment
        target_p.level = source_p.level
        target_p.space_before = source_p.space_before
        target_p.space_after = source_p.space_after
        target_p.line_spacing = source_p.line_spacing
        for source_run in source_p.runs:
            target_run = target_p.add_run()
            target_run.text = source_run.text
            target_run.font.name = source_run.font.name
            target_run.font.size = source_run.font.size
            target_run.font.bold = source_run.font.bold
            target_run.font.italic = source_run.font.italic
            target_run.font.underline = source_run.font.underline
            try:
                target_run.font.color.rgb = source_run.font.color.rgb
            except (AttributeError, TypeError):
                pass


def copy_shape(source_shape, target_slide):
    if source_shape.shape_type == MSO_SHAPE_TYPE.PICTURE:
        target_slide.shapes.add_picture(
            BytesIO(source_shape.image.blob),
            source_shape.left,
            source_shape.top,
            source_shape.width,
            source_shape.height,
        )
        return

    # Shapes other than pictures (groups, text boxes, icons and auto shapes) can be
    # copied as XML because they do not need external media relationships.
    target_slide.shapes._spTree.insert_element_before(
        deepcopy(source_shape._element),
        'p:extLst',
    )


current = Presentation(SOURCE)
reference = Presentation(REFERENCE)
target_slide = current.slides[-2]
reference_slide = reference.slides[-2]

clear_slide(target_slide)
for source_shape in reference_slide.shapes:
    copy_shape(source_shape, target_slide)

# The inherited V14 slide number is 08 / 09. It must match the 13-slide deck.
for shape in target_slide.shapes:
    if not getattr(shape, 'has_text_frame', False):
        continue
    for paragraph in shape.text_frame.paragraphs:
        for run in paragraph.runs:
            if re.fullmatch(r'\d{1,2}\s*/\s*\d{1,2}', run.text.strip()):
                run.text = '12 / 13'

current.save(OUTPUT)
print(f'Created: {OUTPUT}')
