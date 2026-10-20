# DOXA

## At a glance

Visitors create an AI agent, introduce a statement, and watch it change as agents interpret and retell it across a simulated social network. Personalities and connections shape which information reaches each agent and how its worldview develops. The installation asks how different groups come to construct different truths. I developed the concept, interfaces, print materials, and software, with AI coding assistance and exhibition support from collaborators. First prototyped at HTW Berlin, DOXA was exhibited at Ars Electronica in 2026. Visitors engaged with their agents and messages, though the system’s complexity sometimes obscured the broader question.

## Short summary

*DOXA* is an interactive installation in which visitors create AI agents, introduce statements into a social network, and follow how those statements change as agents interpret and retell them. It explores how personalities, social connections, and the information circulating within different groups shape their views of the world.

## Context & timeframe

Developed as a semester project at HTW Berlin, *DOXA* was first presented as a prototype at *Liminal Fields* in February 2026. I developed it further over the following months for exhibition at Ars Electronica in September 2026.

The Ars Electronica installation combined a large network display with joystick navigation and satellite stations for guided exploration, agent creation, and information input. It invited exhibition visitors to explore the construction of truth through participation in a simulated social network.

## Question & concept

How do social structures and the information circulating within them shape how different groups construct truths?

Agents act as stand-ins for people: their personalities influence their behaviour, while their connections determine which information they can encounter. As they interpret and retell statements, different accounts circulate through the network and contribute to their evolving worldviews.

The intended visitor journey begins with the familiar invitation of a joystick. Visitors inspect the network on the main display, then move to a satellite station for a guided introduction. A short personality questionnaire creates an agent that acts independently on their behalf. They can introduce a statement and follow its subsequent retellings.

Returning later is intended to reveal both what their agent has heard and what their original statement has become. The simulation is an artistic exploration built from designed behavioural assumptions, rather than a validated model of human communication.

## My role & collaborators

I developed the concept, designed the interfaces and print materials, and developed the software with assistance from AI coding tools.

Andreas Ingerl supported the installation design. Lennard Lev and Thomas Kemnitz helped realise the exhibition at Ars Electronica.

## Process & key decisions

**From mathematical grouping to personality-based social behaviour.**  
The early system grouped agents through numerical similarity between personality traits. I moved to four Gerlach-inspired Big Five profiles to connect grouping with distinct behaviours. Profiles informed agents’ initial placement, connection preferences, and communication behaviour. A later simplification assigned each agent one fixed profile rather than a blend, while its worldview could continue to change through received information.

**From retelling messages to remembering earlier interpretations.**  
I extended the relay system with memory of an agent’s earlier telling of a statement. When it encountered that statement again, the incoming version could be interpreted alongside its previous wording. Worldview updates also drew on accumulated interpretations, giving repeated encounters continuity and supporting the emergence of different perspectives within the network.

## Implementation

One master computer runs the simulation, a local language model, and the shared data. The visitor stations and network display connect over a local network.

A BFI-10 questionnaire supplies Big Five scores used to assign each new agent to one of four Gerlach-inspired profiles. These profiles influence placement, connections, forwarding likelihood, and reframing. The profile remains fixed; the agent’s worldview develops through accumulated messages.

Strands Agents connects the agents to **Qwen3:8B**, running locally through **Ollama**. Retelling prompts combine personality and behavioural instructions with the current worldview, incoming statement, and available context about the sender and previous retelling. A prompt-based drift allowance guides the extent of change at each step.

A **Python** coordinator schedules agent activity and supplies state through a **WebSocket** server. Local CSV, JSON, and text files retain message versions and transmission records. **Electron, HTML, CSS, and JavaScript** support the interfaces; **Three.js** renders the network and message paths, allowing visitors to connect changes in wording with their route through the network.

## Outcome & evidence

The developed installation was exhibited at Ars Electronica in September 2026. Visitors were excited to see how their messages changed and curious about where their agents were placed and how they processed information independently. The joystick drew visitors in, and the satellite stations supported further engagement.

Visitors generally understood the basic interaction and accepted the premise that information changes through retelling. However, the project’s complexity created obstacles to understanding its broader purpose. Interest in the network did not necessarily mean that visitors understood how its many interacting parts related to the construction of truth.

These findings are based on informal exhibition observations, rather than a structured visitor study.

## Learning & reflection

Getting visitors interested in the network and its subject was easier than explaining all the moving parts. The installation offered several ways to explore, but visitors needed to understand a substantial amount before they could engage critically with the project.

Further development would revisit the visitor journey and reduce what people need to know before they can begin experimenting. I would focus on making the first interaction more approachable, allowing understanding to develop through participation.

## Skills & network connections

- **Critical Design:** Developed an artistic simulation that examines how social structures and communication shape the construction of truth.
- **Interaction Design:** Designed interfaces for network exploration, agent creation, statement input, and guided participation.
- **AI Systems:** Shaped the agent model through personality-based behaviour, retelling memory, and evolving worldviews, with AI assistance in implementation.
- **Creative Coding:** Developed the simulation and connected interfaces with assistance from AI coding tools.
- **Data Visualization:** Designed interfaces for inspecting agents, message versions, and transmission paths through the network.
- **Graphic Design:** Designed the project’s print materials.
