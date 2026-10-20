# Carry the Computation

## At a glance

Visitors use eight physical switches to copy illuminated binary patterns, helping an AI continue its computation—or deliberately introducing errors. Their inputs can change a dialogue between two local language models, printed on a receipt printer. The installation asks who carries responsibility when an apparently autonomous machine depends on human participation. I developed the concept, interaction, and controller, directing and testing AI-assisted software and firmware. Built in one week in October 2026, it was tested at an internal course presentation. The tactile task drew people in, but sometimes became a game that distracted from the conversation.

## Short summary

*Carry the Computation* is an interactive installation in which visitors transfer numerical data through an AI’s computation using eight physical switches. Accurate inputs or deliberate errors influence a printed dialogue between two language models, exposing questions of responsibility, dependence, and apparent machine autonomy.

## Context & timeframe

Developed in one week in October 2026 during *Agents in Debate: Autonomy, AI, and Artistic Creation*, a university project course led by Martín Nadal.

The open brief explored interacting AI agents as participants in artistic creation. My response introduced a human participant whose physical actions would influence the exchange. The completed installation was tested at the course’s internal presentation.

## Question & concept

What happens when an apparently autonomous AI depends on a person to continue its computation—and that person can cooperate or interfere?

Visitors copy illuminated binary patterns using eight keyboard switches and confirm each byte with a ninth button. Across 32 transfers, their inputs enter the language model’s inference process and can change its answer.

A second, unaffected model acts as a simulated human user: it reads the answer, reacts, and asks another question. Their conversation unfolds on a receipt printer.

The installation investigates responsibility within human–machine systems and how readily we perceive intention or emotion in generated language.

## My role & collaborators

I developed the concept, directed the interaction and physical design, selected components, assembled and soldered the controller, evaluated experiments, and tested the installation.

Codex assisted with software, firmware, wiring documentation, and debugging. I directed and evaluated these implementations against the artistic intention. Martín Nadal led the course; presentation participants contributed informal feedback.

## Process & key decisions

**From model damage to carrying computation.**  
The original idea involved corrupting model weights. Transferring intermediate numerical data more directly expressed the visitor’s role within the machine’s operation.

**From real interference to noticeable consequences.**  
Experiments showed that computational errors could leave answers unchanged or cause abrupt breakdown. I compared intervention points and calibrated altered token-selection data alongside additional numerical interference. Technical authenticity alone did not make the consequences understandable or proportional to the error count.

**From isolated answers to dialogue.**  
A separate simulated user gave the altered output a recipient. Reactions, misunderstandings, and follow-up questions extended the consequences beyond a single piece of broken text.

## Implementation

The installation combines a custom controller, a laptop running two local language models, and an Epson TM-m30 thermal receipt printer.

The controller uses an Arduino Nano ESP32, nine mechanical switches, seventeen red LEDs, and three SN74HC595 shift registers on perfboard. Two LED rows show the target byte and the visitor’s selected bits. USB serial communication connects it to a Python application with a browser interface for testing, dialogue history, and receipt previews.

**Qwen2.5-0.5B-Instruct**, running through **PyTorch and Hugging Face Transformers**, generates the machine’s answers. Visitors transfer eight quantized candidate-strength values at each of four generation steps. These 32 bytes influence token selection and subsequent generation; copying errors also control calibrated numerical noise.

The simulated user runs separately through **Ollama using Qwen3:8B**, receiving the actual conversation without byte interference. Its emotional reactions are generated behaviour, not felt experience. Saved progress allows another visitor to continue an unfinished transfer.

## Outcome & evidence

Visitors at the internal presentation responded positively to physically operating the machine. The tactile switches and pattern-copying challenge encouraged participation. Some deliberately introduced errors after understanding their role; casual participants generally aimed for accuracy. Visitors also expressed surprise at the simulated user’s human-like reactions.

However, the controller sometimes became a game to “beat.” Participants focused on speed and accuracy, reading the printed conversation afterward. The input attracted attention but could distract from the dialogue and reflection on responsibility.

These findings came from informal feedback and observation, rather than a structured visitor study.

## Learning & reflection

Rapid prototyping revealed three distinct challenges: intervening in computation, making the effects noticeable, and making them meaningful.

I also learned that a satisfying interface can compete with its conceptual purpose. The controller encouraged participation, but its game-like structure sometimes rewarded optimisation over reflection.

Further development would give the dialogue and printed output greater spatial emphasis and explore more legible relationships between visitor input, randomness, and coherence.

## Skills & network connections

- **Interaction Design:** Designed byte transfer, confirmation, handover, and feedback; observed their effect on visitor attention.
- **Physical Computing:** Selected components, soldered the controller, and tested hardware–software communication.
- **Creative Coding:** Directed and tested AI-assisted model intervention, dialogue orchestration, and receipt printing.
- **Critical Design:** Investigated responsibility, dependence, and perceived AI autonomy through participation.
- **Rapid Prototyping:** Compared computational interventions and iterated across software and hardware within one week.
