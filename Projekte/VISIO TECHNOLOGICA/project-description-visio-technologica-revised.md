# VISIO TECHNOLOGICA

## At a glance

A VR flight over Berlin lets visitors experience the city through simulated technological senses. Shifting their weight on an ICAROS fitness device steers the flight; camera cones reveal detailed surfaces, while live radio streams become spatial sound sources. The project asks how technological infrastructure shapes what we can perceive. I developed the concept, flight sensor, city-data streaming, and visibility shaders; Lennard Lev contributed interfaces and radio streaming, with AI tools assisting coding. Built over six weeks for a Futurium brief, the functioning installation was exhibited at HTW Berlin’s Werkschau in 2026.

## Short summary

*VISIO TECHNOLOGICA* is a VR installation in which visitors fly over Berlin using the ICAROS fitness device, perceiving the city through simulated technological senses. Camera cones reveal detailed surfaces while live radio streams occupy positions in the surrounding space, exploring how sensing systems reveal some parts of a city and leave others inaccessible.

## Context & timeframe

Developed over six weeks in 2026 as a semester project at HTW Berlin for a Futurium Berlin brief. The task was to create a VR experience compatible with the ICAROS, exploring borrowed senses for technologically curious museum visitors across a broad age range.

The project connected with my employment at Futurium and HTW Berlin, through which I developed an additional orientation sensor for the ICAROS. This sensor enabled the flight interaction used in the experience. The completed installation was presented at HTW Berlin’s Werkschau in 2026.

## Question & concept

How does our relationship to a city change when we perceive it through its technological infrastructure?

The experience imagines a future in which advertising systems can track human perception. To evade them, people borrow the senses of the technological infrastructure around them. This fictional premise introduces a shift from familiar perception to a city experienced through cameras and radio signals.

Visitors begin with their real surroundings visible through the headset. A sonar-like scan introduces the transition into a virtual Berlin, where they steer their flight by shifting their weight. Detailed city textures appear within camera cones; elsewhere, the city remains faintly visible. Live radio stations become spatial audio sources encountered during flight.

A simulated battery gradually runs down, ending the borrowed perception and returning visitors to their surroundings. The experience invites reflection on what each sensing system makes accessible and what lies beyond its reach.

## My role & collaborators

I developed the concept and experience design, implemented streaming of Berlin’s 3D city data and the shaders controlling texture visibility, and developed the ICAROS orientation sensor through my employment at Futurium and HTW Berlin.

Lennard Lev designed the interfaces and implemented live radio streaming. OpenCode, Claude, and Codex assisted with coding. The Berlin city model was streamed through Cesium ion.

## Process & key decisions

**Making the limits of sensing visible.**  
I used detailed textures inside camera cones to represent areas where a technical sensor could obtain reliable visual information. Outside those cones, faint geometry suggests a city that still exists beyond the sensor’s perception. The contrast makes selective access to the city central to the visual experience.

**Generating camera positions from the city.**  
An algorithm analysed the 3D building geometry, identified top edges as candidate locations, and selected a limited number of camera positions per building. This connected placement to the city’s architecture. The resulting cones form a speculative visualization of technological perception; they do not document actual surveillance coverage.

## Implementation

The experience uses **WebXR, Three.js, and SvelteKit**, with Berlin’s 3D tiles streamed through **Cesium ion**. Custom shaders control which city textures become visible within the generated camera cones.

An added gyroscope sensor supplies orientation information from the ICAROS, allowing visitors to control flight direction by shifting their weight. Live radio streams are positioned as 3D audio sources within the city, making them audible from different directions as visitors move through the environment.

## Outcome & evidence

The completed VR installation was exhibited at HTW Berlin’s Werkschau in 2026. It combined weight-controlled flight, the transition from real surroundings into the virtual city, camera-dependent visibility, spatial live radio, and the simulated battery ending in a functioning experience.

## Learning & reflection

Developing the flight-direction sensor taught me to consider sensing, physical movement, and the virtual response as one connected experience. Their coordination is essential to making flight feel immersive and enjoyable.

## Skills & network connections

- **XR Design:** Designed the transition between real surroundings and a virtual city experienced through borrowed senses.
- **Interaction Design:** Connected physical movement on the ICAROS with navigation through the experience.
- **Physical Computing:** Developed the additional gyroscope sensor supplying flight-direction input.
- **Creative Coding:** Implemented city streaming and selective-visibility shaders with AI coding assistance.
- **Critical Design:** Used a speculative sensing experience to question how technological infrastructure shapes access to the city.
