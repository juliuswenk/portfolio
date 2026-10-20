# VISIO TECHNOLOGICA

Edited portfolio copy. Original project descriptions remain alongside this file.

## At a glance

How does a city change when we perceive it through technological infrastructure? VISIO TECHNOLOGICA lets visitors fly through a virtual Berlin using the ICAROS, borrowing camera and radio perception. I developed the concept, city streaming, visibility shaders, and flight-direction sensor, with coding assistance and interface and audio work by Lennard Lev. The functioning VR installation was exhibited at HTW Berlin’s Werkschau in 2026.

## Context

VR installation · HTW Berlin / Futurium brief · 2026 · Six weeks

## Experience & intention

In a fictional future where advertising systems track human perception, visitors evade them by borrowing technological senses. Headset passthrough gives way to a sonar-like scan of Berlin. Shifting their weight on the ICAROS controls flight; detailed textures appear inside camera cones, while faint geometry remains outside. Live radio streams become spatial audio sources.

A simulated battery ends the experience and returns visitors to their surroundings. Designed for technologically curious museum visitors across a broad age range, the journey asks what each sensing system makes accessible and what remains beyond its reach.

## My role & collaborators

I developed the concept and experience design, streamed Berlin’s 3D city data, and implemented the selective-visibility shaders. Through my employment at Futurium and HTW Berlin, I developed the additional ICAROS orientation sensor used for flight.

Lennard Lev designed the interfaces and implemented live radio streaming. OpenCode, Claude, and Codex assisted with coding. The city model was streamed through Cesium ion.

## Outcome & learning

The completed installation combined weight-controlled flight, the transition from real surroundings into Berlin, selective visibility, spatial live radio, and the battery ending in a functioning experience exhibited at HTW Berlin’s Werkschau in 2026.

Developing the sensor taught me to consider sensing, physical movement, and virtual response as one connected experience. Their coordination shapes how immersive and enjoyable the flight feels.

## Key design decisions

Detailed textures within camera cones and faint geometry elsewhere make the limits of technical perception part of the experience.

An algorithm identifies building top edges and selects camera positions from the city geometry. These cones are a speculative visualization of technological perception; they do not document actual surveillance coverage.

## Implementation details

The experience uses **WebXR, Three.js, and SvelteKit**, with Berlin’s 3D tiles streamed through **Cesium ion**. Custom shaders control which city textures become visible within the generated camera cones.

An added gyroscope sensor supplies orientation information from the ICAROS, allowing visitors to control flight direction by shifting their weight. Live radio streams are positioned as 3D audio sources within the city, making them audible from different directions as visitors move through the environment.

## Skills

XR design · Interaction design · Physical computing · Creative coding · Critical design
