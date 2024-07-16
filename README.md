# ME Wallet Export

目前 ME 钱包不支持生成账户的导出功能，该仓库可以基于助记词生成对应 ME 钱包的相关账户私钥，然后导入到其他钱包进行管理。

## 提醒

运行过程请保证环境的隐私性，切勿在公共场合填写助记词生成私钥。

## 运行

复制 `.env.example` 改名为 `.env`，填写相关配置参数，运行过程会遍历显示助记词对应的派生地址和私钥。

```bash
npm i
npm run start
```

### 感谢关注: [@Kunsect](https://x.com/kunsect7)
