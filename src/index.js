const express = require("express");
const moment = require("moment");
const momenttz = require("moment-timezone");

const app = express();

const convertDate = (date, from, to) => {
  const res = momenttz.tz(date, from);
  res.tz(to);
  return {
    date: res.format("YYYY-MM-DD HH:mm:ss.SSS"),
    timestamp: Number(res.format("x")),
    timezone: to
  };
};

const convertTimestamp = (date) => {
  return [
    {
      date: moment(date, "x").format("YYYY-MM-DD HH:mm:ss.SSS"),
      timezone: "Etc/GMT+0"
    },
    {
      date: moment(date, "x")
        .tz("America/Sao_Paulo")
        .format("YYYY-MM-DD HH:mm:ss.SSS"),
      timezone: "America/Sao_Paulo"
    }
  ];
};

app.get("/", function (req, res) {
  const myRoute = [];
  app._router.stack.forEach(function (r) {
    if (r.route && r.route.path && r.keys[0]) {
      const { path: caminho } = r.route;
      const { name } = r.keys[0];
      const descricao = `Convert ${name}`;
      myRoute.push({ caminho, descricao });
    }
  });
  res.json(myRoute);
});

app.get("/togmt/:date", (req, res) => {
  const { date } = req.params;
  res.json(convertDate(date, "America/Sao_Paulo", "Etc/GMT+0"));
});

app.get("/tosp/:date", (req, res) => {
  const { date } = req.params;
  res.json(convertDate(date, "Etc/GMT+0", "America/Sao_Paulo"));
});

app.get("/todate/:timestamp", (req, res) => {
  const { timestamp } = req.params;
  res.json(convertTimestamp(timestamp));
});

app.listen(8080);
