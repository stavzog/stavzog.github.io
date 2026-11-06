---
title: Multilayer Perceptron Library
date: 2026-09-8
status: Active
---

This semester I am taking an Artificial Neural Networks and Deep Learning course. Inspired by the material I am learning, I decided to revisit an [old project](https://github.com/stavzog/mini_Neural_Network) of mine and recreate it with the knowledge I gained from the course and also the last few years of coding experience.

## Progress

My first approach was to use large master arrays of parameters to store all layer data. This is what most libraries do under the hood and it allows for efficient memory usage and fast computation. I created 3 buffers: one for parameters (weights and biases), one for activations ($a$ and $z$), and one for gradients. All numerical data appeared in the dedicated buffer and the matrix representations were stored as structs holding offset, row, and column information.

At first I tried coming up with some sort of data structure that could represent any layer in the network. However, I realized that the layer is the wrong primitive. In most libraries, layers are syntactic sugar. The actual network is made up of a graph of mathematical operations.

Finally, I discovered projects like Karpathy's micrograd and automatic differentiation. I am now in the process of re-creating the library architecture to be based on a tape of operations which will be automatically differentiated.
