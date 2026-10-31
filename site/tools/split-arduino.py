"""Regroup the glitter Arduino export into six complete section assemblies."""
import hashlib
import json
import struct
from pathlib import Path

root = Path(__file__).resolve().parents[2]
source = (root / 'Redesign/stem-test/assets/veiled-panopticon.glb').read_bytes()
assert hashlib.sha256(source).hexdigest() == 'f5682fa5cf1aeedc352fe4d4201902744b246f5b6d1ca15bc54414b97e5c6cca', 'Source changed: review the component assignments before exporting.'
length = struct.unpack_from('<I', source, 12)[0]
gltf = json.loads(source[20:20 + length])
binary = bytearray(source[28 + length:28 + length + gltf['buffers'][0]['byteLength']])
assert len(gltf['scenes']) == 1 and not gltf.get('animations') and not gltf.get('skins')
assert all(set(node) == {'name', 'mesh'} for node in gltf['nodes'])


def records(index):
    accessor = gltf['accessors'][index]
    view = gltf['bufferViews'][accessor['bufferView']]
    components = {'SCALAR': 1, 'VEC2': 2, 'VEC3': 3}[accessor['type']]
    fmt = '<' + {5123: 'H', 5125: 'I', 5126: 'f'}[accessor['componentType']] * components
    size = struct.calcsize(fmt)
    offset = view.get('byteOffset', 0) + accessor.get('byteOffset', 0)
    raw = [bytes(binary[offset + i * view.get('byteStride', size):offset + i * view.get('byteStride', size) + size]) for i in range(accessor['count'])]
    return raw, [struct.unpack(fmt, item) for item in raw]


def islands(primitive):
    positions = records(primitive['attributes']['POSITION'])[1]
    indices = [item[0] for item in records(primitive['indices'])[1]]
    keys, parents, vertices = {}, [], []
    for position in positions:
        # Weld coincident UV/normal seams only for finding connected components.
        key = tuple(round(value * 100000) for value in position)
        if key not in keys:
            keys[key] = len(parents)
            parents.append(len(parents))
        vertices.append(keys[key])

    def find(index):
        while parents[index] != index:
            parents[index] = parents[parents[index]]
            index = parents[index]
        return index

    triangles = [indices[i:i + 3] for i in range(0, len(indices), 3)]
    for a, b, c in triangles:
        parents[find(vertices[a])] = find(vertices[b])
        parents[find(vertices[c])] = find(vertices[b])
    groups = {}
    for index, triangle in enumerate(triangles):
        groups.setdefault(find(vertices[triangle[0]]), []).append(index)
    return triangles, sorted(groups.values(), key=lambda group: tuple(min(positions[v][axis] for face in group for v in triangles[face]) for axis in [0, 2, 1]))


original = [mesh['primitives'][0] for mesh in gltf['meshes']]
components = [islands(primitive) for primitive in original]
assert [len(groups) for _, groups in components] == [1, 21, 1, 48]
# Indices refer to islands sorted by their minimum X, Z, then Y coordinates.
assemblies = [
    ('Circuit board and indicator', {0: [0], 1: [2], 2: [0]}),
    ('USB connector', {1: [0], 3: [0, 1]}),
    ('Pin headers', {1: [7, 8, 11, 12, 15, 18, 19, 20], 3: list(range(7, 13)) + list(range(42, 48))}),
    ('Power input and capacitors', {1: [1], 3: [2, 3, 6, 13]}),
    ('Microcontroller and socket', {1: [16, 17], 3: list(range(14, 42))}),
    ('Clock, reset and support electronics', {1: [3, 4, 5, 6, 9, 10, 13, 14], 3: [4, 5]})
]
for index, (_, groups) in enumerate(components):
    assigned = [component for _, selections in assemblies for component in selections.get(index, [])]
    assert sorted(assigned) == list(range(len(groups))), 'Every component must be used exactly once.'


def append_view(data, target):
    binary.extend(b'\0' * (-len(binary) % 4))
    view = {'buffer': 0, 'byteOffset': len(binary), 'byteLength': len(data), 'target': target}
    binary.extend(data)
    gltf['bufferViews'].append(view)
    return len(gltf['bufferViews']) - 1


meshes = []
for name, selections in assemblies:
    primitives = []
    for index, selected in selections.items():
        old = original[index]
        triangles, groups = components[index]
        indices = [vertex for component in selected for face in groups[component] for vertex in triangles[face]]
        used = sorted(set(indices))
        remap = {vertex: i for i, vertex in enumerate(used)}
        attributes = {}
        for semantic, accessor_index in old['attributes'].items():
            raw, values = records(accessor_index)
            accessor = dict(gltf['accessors'][accessor_index])
            accessor.pop('byteOffset', None)
            accessor['bufferView'] = append_view(b''.join(raw[i] for i in used), 34962)
            accessor['count'] = len(used)
            for key, fn in [('min', min), ('max', max)]:
                if key in accessor:
                    accessor[key] = [fn(values[i][axis] for i in used) for axis in range(len(values[0]))]
            attributes[semantic] = len(gltf['accessors'])
            gltf['accessors'].append(accessor)
        accessor = {'bufferView': append_view(struct.pack('<' + 'H' * len(indices), *(remap[i] for i in indices)), 34963), 'componentType': 5123, 'count': len(indices), 'type': 'SCALAR'}
        assert len(used) < 65536
        primitives.append({**old, 'attributes': attributes, 'indices': len(gltf['accessors'])})
        gltf['accessors'].append(accessor)
    meshes.append({'name': 'Arduino - ' + name, 'primitives': primitives})

assert sum(gltf['accessors'][p['indices']]['count'] for mesh in meshes for p in mesh['primitives']) == sum(gltf['accessors'][p['indices']]['count'] for p in original), 'No triangle is lost or duplicated.'
gltf['meshes'] = meshes
gltf['nodes'] = [{'name': mesh['name'], 'mesh': i} for i, mesh in enumerate(meshes)]
gltf['scenes'][0]['nodes'] = list(range(len(meshes)))
gltf['buffers'][0]['byteLength'] = len(binary)
metadata = json.dumps(gltf, separators=(',', ':')).encode()
metadata += b' ' * (-len(metadata) % 4)
binary.extend(b'\0' * (-len(binary) % 4))
result = struct.pack('<III', 0x46546C67, 2, 28 + len(metadata) + len(binary)) + struct.pack('<II', len(metadata), 0x4E4F534A) + metadata + struct.pack('<II', len(binary), 0x004E4942) + binary
assert len(result) < 2_000_000
(root / 'site/redesign/assets/veiled-panopticon.glb').write_bytes(result)
print(f'Exported six Arduino assemblies; {len(result):,} bytes; all original triangles, UVs, normals and embedded textures retained.')
