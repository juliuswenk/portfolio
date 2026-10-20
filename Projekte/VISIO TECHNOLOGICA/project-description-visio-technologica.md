
| Category                     | What to write                                                                                                                                                                                                                                                                                                   |
| ---------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Short summary                | Wie sieht Technologie unsere Stadt? Wie viel Fläche von Berlin wird von Kameras aufgenommen? Wer wird überwacht und wer nicht? Welche Signale umgeben uns? Wie fühlt sich ein Berlin mit technologischen Sinnen im Kontrast zu menschlichen Sinnen an?                                                          |
| Context & timeframe          | 2026, semester project (6 Weeks of Work), Installation for the futurium Berlin, Task: Create a VR experience compatible with the icaros fitness device that leans on topics of borrowed senses, intended for technologically curious museum visitors in a broad age range.                                      |
| Question & concept           | What happens when advertisers catch up to the dead internet theory and try filtering out bot activity? How can we protect ourselves against more and more intrusive "human-detection" algorithms? By utilizing only technological sensors as our main sensory input.                                            |
| My role & collaborators      | I did the concept, coding work with streaming live 3D Tiles of Berlinthat make up the world and the shaders that render selective image textures, creating a gyro sensor for the ICAROS Fitness Device, Experience Design. Teammate Lennard Lev did: Interface Design, Coding for live streaming radio stations |
| Process & key decisions      | Scaling ideas to a short time frame, using vibe coding to create a physics engine from scratch, Improving performance to run the experience on the glasses alone.                                                                                                                                               |
| Implementation               | How it works, tools/materials, and relevant technical challenges.                                                                                                                                                                                                                                               |
| Outcome & evidence           | What actually exists: a strong concept, an installation ready VR Experience, exhibited at the werkschau @ HTW Berlin 2026                                                                                                                                                                                       |
| Learning & reflection        | Capabilites and limitations of VR Experiences as well as vibe coding.                                                                                                                                                                                                                                           |
| Skills & network connections | WebXR, Vibe coding, Experience Design                                                                                                                                                                                                                                                                           |
| Media & credits              |                                                                                                                                                                                                                                                                                                                 |

#### **Zusammenfassung**

Wie sieht Technologie unsere Stadt? Wie viel Fläche von Berlin wird von Kameras aufgenommen? Wer wird überwacht und wer nicht? Welche Signale umgeben uns? Wie fühlt sich ein Berlin mit technologischen Sinnen im Kontrast zu menschlichen Sinnen an?

#### **Das Thema**

Öffentliche Räume in Großstädten wie Berlin sind zunehmend von Kameras durchzogen, die im Alltag in Vergessenheit geraten. VISIO TECHNOLOGICA macht diese unsichtbare Infrastruktur erfahrbar. Das Projekt verbindet eine kritische Auseinandersetzung mit urbaner Überwachung mit den gestalterischen Mitteln von VR: Das Eintauchen in eine neue Sichtweise auf die bekannte Umgebung macht ein abstraktes politisches Thema körperlich spürbar.

In der Erfahrung werden die Nutzenden schrittweise von der "menschlichen" in die "technologische" Wahrnehmung überführt. Die eigenen Sinne werden mit künstlichen Sinnen ausgetauscht. Wir sehen nur das, was Kameras sehen, wir hören die Radiowellen, die die Luft durchdringen, ohne selbst einen Sender ausgewählt zu haben.

<aside>

**Wissenschaftlicher Hintergrund: Akteur-Netzwerk-Theorie**

Konzeptuell stützt sich das Projekt auf die Akteur-Netzwerk-Theorie (ANT) von Madeleine Akrich, Bruno Latour, Michel Callon und John Law (ab ca. 1980). Diese Theorie beschreibt, wie Menschen, Ideen, Technologien und Natur gemeinsam Netzwerke bilden, deren Beziehungen sich fortlaufend neu formen und verändern. Sie schreibt Objekten, Ideen und Prozessen die selbe Handlungsmacht zu wie menschlichen Akteur:innen bei der Entstehung sozialer Situationen. Übertragen auf VISIO TECHNOLOGICA heißt das: Kameras, Kabel, Radiowellen, Serverinfrastruktur und Algorithmen sind in diesem Verständnis keine neutralen, passiven Werkzeuge, sondern aktive Teilnehmer:innen im sozialen Gefüge der Stadt. Sie beobachten, filtern und entscheiden mit, so wie wir, und verändern dadurch, wie sich Menschen im öffentlichen Raum bewegen und verhalten.

**Erzählerisches Konzept: Eine mögliche Zukunft**

Das Projekt entwirft dazu ein spekulatives Zukunftsszenario:

Die Zahl der Bots im digitalen Raum wächst immer weiter, wodurch es für Unternehmen zunehmend unmöglich wird, Werbung noch gezielt an echte Menschen auszuspielen. Dieser Kontrollverlust treibt ein Wettrüsten an, an dessen Ende Unternehmen in der Lage sind, nicht mehr nur Verhalten, sondern die menschliche Wahrnehmung selbst zu tracken und gezielt zu adressieren. Um sich diesem Zugriff zu entziehen und unerkannt durch die Stadt zu bewegen, greifen Menschen in dieser Zukunft paradoxerweise auf genau jene technologischen Sensoren zurück, die sie umgeben. Kameras, Sensorik und technologische Infrastruktur wird herangezogen um deren "Blick" als eigene Wahrnehmung zu nutzen. Im Rauschen der Überwachung wird man so selbst unsichtbar.

Diese Erzählung bildet den fiktionalen Rahmen, in den die VR-Erfahrung die Nutzenden hineinversetzt.

</aside>

<aside>

#### **Konzept & Umsetzung**

Nutzende starten in die Experience, indem zuerst die reale Welt um sie herum durch die VR-Brille immer noch sichtbar ist. Über dieses Bild gelegt, ist ein Sonar erkennbar, das die Umgebung absucht. Nachdem die menschliche Wahrnehmung erkannt wurde, wechselt das System zu der technologischen Wahrnehmung. Die Realität wird abgeschaltet, eine virtuelle Realität taucht auf.

Die Nutzenden fliegen über Berlin. Aber Berlin sieht anders aus, als gewohnt. Die von sämtlichen Kameras in der Stadt abgedeckten Bereiche sind mit Kegeln sichtbar gemacht. In diesen Kegeln sieht Berlin so aus, wie wir es kennen. Dort, wo keine Kameras sind, ist die Stadt nur schemenhaft zu erahnen.

Zu hören sind die Radiowellen, die in diesen Bereich kommen. Im Laufe des Flugs verändern sich auch diese.

In der Ferne sind auch die Geräusche, die Schallwellen, der Stadt zu erkennen. Wie ein Nebel nehmen sie den gesamten Raum ein.

Doch auch wie andere Technologien, ist auch diese an ihre Akkulaufzeit geknüpft und schaltet die technologische Wahrnehmung nach Ablauf dieser Stück für Stück wieder ab. Die Realität kommt wieder.

Das Bewusstsein über das Erlebte bleibt. Verändert sich die Beziehung zu Berlin jetzt?

</aside>


#### **Methoden & Technologie**

**Tech-Stack:** WebXR, Three.js, SvelteKit, Bun, Zed

**KI-Tools:** OpenCode, Claude, Codex

**Assets:** Fotorealistisches 3D-Modell von Berlin: Cesium Ion

**Repository:** [https://github.com/juliuswenk/neural-flight-vt-fork.git](https://github.com/juliuswenk/neural-flight-vt-fork.git)



---

#### **Abstract**

How does technology see our city? How much of Berlin's surface is captured by cameras? Who gets watched, and who doesn't? What signals surround us? What does a Berlin with technological senses feel like, in contrast to human senses?

#### **The Topic**

Public spaces in big cities like Berlin are increasingly threaded through with cameras that fade into the background of everyday life. VISIO TECHNOLOGICA makes this invisible infrastructure tangible. The project combines a critical engagement with urban surveillance with the design tools of VR: immersing yourself in a new way of seeing a familiar environment turns an abstract political topic into something you physically feel.

Over the course of the experience, users are gradually shifted from "human" perception into "technological" perception. Their own senses get swapped out for artificial ones. We see only what cameras see, we hear the radio waves passing through the air around us, without ever having chosen a station ourselves.

<aside>

**Scientific Background: Actor-Network Theory**

Conceptually, the project draws on Actor-Network Theory (ANT), developed by Madeleine Akrich, Bruno Latour, Michel Callon, and John Law (from around 1980 onward). This theory describes how people, ideas, technologies, and nature together form networks whose relationships are constantly reshaping and shifting. It attributes the same agency to objects, ideas, and processes as it does to human actors in the emergence of social situations. Applied to VISIO TECHNOLOGICA, this means: cameras, cables, radio waves, server infrastructure, and algorithms are not neutral, passive tools in this understanding, but active participants in the social fabric of the city. They observe, filter, and co-decide, just like we do — and in doing so, they change how people move and behave in public space.

</aside>

<aside>

**Narrative Concept: A Possible Future**

The project builds a speculative future scenario around this idea:

The number of bots in digital space keeps growing, making it increasingly impossible for companies to target advertising at actual humans. This loss of control fuels an arms race, at the end of which companies are able to track — and specifically target — not just behavior, but human perception itself. To escape this kind of access and move through the city unrecognized, people in this future paradoxically turn to the very technological sensors that surround them. Cameras, sensors, and technological infrastructure get co-opted, their "gaze" used as one's own perception. In the noise of surveillance, you become invisible yourself.

This narrative forms the fictional frame that the VR experience places users inside.

</aside>

<aside>

#### **Concept & Implementation**

Users start the experience with the real world around them still visible through the VR headset. Layered over this image is a sonar sweeping the environment. Once human perception has been detected, the system switches over to technological perception. Reality is switched off, and a virtual reality appears.  
Users fly over Berlin. But Berlin doesn't look the way it usually does. The areas covered by all the cameras in the city are made visible as cones. Inside these cones, Berlin looks the way we know it. Where there are no cameras, the city is only vaguely discernible.  
You can hear the radio waves passing through these areas. As the flight goes on, these change too.  
In the distance, you can also make out the sounds — the sound waves — of the city. Like fog, they fill the entire space.  
But like any other technology, this one too is tied to its battery life, and once that runs out, the technological perception shuts down bit by bit. Reality comes back.  
The awareness of what was experienced stays with you. Does your relationship to Berlin change now?

</aside>

<aside>

#### **Methods & Technology**

**Tech stack:** WebXR, Three.js, SvelteKit, Bun, Zed

**AI tools:** OpenCode, Claude, Codex

**Assets:** Photorealistic 3D model of Berlin: Cesium Ion

**Repository:** [https://github.com/juliuswenk/neural-flight-vt-fork.git](https://github.com/juliuswenk/neural-flight-vt-fork.git)

</aside>

## Portfolio facts

| Category | Documented information |
| --- | --- |
| Format | VR experience |
| Context & timeframe | Berlin; project date, duration, and presentation context to confirm. |
| My role & collaborators | Individual responsibilities to confirm |
| Process & implementation | A fictional scenario grounded in Actor-Network Theory moves visitors from the visible world into an alternative view of the city, built with WebXR, Three.js, and SvelteKit. |
| Outcome & evidence | A described VR experience with scene screenshots; deployment status, camera data sources, and testing remain to be confirmed. |
| Learning & reflection | Not yet documented. |

## Skills & network connections

Skills are normalized editorial tags inferred from the supplied description, not proficiency ratings. Attribution distinguishes the project’s capabilities from confirmed personal work. Tools and subject matter are not automatically treated as skills.

| Skill | Evidence in the description | Attribution |
| --- | --- | --- |
| Critical design | Questions urban surveillance and the agency of technological infrastructure. | Project-level; individual authorship to confirm. |
| Interaction design | Stages the transition from real-world visibility to technological perception and back. | Project-level; individual authorship to confirm. |
| Creative coding | WebXR, Three.js, and SvelteKit are explicitly listed. | Project-level; individual authorship to confirm. |
| Real-time 3D | Three.js city experience using a Cesium Ion Berlin model. | Project-level; individual authorship to confirm. |
| XR design | A VR headset experience transitions between the real environment and a virtual city. | Project-level; individual authorship to confirm. |
| Spatial storytelling | Flight, changing visibility, radio waves, city sound, and a battery-life narrative structure the experience. | Project-level; individual authorship to confirm. |

### Connections through shared skills

- **DOXA** — Critical design, Interaction design, Creative coding, Real-time 3D.
- **VEILED PANOPTICON** — Critical design.
- **Improving Futurium** — Interaction design, Spatial storytelling.
- **Poetics of Encryption** — XR design, Spatial storytelling.

## Selected portfolio images

Selection is based on visual review of the supplied files. Original files are preserved; the prototype uses WebP copies and supplied transparent PNG assets. Captions describe what is visible.

- **hero:** `Codex-Bild 18. Sept. 2026, 12_00_42.png` — Berlin scene with signal visualization; transparent PNG copied to `site/assets/visio-technologica-city-hero.png`.
- **network:** `Codex-Bild 18. Sept. 2026, 11_55_01.png` — Participant wearing a VR headset on ICAROS; transparent PNG copied to `site/assets/visio-technologica-vr-participant.png`.
- **network:** `Bildschirmfoto 2026-09-18 um 11.53.10.png` — Television tower scene.
- **network:** `Bildschirmfoto 2026-09-18 um 11.54.04.png` — Street-level city geometry.
- **detail:** `Bildschirmfoto 2026-06-05 um 19.35.38.png` — Berlin model overview.
- **detail:** `Bildschirmfoto 2026-09-18 um 11.53.55.png` — City scene development view.
