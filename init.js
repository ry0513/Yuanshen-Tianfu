const axios = require("axios");
const cheerio = require("cheerio");
const Character = require("./character");

const talent_time = {
  自由: "周一周四",
  抗争: "周二周五",
  诗文: "周三周六",

  繁荣: "周一周四",
  勤劳: "周二周五",
  黄金: "周三周六",

  浮世: "周一周四",
  风雅: "周二周五",
  天光: "周三周六",

  诤言: "周一周四",
  巧思: "周二周五",
  笃行: "周三周六",

  公平: "周一周四",
  正义: "周二周五",
  秩序: "周三周六",
};

const Init = () => {
  console.log("开始同步角色列表");
  axios
    .get(
      `https://api-static.mihoyo.com/common/blackboard/ys_obc/v1/home/content/list?app_sn=ys_obc&channel_id=189`
    )
    .then(
      async ({
        data: {
          data: {
            list: [{ children: list }],
          },
        },
      }) => {
        const juese = list
          .filter(({ name }) => name === "角色")[0]
          .list.filter(
            ({ title }) =>
              !["旅行者（空）", "旅行者（荧）", "埃洛伊"].includes(title)
          );
        for (const item of juese) {
          const defaults = { id: item.content_id, name: item.title };
          const [user, created] = await Character.findOrCreate({
            where: { id: item.content_id },
            defaults,
          });
          if (created) {
            console.log("开始获取角色数据");
            await nity(item.content_id);
          }
        }
        console.log("完成同步");
      }
    );
};

const nity = (id) => {
  return new Promise((resolve, reject) => {
    axios
      .get(
        `https://api-static.mihoyo.com/common/blackboard/ys_obc/v1/content/info?app_sn=ys_obc&content_id=${id}`
      )
      .then(
        async ({
          data: {
            data: { content },
          },
        }) => {
          console.log(content.title);
          const defaults = {
            id,
            name: content.title,
            attribute: JSON.parse(JSON.parse(content.ext).c_25.filter.text)
              .filter((item) => item.includes("元素"))[0]
              .split("/")[1],
            quality: JSON.parse(JSON.parse(content.ext).c_25.filter.text)
              .filter((item) => item.includes("星级"))[0]
              .split("/")[1],
            weapon: JSON.parse(JSON.parse(content.ext).c_25.filter.text)
              .filter((item) => item.includes("武器"))[0]
              .split("/")[1],
            area: JSON.parse(JSON.parse(content.ext).c_25.filter.text)
              .filter((item) => item.includes("地区"))[0]
              .split("/")[1],
          };
          const $0 = cheerio.load(content.contents[0].text);
          const $1 = cheerio.load(content.contents[1].text);
          $0("h2").each((i, el) => {
            if ($0(el).text() === "角色突破") {
              defaults.specialty = $0(el)
                .next()
                .next()
                .find(
                  "ul>li:nth-child(1) ul>li:nth-child(6) .obc-tmpl__icon-text"
                )
                .text();
            }
          });
          $1("h2").each((i, el) => {
            if ($1(el).text() === "天赋") {
              defaults.talent = $1(el)
                .next()
                .next()
                .find(
                  "ul>li:nth-child(1)>div tbody tr:last-child td:nth-child(10)>div:nth-child(1) .obc-tmpl__icon-text"
                )
                .text()
                .match(/「(.+?)」/)[1];
              defaults.common_drop = $1(el)
                .next()
                .next()
                .find(
                  "ul>li:nth-child(1)>div tbody tr:last-child td:nth-child(10)>div:nth-child(2) .obc-tmpl__icon-text"
                )
                .text();
              defaults.drop = $1(el)
                .next()
                .next()
                .find(
                  "ul>li:nth-child(1)>div tbody tr:last-child td:nth-child(10)>div:nth-child(3) .obc-tmpl__icon-text"
                )
                .text();
              defaults.talent_time = talent_time[defaults.talent];
            }
          });
          console.log(defaults);
          await Character.update(defaults, {
            where: { id },
          });
          setTimeout(() => {
            resolve(1);
          }, 2000);
        }
      );
  });
};

module.exports = Init;
