"""Embed XMP in published images without re-encoding pixels; run from any directory."""
import io
import json
import struct
import zlib
from pathlib import Path
from xml.etree import ElementTree as ET
from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
NS = {
    'x': 'adobe:ns:meta/', 'rdf': 'http://www.w3.org/1999/02/22-rdf-syntax-ns#',
    'dc': 'http://purl.org/dc/elements/1.1/', 'photoshop': 'http://ns.adobe.com/photoshop/1.0/',
    'Iptc4xmpCore': 'http://iptc.org/std/Iptc4xmpCore/1.0/xmlns/',
}
for prefix, uri in NS.items():
    ET.register_namespace(prefix, uri)


def attribution_records():
    projects = json.loads((ROOT / 'projects.js').read_text().split('=', 1)[1].strip().rstrip(';'))
    records = {}
    for project in projects:
        for photo in [project['hero'], *project['photos'], *project['detailImages']]:
            credit = photo.get('credit', '')
            creator = 'Melissa Papafio-Roberts' if 'Melissa' in credit else 'Conrad Lischewsky' if 'Conrad Lischewsky' in credit else 'Julius Wenk'
            description = f"{project['title']} — {photo['title']}. Portfolio and project contribution: Julius Wenk."
            if credit:
                description += ' Image credit: ' + credit + '.'
            if project['id'] == 5:
                description += ' Independent fan project inspired by BEASTBOY; pendant based on an existing SVG logo.'
            if project['id'] == 6:
                description += ' Some presentation photographs use edited studio backgrounds; see the case study for details.'
            records[photo['src']] = {
                'title': f"{project['title']} — {photo['title']}", 'creator': creator,
                'credit': credit or 'Julius Wenk', 'description': description,
            }
    records['assets/doxa-installation-hero.png'] = {
        **records['assets/doxa-installation-melissa.webp'],
        'description': 'DOXA installation cutout. Photograph © Melissa Papafio-Roberts; project and portfolio presentation: Julius Wenk.',
    }
    records['assets/carry-the-computation-hero.webp'] = {
        **records['assets/carry-the-computation-setup.webp'], 'title': 'Carry the Computation — earlier installation photograph',
    }
    records['assets/avatar-still.webp'] = {
        'title': 'Julius Wenk — portfolio avatar', 'creator': 'Julius Wenk',
        'credit': 'Julius Wenk — portfolio avatar presentation',
        'description': 'Avatar portrait of Julius Wenk for his New Media Designer portfolio.',
    }
    records['assets/social-preview.jpg'] = {
        'title': 'Julius Wenk — New Media Designer', 'creator': 'Julius Wenk',
        'credit': 'Portfolio composition: Julius Wenk; DOXA photograph: © Melissa Papafio-Roberts',
        'description': 'Portfolio share card featuring DOXA, Carry the Computation and Matrix Lamp. DOXA photograph © Melissa Papafio-Roberts.',
    }
    return records


def xmp_packet(record, previous=b''):
    root = ET.fromstring(previous) if previous else ET.Element(ET.QName(NS['x'], 'xmpmeta'))
    rdf = root.find('rdf:RDF', NS)
    if rdf is None:
        rdf = ET.SubElement(root, ET.QName(NS['rdf'], 'RDF'))
    description = rdf.find('rdf:Description', NS)
    if description is None:
        description = ET.SubElement(rdf, ET.QName(NS['rdf'], 'Description'), {ET.QName(NS['rdf'], 'about'): ''})
    values = {
        'dc:title': ('Alt', [record['title']]), 'dc:creator': ('Seq', [record['creator']]),
        'dc:publisher': ('Bag', ['Julius Wenk']), 'dc:description': ('Alt', [record['description']]),
        'dc:rights': ('Alt', [record['credit'] if record['creator'] != 'Julius Wenk' or 'Melissa' in record['credit'] else '© Julius Wenk']),
        'dc:relation': ('Bag', ['https://github.com/juliuswenk/portfolio-website', 'https://www.instagram.com/juliuswenk/']),
        'photoshop:Credit': (None, record['credit']),
    }
    for key, (container, value) in values.items():
        prefix, name = key.split(':')
        tag = f'{{{NS[prefix]}}}{name}'
        # Replace only managed attribution fields; retain other existing metadata.
        for desc in rdf.findall('rdf:Description', NS):
            desc.attrib.pop(tag, None)
            for child in list(desc):
                if child.tag == tag:
                    desc.remove(child)
        element = ET.SubElement(description, tag)
        if container:
            group = ET.SubElement(element, ET.QName(NS['rdf'], container))
            for text in value:
                attrs = {'{http://www.w3.org/XML/1998/namespace}lang': 'x-default'} if container == 'Alt' else {}
                ET.SubElement(group, ET.QName(NS['rdf'], 'li'), attrs).text = text
        else:
            element.text = value
    contact = description.find('Iptc4xmpCore:CreatorContactInfo', NS)
    if contact is None:
        contact = ET.SubElement(description, ET.QName(NS['Iptc4xmpCore'], 'CreatorContactInfo'), {ET.QName(NS['rdf'], 'parseType'): 'Resource'})
    # The portfolio contact belongs to Julius, not a third-party image creator.
    if record['creator'] == 'Julius Wenk':
        email = contact.find('Iptc4xmpCore:CiEmailWork', NS)
        if email is None:
            email = ET.SubElement(contact, ET.QName(NS['Iptc4xmpCore'], 'CiEmailWork'))
        email.text = 'wenk.julius@gmail.com'
    description.remove(contact)
    description.append(contact)
    return ET.tostring(root, encoding='utf-8')


def embed_xmp(data, packet):
    if data.startswith(b'RIFF') and data[8:12] == b'WEBP':
        assert int.from_bytes(data[4:8], 'little') == len(data) - 8
        chunks, pos = [], 12
        while pos < len(data):
            length = int.from_bytes(data[pos+4:pos+8], 'little')
            end = pos + 8 + length + length % 2
            assert end <= len(data)
            if data[pos:pos+4] != b'XMP ':
                chunks.append(data[pos:end])
            pos = end
        if chunks[0][:4] == b'VP8X':
            header = bytearray(chunks[0]); header[8] |= 4; chunks[0] = bytes(header)
        else:
            with Image.open(io.BytesIO(data)) as image:
                flags = 4 | (16 if 'A' in image.getbands() else 0)
                payload = bytes([flags, 0, 0, 0]) + (image.width-1).to_bytes(3, 'little') + (image.height-1).to_bytes(3, 'little')
            chunks.insert(0, b'VP8X' + struct.pack('<I', 10) + payload)
        body = b'WEBP' + b''.join(chunks) + b'XMP ' + struct.pack('<I', len(packet)) + packet + b'\0' * (len(packet) % 2)
        return b'RIFF' + struct.pack('<I', len(body)) + body
    if data.startswith(b'\x89PNG\r\n\x1a\n'):
        chunks, pos = [], 8
        while pos < len(data):
            length = int.from_bytes(data[pos:pos+4], 'big')
            end = pos + 12 + length
            assert end <= len(data)
            chunk = data[pos:end]
            if chunk[4:8] == b'IEND':
                payload = b'XML:com.adobe.xmp\0\0\0\0\0' + packet
                content = b'iTXt' + payload
                chunks.append(struct.pack('>I', len(payload)) + content + struct.pack('>I', zlib.crc32(content)))
            if not (chunk[4:8] == b'iTXt' and chunk[8:].startswith(b'XML:com.adobe.xmp\0')):
                chunks.append(chunk)
            pos = end
        return data[:8] + b''.join(chunks)
    if data.startswith(b'\xff\xd8'):
        signature = b'http://ns.adobe.com/xap/1.0/\0'
        chunks, pos = [], 2
        while data[pos:pos+2] not in (b'\xff\xda', b'\xff\xd9'):
            assert data[pos] == 255
            length = int.from_bytes(data[pos+2:pos+4], 'big')
            end = pos + 2 + length
            assert length >= 2 and end <= len(data)
            if not (data[pos:pos+2] == b'\xff\xe1' and data[pos+4:end].startswith(signature)):
                chunks.append(data[pos:end])
            pos = end
        payload = signature + packet
        assert len(payload) + 2 < 65536
        return data[:2] + b''.join(chunks) + b'\xff\xe1' + struct.pack('>H', len(payload)+2) + payload + data[pos:]
    raise ValueError('Unsupported image format')


def apply_attribution():
    records = attribution_records()
    manifest = json.loads((ROOT / 'media.js').read_text().split('=', 1)[1].strip().rstrip(';'))
    files = dict(records)
    for source, variants in manifest.items():
        if source not in records:
            continue
        for variant in variants:
            files[variant['src']] = records[source]
    added = 0
    for relative, record in files.items():
        path = ROOT / relative
        before = path.read_bytes()
        with Image.open(io.BytesIO(before)) as image:
            image.load()
            previous = image.info.get('xmp', image.info.get('XML:com.adobe.xmp', b''))
            pixels, size = image.convert('RGBA').tobytes(), image.size
        packet = xmp_packet(record, previous)
        after = embed_xmp(before, packet)
        with Image.open(io.BytesIO(after)) as image:
            assert image.size == size and image.convert('RGBA').tobytes() == pixels, path
            actual = image.info.get('xmp', image.info.get('XML:com.adobe.xmp', b''))
            assert (actual.encode() if isinstance(actual, str) else actual) == packet, path
        assert embed_xmp(after, packet) == after, f'Not idempotent: {path}'
        if after != before:
            temporary = path.with_name(path.name + '.tmp')
            temporary.write_bytes(after)
            temporary.replace(path)
        added += len(after) - len(before)
    lines = ['# Portfolio image attribution', '', 'Portfolio and project contributions: **Julius Wenk**.', '',
             'Contact: wenk.julius@gmail.com · [Instagram](https://www.instagram.com/juliuswenk/) · [Repository](https://github.com/juliuswenk/portfolio-website)', '',
             'The table records image credits separately from project contributions. All responsive variants inherit their source image’s attribution. Existing third-party credits remain applicable; embedding attribution does not grant a reuse licence. Source project files are untouched.', '',
             '| Published image | Image creator / credit |', '| --- | --- |']
    lines += [f'| [{src}]({src}) | {record["credit"]} |' for src, record in records.items()]
    (ROOT / 'IMAGE_CREDITS.md').write_text('\n'.join(lines) + '\n')
    print(f'Attribution verified in {len(files)} images; {added:,} bytes added; decoded pixels unchanged.')


if __name__ == '__main__':
    apply_attribution()
