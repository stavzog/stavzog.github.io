---
title: Context-Aware Search
date: 2026-09-15
status: Early Planning
---

When working on the parametric embroidery project, I began experimenting with the idea of making the UI toolbar as minimal as possible, and then allowing the user to navigate the UI using context-aware search. I was curious to see how far I could stretch the idea of an intelligent search interface that can understand the user's context and provide relevant results. This endeavor was outside the scope of the embroidery app, though, which is why I decided to make it a standalone project.

#### The vision:

The vision for this project is to create a context-aware search interface that utilizes natural language processing, and other techniques to convert the user's search queries into actionable UI navigation. The interface will essentially match a query to a UI command and then execute that command. It needs to be able to understand something a query like "save" and match that to the `save` command. But it also needs to understand more complex, natural language, queries like "show me all the buttons" and match that to the `show_buttons` command. My current thought is to use embeddings models for this.

I would also like to experiment with command sequences. It would be very interesting if the search engine could translate "save this and make a new copy of it" into a sequence of `save` and `duplicate` commands.
