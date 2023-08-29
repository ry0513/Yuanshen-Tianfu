### 运行

- 直接运行

```js
// 1. 编辑 config.js 文件
// 2. 安装依赖
npm install
// 3. 直接运行服务
npm run app
// 或 3. 使用 pm2
npm run start
```

- docker (自用)

1. 再合适的位置创建并配置 config.js 文件
2. 拉取镜像 ccr.ccs.tencentyun.com/ry0513/ruoyu:tianfu-0.2
3. 启动镜像

```docker
version: "3"
services:
  tianfu:
    container_name: tianfu
    image: ccr.ccs.tencentyun.com/ry0513/ruoyu:tianfu-0.2
    labels:
      createdBy: Apps
    networks:
      RuoYu:
        ipv4_address: 172.20.0.5
    restart: always
    volumes:
      - /var/docker/tianfu/config.js:/app/config.js
networks:
  RuoYu:
    external: true
```
