export const projectAssets = [
  { slug: 'carry-the-computation', name: 'Carry the Computation', file: 'switch', scale: 0.72, rotation: [Math.PI / 2 - 0.28, 0.2, -0.15] },
  { slug: 'doxa', name: 'DOXA', file: 'doxa', scale: 1.1, rotation: [0.15, -Math.PI / 2 + 0.25, 0.08] },
  { slug: 'matrix-lamp', name: 'Matrix Lamp', file: 'matrix-lamp', scale: 1, rotation: [0, 0, -0.55] },
  { slug: 'visio-technologica', name: 'Visio Technologica', file: 'visio-technologica', scale: 1.15, rotation: [0.18, -0.28, 0.12] },
  { slug: 'veiled-panopticon', name: 'Veiled Panopticon', file: 'veiled-panopticon', scale: 0.8, rotation: [Math.PI / 2 - 0.25, -0.2, -0.08] }
];

// Each contact keeps its exported end cap; all eight meshes belong to one section.
const switchParts = [
  { label: 'Blue stem', nodes: ['Low Switch_Gray Plastic_0 - Web'] },
  { label: 'Clear top housing', nodes: ['Low Top_Low Top_0 - Web'] },
  { label: 'Spring', nodes: ['Low Spring_Metal_0 - Web'] },
  { label: 'Bottom housing', nodes: ['Low Bottom_Low Bottom_0 - Web'] },
  { label: 'First metal contact', nodes: ['Low LED_Metal_0.001 - Web', 'Low LED_Metal_0.005 - Web'] },
  { label: 'Second metal contact', nodes: ['Low LED_Metal_0.011 - Web', 'Low LED_Metal_0.012 - Web'] }
];

export const projectParts = {
  'carry-the-computation': { rotation: [.35, -.55, -.12], parts: switchParts },
  doxa: {
    rotation: [.15, -Math.PI / 2 + .3, -.03],
    parts: [
      { label: 'Main upper display', nodes: ['DOXA - Main upper display - Web'] },
      { label: 'Main lower display', nodes: ['DOXA - Main lower display - Web'] },
      { label: 'Satellite displays and stands', nodes: ['DOXA - Satellite displays - Web', 'DOXA - Satellite stands - Web'] },
      { label: 'Main frame and support', nodes: ['DOXA - Main frame - Web', 'DOXA - Center support - Web'] },
      { label: 'Workstations and worktops', nodes: ['DOXA - Workstation frames - Web', 'DOXA - Worktops - Web'] },
      { label: 'Station structure', nodes: ['DOXA - Station structure - Web'] }
    ]
  },
  'visio-technologica': {
    rotation: [.18, -.38, .05],
    parts: [
      { label: 'Outer shell and button', primitives: [0, 2] },
      { label: 'Lenses and optical mounts', primitives: [10, 11, 13] },
      { label: 'Head straps', primitives: [5] },
      { label: 'Face cushion', primitives: [4] },
      { label: 'Inner housing and controls', primitives: [1, 3, 6, 12] },
      { label: 'Optical covers and accents', primitives: [7, 8, 9] }
    ]
  },
  'matrix-lamp': {
    rotation: [0, 0, -.35], repeat: true,
    parts: Array.from({ length: 7 }, () => ({ label: 'LED diode', nodes: ['Cylinder_0 - Web', 'Cylinder_1 - Web'] }))
  }
};
