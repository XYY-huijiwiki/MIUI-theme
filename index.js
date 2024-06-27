import jszip from "jszip";
import { readFileSync, writeFileSync } from "fs";
import { xml2json } from "xml-js";
import { readdirSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

let link_text = await readFileSync("link.txt", "utf-8");
let __dirname = dirname(fileURLToPath(import.meta.url));

async function saveInfo(fileName) {
  // read zip file
  let file = readFileSync(join(__dirname, "mtz", fileName));
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
  )?.[1] || "";
  await writeFileSync(join(__dirname,'json',`${info["主题名称"]}.json`), JSON.stringify(info));
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

let list = readdirSync(join(__dirname, "mtz"));

console.log(list);

for (let index = 0; index < list.length; index++) {
  const element = list[index];
  await saveInfo(element);
}
