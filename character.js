const { Sequelize, DataTypes } = require("sequelize");
const CONFIG = require("./config");

const Count = (start, end = 9, Q = 0) => {
  if (start >= end) {
    return Q;
  }
  switch (start) {
    case 1:
      Q += 12500;
      break;
    case 2:
      Q += 17500;
      break;
    case 3:
      Q += 25000;
      break;
    case 4:
      Q += 30000;
      break;
    case 5:
      Q += 37500;
      break;
    case 6:
      Q += 120000;
      break;
    case 7:
      Q += 260000;
      break;
    case 8:
      Q += 450000;
      break;
    case 9:
      Q += 700000;
      break;
  }
  start++;
  return Count(start, end, Q);
};

const sequelize = new Sequelize(CONFIG.database, CONFIG.name, CONFIG.password, {
  host: CONFIG.host,
  port: CONFIG.port,
  dialect: "mysql",
  logging: false,
  timezone: "+08:00",
});
const Character = sequelize.define("character", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    comment: "id",
  },
  name: {
    type: DataTypes.STRING,
    comment: "角色",
  },
  attribute: {
    type: DataTypes.STRING,
    comment: "属性",
  },
  area: {
    type: DataTypes.STRING,
    comment: "地区",
  },
  weapon: {
    type: DataTypes.STRING,
    comment: "武器",
  },
  quality: {
    type: DataTypes.STRING,
    comment: "品质",
  },
  talent: {
    type: DataTypes.STRING,
    comment: "天赋书",
  },
  talent_time: {
    type: DataTypes.STRING,
    comment: "天赋书时间",
  },
  specialty: {
    type: DataTypes.STRING,
    comment: "特产",
  },
  common_drop: {
    type: DataTypes.STRING,
    comment: "普通掉落物",
  },
  drop: {
    type: DataTypes.STRING,
    comment: "掉落物",
  },
  q: {
    type: DataTypes.INTEGER,
    defaultValue: 1,
    comment: "元素爆发",
  },
  e: {
    type: DataTypes.INTEGER,
    defaultValue: 1,
    comment: "元素战技",
  },
  a: {
    type: DataTypes.INTEGER,
    defaultValue: 1,
    comment: "普通攻击",
  },
  level: {
    type: DataTypes.INTEGER,
    defaultValue: 1,
    comment: "角色等级",
  },
  status: {
    type: DataTypes.STRING,
    defaultValue: "未拥有",
    comment: "状态",
  },
  gold: {
    type: DataTypes.INTEGER,
    get() {
      return Count(this.q) + Count(this.e) + Count(this.a);
    },
    comment: "所需金币",
  },
});

module.exports = Character;
