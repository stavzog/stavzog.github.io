---
title: Multilayer Perceptron Library
date: 2026-09-8
status: Active
---

This semester I am taking an Artificial Neural Networks and Deep Learning course. Inspired by the material I am learning, I decided to revisit an [old project](https://github.com/stavzog/mini_Neural_Network) of mine and recreate it with the knowledge I gained from the course. 

When I first tried to create a multilayer perceptron library, I was in high school and I had not yet learned derivatives, or matrices, or linear algebra. I was deep into OOP and I was inspired by the modularity of the [kotlindl](https://github.com/Kotlin/kotlindl) library. I managed to come up with a really nice architecture from looking at the source code of the library, but unfortunately I could not get the math to work. 

Four years later, I finally know enough so I decided to rewrite the library from scratch. This time, I am using Rust instead of Kotlin, DOD instead of OOP, and I have more experience. My goal is to create a library  that will be much faster than the python code we use in class to explain neural networks. My reach-goal is to make a library that other developers can use to build neural networks without needing to write a lot of boilerplate code and they can extend it with their own layers, or operations.

## Technicalities

The approach I am going with this time is to use a large master array of parameters to store all layer data. This is what most libraries do under the hood and it allows for efficient memory usage and fast computation. At this point, I am a bit stuck on how to represent the layers.

As a concept, it makes sense for a layer to be its own class because it is very self-contained. It has its own parameters and operations. In Kotlin, I would make a `Layer`interface and then I would write a `DenseLayer` class, an `InputLayer` class, etc. This is not the rust way, though. So I have to look for alternatives. 

The simplest one is an enum. This is the approach I am currently using. But then my library will not be easily extensible (you have to change the enum, and then change all the places that `match` the enum, and this is not true extensibility). 

My task for the future is to come up with some sort of univarsal layer specification which the library can read, and ingest it into its own internal data representation (the master params array and the metadata that accompanies it). Then I can add new layer types without enums. In OOP, the layer specification is the interface. I am trying to figure out what this means for DOD.
