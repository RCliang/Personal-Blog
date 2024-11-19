---
slug: vector-database
title: Faiss向量库指北
authors: liangdong
tags: [infra]
---

# Faiss向量库实践

    背景：作为可以直接在单机上运行的向量数据库非常适合于小批量暂时性保存的向量检索应用。比如：作为切分句子后，将句子向量化后的相似度检索。如果想要持久化保存知识库，还是建议上集群部署的专用向量数据库如milvus，es等等。因为faiss存储的向量如果要关联到原始的文字或图片等等，需要额外保存这些向量的对应的索引，以便在下次搜索的时候能把索引对应的文字或图片返回。但这也正是它的优点，比较灵活，随时建立index，随时load，当然也比你自己用numpy手写相似度检索要快得多。

## 安装
非常简单，直接```pip install faiss-cpu```即可。

## 快速上手

```python
d=768 # 指定向量的维度
index = faiss.IndexFlatIP(d) # 初始化使用Flat余弦向量相似度
print(index.is_trained) # 某些索引方式需要进行预训练，比如倒排索引和PCA等等需要进行训练
print(index.ntotal) # 输出index库有多少个向量

# 比如将文本向量化后进行搜索，找出3个最相似的向量并返回id, 距离
D, I = index.search(data_embedding('脾良性肿瘤'), 3) 

# 持久化保存当前index
faiss.write_index(index, "../target_data/target_diseases.index")

# 读取保存的index
index = faiss.read_index("../target_data/target_diseases.index")
```

**在使用faiss时遇到的坑**：
当使用numpy的array，在index进行搜索时有时会导致jupyter内核崩溃，查得有效的解决办法:
```python
import os
os.environ["KMP_DUPLICATE_LIB_OK"]="TRUE"
```

## 最佳实践
推荐使用index_factory方式构建index
需要三个参数，向量维度，构建索引的搜索算法，度量方法
```python
dim, measure = 64, faiss.METRIC_L2
param = 'Flat'
index = faiss.index_factory(dim, param, measure)
```
其他的度量方式包含:
```
METRIC_INNER_PRODUCT = 0, #（内积）
METRIC_L2 = 1,        # （欧式距离）
METRIC_L1,            #（曼哈顿距离）
METRIC_Linf,          #（无穷范数）
METRIC_Lp,            #（p范数）

METRIC_Canberra = 20,   #（兰氏距离/堪培拉距离）
METRIC_BrayCurtis,   #（BC相异度）
METRIC_JensenShannon, #（JS散度）
METRIC_Jaccard, #（杰卡德距离）
```
faiss也可以通过训练一个PCA来对向量进行降维以便能加快搜索效率
```python
mt = np.random.rand(1000, 40).astype('float32')
mat = faiss.PCAMatrix (40, 10)
mat.train(mt)
assert mat.is_trained
tr = mat.apply(mt)
# print this to show that the magnitude of tr's columns is decreasing
print (tr ** 2).sum(0)
```
如果在加载faiss库的时候内存不够用，也可以一开始在构建时通过量化的方式降低向量的精度，需要先训练，其实就是利用编码解码器的思想，主要的量化器有以下几种类型：
* ScalarQuantizer
* ProductQuantizer
* AdditiveQuantizer

如果想要提升搜索速度，可以通过提前训练索引方法。
使用Flat这种暴力检索的方式对于几十万级别的库效率有时不是太让人满意。
因此，可以使用如IVF_Flat的方式先进行聚类，找到设定数量的聚类中心，在最近的几个中心ID下进行搜索，相当于缩小了范围，提升了效率。

```python
dim, measure = 64, faiss.METRIC_L2
param = 'IVF100,Flat'                           # 代表k-means聚类中心为100,   
index = faiss.index_factory(dim, param, measure)
print(index.is_trained)                          # 此时输出为False，因为倒排索引需要训练k-means，
index.train(xb)                                  # 因此需要先训练index，再add向量
index.add(xb)
```
- PQx 乘积量化
分而治之的思想，将向量切成几段进行搜索，最后取交集的topK，缺点是召回率比较低。比如param='PQ16'
- IVF_PQ_ 
用的比较多，属于平衡了上述两种方法
先分段再聚类，比如'IVF1000PQ16
- LSH局部敏感哈希，效果最差基本不考虑，但是检索速度最快
- HNSW:  
不需要预训练，基于图构建，构图时需设定一个点最多连接多少节点，
缺点就是构建图建索引时比较慢，支持分批导入，但不支持设定ID，因此导入时一定要记得再存一份索引啊，不然下次搜索就悲剧了。这个也是强烈推荐使用在RAG中文本切分后的向量化搜索。
```python
dim, measure = 64, faiss.METRIC_L2   
param =  'HNSW64'
index = faiss.index_factory(dim, param, measure)  
print(index.is_trained)                          # 此时输出为True
index.add(xb)
```

## 总体使用总结
faiss是一个非常实用的用于保存向量和搜索向量的工具，也支持GPU加速，还有各种搜索算法的优化，对于快速构建系统原型非常有用。不过如果是构建大型生产系统，还是推荐考虑专用的向量库集群。