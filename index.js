import jszip from "jszip";
import { readFileSync, writeFileSync } from "fs";
import { xml2json } from "xml-js";

let link_text = await readFileSync("link.txt", "utf-8");

async function saveInfo(fileName) {
  // read zip file
  let file = readFileSync(fileName);
  let zipObj = await jszip.loadAsync(file);
  // get info
  let description_xml = await zipObj.file("description.xml").async("string");
  let description_json = JSON.parse(
    xml2json(description_xml, { compact: true })
  );
  console.log(description_json.theme);
  // get imgs
  let allFiles = Object.keys(zipObj.files);
  let imgs_list = allFiles.filter((file) => file.startsWith("preview/"));
  imgs_list.forEach((element, index) => {
    imgs_list[index] = element.slice(8);
  });
  imgs_list = imgs_list.filter((img) => img !== "");
  // save info
  let info = {};
  info["_hjschema"] = "小米主题";
  info["主题名称"] = fileName.match(/ (.*?).mtz/)[1];
  info["发布日期"] = fileName.match(/^(.*?) /)[1];
  info["主题作者"] = description_json.theme.designer._cdata.trim();
  info["主题介绍"] = description_json.theme.description._cdata
    .trim()
    .replace(/[\r\n]{1,2}/g, "<br/>");
  info["主题预览"] = imgs_list.sort();
  info["主题链接"] = link_text.match(
    new RegExp(info["主题名称"] + ".*?(http.*?)[\n\r]")
  )[1];
  await writeFileSync(`${info["主题名称"]}.json`, JSON.stringify(info));
  // save imgs
  for (let index = 0; index < imgs_list.length; index++) {
    const element = imgs_list[index];
    let img = await zipObj.file("preview/" + element).async("nodebuffer");
    await writeFileSync(
      "preview/小米主题_" + info["主题名称"] + "_" + element,
      img
    );
  }
}

let list = `
2020-10-13 灰太狼游戏机.mtz
2020-10-16 摇晃喜羊羊.mtz
2020-10-22 每天都要懒羊羊.mtz
2021-12-22 懒羊羊小游戏.mtz
2022-03-28 萌萌懒羊羊.mtz
2022-04-20 懒羊羊便签.mtz
2022-04-28 青青草原懒大王.mtz
2022-05-18 懒羊羊鱼嘴包.mtz
2022-06-21 懒羊羊最可爱.mtz
2022-07-28 夏日懒羊羊.mtz
2022-08-12 夏日草地懒羊羊.mtz
2022-08-17 灰太狼的拼贴清单.mtz
2023-02-01 吃货懒羊羊元宵节.mtz
2023-02-13 懒羊羊新年便签.mtz
2023-02-22 懒羊羊的工作日.mtz
2023-03-10 懒羊羊与蕉太狼.mtz
2023-03-17 懒羊羊春日郊游.mtz
2023-04-10 懒大王的青青草原.mtz
2023-04-10 懒羊羊烘焙日常.mtz
2023-04-14 喜羊羊上学记.mtz
2023-04-14 喜羊羊学习计划.mtz
2023-04-25 学霸喜羊羊.mtz
2023-04-28 羊村最美美羊羊.mtz
2023-05-12 懒羊羊夏日游玩.mtz
2023-05-31 羊羊慵懒夏日.mtz
2023-06-07 懒羊羊消消乐.mtz
2023-06-15 让不让懒羊羊睡啦.mtz
2023-06-15 转盘夏日懒羊羊.mtz
2023-06-20 闪闪发光灰太狼.mtz
2023-07-03 度假海边懒羊羊.mtz
2023-07-06 懒羊羊睡觉.mtz
2023-07-20 灵动宠物懒羊羊.mtz
2023-08-16 发光懒羊羊.mtz
2023-08-17 懒羊羊无情戴墨镜.mtz
2023-08-18 灰太狼便签.mtz
2023-08-31 膨胀墨镜懒羊羊.mtz
2023-08-31 膨胀懒羊羊睡觉.mtz
2023-09-06 膨胀懒羊羊.mtz
2023-09-14 太阳公公与懒羊羊.mtz
2023-09-14 快把懒羊羊叫醒.mtz
2023-09-20 Q萌膨胀懒羊羊.mtz
2023-09-20 光影漫画懒羊羊.mtz
2023-09-22 可爱手账美羊羊.mtz
2023-09-22 贴脸膨胀懒羊羊.mtz
2023-09-28 励志可爱喜羊羊伙伴.mtz
2023-09-28 吹开懒羊羊的面具.mtz
2023-09-28 喜羊羊手账开学季.mtz
2023-09-28 膨胀打工懒羊羊.mtz
2023-09-28 贴屏云朵懒羊羊.mtz
2023-10-09 喜羊羊与灰太狼咩.mtz
2023-10-09 在线打工灰太狼.mtz
2023-10-23 和羊羊一起摇摆.mtz
2023-11-03 喜羊羊的学习日常.mtz
2023-11-03 懒羊羊滚动漫画.mtz
2023-11-13 拟态简约灰太狼.mtz
2023-11-13 羊羊手账贴纸.mtz
2023-11-13 闪闪发光喜羊羊.mtz
2023-11-14 天气感应懒羊羊郊游.mtz
2023-11-17 懒羊羊的一天日常.mtz
2023-11-17 简笔画涂鸦懒羊羊.mtz
2023-11-17 羊羊家族合照.mtz
2023-11-20 蜡笔世界的羊羊.mtz
2023-11-21 时间感知学霸喜羊羊.mtz
2023-11-22 大头软萌懒羊羊.mtz
2023-11-22 荷气生财懒羊羊.mtz
2023-12-19 平安喜乐好运羊羊.mtz
2023-12-20 冬日圣诞懒羊羊.mtz
2023-12-22 冬季玩雪懒羊羊.mtz
2023-12-22 懒羊羊冬日温泉.mtz
2023-12-28 巨无霸懒羊羊汉堡.mtz
2024-01-04 地铁昼夜上班懒羊羊.mtz
2024-01-10 懒羊羊的泳池派对.mtz
2024-01-11 可爱懒羊羊小情绪.mtz
2024-01-11 懒羊羊双模式.mtz
2024-01-16 公主请开心可爱羊羊.mtz
2024-01-16 快说公主请暴富.mtz
2024-01-24 懒羊羊收红包啦.mtz
2024-01-26 懒羊羊的日常多换图.mtz
2024-02-02 喜羊羊返工日.mtz
2024-02-18 懒羊羊一周生活.mtz
2024-02-18 灰太狼生活日记.mtz
2024-02-18 羊羊滚筒洗衣机.mtz
2024-02-21 呆萌懒羊羊多换图.mtz
2024-02-26 懒羊羊工作日常.mtz
`
  .split("\n")
  .filter((element) => element !== "");
for (let index = 0; index < list.length; index++) {
  const element = list[index];
  await saveInfo(element);
}
