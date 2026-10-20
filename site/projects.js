// Editorial selection from the project descriptions. See PROJECT_GUIDE.md for attribution.
window.PORTFOLIO_PROJECTS = [
  {
    "id": 1,
    "title": "DOXA",
    "slug": "doxa",
    "atAGlance": "Visitors create an AI agent, introduce a statement, and watch it change as agents interpret and retell it across a simulated social network. Personalities and connections shape which information reaches each agent and how its worldview develops. The installation asks how different groups come to construct different truths. I developed the concept, interfaces, print materials, and software, with AI coding assistance and exhibition support from collaborators. First prototyped at HTW Berlin, DOXA was exhibited at Ars Electronica in 2026. Visitors engaged with their agents and messages, though the system’s complexity sometimes obscured the broader question.",
    "discipline": "Interactive installation",
    "summary": "*DOXA* is an interactive installation in which visitors create AI agents, introduce statements into a social network, and follow how those statements change as agents interpret and retell them. It explores how personalities, social connections, and the information circulating within different groups shape their views of the world.",
    "skills": [
      "Critical design",
      "Interaction design",
      "AI systems",
      "Creative coding",
      "Data visualization",
      "Graphic design"
    ],
    "hero": {
      "src": "assets/doxa-installation-hero.png",
      "width": 1536,
      "height": 1024,
      "title": "Installation overview",
      "credit": "",
      "use": "hero",
      "source": "Codex-Bild 18. Sept. 2026, 12_39_05.png"
    },
    "photos": [
      {
        "src": "assets/doxa-02.webp",
        "width": 1440,
        "height": 960,
        "title": "Visitor at the installation",
        "credit": "© Melissa Papafio-Roberts",
        "use": "network",
        "source": "1 DOXA © Melissa Papafio-Roberts.png"
      },
      {
        "src": "assets/doxa-03.webp",
        "width": 1440,
        "height": 960,
        "title": "Interface and input detail",
        "credit": "© Melissa Papafio-Roberts",
        "use": "network",
        "source": "4 DOXA © Melissa Papafio-Roberts.png"
      }
    ],
    "detailImages": [
      {
        "src": "assets/doxa-diagram.png",
        "width": 1517,
        "height": 1226,
        "title": "Agent behaviour and information flow",
        "credit": "",
        "use": "detail",
        "source": "Diagramm DOXA.png"
      },
      {
        "src": "assets/doxa-04.webp",
        "width": 1440,
        "height": 960,
        "title": "Side view of the installation",
        "credit": "© Melissa Papafio-Roberts",
        "use": "detail",
        "source": "3 DOXA © Melissa Papafio-Roberts.png"
      },
      {
        "src": "assets/doxa-05.webp",
        "width": 1440,
        "height": 1440,
        "title": "3D installation layout study",
        "credit": "",
        "use": "detail",
        "source": "Aufbau Sketch 3D.png"
      }
    ],
    "mediaSections": {"detailImages": [4, 0, 3], "photos": [5, 1]},
    "caseStudy": [
      {
        "title": "Context & timeframe",
        "text": "Developed as a semester project at HTW Berlin, *DOXA* was first presented as a prototype at *Liminal Fields* in February 2026. I developed it further over the following months for exhibition at Ars Electronica in September 2026.\n\nThe Ars Electronica installation combined a large network display with joystick navigation and satellite stations for guided exploration, agent creation, and information input. It invited exhibition visitors to explore the construction of truth through participation in a simulated social network."
      },
      {
        "title": "Question & concept",
        "text": "How do social structures and the information circulating within them shape how different groups construct truths?\n\nAgents act as stand-ins for people: their personalities influence their behaviour, while their connections determine which information they can encounter. As they interpret and retell statements, different accounts circulate through the network and contribute to their evolving worldviews.\n\nThe intended visitor journey begins with the familiar invitation of a joystick. Visitors inspect the network on the main display, then move to a satellite station for a guided introduction. A short personality questionnaire creates an agent that acts independently on their behalf. They can introduce a statement and follow its subsequent retellings.\n\nReturning later is intended to reveal both what their agent has heard and what their original statement has become. The simulation is an artistic exploration built from designed behavioural assumptions, rather than a validated model of human communication."
      },
      {
        "title": "My role & collaborators",
        "text": "I developed the concept, designed the interfaces and print materials, and developed the software with assistance from AI coding tools.\n\nAndreas Ingerl supported the installation design. Lennard Lev and Thomas Kemnitz helped realise the exhibition at Ars Electronica."
      },
      {
        "title": "Process & key decisions",
        "text": "**From mathematical grouping to personality-based social behaviour.**  \nThe early system grouped agents through numerical similarity between personality traits. I moved to four Gerlach-inspired Big Five profiles to connect grouping with distinct behaviours. Profiles informed agents’ initial placement, connection preferences, and communication behaviour. A later simplification assigned each agent one fixed profile rather than a blend, while its worldview could continue to change through received information.\n\n**From retelling messages to remembering earlier interpretations.**  \nI extended the relay system with memory of an agent’s earlier telling of a statement. When it encountered that statement again, the incoming version could be interpreted alongside its previous wording. Worldview updates also drew on accumulated interpretations, giving repeated encounters continuity and supporting the emergence of different perspectives within the network."
      },
      {
        "title": "Implementation",
        "text": "One master computer runs the simulation, a local language model, and the shared data. The visitor stations and network display connect over a local network.\n\nA BFI-10 questionnaire supplies Big Five scores used to assign each new agent to one of four Gerlach-inspired profiles. These profiles influence placement, connections, forwarding likelihood, and reframing. The profile remains fixed; the agent’s worldview develops through accumulated messages.\n\nStrands Agents connects the agents to **Qwen3:8B**, running locally through **Ollama**. Retelling prompts combine personality and behavioural instructions with the current worldview, incoming statement, and available context about the sender and previous retelling. A prompt-based drift allowance guides the extent of change at each step.\n\nA **Python** coordinator schedules agent activity and supplies state through a **WebSocket** server. Local CSV, JSON, and text files retain message versions and transmission records. **Electron, HTML, CSS, and JavaScript** support the interfaces; **Three.js** renders the network and message paths, allowing visitors to connect changes in wording with their route through the network."
      },
      {
        "title": "Outcome & evidence",
        "text": "The developed installation was exhibited at Ars Electronica in September 2026. Visitors were excited to see how their messages changed and curious about where their agents were placed and how they processed information independently. The joystick drew visitors in, and the satellite stations supported further engagement.\n\nVisitors generally understood the basic interaction and accepted the premise that information changes through retelling. However, the project’s complexity created obstacles to understanding its broader purpose. Interest in the network did not necessarily mean that visitors understood how its many interacting parts related to the construction of truth.\n\nThese findings are based on informal exhibition observations, rather than a structured visitor study."
      },
      {
        "title": "Learning & reflection",
        "text": "Getting visitors interested in the network and its subject was easier than explaining all the moving parts. The installation offered several ways to explore, but visitors needed to understand a substantial amount before they could engage critically with the project.\n\nFurther development would revisit the visitor journey and reduce what people need to know before they can begin experimenting. I would focus on making the first interaction more approachable, allowing understanding to develop through participation."
      }
    ],
    "skillEvidence": "**Critical Design:** Developed an artistic simulation that examines how social structures and communication shape the construction of truth.\n\n**Interaction Design:** Designed interfaces for network exploration, agent creation, statement input, and guided participation.\n\n**AI Systems:** Shaped the agent model through personality-based behaviour, retelling memory, and evolving worldviews, with AI assistance in implementation.\n\n**Creative Coding:** Developed the simulation and connected interfaces with assistance from AI coding tools.\n\n**Data Visualization:** Designed interfaces for inspecting agents, message versions, and transmission paths through the network.\n\n**Graphic Design:** Designed the project’s print materials."
  },
  {
    "id": 2,
    "title": "VISIO TECHNOLOGICA",
    "slug": "visio-technologica",
    "atAGlance": "A VR flight over Berlin lets visitors experience the city through simulated technological senses. Shifting their weight on an ICAROS fitness device steers the flight; camera cones reveal detailed surfaces, while live radio streams become spatial sound sources. The project asks how technological infrastructure shapes what we can perceive. I developed the concept, flight sensor, city-data streaming, and visibility shaders; Lennard Lev contributed interfaces and radio streaming, with AI tools assisting coding. Built over six weeks for a Futurium brief, the functioning installation was exhibited at HTW Berlin’s Werkschau in 2026.",
    "discipline": "VR experience for ICAROS",
    "summary": "*VISIO TECHNOLOGICA* is a VR installation in which visitors fly over Berlin using the ICAROS fitness device, perceiving the city through simulated technological senses. Camera cones reveal detailed surfaces while live radio streams occupy positions in the surrounding space, exploring how sensing systems reveal some parts of a city and leave others inaccessible.",
    "skills": [
      "XR design",
      "Interaction design",
      "Physical computing",
      "Creative coding",
      "Critical design"
    ],
    "hero": {
      "src": "assets/visio-technologica-city-hero.png",
      "width": 898,
      "height": 1752,
      "title": "Berlin scene with signal visualization",
      "credit": "",
      "use": "hero",
      "source": "Codex-Bild 18. Sept. 2026, 12_00_42.png"
    },
    "photos": [
      {
        "src": "assets/visio-technologica-02.webp",
        "width": 738,
        "height": 1440,
        "title": "Television tower scene",
        "credit": "",
        "use": "network",
        "source": "Bildschirmfoto 2026-09-18 um 11.53.10.png"
      },
      {
        "src": "assets/visio-technologica-03.webp",
        "width": 1286,
        "height": 1440,
        "title": "Street-level city geometry",
        "credit": "",
        "use": "network",
        "source": "Bildschirmfoto 2026-09-18 um 11.54.04.png"
      },
      {
        "src": "assets/visio-technologica-vr-participant.png",
        "width": 1086,
        "height": 1449,
        "title": "Participant wearing a VR headset on ICAROS",
        "credit": "",
        "use": "network",
        "source": "Codex-Bild 18. Sept. 2026, 11_55_01.png"
      }
    ],
    "detailImages": [
      {
        "src": "assets/visio-technologica-04.webp",
        "width": 1440,
        "height": 760,
        "title": "Berlin model overview",
        "credit": "",
        "use": "detail",
        "source": "Bildschirmfoto 2026-06-05 um 19.35.38.png"
      },
      {
        "src": "assets/visio-technologica-05.webp",
        "width": 1018,
        "height": 1440,
        "title": "City scene development view",
        "credit": "",
        "use": "detail",
        "source": "Bildschirmfoto 2026-09-18 um 11.53.55.png"
      }
    ],
    "mediaSections": {"detailImages": [1, 3], "photos": [4, 4, 5]},
    "caseStudy": [
      {
        "title": "Context & timeframe",
        "text": "Developed over six weeks in 2026 as a semester project at HTW Berlin for a Futurium Berlin brief. The task was to create a VR experience compatible with the ICAROS, exploring borrowed senses for technologically curious museum visitors across a broad age range.\n\nThe project connected with my employment at Futurium and HTW Berlin, through which I developed an additional orientation sensor for the ICAROS. This sensor enabled the flight interaction used in the experience. The completed installation was presented at HTW Berlin’s Werkschau in 2026."
      },
      {
        "title": "Question & concept",
        "text": "How does our relationship to a city change when we perceive it through its technological infrastructure?\n\nThe experience imagines a future in which advertising systems can track human perception. To evade them, people borrow the senses of the technological infrastructure around them. This fictional premise introduces a shift from familiar perception to a city experienced through cameras and radio signals.\n\nVisitors begin with their real surroundings visible through the headset. A sonar-like scan introduces the transition into a virtual Berlin, where they steer their flight by shifting their weight. Detailed city textures appear within camera cones; elsewhere, the city remains faintly visible. Live radio stations become spatial audio sources encountered during flight.\n\nA simulated battery gradually runs down, ending the borrowed perception and returning visitors to their surroundings. The experience invites reflection on what each sensing system makes accessible and what lies beyond its reach."
      },
      {
        "title": "My role & collaborators",
        "text": "I developed the concept and experience design, implemented streaming of Berlin’s 3D city data and the shaders controlling texture visibility, and developed the ICAROS orientation sensor through my employment at Futurium and HTW Berlin.\n\nLennard Lev designed the interfaces and implemented live radio streaming. OpenCode, Claude, and Codex assisted with coding. The Berlin city model was streamed through Cesium ion."
      },
      {
        "title": "Process & key decisions",
        "text": "**Making the limits of sensing visible.**  \nI used detailed textures inside camera cones to represent areas where a technical sensor could obtain reliable visual information. Outside those cones, faint geometry suggests a city that still exists beyond the sensor’s perception. The contrast makes selective access to the city central to the visual experience.\n\n**Generating camera positions from the city.**  \nAn algorithm analysed the 3D building geometry, identified top edges as candidate locations, and selected a limited number of camera positions per building. This connected placement to the city’s architecture. The resulting cones form a speculative visualization of technological perception; they do not document actual surveillance coverage."
      },
      {
        "title": "Implementation",
        "text": "The experience uses **WebXR, Three.js, and SvelteKit**, with Berlin’s 3D tiles streamed through **Cesium ion**. Custom shaders control which city textures become visible within the generated camera cones.\n\nAn added gyroscope sensor supplies orientation information from the ICAROS, allowing visitors to control flight direction by shifting their weight. Live radio streams are positioned as 3D audio sources within the city, making them audible from different directions as visitors move through the environment."
      },
      {
        "title": "Outcome & evidence",
        "text": "The completed VR installation was exhibited at HTW Berlin’s Werkschau in 2026. It combined weight-controlled flight, the transition from real surroundings into the virtual city, camera-dependent visibility, spatial live radio, and the simulated battery ending in a functioning experience."
      },
      {
        "title": "Learning & reflection",
        "text": "Developing the flight-direction sensor taught me to consider sensing, physical movement, and the virtual response as one connected experience. Their coordination is essential to making flight feel immersive and enjoyable."
      }
    ],
    "skillEvidence": "**XR Design:** Designed the transition between real surroundings and a virtual city experienced through borrowed senses.\n\n**Interaction Design:** Connected physical movement on the ICAROS with navigation through the experience.\n\n**Physical Computing:** Developed the additional gyroscope sensor supplying flight-direction input.\n\n**Creative Coding:** Implemented city streaming and selective-visibility shaders with AI coding assistance.\n\n**Critical Design:** Used a speculative sensing experience to question how technological infrastructure shapes access to the city."
  },
  {
    "id": 3,
    "title": "VEILED PANOPTICON",
    "slug": "veiled-panopticon",
    "atAGlance": "A person hidden from view changes WiFi signal strength, causing a shadowy figure to appear in a projection. The person being sensed cannot see the image, and the audience cannot see them: visitors discover the connection through each other. The installation questions the privacy we associate with walls and everyday wireless infrastructure. I developed the concept and sensing hardware, with AI assistance for software; Lennard Lev and Lena Eibel created the projection. Built in four days and shown internally at HTW Berlin, the prototype made concealed sensing tangible, although detection remained coarse and unreliable.",
    "video": "1191205459",
    "discipline": "Physical computing installation",
    "summary": "*Veiled Panopticon* is an installation that uses changes in WiFi signal strength to detect approximate human presence behind wooden panels and position a shadowy figure in a projection. By separating the person being sensed from those watching the visualisation, it makes concealed, camera-free sensing tangible and questions the privacy we associate with being hidden from view.",
    "skills": [
      "Critical design",
      "Physical computing",
      "Creative coding",
      "Interaction design",
      "Rapid prototyping"
    ],
    "hero": {
      "src": "assets/veiled-panopticon-01.webp",
      "width": 1080,
      "height": 1440,
      "title": "Live projection in the installation space",
      "credit": "",
      "use": "hero",
      "source": "IMG_2516.JPG"
    },
    "photos": [
      {
        "src": "assets/veiled-panopticon-02.webp",
        "width": 1080,
        "height": 1440,
        "title": "Hardware and installation setup",
        "credit": "",
        "use": "network",
        "source": "IMG_2471 2.JPG"
      },
      {
        "src": "assets/veiled-panopticon-03.webp",
        "width": 1080,
        "height": 1440,
        "title": "Sensing panels across the space",
        "credit": "",
        "use": "network",
        "source": "IMG_2487.JPG"
      }
    ],
    "detailImages": [
      {
        "src": "assets/veiled-panopticon-04.webp",
        "width": 1080,
        "height": 1440,
        "title": "Receiver mounted on a panel",
        "credit": "",
        "use": "detail",
        "source": "IMG_2486.JPG"
      },
      {
        "src": "assets/veiled-panopticon-05.webp",
        "width": 1440,
        "height": 744,
        "title": "Spatial context of the installation",
        "credit": "",
        "use": "detail",
        "source": "IMG_2496.JPG"
      },
      {
        "src": "assets/veiled-panopticon-06.webp",
        "width": 1080,
        "height": 1440,
        "title": "Installation entrance and signage",
        "credit": "",
        "use": "detail",
        "source": "IMG_2514.JPG"
      }
    ],
    "mediaSections": {"detailImages": [4, 0, 5], "photos": [3, 1]},
    "caseStudy": [
      {
        "title": "Context & timeframe",
        "text": "Developed in four days in 2026 as a short-term project within the Communication Design BA at HTW Berlin.\n\nThe brief was to turn invisible signals surrounding us into an experience. The completed prototype was shown at a small internal exhibition, inviting visitors to consider familiar technology as a designed system with capabilities they might not expect."
      },
      {
        "title": "Question & concept",
        "text": "What happens when walls no longer separate seen from unseen?\n\nThe installation explores how wireless signals can make a person's presence detectable without a camera or direct line of sight. It asks visitors to reconsider what the technological infrastructure around them enables, particularly when sensing can take place without their awareness.\n\nA person moving in front of the concealed sensors influences the position of a shadowy figure in the visualisation. The figure appears on the left, in the middle, or on the right according to which receiver detects their presence.\n\nThe person triggering the sensors cannot see the projection, while those watching it cannot see that person. Discovery happens between people: one observes the visual response, another causes it, and an exchange reveals the connection. This separation makes the act of observation asymmetric and brings questions of awareness and consent into the experience."
      },
      {
        "title": "My role & collaborators",
        "text": "I developed the concept, designed the sensing setup, and built the hardware installation. I developed the firmware and software with assistance from AI coding tools.\n\nLennard Lev and Lena Eibel developed the projection and visual language. Prof. Alexander Müller-Rakow and Christian Pflug guided the project from its initial concept to the final installation."
      },
      {
        "title": "Process & key decisions",
        "text": "**From accurate movement tracking to approximate presence.**  \nThe initial ambition was to track movement through wireless signals. Experiments with the hardware, receiver arrangement, and signal filtering revealed how difficult it was to distinguish meaningful changes from noise. Within the four-day development period, I reduced the scope to approximate presence detection across three positions.\n\n**From direct feedback to discovery between visitors.**  \nWe placed the sensors and projection so that the person triggering the system and those watching its output could not see each other. This concealed unreliable readings by preventing an immediate comparison between a person's position and the figure's response. It also made conversation part of discovering the sensing setup.\n\nThe reduced prototype still fulfilled the original intention: it made an invisible technological capability experiential, even though it could not deliver precise tracking."
      },
      {
        "title": "Implementation",
        "text": "The installation uses four Arduino Nano ESP32 boards based on the ESP32-S3: one WiFi sender and three receivers. The sensing hardware is concealed behind wooden panels.\n\nThe system reads received signal strength, or **RSSI**. A person moving between the sender and receivers changes the signal readings. The software interprets these changes as approximate presence at the left, middle, or right receiver and uses that position to place the projected figure.\n\nFinding useful thresholds and filters was a central technical challenge. The readings remained sensitive to noise, so the installation demonstrated coarse presence sensing rather than reliable movement tracking. The prototype used RSSI; channel state information, or **CSI**, is a proposed next step."
      },
      {
        "title": "Outcome & evidence",
        "text": "The completed installation prototype was presented at the internal exhibition at HTW Berlin. Visitors expressed fascination with the technological setup and discomfort when they learned that it relied on technology familiar from their own homes.\n\nThese responses suggest that the installation achieved its central goal: making concealed sensing tangible and prompting visitors to reconsider the capabilities of everyday infrastructure. Detection remained unreliable, limiting how accurately the figure could represent a person's position.\n\nThese findings come from informal visitor comments and exhibition observations, rather than a structured study or measured evaluation of sensing accuracy."
      },
      {
        "title": "Learning & reflection",
        "text": "The project sparked my interest in physical computing and in thinking through hardware as well as software. Working within the limits of the sensing setup required me to reconsider both the technical ambition and how visitors would encounter the result.\n\nI learned that shaping an experience around hardware limitations can preserve an artistic intention, while leaving important technical questions unresolved. Separating sensing from viewing supported discovery between visitors, but also concealed the instability of the measurements.\n\nFurther development would focus on improving the reliability of presence detection and incorporating CSI to explore more accurate tracking and movement detection."
      }
    ],
    "skillEvidence": "**Critical Design:** Developed an installation that questions privacy, consent, and the hidden sensing capabilities of familiar infrastructure.\n\n**Physical Computing:** Designed and built an ESP32 sender-and-receiver setup connecting wireless measurements to a spatial installation.\n\n**Creative Coding:** Developed firmware and software with AI coding assistance to interpret signal changes and connect approximate presence to the visual output.\n\n**Interaction Design:** Designed the sensing setup within a visitor experience where observation and conversation reveal the connection between movement and visual response.\n\n**Rapid Prototyping:** Tested receiver arrangements and signal filtering, then adjusted the scope within four days of development.",
    "documentation": "https://juliuswenk.github.io/veiled-panopticon/"
  },
  {
    "id": 4,
    "title": "Improving Futurium",
    "slug": "improving-futurium",
    "atAGlance": "What if an AI character looked like you but represented information according to someone else’s intentions? This exhibition proposal invites visitors to create a character from their photograph, accompany it through information stations, and adjust its responses in a final conversation on a holographic fan display. The aim is to question AI’s apparent objectivity. In five days, our team developed the spatial concept, and I built the character-generation, animation, and display workflow. Presented to Futurium in 2025, the result combined spatial visualisations with a working character display; the dialogue was prepared in advance.",
    "discipline": "Exhibition concept",
    "summary": "*Improving Futurium* is an interactive exhibition concept in which visitors create an AI character from their own photograph, accompany it through information stations, and speak with it at the end. By manipulating how their character responds, visitors are invited to question AI’s apparent objectivity and explore how it can frame information according to different intentions.",
    "skills": [
      "Critical design",
      "Interaction design",
      "Rapid prototyping",
      "3d visualization",
      "Spatial storytelling"
    ],
    "hero": {
      "src": "assets/improving-futurium-01.webp",
      "width": 1440,
      "height": 1440,
      "title": "Exhibition walkthrough visualization",
      "credit": "Spatial visualisation by Conrad · exhibition proposal",
      "use": "hero",
      "source": "4if.jpg"
    },
    "photos": [
      {
        "src": "assets/improving-futurium-02.webp",
        "width": 1440,
        "height": 1440,
        "title": "Proposed character selection station",
        "credit": "Spatial visualisation by Conrad · exhibition proposal",
        "use": "network",
        "source": "3.jpg"
      },
      {
        "src": "assets/improving-futurium-03.webp",
        "width": 1440,
        "height": 1440,
        "title": "Proposed final conversation area",
        "credit": "Spatial visualisation by Conrad · exhibition proposal",
        "use": "network",
        "source": "if10.jpg"
      }
    ],
    "detailImages": [
      {
        "src": "assets/improving-futurium-04.webp",
        "width": 1440,
        "height": 1440,
        "title": "Exhibition scene detail",
        "credit": "Spatial visualisation by Conrad · exhibition proposal",
        "use": "detail",
        "source": "6if.jpg"
      },
      {
        "src": "assets/improving-futurium-05.webp",
        "width": 1440,
        "height": 1440,
        "title": "Spatial layout from above",
        "credit": "Spatial visualisation by Conrad · exhibition proposal",
        "use": "detail",
        "source": "7if.jpg"
      },
      {
        "src": "assets/improving-futurium-06.webp",
        "width": 1440,
        "height": 1440,
        "title": "Information stations and visitor route",
        "credit": "Spatial visualisation by Conrad · exhibition proposal",
        "use": "detail",
        "source": "9if.jpg"
      }
    ],
    "mediaSections": {"detailImages": [1, 3, 1], "photos": [1, 5]},
    "caseStudy": [
      {
        "title": "Context & timeframe",
        "text": "Developed over five days in October 2025 during *improvingFuturium*, a short-term educational project led by Andreas Ingerl.\n\nFuturium provided the brief to develop a concept for an exhibition area. We presented our proposal to Futurium at the end of the week, supported by spatial visualisations and a character demonstration."
      },
      {
        "title": "Question & concept",
        "text": "How can an exhibition help visitors recognise AI as a tool that can carry biases and frame information, rather than an inherently objective source of reasoning?\n\nThe proposed experience begins with a photograph of the visitor, used to generate a personalised 3D character. This character accompanies them through different information stations before appearing on a holographic fan display at the end of the exhibition.\n\nThere, visitors can talk to their character about what it encountered and manipulate its responses through parameters such as temperature and intention. The conversation becomes a way to explore how the same information can be represented differently depending on how a system is configured.\n\nThe character’s likeness connects this question to the visitor personally: resembling someone does not mean faithfully representing their perspective. Changing its behaviour is intended to expose the gap between apparent representation and a system shaped by particular purposes. This makes AI’s dual-use potential tangible through its capacity to inform, bias, or reframe an account."
      },
      {
        "title": "My role & collaborators",
        "text": "I developed the technological framework that translated the team’s ideas into a demonstration. I used Meshy to generate characters from images, Mixamo to animate them, Blender to render the animations, and the holographic fan software to prepare and display the result.\n\nWe developed the spatial concept together. Conrad created the spatial visualisations. Andreas Ingerl led the project, and Futurium provided the brief and received the final presentation."
      },
      {
        "title": "Process & key decisions",
        "text": "**Making the question personal.**  \nCreating a character from the visitor’s photograph connects the exhibition’s subject to their own representation. The character provides a personal point of reference for questioning whose perspective an AI response expresses.\n\n**Making framing adjustable.**  \nThe concept gives visitors control over the character’s responses. Manipulating its behaviour is intended to reveal how an apparently reasoning-based account can reflect different intentions and biases.\n\n**Connecting information with conversation.**  \nThe character accompanies visitors through the exhibition before becoming a conversational counterpart. The final exchange is intended to let visitors revisit the information encountered along the way and explore how the character represents it."
      },
      {
        "title": "Implementation",
        "text": "The character workflow begins with a visitor photograph. **Meshy** generates the character from the image, **Mixamo** supplies animation, and **Blender** renders the animated character. The holographic fan’s software prepares the rendered animation for display.\n\nWe demonstrated character creation and playback on the holographic fan. The dialogue interaction was prepared in advance because of the limited timeframe. Character accompaniment through the stations and an adjustable final conversation formed the proposed exhibition experience."
      },
      {
        "title": "Outcome & evidence",
        "text": "The project resulted in an exhibition proposal presented to Futurium, with spatial visualisations and a demonstration of character creation and fan display. The presentation communicated the intended experience through these elements and the prepared dialogue."
      },
      {
        "title": "Learning & reflection",
        "text": "The project taught me how to translate a complex topic into an understandable interactive concept within five days. My contribution centred on finding a technological workflow that could make the team’s idea concrete enough to demonstrate and discuss."
      }
    ],
    "skillEvidence": "**Critical Design:** Co-developed an exhibition concept questioning AI’s apparent objectivity and its capacity to carry biases and frame information.\n\n**Interaction Design:** Co-developed the relationship between character creation, information stations, and an adjustable final conversation.\n\n**Rapid Prototyping:** Created a technological framework for demonstrating the concept within five days.\n\n**3D Visualization:** Generated characters with Meshy, animated them with Mixamo, and rendered their animations in Blender for fan display; Conrad created the spatial visualisations.\n\n**Spatial Storytelling:** Co-developed a spatial concept linking information stations with a personalised character and a final conversation."
  },
  {
    "id": 5,
    "title": "Hyperreal",
    "slug": "hyperreal",
    "atAGlance": "Hyperreal is a chain-shaped 3D asset, presented here through an interactive 360° turntable that lets you inspect the necklace from different angles. The project folder contains Blender and GLB files. Its brief, intended use, authorship, design process, and outcome are still awaiting documentation, so this entry currently offers a visual introduction to the object.",
    "discipline": "3D asset · description pending",
    "role": "To confirm",
    "summary": "**WIP — project description awaiting revision.**\n\nA chain-shaped 3D asset is present in the project folder. The brief, intended use, and design process still need a description.",
    "process": "No description supplied. The rendered turntable animation is displayed as an interactive 360° preview.",
    "context": "Working title: folder says Raveboy; Blender file says Ravelord. Final title to confirm.",
    "skills": [],
    "hero": {
      "src": "assets/hyperreal-spin-poster.png",
      "width": 864,
      "height": 1080,
      "motion": {
        "webm": "assets/hyperreal-spin.webm",
        "hevc": "assets/hyperreal-spin.mov",
        "frames": 360,
        "fps": 25
      },
      "title": "Hyperreal Ravelord · interactive 3D necklace",
      "credit": "",
      "use": "hero",
      "source": "Animation/0000.png–0359.png → transparent turntable videos; frame 0000 used as poster"
    },
    "photos": [],
    "detailImages": []
  },
  {
    "id": 6,
    "title": "Matrix Lamp",
    "slug": "matrix-lamp",
    "atAGlance": "A personal gift became an exploration of ambient light, electronics, and visible construction. Five animations run across a 16 × 16 LED matrix; one knob selects the animation, colour, and brightness. Acrylic layers and a metal rear plate are held apart by threaded rods, keeping the parts accessible for repair and modification. I planned and fabricated the structure, soldered the electronics, and created the animations, with AI assistance for electronics layout and firmware. Completed in two weeks in October 2026, the lamp worked well in use, although pressing the knob can shift the object.",
    "discipline": "Lamp",
    "summary": "*Matrix Lamp* is an ambient light made as a personal gift. Five animations play across a 16 × 16 LED matrix, while an exposed, layered construction reveals how the object is assembled.",
    "skills": [
      "Physical computing",
      "Digital fabrication",
      "Object design",
      "Interaction design"
    ],
    "hero": {
      "src": "assets/matrix-lamp-hero.png",
      "width": 1086,
      "height": 1448,
      "title": "Finished Matrix Lamp · transparent cutout",
      "credit": "",
      "use": "hero",
      "source": "Final Lamp/IMG_3335.JPG → matrix-lamp-cutout.png"
    },
    "photos": [
      {
        "src": "assets/matrix-lamp-network-led-detail.png",
        "width": 1086,
        "height": 1448,
        "title": "LED matrix and layered construction",
        "credit": "",
        "source": "Final Lamp/IMG_3349.JPG → Studio/matrix-lamp-studio-led-detail.png → Cutouts/matrix-lamp-network-led-detail.png",
        "use": "network"
      },
      {
        "src": "assets/matrix-lamp-network-profile.png",
        "width": 1086,
        "height": 1448,
        "title": "Side profile and panel spacing",
        "credit": "",
        "source": "Final Lamp/IMG_3342.JPG → Studio/matrix-lamp-studio-profile.png → Cutouts/matrix-lamp-network-profile.png",
        "use": "network"
      }
    ],
    "detailImages": [
      {
        "src": "assets/matrix-lamp-06.webp",
        "width": 1200,
        "height": 1600,
        "title": "Early light and breadboard test",
        "credit": "",
        "use": "detail",
        "source": "IMG_3280.JPG"
      },
      {
        "src": "assets/matrix-lamp-05.webp",
        "width": 1200,
        "height": 1600,
        "title": "Diffuser and LED matrix assembly",
        "credit": "",
        "use": "detail",
        "source": "IMG_3292.JPG"
      },
      {
        "src": "assets/matrix-lamp-network-led-detail.png",
        "width": 1086,
        "height": 1448,
        "title": "LED matrix and layered construction",
        "credit": "",
        "source": "Final Lamp/IMG_3349.JPG → Studio/matrix-lamp-studio-led-detail.png → Cutouts/matrix-lamp-network-led-detail.png",
        "use": "detail"
      },
      {
        "src": "assets/matrix-lamp-network-profile.png",
        "width": 1086,
        "height": 1448,
        "title": "Side profile and panel spacing",
        "credit": "",
        "source": "Final Lamp/IMG_3342.JPG → Studio/matrix-lamp-studio-profile.png → Cutouts/matrix-lamp-network-profile.png",
        "use": "detail"
      },
      {
        "src": "assets/matrix-lamp-studio-rear.webp",
        "width": 1086,
        "height": 1448,
        "title": "Rear view and metal finish",
        "credit": "",
        "source": "Final Lamp/IMG_3347.JPG → Studio/matrix-lamp-studio-rear.png",
        "use": "detail"
      },
      {
        "src": "assets/matrix-lamp-studio-front.webp",
        "width": 1086,
        "height": 1448,
        "title": "Front view in purple light",
        "credit": "",
        "source": "Final Lamp/IMG_3333.JPG → Studio/matrix-lamp-studio-front.png",
        "use": "detail"
      }
    ],
    "mediaSections": {
      "detailImages": [
        3,
        3,
        3,
        3,
        4,
        5
      ],
      "photos": [
        3,
        3
      ]
    },
    "caseStudy": [
      {
        "title": "Context & timeframe",
        "text": "A private, self-directed project built over two weeks in October 2026."
      },
      {
        "title": "Intention & design",
        "text": "The project was an opportunity to develop my electronics and fabrication skills while creating calming ambient light. I wanted the lamp to be easy to repair and modify, with its parts and their relationships visible."
      },
      {
        "title": "My role & assistance",
        "text": "I developed the build plan, fabricated the plates, assembled the structure, soldered the components, and created the animations. AI tools assisted with the electronics layout and firmware coding."
      },
      {
        "title": "Process & key decisions",
        "text": "I initially planned a bent aluminium enclosure, then switched to separate layers held together with threaded rods and nuts. This simplified fabrication, made the components accessible, and turned the construction itself into part of the lamp’s appearance.\n\nLearning to solder and assemble the electronics was the most experimental part of the build."
      },
      {
        "title": "Construction & interaction",
        "text": "Two laser-cut acrylic sheets and a metal rear plate, cut with a mechanical saw, form the layered structure.\n\nA single knob controls animation selection, colour, and brightness. Pressing it cycles between these three settings; turning it adjusts the selected setting."
      },
      {
        "title": "Finished object & use",
        "text": "The lamp was completed on time and given to its recipient. It worked well in use, providing the intended ambient lighting."
      },
      {
        "title": "Learning & reflection",
        "text": "The build gave me practical experience in soldering, fabrication, and assembly. It also revealed an interaction problem: pressing the knob can shift the lamp because of its placement. For another version, I would choose a different control arrangement."
      },
      {
        "title": "Studio edits",
        "text": "Four edited photographs replace the home background with a white studio setting and soft lighting. They are presentation edits, not documentation of an actual studio shoot. Original angles and lamp components were used as invariants; originals are preserved for reference."
      }
    ],
    "skillEvidence": "**Physical Computing:** Electronics assembly and soldering.\n\n**Digital Fabrication:** Laser cutting and component fabrication.\n\n**Object Design:** Accessible, layered construction.\n\n**Interaction Design:** Animation, colour, and brightness control."
  },
  {
    "id": 7,
    "title": "Carry the Computation",
    "slug": "carry-the-computation",
    "atAGlance": "Visitors use eight physical switches to copy illuminated binary patterns, helping an AI continue its computation—or deliberately introducing errors. Their inputs can change a dialogue between two local language models, printed on a receipt printer. The installation asks who carries responsibility when an apparently autonomous machine depends on human participation. I developed the concept, interaction, and controller, directing and testing AI-assisted software and firmware. Built in one week in October 2026, it was tested at an internal course presentation. The tactile task drew people in, but sometimes became a game that distracted from the conversation.",
    "discipline": "Interactive installation",
    "skills": [
      "Interaction design",
      "Physical computing",
      "Creative coding",
      "Critical design",
      "Rapid prototyping"
    ],
    "hero": {
      "src": "assets/carry-the-computation-setup.webp",
      "width": 1122,
      "height": 1402,
      "title": "Controller wiring and receipt printer together",
      "credit": "",
      "use": "hero",
      "source": "Projekte/Carry the computation/exec-e2079ca6-dd1a-4cab-97e1-df8a335c112b.png"
    },
    "photos": [
      {
        "src": "assets/carry-the-computation-controller.webp",
        "width": 1122,
        "height": 1402,
        "title": "Controller switches, LEDs, and exposed construction",
        "credit": "",
        "use": "network",
        "source": "Projekte/Carry the computation/exec-615b3456-5408-41f0-b907-238e089e47f7.png"
      },
      {
        "src": "assets/carry-the-computation-receipts.webp",
        "width": 1122,
        "height": 1402,
        "title": "Printed conversation records and transfer accuracy",
        "credit": "",
        "use": "network",
        "source": "Projekte/Carry the computation/exec-21975189-1039-4e95-896e-45454aea740a.png"
      }
    ],
    "detailImages": [
      {
        "src": "assets/carry-the-computation-printer.webp",
        "width": 1122,
        "height": 1402,
        "title": "Thermal printer with the interaction instructions",
        "credit": "",
        "use": "detail",
        "source": "Projekte/Carry the computation/exec-b2942067-4603-4095-aef2-85723391717f.png"
      }
    ],
    "summary": "*Carry the Computation* is an interactive installation in which visitors transfer numerical data through an AI’s computation using eight physical switches. Accurate inputs or deliberate errors influence a printed dialogue between two language models, exposing questions of responsibility, dependence, and apparent machine autonomy.",
    "mediaSections": {
      "photos": [
        4,
        5
      ],
      "detailImages": [
        4
      ]
    },
    "caseStudy": [
      {
        "title": "Context & timeframe",
        "text": "Developed in one week in October 2026 during *Agents in Debate: Autonomy, AI, and Artistic Creation*, a university project course led by Martín Nadal.\n\nThe open brief explored interacting AI agents as participants in artistic creation. My response introduced a human participant whose physical actions would influence the exchange. The completed installation was tested at the course’s internal presentation."
      },
      {
        "title": "Question & concept",
        "text": "What happens when an apparently autonomous AI depends on a person to continue its computation—and that person can cooperate or interfere?\n\nVisitors copy illuminated binary patterns using eight keyboard switches and confirm each byte with a ninth button. Across 32 transfers, their inputs enter the language model’s inference process and can change its answer.\n\nA second, unaffected model acts as a simulated human user: it reads the answer, reacts, and asks another question. Their conversation unfolds on a receipt printer.\n\nThe installation investigates responsibility within human–machine systems and how readily we perceive intention or emotion in generated language."
      },
      {
        "title": "My role & collaborators",
        "text": "I developed the concept, directed the interaction and physical design, selected components, assembled and soldered the controller, evaluated experiments, and tested the installation.\n\nCodex assisted with software, firmware, wiring documentation, and debugging. I directed and evaluated these implementations against the artistic intention. Martín Nadal led the course; presentation participants contributed informal feedback."
      },
      {
        "title": "Process & key decisions",
        "text": "**From model damage to carrying computation.**  \nThe original idea involved corrupting model weights. Transferring intermediate numerical data more directly expressed the visitor’s role within the machine’s operation.\n\n**From real interference to noticeable consequences.**  \nExperiments showed that computational errors could leave answers unchanged or cause abrupt breakdown. I compared intervention points and calibrated altered token-selection data alongside additional numerical interference. Technical authenticity alone did not make the consequences understandable or proportional to the error count.\n\n**From isolated answers to dialogue.**  \nA separate simulated user gave the altered output a recipient. Reactions, misunderstandings, and follow-up questions extended the consequences beyond a single piece of broken text."
      },
      {
        "title": "Implementation",
        "text": "The installation combines a custom controller, a laptop running two local language models, and an Epson TM-m30 thermal receipt printer.\n\nThe controller uses an Arduino Nano ESP32, nine mechanical switches, seventeen red LEDs, and three SN74HC595 shift registers on perfboard. Two LED rows show the target byte and the visitor’s selected bits. USB serial communication connects it to a Python application with a browser interface for testing, dialogue history, and receipt previews.\n\n**Qwen2.5-0.5B-Instruct**, running through **PyTorch and Hugging Face Transformers**, generates the machine’s answers. Visitors transfer eight quantized candidate-strength values at each of four generation steps. These 32 bytes influence token selection and subsequent generation; copying errors also control calibrated numerical noise.\n\nThe simulated user runs separately through **Ollama using Qwen3:8B**, receiving the actual conversation without byte interference. Its emotional reactions are generated behaviour, not felt experience. Saved progress allows another visitor to continue an unfinished transfer."
      },
      {
        "title": "Outcome & evidence",
        "text": "Visitors at the internal presentation responded positively to physically operating the machine. The tactile switches and pattern-copying challenge encouraged participation. Some deliberately introduced errors after understanding their role; casual participants generally aimed for accuracy. Visitors also expressed surprise at the simulated user’s human-like reactions.\n\nHowever, the controller sometimes became a game to “beat.” Participants focused on speed and accuracy, reading the printed conversation afterward. The input attracted attention but could distract from the dialogue and reflection on responsibility.\n\nThese findings came from informal feedback and observation, rather than a structured visitor study."
      },
      {
        "title": "Learning & reflection",
        "text": "Rapid prototyping revealed three distinct challenges: intervening in computation, making the effects noticeable, and making them meaningful.\n\nI also learned that a satisfying interface can compete with its conceptual purpose. The controller encouraged participation, but its game-like structure sometimes rewarded optimisation over reflection.\n\nFurther development would give the dialogue and printed output greater spatial emphasis and explore more legible relationships between visitor input, randomness, and coherence."
      }
    ],
    "skillEvidence": "**Interaction Design:** Designed byte transfer, confirmation, handover, and feedback; observed their effect on visitor attention.\n\n**Physical Computing:** Selected components, soldered the controller, and tested hardware–software communication.\n\n**Creative Coding:** Directed and tested AI-assisted model intervention, dialogue orchestration, and receipt printing.\n\n**Critical Design:** Investigated responsibility, dependence, and perceived AI autonomy through participation.\n\n**Rapid Prototyping:** Compared computational interventions and iterated across software and hardware within one week."
  }
];
