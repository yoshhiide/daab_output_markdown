// Description:
//   Utility commands surrounding Hubot uptime.
'use strict';

const DEBUG_LOG = true;

// module
//const fs = require('fs');
//const util = require('util');
const _ = require('lodash');
const md = require('markdown-pdf');

const MD_OUTPUT_PATH = 'create_from_bot.pdf';


module.exports = (robot) => {
  
  //----------------------テストロジック(start)---------------------
  robot.respond(/PING$/i, (res) => {
    res.send('PONG');
  });
  //----------------------テストロジック(end)-----------------------
  
  // ----------------------------
  //    テキスト受信
  // ----------------------------
  robot.hear(/([\s\S]+)/, (res) => {
    const msg = defaultHear(res);
    if (msg === false) return;

    // 1文字目が'#'の場合にPDF変換
    if (msg[0] === '#') {
      textFunc(res, msg);
    }
  });
};


// ------------------------------
//           Main funcs
// ------------------------------

// [テキスト受信]
const textFunc = (res, msg) => {

  md()
    .from.string(msg)
    .to(MD_OUTPUT_PATH, () => {
      res.send({
        path: MD_OUTPUT_PATH,
        name: 'create_from_bot.pdf',
        type: 'application/pdf'
      });
    });
};


// ------------------------------
//       Default funcs
// ------------------------------
const defaultHear = (res) => {
  // bot nameの削除およびアクションスタンプは対象外に
  let msg = res.match[1];

  // ペアトーク
  if (res.message.roomType === 1) {
    msg = msg.replace(/^\S+ /, '');
  }
  if (/^\{[\s\S]+\}$/.test(msg)) return false;
  
  // トークルーム名の変更を対象外に
  if (_.isNull(res.message.id)) return false;
  
  // 改行と前後のスペースは不要なので取り除き
  let msg2 = msg.replace(/[\n\r]/g, ' ');
  msg2 = msg2.trim();

  // 退出指示
  if (msg2 === 'bye') {
    res.send('トークルームから退出します');
    res.leave();
    return false;
  }
  
  return msg;
};

// エラー処理
const errorFunc = (errMsg) => {
  try {
    throw new Error(errMsg);
  } catch(e) {
    log(e);
  }
};

// デバッグメッセージ
const log = (debugMsg) => {
  if (DEBUG_LOG) {
    console.log(debugMsg);
  }
};
