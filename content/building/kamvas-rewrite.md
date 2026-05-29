---
title: Kamvas Rewrite
date: 2026-05-18
status: Paused
---
A complete rewrite of the [Kamvas](https://github.com/stavzog/project_kamvas) productivity canvas application in Rust, focusing on performance and a modular architecture.

The original project was built with Kotlin Multiplatform. The rewrite will be built with Rust, egui, and Ultralight. egui will handle the workspace ui. The modules will be webviews which will make it easier for users to build their own and rely on the extremely large web ecosystem. Also, the fact that there is no state management framework means that I can implement my own data-oriented design approach and retain full control of the architecture.
