export const projectAssets = [
  { slug: 'carry-the-computation', name: 'Carry the Computation', file: 'switch', scale: 0.72, rotation: [Math.PI / 2 - 0.28, 0.2, -0.15] },
  { slug: 'doxa', name: 'DOXA', file: 'doxa', scale: 1.1, rotation: [0.15, -Math.PI / 2 + 0.25, 0.08] },
  { slug: 'matrix-lamp', name: 'Matrix Lamp', file: 'matrix-lamp', scale: 1, rotation: [0, 0, -0.55] },
  { slug: 'visio-technologica', name: 'Visio Technologica', file: 'visio-technologica', scale: 1.15, rotation: [0.18, -0.28, 0.12] },
  { slug: 'veiled-panopticon', name: 'Veiled Panopticon', file: 'veiled-panopticon', scale: 0.8, rotation: [Math.PI / 2 - 0.25, -0.2, -0.08] }
];

// Each contact keeps its exported end cap; all eight meshes belong to one section.
export const switchParts = [
  { label: 'Blue stem', nodes: ['Low Switch_Gray Plastic_0 - Web'] },
  { label: 'Clear top housing', nodes: ['Low Top_Low Top_0 - Web'] },
  { label: 'Spring', nodes: ['Low Spring_Metal_0 - Web'] },
  { label: 'Bottom housing', nodes: ['Low Bottom_Low Bottom_0 - Web'] },
  { label: 'First metal contact', nodes: ['Low LED_Metal_0.001 - Web', 'Low LED_Metal_0.005 - Web'] },
  { label: 'Second metal contact', nodes: ['Low LED_Metal_0.011 - Web', 'Low LED_Metal_0.012 - Web'] }
];
