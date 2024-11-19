---
slug: LLama3-paper
title: llama3论文精读
authors: [liangdong]
tags: [paper]
---

# llama3论文主要内容

## 更大，更好，更强
高质量的数据集是llama3效果提升的主要利器。高质量的少量数据集放在最后退火阶段学习，效果更佳。

<!-- truncate -->
## GQA(group querry attention)的概念
decoder生成的时候算注意力，当前token的Q需要和之前所有的K,V矩阵去计算，之前的KV其实都是之前算过的（KVcache）占内存，GQA就是多头注意力将头分组，每一组中的KV权重一样，（设定的组数为超参，尽量在不影响性能情况下少分组），那么计算出的KV矩阵就只用存一份就够了，大大降低了内存使用。

## RoPE做位置编码

## Scaling Law
在小模型上的效果去预测大模型上的效果，用之前训练的数据去预测。固定算力下，不同训练token数量下的validationloss，能做出横轴为算力大小，y轴为样本大小的直线。
工程上：使用了H100，16K张，提到存储的压力很大，基本2TB/s到7TB/s。网络方面，用了infiniband一种高性能传输协议
数据模型的切分：TP(tensorr并行)，把矩阵切开，pipe parall,（把模型分层切开）， DP（数据并行），context pararlle（输入的序列切开）

## 训练方式
分三个阶段，初始预训练，首先线性warm up,再做cosine decay，8k上下文序列训练，第二阶段长上下文128k序列预训练。最后阶段使用高质量数据进行退火，40M的token，仍旧使用128k长的序列，退火阶段的学习率很低，数据采样的超参数挺重要。 

