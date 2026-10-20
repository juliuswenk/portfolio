# Carry the Computation

Edited portfolio copy. Original project descriptions remain alongside this file.

## At a glance

What does responsibility feel like when a machine depends on your labour? Carry the Computation asks visitors to copy 32 bytes with switches, allowing their accuracy or deliberate errors to affect a language model’s answer. I developed the concept, physical controller, and interaction, directing AI-assisted software and firmware. Built in one week for an internal course presentation, its tactile task encouraged participation but sometimes drew attention away from the printed dialogue.

## Context

Interactive installation · October 2026 · One week

## Experience & intention

Eight switches copy an illuminated binary pattern; a ninth confirms each byte. After 32 transfers, the machine produces an answer affected by the visitor’s copying. A separate language model acts as its user, reacting and asking another question. Their exchange unfolds on a receipt printer.

Developed for Martín Nadal’s course *Agents in Debate: Autonomy, AI, and Artistic Creation*, the installation explores responsibility, dependence, and our readiness to perceive intention or emotion in generated language.

## My role & collaborators

I developed the concept, directed the interaction and physical design, selected components, assembled and soldered the controller, evaluated experiments, and tested the installation.

Codex assisted with software, firmware, wiring documentation, and debugging. I directed and evaluated this work against the artistic intention. Martín Nadal led the course; presentation participants contributed informal feedback.

## Outcome & learning

Participants enjoyed physically operating the machine. Some deliberately introduced errors; casual participants generally aimed for accuracy. The simulated user’s human-like reactions surprised visitors. These are informal observations and feedback, not a structured study.

The controller sometimes became a game to beat: visitors prioritised speed and accuracy, reading the dialogue afterward. I learned that real interference, noticeable effects, and meaningful consequences are separate challenges—and that a satisfying interface can compete with its purpose. Further work would emphasise the printed dialogue and make input consequences more legible.

## Key design decisions

I moved from corrupting model weights to transferring intermediate data so the visitor’s labour became part of the machine’s operation. Experiments produced either little visible change or abrupt breakdown; I calibrated token-selection interventions and numerical noise to explore consequences between those extremes.

A separate simulated user gives the altered answer a recipient. Its reactions and follow-up questions extend the consequence beyond a single broken text. These emotional reactions are generated behaviour, not felt experience.

## Implementation details

The installation combines a custom controller, a laptop running two local language models, and an Epson TM-m30 thermal receipt printer.

The controller uses an Arduino Nano ESP32, nine mechanical switches, seventeen red LEDs, and three SN74HC595 shift registers on perfboard. Two LED rows show the target byte and the visitor’s selected bits. USB serial communication connects it to a Python application with a browser interface for testing, dialogue history, and receipt previews.

**Qwen2.5-0.5B-Instruct**, running through **PyTorch and Hugging Face Transformers**, generates the machine’s answers. Visitors transfer eight quantized candidate-strength values at each of four generation steps. These 32 bytes influence token selection and subsequent generation; copying errors also control calibrated numerical noise.

The simulated user runs separately through **Ollama using Qwen3:8B**, receiving the actual conversation without byte interference. Its emotional reactions are generated behaviour, not felt experience. Saved progress allows another visitor to continue an unfinished transfer.

## Skills

Interaction design · Physical computing · Creative coding · Critical design · Rapid prototyping
