---
title: Researching DOD
date: 2026-05-10
status: Active
---

I am currently researching the methodology and applications of Data Oriented Design.
This involves researching cache locality, memory layout, and efficient data structures for high-performance applications.

My conclusions are:

- DOD makes everything faster because of cache locality.
- DOD is easier to reason about than object-oriented design. Extensibility is easier
- The way of working is: start with arrays and basic data structures, upgrade to increasingly more complex data structures when things fail.

---

**2026-05**
I implemented a custom slot map data structure that offers dense, cache-friendly storage of elements with stable ids for efficient lookup. Uploaded rust library: [slotmap_microlib](https://crates.io/crates/slotmap_microlib/0.1.0)

---

**2026-04**
Worked on applying DOD to the Parametric Embroidery backend.

---

**2026-01**

Read [Data Oriented Design by Richard Fabian](https://www.dataorienteddesign.com/dodbook/). Learned about DOD, cache-locality, database normalization and other related concepts.
