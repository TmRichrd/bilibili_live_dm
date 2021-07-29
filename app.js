const request = require('request')
const mysql = require('mysql');
const _config = require('./mysql.config')
let url = "https://api.live.bilibili.com/ajax/msg"
let header = {
  "Content-Type": "application/x-www-form-urlencoded",
  "Origi": "https://live.bilibili.com",
  "Referer": "https://live.bilibili.com/22625025?spm_id_from=333.334.b_62696c695f6c697665.5",
  "User-Agent": "Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/72.0.3626.119 Safari/537.36"
}
let params = {
  roomid: "22625025",
  csrf_token: "fa56950667934cf5a3479ca94abc1f9a",
  csrf: "fa56950667934cf5a3479ca94abc1f9a",
  visit_id: ""
}

const connection = mysql.createConnection(_config)
connection.connect();

let time = null
clearInterval(time)
setInterval(() => {
  request({
    url: url,
    method: "post",
    headers: header,
    form: params,
  }, (error, res, body) => {
    const { data } = JSON.parse(body)
    data.room.forEach(item => {
      let sql = `INSERT INTO c_dwr VALUES(0,'${item.text}','${item.uid}','${item.nickname}','${item.timeline}','${item.medal[0]}','${item.medal[1]}','${item.medal[2]}')`
      connection.query(sql, function (error, results, fields) {
        if (error) throw error;
        console.log(`插入成功,当前插入数量${data.room.length}`);
      });
    })
  })
}, 2000);