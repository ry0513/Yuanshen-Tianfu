const { createApp } = Vue;
const { Input, MessagePlugin, Select } = TDesign;
createApp({
  data() {
    return {
      dropList: {},
      filterValue: { status: ["进行中"] },
      loading: true,
      status: {
        未开始: "warning",
        进行中: "primary",
        已完成: "success",
      },
      columns: [
        { colKey: "name", title: "角色", align: "center", fixed: "left" },
        {
          colKey: "status",
          title: "状态",
          align: "center",
          filter: {
            type: "multiple",
            resetValue: [],
            list: ["未拥有", "未开始", "进行中", "已完成"],
            showConfirmAndReset: true,
          },
          edit: {
            component: Select,
            showEditIcon: false,
            props: {
              options: [
                { label: "未拥有", value: "未拥有" },
                { label: "未开始", value: "未开始" },
                { label: "进行中", value: "进行中" },
                { label: "已完成", value: "已完成" },
              ],
            },
            abortEditOnEvent: ["onChange"],
            onEdited: (context) => {
              this.update(context);
            },
          },
        },
        {
          colKey: "attribute",
          title: "元素",
          align: "center",
          filter: {
            type: "multiple",
            resetValue: [],
            list: ["风", "岩", "雷", "草", "水", "火", "冰"],
            showConfirmAndReset: true,
          },
        },
        {
          colKey: "area",
          title: "地区",
          align: "center",
          filter: {
            type: "multiple",
            resetValue: [],
            list: ["蒙德", "璃月", "稻妻", "须弥", "枫丹", "纳塔", "至冬"],
            showConfirmAndReset: true,
          },
        },
        {
          colKey: "weapon",
          title: "武器",
          align: "center",
          filter: {
            type: "multiple",
            resetValue: [],
            list: ["单手剑", "双手剑", "长柄武器", "弓", "法器"],
            showConfirmAndReset: true,
          },
        },
        {
          colKey: "level",
          title: "人物等级",
          align: "center",
          edit: {
            component: Input,
            showEditIcon: false,
            props: {
              autofocus: true,
            },
            abortEditOnEvent: ["onEnter", "onBlur"],
            onEdited: (context) => {
              this.update(context);
            },
          },
        },
        {
          colKey: "specialty",
          title: "突破特产",
          align: "center",
        },
        {
          colKey: "q",
          title: "元素爆发",
          align: "center",
          edit: {
            component: Input,
            showEditIcon: false,
            props: {
              autofocus: true,
            },
            abortEditOnEvent: ["onEnter", "onBlur"],
            onEdited: (context) => {
              this.update(context);
            },
          },
        },
        {
          colKey: "e",
          title: "元素战技",
          align: "center",
          edit: {
            component: Input,
            showEditIcon: false,
            props: {
              autofocus: true,
            },
            abortEditOnEvent: ["onEnter", "onBlur"],
            onEdited: (context) => {
              this.update(context);
            },
          },
        },
        {
          colKey: "a",
          title: "普通攻击",
          align: "center",
          edit: {
            component: Input,
            showEditIcon: false,
            props: {
              autofocus: true,
            },
            abortEditOnEvent: ["onEnter", "onBlur"],
            onEdited: (context) => {
              this.update(context);
            },
          },
        },
        {
          colKey: "talent",
          title: "天赋书",
          align: "center",
        },
        {
          colKey: "talent_time",
          title: "时间",
          align: "center",
          filter: {
            type: "multiple",
            resetValue: [],
            list: ["周一周四", "周二周五", "周三周六"],
            showConfirmAndReset: true,
          },
        },
        {
          colKey: "common_drop",
          title: "普通材料",
          align: "center",
        },
        {
          colKey: "drop",
          title: "周本材料",
          align: "center",
        },
        { colKey: "gold", title: "所需摩拉", align: "center" },
      ],
      list: [],
    };
  },
  created() {
    this.getData(this.filterValue);
  },
  methods: {
    resetFilter() {
      this.getData({});
    },
    editableCellState(cellParams) {
      const { row, col } = cellParams;
      if (["q", "e", "a"].includes(col.colKey)) {
        return 0 < row[col.colKey] && row[col.colKey] < 9;
      } else if (["level"].includes(col.colKey)) {
        return 0 < row[col.colKey] && row[col.colKey] < 90;
      } else if (["status"].includes(col.colKey)) {
        return row[col.colKey] !== "已完成";
      }
    },
    update(context) {
      axios({
        url: "/update",
        method: "post",
        data: Qs.stringify(context.newRowData),
      }).then(({ data: { code, msg } }) => {
        if (code === 0) {
          this.getData(this.filterValue);
          MessagePlugin.success(msg);
        } else {
          MessagePlugin.error(msg);
        }
      });
    },
    getData(params) {
      this.loading = true;
      axios({
        url: "/list",
        params,
      }).then(({ data: { filterValue, list, dropList } }) => {
        this.filterValue = filterValue;
        this.list = list;
        this.dropList = dropList;
        this.loading = false;
      });
    },
  },
})
  .use(TDesign)
  .mount("#app");
