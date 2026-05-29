---
title: Parametric Embroidery App
date: 2026-05-25
status: In Progress
---

## Project Overview

The Parametric Embroidery App is a web-based tool designed to empower artists and designers to create complex and reusable stitch patterns. It bridges the gap between high-level design intent and low-level stitch control, offering a non-destructive workflow where designs can be regenerated parametrically. This team project is being developed under the guidance of my professor at Pomona College.

## My Role: Backend Development

As part of a four-person team, my primary responsibility is the design and implementation of the backend engine. This involves developing a robust, efficient, and deterministic system to handle 2D geometry generation and transformation. It was a team decision to adhere to DOD principles, because the backend prioritizes predictability and performance.

## Backend Architecture: A Data-Oriented Approach

My work on the backend focuses on a highly performant and predictable system, built with Rust/WASM, that processes user input into precise stitch data. The core components and concepts include:

### User-Generated Points (UGPs) & Interpolated Points (IPs)

- **UGPs:** User-manipulated guide points that describe geometric intent.
- **IPs:** System-generated points that define the actual geometry for embroidery machines.

### Generators & Generator Chains

At the heart of the system are **Generators**: pure functions that transform input points into output points. These can be chained together to form complex geometric operations, allowing for a modular and extensible design.

### Directed Acyclic Graph (DAG) for Orchestration

Generator chains are organized within a **Directed Acyclic Graph (DAG)**. Each node in the DAG represents a generator, and edges define dependencies. Nodes are equipped with `ports` to specify different input types for generators, enabling precise mapping of outputs to subsequent generator inputs.

### Input Map & UGP Binder

- **Input Map:** An internal table that tracks generator inputs by mapping node IDs to lists of points. It ensures that the output of one generator correctly feeds into the next in the chain.
- **UGP Binder:** A crucial component that maps UGPs (from the frontend) to specific nodes and ports in the DAG. This establishes the initial geometric data that seeds the generator pipeline.

### The Packaging Step

Once generators at a terminal node (a sink in the DAG) complete their processing, a **Packaging Step** converts their final IP outputs into `Shape` objects. These `Shape` objects, containing node handles, operation types, parameters, and the final interpolated points, are then sent to the frontend for rendering.

## Key Backend Contributions

- **Architectural Design:** Led the conceptualization and detailed design of the backend's DOD architecture.
- **Core Logic Implementation:** Developed the foundational Rust code for the DAG, generator processing, input management (Input Map, UGP Binder), and shape packaging.
- **Performance Focus:** Prioritized cache locality and memory efficiency, making the backend suitable for compilation to WebAssembly (Wasm).
- **Deterministic Computation:** Ensured that given the same UGPs and DAG configuration, the backend consistently produces identical geometric outputs.
