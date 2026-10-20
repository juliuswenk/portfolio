"""Metadata round-trip checks using Pillow's independent image/XMP reader."""
import io
import unittest
from xml.etree import ElementTree as ET
from PIL import Image
from image_attribution import NS, attribution_records, embed_xmp, xmp_packet


def read_packet(image):
    return image.info.get('xmp', image.info.get('XML:com.adobe.xmp', b''))


class AttributionTests(unittest.TestCase):
    def test_formats_keep_pixels_and_readable_attribution(self):
        record = attribution_records()['assets/doxa-installation-melissa.webp']
        packet = xmp_packet(record)
        for format, mode, options in [
            ('WEBP', 'RGB', {}), ('WEBP', 'RGBA', {}),
            ('WEBP', 'RGBA', {'lossless': True}), ('PNG', 'RGBA', {}), ('JPEG', 'RGB', {}),
        ]:
            with self.subTest(format=format, mode=mode, options=options):
                buffer = io.BytesIO()
                Image.new(mode, (7, 9), (30, 90, 200, 120) if mode == 'RGBA' else (30, 90, 200)).save(buffer, format, **options)
                original = buffer.getvalue()
                result = embed_xmp(original, packet)
                with Image.open(io.BytesIO(original)) as before, Image.open(io.BytesIO(result)) as after:
                    self.assertEqual(before.convert('RGBA').tobytes(), after.convert('RGBA').tobytes())
                    tree = ET.fromstring(read_packet(after))
                    self.assertEqual(tree.find('.//dc:creator/rdf:Seq/rdf:li', NS).text, 'Melissa Papafio-Roberts')
                    self.assertEqual(tree.find('.//dc:publisher/rdf:Bag/rdf:li', NS).text, 'Julius Wenk')
                    self.assertEqual(tree.find('.//dc:rights/rdf:Alt/rdf:li', NS).text, '© Melissa Papafio-Roberts')
                self.assertEqual(embed_xmp(result, packet), result)

    def test_other_creators_and_existing_metadata_survive(self):
        records = attribution_records()
        record = records['assets/improving-futurium-01.webp']
        previous = b'<x:xmpmeta xmlns:x="adobe:ns:meta/" xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#" xmlns:test="urn:example"><rdf:RDF><rdf:Description test:keep="original"/></rdf:RDF></x:xmpmeta>'
        packet = xmp_packet(record, previous)
        tree = ET.fromstring(packet)
        self.assertEqual(tree.find('.//rdf:Description', NS).get('{urn:example}keep'), 'original')
        self.assertEqual(tree.find('.//dc:creator/rdf:Seq/rdf:li', NS).text, 'Conrad Lischewsky')
        self.assertIsNone(tree.find('.//Iptc4xmpCore:CiEmailWork', NS))
        self.assertEqual(xmp_packet(record, packet), packet)
        hyperreal = ET.fromstring(xmp_packet(records['assets/hyperreal-spin-poster.png']))
        self.assertIn('existing SVG logo', hyperreal.find('.//dc:description/rdf:Alt/rdf:li', NS).text)
        self.assertEqual(hyperreal.find('.//Iptc4xmpCore:CiEmailWork', NS).text, 'wenk.julius@gmail.com')


if __name__ == '__main__':
    unittest.main()
