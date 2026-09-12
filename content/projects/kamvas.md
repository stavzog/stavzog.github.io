---
title: Project Kamvas
date: 2026-01-24
status: Early Development
---

##### A Vast, Fluid Workspace for Human-Data Interaction.

**Project Kamvas** is a vision for a desktop productivity app. Inspired by the [Mercury OS](https://www.mercuryos.com/) concept, it treats your workspace as an infinite, high-performance canvas where information is composed.

Project Kamvas allows you to create dynamic modules (Markdown, Code, Web, and more) that interact through semantic flow lines, creating a unified interface for your digital life. It provides a boundless spatial environment where modules live side-by-side, allowing for complex cross-referencing and visual "flow."

![/static/showcase.png](showcase.png)

Project Kamvas is meant to be used to organize and plan and build projects. The (currently not too wide) selection of modules allows the user to configure their workflow according to the needs of their project. It tries to minimize the friction between the ideas we hold in our head and the way they can be effectively represented outside our minds.

The motivation behind building canvas is that feeling of being lost that I felt when I needed to start a new project. Do I open a browser? Do I open a text editor? Kamvas lets you open everything at once. Anything you might need is there just a few clicks away and it is made to stay in one screen. This way you can find the configuration of windows that works exactly for your needs. If you are writing an essay, you can open the text module to write, and a few web modules to research. You can even open the markdown module to create a quick outline. All of the modules stay organized and saved in one place.

## Technical Stack and Architecture

Language: Kotlin (Compose Multiplatform) for a reactive, modern UI.

Architecture: Object-Oriented Design with the Single Source of Truth principle and state immutability.

State-Management: The project uses an MVI approach but modified to do away with the excessive boilerplate and to integrate principles from [Zustand React Library](https://zustand.docs.pmnd.rs/getting-started/introduction), which is famous for its simplicity.

The main idea that guides all of my architecture decisions is that the code should be as simple as possible. This means that I want to eliminate unwanted boilerplate and also make the flow of data straightforward. For example, I will choose to use a simple function over a class if possible. In order to make my code more readable, I am currently exploring how to rewrite it using a combination of Data-Oriented-Design principles, and concepts from Entity-Compontent-System frameworks.

---

> Currently the project is an MVP. The core functionality is there but *Module Actions* are very limited in how they work.

---

## Next Steps

For now, the Kamvas project is paused. However, there are plans to rebuild it from scratch using a different architecture. I want to shift from KMP to Rust and `egui`. `egui` is a modern, immediate-mode GUI library and it has no internal state management. This means that I can take full control of the state management strategy and come up with something that is efficient and specific to the needs of the project. The general line of thinking is that I will use `egui` for the main GUI layer, but the modules will be web-views. Effectively, kamvas will be a manager of web-views. I made this decision because web technologies are the most effective choice for extensibility and there is already a wide ecosystem of libraries and tools available that I can use to create the different modules that I need. In this context, rust and my custom state management architecture will prioritize performance snappiness of the web-views.
