// Edited portfolio stories; original descriptions and editorial sources are documented in PROJECT_GUIDE.md.
window.PORTFOLIO_PROJECTS = [
  {
    "id": 1,
    "title": "DOXA",
    "slug": "doxa",
    "atAGlance": "How do different groups come to construct different truths? DOXA lets visitors create AI agents and follow statements as they change across a simulated social network. I developed the concept, interfaces, print materials, and software, with AI coding assistance and exhibition support. Exhibited at Ars Electronica in 2026, it drew visitors into the exchange, though the system’s complexity sometimes obscured the broader question.",
    "discipline": "Interactive installation",
    "skills": [
      "Critical design",
      "Interaction design",
      "AI systems",
      "Creative coding",
      "Data visualization",
      "Graphic design"
    ],
    "hero": {
      "src": "assets/doxa-installation-melissa.webp",
      "width": 3000,
      "height": 2000,
      "title": "Installation overview",
      "credit": "© Melissa Papafio-Roberts",
      "use": "hero",
      "source": "2 DOXA © Melissa Papafio-Roberts.png"
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
        "source": "Diagramm DOXA.png",
        "transparent": true
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
    "mediaSections": {
      "detailImages": [
        3,
        0,
        1
      ],
      "photos": [
        3,
        0
      ]
    },
    "caseStudy": [
      {
        "title": "Experience & intention",
        "text": "A joystick invites visitors to inspect the network. At satellite stations, a short personality questionnaire creates an agent that acts independently on their behalf. Visitors can introduce statements and follow how agents interpret and retell them. Returning later reveals what their agent has heard and how their statement has changed.\n\nThe simulation makes social connections and differing interpretations visible. It is an artistic exploration of designed behavioural assumptions, rather than a validated model of human communication."
      },
      {
        "title": "My role & collaborators",
        "text": "I developed the concept, interfaces, print materials, and software with assistance from AI coding tools. Andreas Ingerl supported the installation design. Lennard Lev and Thomas Kemnitz helped realise the Ars Electronica exhibition."
      },
      {
        "title": "Outcome & learning",
        "text": "Visitors were curious about their agents and how messages changed. The joystick drew them in, and the satellite stations supported further exploration. Many understood the interaction and the idea that information changes through retelling, but the system's complexity made its broader purpose harder to grasp.\n\nThese are informal exhibition observations, rather than a structured visitor study. Further development would simplify the first interaction so visitors could begin experimenting before needing to understand the whole system."
      },
      {
        "title": "Key design decisions",
        "text": "I replaced numerical grouping by personality similarity with four Gerlach-inspired Big Five profiles that shaped agents' placement and behaviour. Each agent eventually received one fixed profile, while its worldview could develop through received information.\n\nI also gave agents memory of earlier tellings. Repeated encounters could then bring an incoming statement into contact with an agent's previous interpretation, giving the exchange continuity."
      },
      {
        "title": "Implementation details",
        "text": "One master computer runs the simulation, a local language model, and the shared data. The visitor stations and network display connect over a local network.\n\nA BFI-10 questionnaire supplies Big Five scores used to assign each new agent to one of four Gerlach-inspired profiles. These profiles influence placement, connections, forwarding likelihood, and reframing. The profile remains fixed; the agent’s worldview develops through accumulated messages.\n\nStrands Agents connects the agents to **Qwen3:8B**, running locally through **Ollama**. Retelling prompts combine personality and behavioural instructions with the current worldview, incoming statement, and available context about the sender and previous retelling. A prompt-based drift allowance guides the extent of change at each step.\n\nA **Python** coordinator schedules agent activity and supplies state through a **WebSocket** server. Local CSV, JSON, and text files retain message versions and transmission records. **Electron, HTML, CSS, and JavaScript** support the interfaces; **Three.js** renders the network and message paths, allowing visitors to connect changes in wording with their route through the network.",
        "expandable": true
      }
    ],
    "context": "Interactive installation · HTW Berlin · 2026\n\nFirst prototyped for *Liminal Fields* in February; developed further for Ars Electronica in September.",
    "editorialSource": "Projekte/DOXA/portfolio-editorial.md"
  },
  {
    "id": 2,
    "title": "VISIO TECHNOLOGICA",
    "slug": "visio-technologica",
    "atAGlance": "How does a city change when we perceive it through technological infrastructure? VISIO TECHNOLOGICA lets visitors fly through a virtual Berlin using the ICAROS, borrowing camera and radio perception. I developed the concept, city streaming, visibility shaders, and flight-direction sensor, with coding assistance and interface and audio work by Lennard Lev. The functioning VR installation was exhibited at HTW Berlin’s Werkschau in 2026.",
    "discipline": "VR experience for ICAROS",
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
      "source": "Codex-Bild 18. Sept. 2026, 12_00_42.png",
      "transparent": true
    },
    "photos": [
      {
        "src": "assets/visio-technologica-vr-participant.png",
        "width": 1086,
        "height": 1449,
        "title": "Participant wearing a VR headset on ICAROS",
        "credit": "",
        "use": "network",
        "source": "Codex-Bild 18. Sept. 2026, 11_55_01.png",
        "transparent": true
      }
    ],
    "detailImages": [
      {
        "src": "assets/visio-technologica-vr-participant.png",
        "width": 1086,
        "height": 1449,
        "title": "Participant wearing a VR headset on ICAROS",
        "credit": "",
        "use": "detail",
        "source": "Codex-Bild 18. Sept. 2026, 11_55_01.png",
        "transparent": true
      },
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
    "mediaSections": {
      "detailImages": [
        0,
        1,
        3
      ],
      "photos": [
        0
      ]
    },
    "caseStudy": [
      {
        "title": "Experience & intention",
        "text": "In a fictional future where advertising systems track human perception, visitors evade them by borrowing technological senses. Headset passthrough gives way to a sonar-like scan of Berlin. Shifting their weight on the ICAROS controls flight; detailed textures appear inside camera cones, while faint geometry remains outside. Live radio streams become spatial audio sources.\n\nA simulated battery ends the experience and returns visitors to their surroundings. Designed for technologically curious museum visitors across a broad age range, the journey asks what each sensing system makes accessible and what remains beyond its reach."
      },
      {
        "title": "My role & collaborators",
        "text": "I developed the concept and experience design, streamed Berlin’s 3D city data, and implemented the selective-visibility shaders. Through my employment at Futurium and HTW Berlin, I developed the additional ICAROS orientation sensor used for flight.\n\nLennard Lev designed the interfaces and implemented live radio streaming. OpenCode, Claude, and Codex assisted with coding. The city model was streamed through Cesium ion."
      },
      {
        "title": "Outcome & learning",
        "text": "The completed installation combined weight-controlled flight, the transition from real surroundings into Berlin, selective visibility, spatial live radio, and the battery ending in a functioning experience exhibited at HTW Berlin’s Werkschau in 2026.\n\nDeveloping the sensor taught me to consider sensing, physical movement, and virtual response as one connected experience. Their coordination shapes how immersive and enjoyable the flight feels."
      },
      {
        "title": "Key design decisions",
        "text": "Detailed textures within camera cones and faint geometry elsewhere make the limits of technical perception part of the experience.\n\nAn algorithm identifies building top edges and selects camera positions from the city geometry. These cones are a speculative visualization of technological perception; they do not document actual surveillance coverage."
      },
      {
        "title": "Implementation details",
        "text": "The experience uses **WebXR, Three.js, and SvelteKit**, with Berlin’s 3D tiles streamed through **Cesium ion**. Custom shaders control which city textures become visible within the generated camera cones.\n\nAn added gyroscope sensor supplies orientation information from the ICAROS, allowing visitors to control flight direction by shifting their weight. Live radio streams are positioned as 3D audio sources within the city, making them audible from different directions as visitors move through the environment.",
        "expandable": true
      }
    ],
    "context": "VR installation · HTW Berlin / Futurium brief · 2026 · Six weeks",
    "editorialSource": "Projekte/VISIO TECHNOLOGICA/portfolio-editorial.md"
  },
  {
    "id": 3,
    "title": "VEILED PANOPTICON",
    "slug": "veiled-panopticon",
    "atAGlance": "What happens when walls no longer separate seen from unseen? VEILED PANOPTICON uses WiFi signal changes to make a hidden person’s presence affect a projected figure. I developed the concept, sensing setup, and hardware, with AI-assisted firmware and software and collaborators’ projection design. Built in four days and shown internally at HTW Berlin, the prototype prompted fascination and discomfort, while its noisy sensing remained approximate.",
    "video": "1191205459",
    "discipline": "Physical computing installation",
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
    "mediaSections": {
      "detailImages": [
        3,
        0,
        4
      ],
      "photos": [
        1,
        0
      ]
    },
    "caseStudy": [
      {
        "title": "Experience & intention",
        "text": "A person near concealed sensors affects a shadowy figure’s position: left, middle, or right. They cannot see the projection, while its audience cannot see them. Conversation reveals who is causing the response and how.\n\nThe course brief asked us to make invisible signals experiential. Using familiar WiFi infrastructure without a camera or direct line of sight turns concealed sensing into a question of awareness, privacy, and consent."
      },
      {
        "title": "My role & collaborators",
        "text": "I developed the concept, designed the sensing setup, and built the hardware installation. AI coding tools assisted with firmware and software.\n\nLennard Lev and Lena Eibel developed the projection and visual language. Prof. Alexander Müller-Rakow and Christian Pflug guided the project."
      },
      {
        "title": "Outcome & learning",
        "text": "At the small internal exhibition, visitors expressed fascination with the setup and discomfort at its use of technology familiar from their homes. These were informal comments and observations, not a structured study or measured evaluation of sensing accuracy.\n\nDetection remained unreliable. Working around this limitation sparked my interest in physical computing, while showing how an experience can preserve an artistic intention and conceal technical instability. Further work would improve sensing reliability."
      },
      {
        "title": "Key design decisions",
        "text": "Experiments with receiver placement and filtering could not separate movement reliably from signal noise within four days. I reduced the ambition from accurate tracking to approximate presence across three positions.\n\nSeparating the sensors from the projection made discovery happen between visitors. It also concealed unreliable readings by preventing an immediate comparison between a person’s position and the figure’s response. This limitation remains part of how I assess the prototype."
      },
      {
        "title": "Implementation details",
        "text": "The installation uses four Arduino Nano ESP32 boards based on the ESP32-S3: one WiFi sender and three receivers. The sensing hardware is concealed behind wooden panels.\n\nThe system reads received signal strength, or **RSSI**. A person moving between the sender and receivers changes the signal readings. The software interprets these changes as approximate presence at the left, middle, or right receiver and uses that position to place the projected figure.\n\nFinding useful thresholds and filters was a central technical challenge. The readings remained sensitive to noise, so the installation demonstrated coarse presence sensing rather than reliable movement tracking. The prototype used RSSI; channel state information, or **CSI**, is a proposed next step.",
        "expandable": true
      }
    ],
    "documentation": "https://juliuswenk.github.io/veiled-panopticon/",
    "context": "Installation prototype · HTW Berlin · 2026 · Four days",
    "editorialSource": "Projekte/VEILED PANOPTICON/portfolio-editorial.md"
  },
  {
    "id": 4,
    "title": "Improving Futurium",
    "slug": "improving-futurium",
    "atAGlance": "How can an exhibition make AI’s biases and framing tangible? Improving Futurium proposes a personalised character that accompanies visitors and later discusses the exhibition with them. I developed the character-generation and holographic-fan workflow within a team concept. In five days, we produced spatial visualisations and a working character demonstration for Futurium; the dialogue was prepared in advance, while the full exhibition remained a proposal.",
    "discipline": "Exhibition concept",
    "skills": [
      "Critical design",
      "Interaction design",
      "Rapid prototyping",
      "3D visualization",
      "Spatial storytelling"
    ],
    "hero": {
      "src": "assets/improving-futurium-01.webp",
      "width": 1440,
      "height": 1440,
      "title": "Exhibition walkthrough visualization",
      "credit": "Spatial visualisation by Conrad Lischewsky · exhibition proposal",
      "use": "hero",
      "source": "4if.jpg"
    },
    "photos": [
      {
        "src": "assets/improving-futurium-02.webp",
        "width": 1440,
        "height": 1440,
        "title": "Proposed character selection station",
        "credit": "Spatial visualisation by Conrad Lischewsky · exhibition proposal",
        "use": "network",
        "source": "3.jpg"
      },
      {
        "src": "assets/improving-futurium-03.webp",
        "width": 1440,
        "height": 1440,
        "title": "Proposed final conversation area",
        "credit": "Spatial visualisation by Conrad Lischewsky · exhibition proposal",
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
        "credit": "Spatial visualisation by Conrad Lischewsky · exhibition proposal",
        "use": "detail",
        "source": "6if.jpg"
      },
      {
        "src": "assets/improving-futurium-05.webp",
        "width": 1440,
        "height": 1440,
        "title": "Spatial layout from above",
        "credit": "Spatial visualisation by Conrad Lischewsky · exhibition proposal",
        "use": "detail",
        "source": "7if.jpg"
      },
      {
        "src": "assets/improving-futurium-06.webp",
        "width": 1440,
        "height": 1440,
        "title": "Information stations and visitor route",
        "credit": "Spatial visualisation by Conrad Lischewsky · exhibition proposal",
        "use": "detail",
        "source": "9if.jpg"
      }
    ],
    "mediaSections": {
      "detailImages": [
        0,
        3,
        0
      ],
      "photos": [
        0,
        4
      ]
    },
    "caseStudy": [
      {
        "title": "Experience & intention",
        "text": "A visitor photograph becomes a 3D character that, in the proposed experience, accompanies them through information stations. On a holographic fan at the end, visitors would talk to it and adjust parameters such as temperature and intention.\n\nIts likeness makes representation personal: resembling a visitor does not mean faithfully expressing their perspective. Changing its behaviour would reveal how the same information can inform, bias, or reframe an account."
      },
      {
        "title": "My role & collaborators",
        "text": "I developed the technological framework for character generation, animation, rendering, and fan playback, turning the team’s ideas into a demonstration.\n\nWe developed the spatial concept together. Conrad Lischewsky created the spatial visualisations. Andreas Ingerl led the educational project; Futurium provided the brief and received the final presentation."
      },
      {
        "title": "Outcome & learning",
        "text": "We presented an exhibition proposal with spatial visualisations, character creation, and fan playback. Dialogue was prepared in advance; accompaniment through the stations and an adjustable live conversation were proposed features. This was a concept and demonstration, rather than an installed museum experience.\n\nI learned to turn a complex topic into a demonstrable concept within five days by finding a practical technological workflow."
      },
      {
        "title": "Key design decisions",
        "text": "A character based on the visitor’s photograph provides a personal reference for questioning whose perspective an AI response expresses. Adjustable behaviour would make framing visible. Connecting information stations with a final conversation gives visitors a way to revisit what they encountered."
      },
      {
        "title": "Implementation details",
        "text": "The character workflow begins with a visitor photograph. **Meshy** generates the character from the image, **Mixamo** supplies animation, and **Blender** renders the animated character. The holographic fan’s software prepares the rendered animation for display.\n\nWe demonstrated character creation and playback on the holographic fan. The dialogue interaction was prepared in advance because of the limited timeframe. Character accompaniment through the stations and an adjustable final conversation formed the proposed exhibition experience.",
        "expandable": true
      }
    ],
    "context": "Exhibition proposal and demonstration · Futurium brief · October 2025 · Five days",
    "editorialSource": "Projekte/Improving Futurium/portfolio-editorial.md"
  },
  {
    "id": 5,
    "title": "Hyperreal Ravelord",
    "slug": "hyperreal",
    "atAGlance": "Hyperreal Ravelord is a personal Blender study inspired by BEASTBOY’s album of the same name. Made in 2018 to explore 3D tools, it takes the chain—a subject in the music—as a digital object. I modelled the necklace, based its pendant on an existing SVG logo, and created the materials, lighting, and rendering setup. The result was a digital necklace with animated renders, intended entirely for the screen.",
    "discipline": "3D asset · description pending",
    "context": "Personal fan project · 2018 · Digital jewellery study · Blender",
    "skills": [
      "3D modeling",
      "Materials",
      "Lighting",
      "Rendering",
      "3D visualization"
    ],
    "hero": {
      "src": "assets/hyperreal-spin-poster.png",
      "width": 864,
      "height": 1080,
      "motion": {
        "webm": "assets/hyperreal-spin-web.webm",
        "hevc": "assets/hyperreal-spin.mov",
        "frames": 360,
        "fps": 25
      },
      "title": "Hyperreal Ravelord · interactive 3D necklace",
      "credit": "",
      "use": "hero",
      "source": "Animation/0000.png–0359.png → transparent turntable videos; frame 0000 used as poster",
      "transparent": true
    },
    "photos": [],
    "detailImages": [],
    "caseStudy": [
      {
        "title": "Intention & design",
        "text": "I wanted to explore what I could make with 3D tools through a subject connected to music I enjoyed. The chain offered a way to translate a motif from the album into an object, with an existing SVG logo providing the starting point for the pendant."
      },
      {
        "title": "My role & process",
        "text": "I modelled the necklace myself and developed its materials, lighting, and rendering setup entirely in Blender. The pendant was based on an existing SVG logo; the original graphic design was not my work."
      },
      {
        "title": "Outcome & reflection",
        "text": "The model and animated renders remained a personal study, with no physical production intended. Making it developed my understanding of modelling, lighting, and materials. Revisiting it now, I would improve the animation through a physics-based simulation to explore more dynamic movement."
      }
    ],
    "credits": "Musical reference: *Hyperreal Ravelord* by BEASTBOY. Independent fan project; pendant based on an existing SVG logo.",
    "editorialSource": "Projekte/Hyperreal Ravelord Kette 3D/portfolio-editorial.md"
  },
  {
    "id": 6,
    "title": "Matrix Lamp",
    "slug": "matrix-lamp",
    "atAGlance": "Matrix Lamp is a personal gift and an exploration of electronics and fabrication. I designed and built a layered lamp around a 16 × 16 LED matrix, creating five animations for calming ambient light with AI assistance on the electronics layout and firmware. Completed over two weeks in October 2026, it worked well in use, though pressing its control knob can shift the object.",
    "discipline": "Lamp",
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
      "source": "Final Lamp/IMG_3335.JPG → matrix-lamp-cutout.png",
      "transparent": true
    },
    "photos": [],
    "detailImages": [
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
      },
      {
        "src": "assets/matrix-lamp-06.webp",
        "width": 1200,
        "height": 1600,
        "title": "Early light and breadboard test",
        "credit": "",
        "use": "detail",
        "source": "IMG_3280.JPG"
      }
    ],
    "mediaSections": {
      "detailImages": [
        0,
        0,
        3
      ],
      "photos": []
    },
    "caseStudy": [
      {
        "title": "Intention & design",
        "text": "I wanted calming ambient light in an object whose construction remains visible. Making its parts accessible would also allow the lamp to be repaired and modified."
      },
      {
        "title": "My role & assistance",
        "text": "I developed the build plan, fabricated the plates, assembled the structure, soldered the components, and created the animations. AI tools assisted with the electronics layout and firmware coding."
      },
      {
        "title": "Outcome & learning",
        "text": "The lamp was completed on time and given to its recipient. It worked well as ambient lighting, while giving me practical experience in soldering, fabrication, and assembly.\n\nPressing the knob can shift the lamp because of its placement. For another version, I would choose a different control arrangement."
      },
      {
        "title": "Key design decisions",
        "text": "I initially planned a bent aluminium enclosure, then switched to separate layers held together with threaded rods and nuts. This simplified fabrication, made the components accessible, and turned the construction itself into part of the lamp’s appearance.\n\nLearning to solder and assemble the electronics was the most experimental part of the build."
      },
      {
        "title": "Construction & interaction",
        "text": "Two laser-cut acrylic sheets and a metal rear plate, cut with a mechanical saw, form the layered structure.\n\nA single knob controls animation selection, colour, and brightness. Pressing it cycles between these three settings; turning it adjusts the selected setting."
      },
      {
        "title": "Media presentation",
        "text": "Four edited photographs replace the home background with a white studio setting and soft lighting. They are presentation edits, not documentation of an actual studio shoot. Original angles and lamp components were used as invariants; originals are preserved for reference."
      }
    ],
    "context": "Personal gift · October 2026 · Two weeks",
    "editorialSource": "Projekte/Matrix Lamp/portfolio-editorial.md",
    "pairedMedia": [
      "detailImages:0",
      "detailImages:1"
    ]
  },
  {
    "id": 7,
    "title": "Carry the Computation",
    "slug": "carry-the-computation",
    "atAGlance": "Visitors use physical switches to copy data that affects a language model’s answers. A second model responds, and their conversation appears on a receipt printer. Copying accurately or introducing errors gives visitors a part in how the exchange develops. I built the installation in one week to explore responsibility when a machine depends on human labour.",
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
      "title": "Controller wiring beside the receipt printer",
      "credit": "",
      "use": "hero",
      "source": "Projekte/Carry the computation/exec-e2079ca6-dd1a-4cab-97e1-df8a335c112b.png"
    },
    "photos": [
      {
        "src": "assets/carry-the-computation-controller.webp",
        "width": 1122,
        "height": 1402,
        "title": "Mechanical switches and LEDs on the exposed controller",
        "credit": "",
        "use": "network",
        "source": "Projekte/Carry the computation/exec-615b3456-5408-41f0-b907-238e089e47f7.png"
      },
      {
        "src": "assets/carry-the-computation-receipts.webp",
        "width": 1122,
        "height": 1402,
        "title": "Printed dialogue with transfer accuracy",
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
        "title": "Thermal printer with interaction instructions",
        "credit": "",
        "use": "detail",
        "source": "Projekte/Carry the computation/exec-b2942067-4603-4095-aef2-85723391717f.png"
      }
    ],
    "mediaSections": {
      "detailImages": [
        3
      ],
      "photos": [
        3,
        4
      ]
    },
    "caseStudy": [
      {
        "title": "Experience & intention",
        "text": "Eight switches let visitors copy an illuminated binary pattern. A ninth confirms each byte. After 32 transfers, the machine generates an answer influenced by their inputs. A separate language model acts as its user and asks the next question.\n\nThe task gives visitors a choice: follow the pattern or interfere with it. I wanted to explore how that choice affects their sense of responsibility for the conversation, and how readily they read intention or emotion into the models’ responses.\n\nThe project was developed for Martín Nadal’s course *Agents in Debate: Autonomy, AI, and Artistic Creation* and tested at its internal presentation."
      },
      {
        "title": "My role & collaborators",
        "text": "I developed the concept and designed the interaction and physical controller. I assembled and soldered the hardware using components I selected, then tested the installation through a series of experiments.\n\nI used Codex to assist with the software and firmware, as well as wiring documentation and debugging. I directed that work and evaluated whether the results served the project’s intention. Martín Nadal led the course. Participants at the presentation contributed informal feedback."
      },
      {
        "title": "Outcome & learning",
        "text": "The switches and copying task drew people in. Some visitors deliberately introduced errors, while others aimed for accuracy. The simulated user’s human-like reactions also surprised participants. These observations came from the internal presentation and informal feedback.\n\nThe controller sometimes became a game to beat. Visitors focused on speed and accuracy, then read the printed dialogue afterward. The interaction encouraged participation but could draw attention away from the conversation it affected.\n\nMaking an input alter the computation did not guarantee that visitors would notice or understand its effect. Further development would give the printed dialogue more prominence and make the relationship between copying errors and the model’s answers easier to follow."
      },
      {
        "title": "Key design decisions",
        "text": "I initially considered corrupting the model’s weights. I moved to transferring intermediate data so that visitors would carry out a task within the machine’s operation.\n\nIn experiments, interference often made little visible difference or caused the output to break down abruptly. I adjusted how the transferred values affected token selection and calibrated additional numerical noise to explore the range between those outcomes.\n\nAdding a simulated user gave the altered answers a recipient. Its responses and follow-up questions let the effects continue through a conversation. The emotions expressed in that exchange are generated behaviour, not felt experience."
      },
      {
        "title": "Implementation details",
        "text": "A custom controller connects to a laptop running two local language models. An Epson TM-m30 thermal receipt printer records their conversation.\n\nThe controller uses an Arduino Nano ESP32 with nine mechanical switches and seventeen red LEDs. Three SN74HC595 shift registers are mounted on perfboard. Two LED rows display the target byte and the visitor’s selected bits. A USB serial connection links the controller to a Python application. Its browser interface provides testing controls alongside dialogue history and receipt previews.\n\n**Qwen2.5-0.5B-Instruct**, running through **PyTorch and Hugging Face Transformers**, generates the machine’s answers. At each of four generation steps, visitors transfer eight quantized values representing the strengths of candidate tokens. These 32 bytes affect token selection and subsequent generation. Copying errors also control calibrated numerical noise.\n\nThe simulated user runs separately through **Ollama using Qwen3:8B**. It receives the conversation without byte interference. Progress is saved so another visitor can continue an unfinished transfer.",
        "expandable": true
      }
    ],
    "context": "Interactive installation · October 2026 · One week",
    "editorialSource": "Projekte/Carry the computation/portfolio-editorial.md"
  }
];
