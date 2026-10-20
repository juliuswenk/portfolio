"""Run from the repository root with Python and Pillow; originals stay untouched."""
import json
from pathlib import Path
from PIL import Image
from image_attribution import apply_attribution

root = Path(__file__).resolve().parents[1]
projects = json.loads((root / 'projects.js').read_text().split('=', 1)[1].strip().rstrip(';'))
output = root / 'assets' / 'responsive'
output.mkdir(exist_ok=True)
manifest = {}
for project in projects:
    for photo in [project['hero'], *project['photos'], *project['detailImages']]:
        source = photo['src']
        if source in manifest:
            continue
        image = Image.open(root / source)
        variants = []
        for width in sorted({min(image.width, size) for size in (240, 480, 960, 1600)}):
            resized = image.resize((width, round(image.height * width / image.width)), Image.Resampling.LANCZOS)
            target = output / f'{Path(source).stem}-{width}.webp'
            resized.save(target, 'WEBP', quality=84, method=6)
            variants.append({'src': target.relative_to(root).as_posix(), 'width': width})
        manifest[source] = variants
(root / 'media.js').write_text('window.PORTFOLIO_MEDIA = ' + json.dumps(manifest, separators=(',', ':')) + ';\n')
before = sum((root / p['hero']['src']).stat().st_size for p in projects)
after = sum((root / manifest[p['hero']['src']][0]['src']).stat().st_size for p in projects)
apply_attribution()
print(f'Seven 240px overview heroes: {after:,} B; originals: {before:,} B ({1-after/before:.1%} smaller).')
