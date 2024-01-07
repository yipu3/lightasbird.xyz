---
title: "为什么要有欺诈证明"
date: '2023-04-02'
spoiler: ""
---

相信不少关注Layer2的人都会对欺诈证明这个概念略有耳闻。我作为其中一员，之前对欺诈证明的理解也仅仅停留在知道它在Optimism Rollup中发挥了什么作用，但并不知道欺诈证明大概长什么样子，比如它的原理、结构、占用空间大小。

最近在阅读Danksharding相关的文章时，发现有些新的优化必须建立在理解欺诈证明的基础上（比如：如果不知道欺诈证明的大小取决于什么，就无法理解二维纠删码为什么会降低欺诈证明的大小），所以最近学习了一篇相关的[论文](https://arxiv.org/pdf/1809.09044.pdf)。

同时在搜索相关资料的过程中，我也发现简中区关于欺诈证明的文章很少，所以写了这篇文章，希望能帮助到不习惯英文阅读同时又想进一步了解欺诈证明的读者。

要理解欺诈证明，我们需要先阐明欺诈证明是为了解决什么问题的。

在现在大部分区块链，比如以太坊中，节点包办了三件事：

1. 达成共识，一笔交易是否被大部分节点认同；
2. 数据的保存和可用性，一笔交易被通过后，它涉及的数据需要被所有节点持久化，同时也要保持可用；
3. 交易的执行，从交易到数据的变化，还需要节点执行这笔交易，保证这笔交易是合理的、安全的。

最举个简单的例子，一个账户的余额就是**数据**，任何人都能随时查看这个余额，这是**数据的可用性**，当这个账户发起一笔转账**交易**，区块链节点就会**执行**这笔交易，比如：检查这个账户的余额能否支付这笔转账，从账户余额扣除转账的数量。执行后账户就有了一个新的余额，节点把这个新的余额（数据）保存起来。最后是达成**共识**，即所有节点都认同这笔转账。

如果是一枚习惯于重构代码的程序员，就会发现这三件事情是可以区分开来的，我们可以分别称为：共识层、数据层、执行层。而在大部分的区块链实现中，如上所述，即这三层是耦合在一起的。这就会带来优化的瓶颈，比如我想优化执行层，让交易执行得更快，就不得不涉及数据层和共识层的改动，难以为继（更深一点，现在的架构要同时优化这三层，就只能降低区块链的去中心化程度，而去中心化是区块链的灵魂）。

上面的内容比较偏技术。现在转回到轻松一点的吐槽。就是现在的区块链，从用户角度看最大的两个缺点就是：

1. 太贵了，以太坊执行一笔转账要花几刀到几十刀，我用支付宝免费转账不香吗？
2. 太慢了，以太坊完成一笔转账要几十秒甚至几分钟，我用支付宝秒到账不香吗？

太贵和太慢其实都是因为同一个原因，就是一笔交易需要网络上的所有节点执行。交易需要传给所有节点，达成共识，网速有限，当然就慢了，而且所有节点都要执行这笔交易，光是花的电费也够一壶子了，当然贵了。

那么怎么解决呢？最直观的就是，一笔交易就不要让所有节点执行了，毕竟我的笔记本电脑的TPS都比以太坊高，我用自己的电脑执行交易不香吗？最后把结果传到链上就可以了。对于链来说，相比存数据+执行交易，只存数据肯定是更快、成本更低的。这就是把上面提到的**执行层**，剥离了出来。

但是这又引出了一个问题，区块链怎么知道我传的数据是对的呢？要是我给自己无中生有了一万个比特币怎么办？这就需要引入经济上的成本了，简单来说就是：

1. 我在上传数据到链上前，需要押一定的钱；
2. 上传的数据在大家都认同前，有一段挑战期；
3. 在挑战期中，如果有人证明这个数据是有问题的、错误的，我的押金就没了（这是对我的惩罚）。

第三点里的“证明”，就是**欺诈证明**。