const express = require("express");
const cron = require("node-cron");
const bodyParser = require("body-parser");
const Character = require("./character");
const Joi = require("joi");
const { Op } = require("sequelize");
const Init = require("./init");
const CONFIG = require("./config");

(async () => {
  const app = express();
  app.set("trust proxy", true);
  // 处理 post 请求
  app.use(
    bodyParser.urlencoded({
      extended: true,
    })
  );
  const a = (num) => {
    switch (num) {
      case 9:
        return 0;
      case 8:
        return 2;
      case 7:
        return 3;
      default:
        return 4;
    }
  };
  await Character.sync({ alter: true });
  app.use(express.static("static"));

  app.get("/list", (req, res) => {
    let {
      status = [],
      area = [],
      talent_time = [],
      weapon = [],
      talent = [],
      specialty = [],
      drop = [],
      common_drop = [],
      attribute = [],
    } = req.query;
    Character.findAll({
      order: [["level", "DESC"]],
      where: {
        status: { [Op.or]: status },
        area: { [Op.or]: area },
        talent_time: { [Op.or]: talent_time },
        weapon: { [Op.or]: weapon },
        talent: { [Op.or]: talent },
        drop: { [Op.or]: drop },
        specialty: { [Op.or]: specialty },
        common_drop: { [Op.or]: common_drop },
        attribute: { [Op.or]: attribute },
      },
    }).then((Character) => {
      const dropList = {};
      for (const item of Character) {
        if (!dropList[item.drop]) {
          dropList[item.drop] = 0;
        }
        dropList[item.drop] += a(item.q);
        dropList[item.drop] += a(item.e);
        dropList[item.drop] += a(item.a);
      }
      res.send({
        dropList,
        list: Character,
        filterValue: {
          status: status || [],
          area: area || [],
          talent_time: talent_time || [],
          weapon: weapon || [],
          talent: talent || [],
          specialty: specialty || [],
          drop: drop || [],
          common_drop: common_drop || [],
          attribute: attribute || [],
        },
      });
    });
  });

  app.post("/update", async (req, res) => {
    console.log(CONFIG.ips);
    console.log(req.ips[0]);
    console.log(req.ip);
    if (!CONFIG.ips.includes(req.ips[0] || req.ip)) {
      return res.send({ code: -1, msg: "没有编辑权限！" });
    }
    const schema = Joi.object({
      id: Joi.number().required(),
      q: Joi.number().integer().min(1).max(9).required(),
      e: Joi.number().integer().min(1).max(9).required(),
      a: Joi.number().integer().min(1).max(9).required(),
      level: Joi.number().integer().min(1).max(90).required(),
      status: Joi.string()
        .valid("未拥有", "未开始", "进行中", "已完成")
        .required(),
    });
    const { id, q, e, a, level, status } = req.body;
    const result = schema.validate({ id, q, e, a, level, status });
    if (result.error) {
      return res.send({ code: -1, msg: "请填写正确！" });
    }
    await Character.update(
      {
        id,
        q,
        e,
        a,
        level,
        status,
      },
      {
        where: { id },
      }
    );
    res.send({ code: 0, msg: "修改成功" });
  });

  app.listen(3098, "0.0.0.0", () => {
    console.log(`http://127.0.0.1:3098`);
    Init();
    cron.schedule(
      "0 3 * * *",
      () => {
        Init();
      },
      {
        scheduled: true,
        timezone: "Asia/Shanghai",
      }
    );
  });
})();
