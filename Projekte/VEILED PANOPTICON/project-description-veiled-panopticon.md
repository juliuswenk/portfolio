# Veiled Panopticon

## At a glance

A person hidden from view changes WiFi signal strength, causing a shadowy figure to appear in a projection. The person being sensed cannot see the image, and the audience cannot see them: visitors discover the connection through each other. The installation questions the privacy we associate with walls and everyday wireless infrastructure. I developed the concept and sensing hardware, with AI assistance for software; Lennard Lev and Lena Eibel created the projection. Built in four days and shown internally at HTW Berlin, the prototype made concealed sensing tangible, although detection remained coarse and unreliable.

## Short summary

*Veiled Panopticon* is an installation that uses changes in WiFi signal strength to detect approximate human presence behind wooden panels and position a shadowy figure in a projection. By separating the person being sensed from those watching the visualisation, it makes concealed, camera-free sensing tangible and questions the privacy we associate with being hidden from view.

## Context & timeframe

Developed in four days in 2026 as a short-term project within the Communication Design BA at HTW Berlin.

The brief was to turn invisible signals surrounding us into an experience. The completed prototype was shown at a small internal exhibition, inviting visitors to consider familiar technology as a designed system with capabilities they might not expect.

## Question & concept

What happens when walls no longer separate seen from unseen?

The installation explores how wireless signals can make a person's presence detectable without a camera or direct line of sight. It asks visitors to reconsider what the technological infrastructure around them enables, particularly when sensing can take place without their awareness.

A person moving in front of the concealed sensors influences the position of a shadowy figure in the visualisation. The figure appears on the left, in the middle, or on the right according to which receiver detects their presence.

The person triggering the sensors cannot see the projection, while those watching it cannot see that person. Discovery happens between people: one observes the visual response, another causes it, and an exchange reveals the connection. This separation makes the act of observation asymmetric and brings questions of awareness and consent into the experience.

## My role & collaborators

I developed the concept, designed the sensing setup, and built the hardware installation. I developed the firmware and software with assistance from AI coding tools.

Lennard Lev and Lena Eibel developed the projection and visual language. Prof. Alexander Müller-Rakow and Christian Pflug guided the project from its initial concept to the final installation.

## Process & key decisions

**From accurate movement tracking to approximate presence.**  
The initial ambition was to track movement through wireless signals. Experiments with the hardware, receiver arrangement, and signal filtering revealed how difficult it was to distinguish meaningful changes from noise. Within the four-day development period, I reduced the scope to approximate presence detection across three positions.

**From direct feedback to discovery between visitors.**  
We placed the sensors and projection so that the person triggering the system and those watching its output could not see each other. This concealed unreliable readings by preventing an immediate comparison between a person's position and the figure's response. It also made conversation part of discovering the sensing setup.

The reduced prototype still fulfilled the original intention: it made an invisible technological capability experiential, even though it could not deliver precise tracking.

## Implementation

The installation uses four Arduino Nano ESP32 boards based on the ESP32-S3: one WiFi sender and three receivers. The sensing hardware is concealed behind wooden panels.

The system reads received signal strength, or **RSSI**. A person moving between the sender and receivers changes the signal readings. The software interprets these changes as approximate presence at the left, middle, or right receiver and uses that position to place the projected figure.

Finding useful thresholds and filters was a central technical challenge. The readings remained sensitive to noise, so the installation demonstrated coarse presence sensing rather than reliable movement tracking. The prototype used RSSI; channel state information, or **CSI**, is a proposed next step.

## Outcome & evidence

The completed installation prototype was presented at the internal exhibition at HTW Berlin. Visitors expressed fascination with the technological setup and discomfort when they learned that it relied on technology familiar from their own homes.

These responses suggest that the installation achieved its central goal: making concealed sensing tangible and prompting visitors to reconsider the capabilities of everyday infrastructure. Detection remained unreliable, limiting how accurately the figure could represent a person's position.

These findings come from informal visitor comments and exhibition observations, rather than a structured study or measured evaluation of sensing accuracy.

## Learning & reflection

The project sparked my interest in physical computing and in thinking through hardware as well as software. Working within the limits of the sensing setup required me to reconsider both the technical ambition and how visitors would encounter the result.

I learned that shaping an experience around hardware limitations can preserve an artistic intention, while leaving important technical questions unresolved. Separating sensing from viewing supported discovery between visitors, but also concealed the instability of the measurements.

Further development would focus on improving the reliability of presence detection and incorporating CSI to explore more accurate tracking and movement detection.

## Skills & network connections

- **Critical Design:** Developed an installation that questions privacy, consent, and the hidden sensing capabilities of familiar infrastructure.
- **Physical Computing:** Designed and built an ESP32 sender-and-receiver setup connecting wireless measurements to a spatial installation.
- **Creative Coding:** Developed firmware and software with AI coding assistance to interpret signal changes and connect approximate presence to the visual output.
- **Interaction Design:** Designed the sensing setup within a visitor experience where observation and conversation reveal the connection between movement and visual response.
- **Rapid Prototyping:** Tested receiver arrangements and signal filtering, then adjusted the scope within four days of development.

## Media & credits

[Project documentation](https://juliuswenk.github.io/veiled-panopticon/)

Selected portfolio images:

- **Hero:** `IMG_2516.JPG` — Live projection in the installation space.
- **Setup:** `IMG_2471 2.JPG` — Hardware and installation setup.
- **Spatial view:** `IMG_2487.JPG` — Sensing panels across the space.
- **Detail:** `IMG_2486.JPG` — Receiver mounted on a panel.
- **Context:** `IMG_2496.JPG` — Spatial context of the installation.
- **Entrance:** `IMG_2514.JPG` — Installation entrance and signage.
