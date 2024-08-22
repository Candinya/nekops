# Nekops

> Ops' now nyaing

## 介绍

一款进阶的服务器（SSH）管理工具。

基于 Nyawork 的服务器管理需求定制：

- 使用 JSON 格式存储文件，方便 Git 版本管理。
- 使用 tweetnacl 加密关键数据，避免隐私泄露。
- 复制 SSH 连接命令或是直接发起请求，多种调用方式自由选择。
- 简单易行的跳板机管理逻辑，快速安全的连接方式。

更多功能持续开发中…

## 特别注意

程序依赖系统级的 SSH 命令，所以请确保您的系统已经启用 OpenSSH 或其他等效功能。

推荐使用支持现代密码学的公钥认证方案（比如 ed25519 这种，或者后量子密码学（如果支持的话），没有一般 SSH 客户端那种内置认证管理。

以及因为这个只是我自己写着用（玩）的，如果您有新功能的想法，推荐直接开 PR 。功能需求类的 issue 请恕我暂时没法跟进。

## 技术栈

- [Tauri](https://v2.tauri.app/)
- [React](https://react.dev/)
- [Mantine](https://mantine.dev/)

## 非常感谢

- [Xterm.js](https://xtermjs.org/)
