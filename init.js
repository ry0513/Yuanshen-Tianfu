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
            console.log("开始获取角色数据：",item.title);
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
        `https://api-takumi-static.mihoyo.com/hoyowiki/genshin/wapi/entry_page?app_sn=ys_obc&entry_page_id=${id}&lang=zh-cn`
      )
      .then(
        async ({
          data: {
            data: { page },
          },
        }) => {
         
          const c_25 = JSON.parse(JSON.parse(page.ext.fe_ext).c_25.filter.text)
          const defaults = {
            id,
            name: page.name,
            attribute: c_25.filter((item) => item.includes("元素"))[0].split("/")[1],
            quality: c_25.filter((item) => item.includes("星级"))[0].split("/")[1],
            weapon: c_25.filter((item) => item.includes("武器"))[0].split("/")[1],
            area: c_25.filter((item) => item.includes("地区"))[0].split("/")[1],
          };
          const materials = JSON.parse(page.modules[1].components[0].data).list[6].materials
          defaults.specialty = materials[2].nickname;
          const row = JSON.parse(page.modules[4].components[0].data).list[0].attr.row
          const $0 = cheerio.load(row[row.length-1][7]);
          defaults.talent = $0("a .name").eq(0).text().match(/「(.+?)」/)[1]
          defaults.common_drop = $0("a .name").eq(1).text()
          defaults.drop  = $0("a .name").eq(2).text()
          defaults.talent_time = talent_time[defaults.talent];
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
