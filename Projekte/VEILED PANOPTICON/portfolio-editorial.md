# VEILED PANOPTICON

Edited portfolio copy. Original project descriptions remain alongside this file.

## At a glance

What happens when walls no longer separate seen from unseen? VEILED PANOPTICON uses WiFi signal changes to make a hidden person’s presence affect a projected figure. I developed the concept, sensing setup, and hardware, with AI-assisted firmware and software and collaborators’ projection design. Built in four days and shown internally at HTW Berlin, the prototype prompted fascination and discomfort, while its noisy sensing remained approximate.

## Context

Installation prototype · HTW Berlin · 2026 · Four days

## Experience & intention

A person near concealed sensors affects a shadowy figure’s position: left, middle, or right. They cannot see the projection, while its audience cannot see them. Conversation reveals who is causing the response and how.

The course brief asked us to make invisible signals experiential. Using familiar WiFi infrastructure without a camera or direct line of sight turns concealed sensing into a question of awareness, privacy, and consent.

## My role & collaborators

I developed the concept, designed the sensing setup, and built the hardware installation. AI coding tools assisted with firmware and software.

Lennard Lev and Lena Eibel developed the projection and visual language. Prof. Alexander Müller-Rakow and Christian Pflug guided the project.

## Outcome & learning

At the small internal exhibition, visitors expressed fascination with the setup and discomfort at its use of technology familiar from their homes. These were informal comments and observations, not a structured study or measured evaluation of sensing accuracy.

Detection remained unreliable. Working around this limitation sparked my interest in physical computing, while showing how an experience can preserve an artistic intention and conceal technical instability. Further work would improve sensing reliability.

## Key design decisions

Experiments with receiver placement and filtering could not separate movement reliably from signal noise within four days. I reduced the ambition from accurate tracking to approximate presence across three positions.

Separating the sensors from the projection made discovery happen between visitors. It also concealed unreliable readings by preventing an immediate comparison between a person’s position and the figure’s response. This limitation remains part of how I assess the prototype.

## Implementation details

The installation uses four Arduino Nano ESP32 boards based on the ESP32-S3: one WiFi sender and three receivers. The sensing hardware is concealed behind wooden panels.

The system reads received signal strength, or **RSSI**. A person moving between the sender and receivers changes the signal readings. The software interprets these changes as approximate presence at the left, middle, or right receiver and uses that position to place the projected figure.

Finding useful thresholds and filters was a central technical challenge. The readings remained sensitive to noise, so the installation demonstrated coarse presence sensing rather than reliable movement tracking. The prototype used RSSI; channel state information, or **CSI**, is a proposed next step.

## Skills

Critical design · Physical computing · Creative coding · Interaction design · Rapid prototyping
