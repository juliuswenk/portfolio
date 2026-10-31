// Edited portfolio stories; original descriptions and editorial sources are documented in PROJECT_GUIDE.md.
window.PORTFOLIO_PROJECTS = [
  {
    "id": 1,
    "title": "DOXA",
    "slug": "doxa",
    "atAGlance": "DOXA lets visitors create AI agents and follow how they retell statements across a simulated social network. I developed the concept and built the interfaces and software with AI coding assistance. I also designed the print materials. First prototyped for *Liminal Fields*, the installation was developed further for Ars Electronica in 2026. Visitors became curious about their agents, though the system’s complexity sometimes made its purpose harder to grasp.",
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
      "title": "DOXA installation overview",
      "credit": "© Melissa Papafio-Roberts",
      "use": "hero",
      "source": "2 DOXA © Melissa Papafio-Roberts.png"
    },
    "photos": [
      {
        "src": "assets/doxa-02.webp",
        "width": 1440,
        "height": 960,
        "title": "Visitor using the installation",
        "credit": "© Melissa Papafio-Roberts",
        "use": "network",
        "source": "1 DOXA © Melissa Papafio-Roberts.png"
      },
      {
        "src": "assets/doxa-03.webp",
        "width": 1440,
        "height": 960,
        "title": "Visitor interface and input controls",
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
        "title": "Diagram of agent behaviour and information flow",
        "credit": "",
        "use": "detail",
        "source": "Diagramm DOXA.png",
        "transparent": true
      },
      {
        "src": "assets/doxa-04.webp",
        "width": 1440,
        "height": 960,
        "title": "Installation viewed from the side",
        "credit": "© Melissa Papafio-Roberts",
        "use": "detail",
        "source": "3 DOXA © Melissa Papafio-Roberts.png"
      },
      {
        "src": "assets/doxa-05.webp",
        "width": 1440,
        "height": 1440,
        "title": "3D study of the installation layout",
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
        "text": "Visitors use a joystick to inspect the network. At satellite stations, they answer a short personality questionnaire to create an agent that acts independently on their behalf. They can introduce a statement and follow how agents interpret and retell it. Returning later reveals what their agent has heard and how the statement has changed.\n\nI wanted to make the relationship between social connections and differing interpretations visible. The agents follow behavioural assumptions I designed. Their exchanges offer a way to experiment with those assumptions, without claiming to reproduce human communication accurately."
      },
      {
        "title": "My role & collaborators",
        "text": "I developed the concept and built the interfaces and software with help from AI coding tools. I also designed the print materials. Andreas Ingerl supported the installation design. Lennard Lev and Thomas Kemnitz helped realise the Ars Electronica exhibition."
      },
      {
        "title": "Outcome & learning",
        "text": "Visitors were curious about their agents and how messages changed. The joystick drew them in, and the satellite stations gave them a way to explore further. Many understood that information changes through retelling, but the system’s complexity made its broader purpose harder to grasp.\n\nThese observations came from the exhibitions and informal feedback. Further development would simplify the first interaction so visitors could start experimenting before needing to understand the whole system."
      },
      {
        "title": "Key design decisions",
        "text": "I initially grouped agents by numerical personality similarity. I replaced this with four profiles inspired by Gerlach’s Big Five personality research, using them to shape each agent’s placement and behaviour. The assigned profile stayed fixed, while the agent’s worldview could develop through the messages it received.\n\nI also gave agents memory of earlier tellings. When a statement reached an agent again, it could respond in the context of its previous interpretation."
      },
      {
        "title": "Implementation details",
        "text": "A master computer runs the simulation and a local language model, and stores their shared data. The visitor stations and network display connect to it over a local network.\n\nA BFI-10 personality questionnaire supplies Big Five scores used to assign each agent to one of four Gerlach-inspired profiles. The profile influences its position and connections, along with how likely it is to forward or reframe a message. The agent’s worldview develops as messages accumulate.\n\nStrands Agents connects the agents to **Qwen3:8B**, running locally through **Ollama**. Retelling prompts include personality instructions and the agent’s current worldview. They also provide the incoming statement and available context about its sender and previous retelling. A drift allowance in the prompt guides how much the wording may change at each step.\n\nA **Python** coordinator schedules agent activity and sends state through a **WebSocket** server. Local CSV, JSON, and text files store message versions and transmission records. The interfaces use **Electron, HTML, CSS, and JavaScript**. **Three.js** renders the network and message paths so visitors can follow changes in wording alongside the route a statement takes.",
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
    "atAGlance": "Visitors steer the ICAROS by shifting their weight to fly through a virtual Berlin. Camera cones reveal parts of the city, while live radio streams become spatial audio. VISIO TECHNOLOGICA uses these different views to explore what technological sensing lets us perceive. I developed the concept, city streaming, visibility shaders, and an additional flight-direction sensor. Lennard Lev created the interfaces and radio audio. The VR installation was exhibited at HTW Berlin’s Werkschau in 2026.",
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
      "title": "Virtual Berlin with signal visualisation",
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
        "title": "Visitor wearing a VR headset on the ICAROS",
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
        "title": "Visitor wearing a VR headset on the ICAROS",
        "credit": "",
        "use": "detail",
        "source": "Codex-Bild 18. Sept. 2026, 11_55_01.png",
        "transparent": true
      },
      {
        "src": "assets/visio-technologica-04.webp",
        "width": 1440,
        "height": 760,
        "title": "Overview of the Berlin city model",
        "credit": "",
        "use": "detail",
        "source": "Bildschirmfoto 2026-06-05 um 19.35.38.png"
      },
      {
        "src": "assets/visio-technologica-05.webp",
        "width": 1018,
        "height": 1440,
        "title": "Berlin scene during development",
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
        "text": "In a fictional future, advertising systems track human perception. Visitors evade them by borrowing technological senses. A view of their real surroundings through the headset gives way to a sonar-like scan of Berlin. Shifting their weight on the ICAROS controls flight. Detailed textures appear inside camera cones, while faint geometry remains outside. Live radio streams can be heard from different directions as visitors move through the city.\n\nA simulated battery ends the flight and returns visitors to their surroundings. Designed for museum visitors across a broad age range, the experience explores what each sensing system reveals and what it leaves out."
      },
      {
        "title": "My role & collaborators",
        "text": "I developed the concept and experience design, streamed Berlin’s 3D city data, and built the shaders that control visibility. Through my employment at Futurium and HTW Berlin, I developed the additional ICAROS orientation sensor used for flight.\n\nLennard Lev designed the interfaces and implemented live radio streaming. I used OpenCode alongside Claude and Codex for coding assistance. The city model was streamed through Cesium ion."
      },
      {
        "title": "Outcome & learning",
        "text": "The installation was exhibited at HTW Berlin’s Werkschau in 2026. It brought weight-controlled flight into a virtual Berlin, with selective visibility and spatial live radio. A transition from the visitor’s real surroundings opened the experience, and the simulated battery brought it to an end.\n\nDeveloping the sensor taught me how closely physical movement and virtual response need to work together. Their coordination shapes how immersive and enjoyable the flight feels."
      },
      {
        "title": "Key design decisions",
        "text": "I used detailed textures inside camera cones and faint geometry elsewhere to let visitors experience the limits of each view as they flew.\n\nAn algorithm finds the top edges of buildings and uses the city geometry to choose camera positions. The resulting cones are speculative. They do not show actual surveillance coverage."
      },
      {
        "title": "Implementation details",
        "text": "The experience uses **WebXR and Three.js** within **SvelteKit**. Berlin’s 3D tiles stream through **Cesium ion**, and custom shaders control which textures appear inside the generated camera cones.\n\nAn added gyroscope sensor measures the ICAROS’s orientation, allowing visitors to steer by shifting their weight. Live radio streams are positioned as 3D audio sources within the city, so their direction changes as visitors move.",
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
    "atAGlance": "A hidden person’s movements affect a projected figure through changes in WiFi signal strength. The person and the projection’s audience cannot see each other, so they discover the connection through conversation. I developed the concept and built the sensing hardware with AI assistance on firmware and software. Collaborators created the projection. Built in four days, VEILED PANOPTICON remained an approximate sensing prototype. At an internal HTW Berlin exhibition, it prompted both fascination and discomfort.",
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
      "title": "Projected figure in the installation space",
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
        "title": "Sensing panels arranged across the space",
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
        "title": "Receiver mounted on a wooden panel",
        "credit": "",
        "use": "detail",
        "source": "IMG_2486.JPG"
      },
      {
        "src": "assets/veiled-panopticon-05.webp",
        "width": 1440,
        "height": 744,
        "title": "View of the installation space",
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
        "text": "A person near concealed sensors affects whether a shadowy figure appears on the left, in the middle, or on the right. They cannot see the projection, and its audience cannot see them. Visitors have to talk to one another to discover who is causing the response.\n\nThe course brief asked us to make invisible signals perceptible. I used familiar WiFi hardware to sense presence without a camera or direct line of sight, raising questions about whether people know they are being sensed and can consent to it."
      },
      {
        "title": "My role & collaborators",
        "text": "I developed the concept and designed the sensing setup, then built the hardware installation. AI coding tools assisted with firmware and software.\n\nLennard Lev and Lena Eibel developed the projection and visual language. Prof. Alexander Müller-Rakow and Christian Pflug guided the project."
      },
      {
        "title": "Outcome & learning",
        "text": "At the small internal exhibition, visitors expressed fascination with the setup and discomfort at its use of technology familiar from their homes. This feedback was informal. I did not conduct a structured visitor study or measure sensing accuracy.\n\nDetection remained unreliable. Working with the hardware sparked my interest in physical computing. It also showed me how an installation’s arrangement could support the intended experience while hiding technical instability. Further work would focus on making the sensing more reliable."
      },
      {
        "title": "Key design decisions",
        "text": "Within four days, experiments with receiver placement and filtering did not reliably separate movement from signal noise. I reduced the aim from accurate tracking to approximate presence across three positions.\n\nSeparating the sensors from the projection made visitors discover the connection through conversation. It also stopped them from immediately comparing a person’s position with the figure’s response, concealing unreliable readings. That limits what the prototype demonstrates about the sensing itself."
      },
      {
        "title": "Implementation details",
        "text": "The installation uses four Arduino Nano ESP32 boards based on the ESP32-S3: one WiFi sender and three receivers. Wooden panels conceal the sensing hardware.\n\nThe system reads received signal strength, or **RSSI**. A person moving between the sender and receivers changes those readings. The software interprets the changes as approximate presence near the left, middle, or right receiver and moves the projected figure accordingly.\n\nFinding useful thresholds and filters was difficult because the readings remained noisy. The result was coarse presence sensing, with movement tracking still unreliable. The prototype used RSSI; channel state information, or **CSI**, is a proposed next step.",
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
    "atAGlance": "Our proposal for Futurium gives visitors a character based on their own photograph. It would accompany them through an exhibition and discuss what they encountered, with adjustable behaviour to reveal how AI can frame an account. I developed the workflow for generating the character and displaying it on a holographic fan. In five days, our team produced spatial visualisations and a working character demonstration. The dialogue was prepared in advance, and the full exhibition remained a proposal.",
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
      "title": "Visualisation of the proposed exhibition route",
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
        "title": "Detail of the exhibition proposal",
        "credit": "Spatial visualisation by Conrad Lischewsky · exhibition proposal",
        "use": "detail",
        "source": "6if.jpg"
      },
      {
        "src": "assets/improving-futurium-05.webp",
        "width": 1440,
        "height": 1440,
        "title": "Proposed spatial layout from above",
        "credit": "Spatial visualisation by Conrad Lischewsky · exhibition proposal",
        "use": "detail",
        "source": "7if.jpg"
      },
      {
        "src": "assets/improving-futurium-06.webp",
        "width": 1440,
        "height": 1440,
        "title": "Proposed information stations and visitor route",
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
        "text": "A visitor’s photograph becomes a 3D character. In the proposed exhibition, it would accompany them through information stations. At the end, they would speak to it on a holographic fan and adjust parameters such as temperature and intention.\n\nResembling the visitor would not guarantee that the character expressed their perspective. Changing its behaviour would let visitors compare how it presented the same information and question whose view it represented."
      },
      {
        "title": "My role & collaborators",
        "text": "I developed the workflow for generating and animating the character, then rendering it for playback on the holographic fan. This turned part of the team’s concept into a working demonstration.\n\nWe developed the spatial concept together. Conrad Lischewsky created the spatial visualisations. Andreas Ingerl led the educational project. Futurium provided the brief and received the final presentation."
      },
      {
        "title": "Outcome & learning",
        "text": "We presented the exhibition proposal with spatial visualisations and a demonstration of character creation and fan playback. The dialogue was prepared in advance. Accompanying visitors through the stations and holding an adjustable live conversation remained proposed features.\n\nWorking within five days taught me to identify which part of a complex concept I could demonstrate and find a practical workflow to make it work."
      },
      {
        "title": "Key design decisions",
        "text": "Basing the character on a visitor’s photograph made the question of representation personal. Its proposed behaviour controls would let visitors compare how the same character framed an account differently.\n\nPlacing the conversation after the information stations gave visitors a way to revisit what they had encountered."
      },
      {
        "title": "Implementation details",
        "text": "The workflow starts with a visitor’s photograph. **Meshy** generates a 3D character from the image, and **Mixamo** supplies animation. **Blender** renders the animated character, then the holographic fan’s software prepares it for display.\n\nWe demonstrated character creation and fan playback. With the time available, we prepared the dialogue in advance. The character’s accompaniment through the stations and an adjustable final conversation were part of the exhibition proposal.",
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
    "atAGlance": "I made this digital necklace in Blender in 2018, inspired by BEASTBOY’s album *Hyperreal Ravelord*. The chain, a motif in the music, gave me a subject for exploring 3D tools. I modelled the necklace and created its materials and animated renders. The pendant uses an existing SVG logo. It was a personal fan project made for the screen, with no physical production intended.",
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
      "title": "Hyperreal Ravelord necklace · interactive view",
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
        "text": "I wanted to learn what I could make with 3D tools through a subject connected to music I enjoyed. The chain gave me an object to model, with an existing SVG logo as the starting point for the pendant."
      },
      {
        "title": "My role & process",
        "text": "I modelled the necklace in Blender and developed its materials and lighting. I also set up the animated renders. The pendant was based on an existing SVG logo, whose graphic design was not my work."
      },
      {
        "title": "Outcome & reflection",
        "text": "The finished model and animated renders remained a personal digital study. Making them helped me learn how modelling decisions interact with lighting and materials. Revisiting it now, I would improve the animation with a physics simulation to explore more dynamic movement."
      }
    ],
    "credits": "Musical reference: *Hyperreal Ravelord* by BEASTBOY. Independent fan project. The pendant is based on an existing SVG logo.",
    "editorialSource": "Projekte/Hyperreal Ravelord Kette 3D/portfolio-editorial.md"
  },
  {
    "id": 6,
    "title": "Matrix Lamp",
    "slug": "matrix-lamp",
    "atAGlance": "I designed and built Matrix Lamp as a gift, using a 16 × 16 LED matrix to create calming ambient light. Five animations sit within a layered structure that leaves the construction visible and the parts accessible. AI tools assisted with the electronics layout and firmware. The lamp was completed in two weeks and worked well in use, though pressing its control knob can shift it.",
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
      "title": "Finished Matrix Lamp · background removed",
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
        "title": "Rear plate and metal finish",
        "credit": "",
        "source": "Final Lamp/IMG_3347.JPG → Studio/matrix-lamp-studio-rear.png",
        "use": "detail"
      },
      {
        "src": "assets/matrix-lamp-studio-front.webp",
        "width": 1086,
        "height": 1448,
        "title": "Front view with purple light",
        "credit": "",
        "source": "Final Lamp/IMG_3333.JPG → Studio/matrix-lamp-studio-front.png",
        "use": "detail"
      },
      {
        "src": "assets/matrix-lamp-06.webp",
        "width": 1200,
        "height": 1600,
        "title": "Early LED and breadboard test",
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
        "text": "I wanted to make a lamp for calming ambient light while keeping its construction visible. Leaving the parts accessible would also make repairs and modifications possible."
      },
      {
        "title": "My role & assistance",
        "text": "I planned the build and fabricated the plates, then assembled the structure and soldered the components. I also created the animations. AI tools assisted with the electronics layout and firmware coding."
      },
      {
        "title": "Outcome & learning",
        "text": "I finished the lamp on time and gave it to its recipient. It worked well as ambient lighting, and the build gave me practical experience with fabrication and soldering.\n\nPressing the control knob can shift the lamp because of where it is placed. For another version, I would choose a different control arrangement."
      },
      {
        "title": "Key design decisions",
        "text": "I initially planned a bent aluminium enclosure, then switched to separate layers held together with threaded rods and nuts. The layers were easier to fabricate and left the components accessible. They also made the construction part of the lamp’s appearance.\n\nLearning to solder and assemble the electronics involved the most experimentation."
      },
      {
        "title": "Construction & interaction",
        "text": "Two laser-cut acrylic sheets form the structure with a metal rear plate cut using a mechanical saw.\n\nA single knob selects an animation and adjusts its colour and brightness. Pressing the knob cycles through these settings. Turning it adjusts the selected setting."
      },
      {
        "title": "Media presentation",
        "text": "Four photographs were edited to replace the home background with a white studio setting and soft lighting. They preserve the original viewing angles and lamp components. I kept the original photographs for reference. The images show presentation edits, not an actual studio shoot."
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
