# Editorial copy for review

Confirmed by the user and implemented on 20 October 2026. This file records the approved examples; maintained project copy is in each project’s portfolio-editorial.md. Facts come from the user’s answers and the existing project descriptions.

## Hyperreal Ravelord

### At a glance

Hyperreal Ravelord is a personal Blender study inspired by BEASTBOY’s album of the same name. Made in 2018 to explore 3D tools, it takes the chain—a subject in the music—as a digital object. I modelled the necklace, based its pendant on an existing SVG logo, and created the materials, lighting, and rendering setup. The result was a digital necklace with animated renders, intended entirely for the screen.

### Context

Personal fan project · 2018 · Digital jewellery study · Blender

### Intention & design

I wanted to explore what I could make with 3D tools through a subject connected to music I enjoyed. The chain offered a way to translate a motif from the album into an object, with an existing SVG logo providing the starting point for the pendant.

### My role & process

I modelled the necklace myself and developed its materials, lighting, and rendering setup entirely in Blender. The pendant was based on an existing SVG logo; the original graphic design was not my work.

### Outcome & reflection

The model and animated renders remained a personal study, with no physical production intended. Making it developed my understanding of modelling, lighting, and materials. Revisiting it now, I would improve the animation through a physics-based simulation to explore more dynamic movement.

### Skills & credits

3D modelling · Materials · Lighting · Rendering

Musical reference: *Hyperreal Ravelord* by BEASTBOY. Independent fan project; pendant based on an existing SVG logo.

The website's video encoding and interactive rotation are portfolio presentation work, separate from the original study. Keep those details in technical/export documentation rather than attributing them to the 2018 project.

## DOXA — example of the revised reading structure

### At a glance

How do different groups come to construct different truths? DOXA lets visitors create AI agents and follow statements as they change across a simulated social network. I developed the concept, interfaces, print materials, and software, with AI coding assistance and exhibition support. Exhibited at Ars Electronica in 2026, it drew visitors into the exchange, though the system’s complexity sometimes obscured the broader question.

### Context

Interactive installation · HTW Berlin · 2026

First prototyped for *Liminal Fields* in February; developed further for Ars Electronica in September.

### Experience & intention

A joystick invites visitors to inspect the network. At satellite stations, a short personality questionnaire creates an agent that acts independently on their behalf. Visitors can introduce statements and follow how agents interpret and retell them. Returning later reveals what their agent has heard and how their statement has changed.

The simulation makes social connections and differing interpretations visible. It is an artistic exploration of designed behavioural assumptions, rather than a validated model of human communication.

### My role & collaborators

I developed the concept, interfaces, print materials, and software with assistance from AI coding tools. Andreas Ingerl supported the installation design. Lennard Lev and Thomas Kemnitz helped realise the Ars Electronica exhibition.

### Outcome & learning

Visitors were curious about their agents and how messages changed. The joystick drew them in, and the satellite stations supported further exploration. Many understood the interaction and the idea that information changes through retelling, but the system's complexity made its broader purpose harder to grasp.

These are informal exhibition observations, rather than a structured visitor study. Further development would simplify the first interaction so visitors could begin experimenting before needing to understand the whole system.

### Key design decisions

I replaced numerical grouping by personality similarity with four Gerlach-inspired Big Five profiles that shaped agents' placement and behaviour. Each agent eventually received one fixed profile, while its worldview could develop through received information.

I also gave agents memory of earlier tellings. Repeated encounters could then bring an incoming statement into contact with an agent's previous interpretation, giving the exchange continuity.

### Expandable: Implementation details

One master computer runs the simulation, a local language model, and the shared data. The visitor stations and network display connect over a local network.

A BFI-10 questionnaire supplies Big Five scores used to assign each new agent to one of four Gerlach-inspired profiles. These profiles influence placement, connections, forwarding likelihood, and reframing. The profile remains fixed; the agent’s worldview develops through accumulated messages.

Strands Agents connects the agents to **Qwen3:8B**, running locally through **Ollama**. Retelling prompts combine personality and behavioural instructions with the current worldview, incoming statement, and available context about the sender and previous retelling. A prompt-based drift allowance guides the extent of change at each step.

A **Python** coordinator schedules agent activity and supplies state through a **WebSocket** server. Local CSV, JSON, and text files retain message versions and transmission records. **Electron, HTML, CSS, and JavaScript** support the interfaces; **Three.js** renders the network and message paths, allowing visitors to connect changes in wording with their route through the network.

### Skills & media

Retain the confirmed skill tags and collaborator/photo credits. Remove the repeated paragraph list of skills where it restates the role and key decisions already explained above. Keep the existing selected images, captions, and generous presentation; place them beside the appropriate narrative sections on phones. No media is removed solely to reach an arbitrary page-height target.

## Closing invitation and contact

I’m looking to join a team creating interactive experiences, installations, or exhibitions. If my approach fits your work, I’d like to talk.

- Email me: [wenk.julius@gmail.com](mailto:wenk.julius@gmail.com)
- Instagram: [@juliuswenk](https://www.instagram.com/juliuswenk/)
- GitHub: [juliuswenk](https://github.com/juliuswenk)

Repeat this contact group in About. Keep email as the primary action and the two profiles as secondary links. Use ordinary links; no contact form or automatic message sending.
