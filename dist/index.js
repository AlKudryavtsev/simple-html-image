"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var __async = (__this, __arguments, generator) => {
  return new Promise((resolve, reject) => {
    var fulfilled = (value) => {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    };
    var rejected = (value) => {
      try {
        step(generator.throw(value));
      } catch (e) {
        reject(e);
      }
    };
    var step = (x) => x.done ? resolve(x.value) : Promise.resolve(x.value).then(fulfilled, rejected);
    step((generator = generator.apply(__this, __arguments)).next());
  });
};

// src/index.ts
var src_exports = {};
__export(src_exports, {
  convertHtmlToImage: () => convertHtmlToImage
});
module.exports = __toCommonJS(src_exports);
var import_axios = __toESM(require("axios"));
var import_sharp = __toESM(require("sharp"));
var import_cheerio = __toESM(require("cheerio"));
var import_node_html_to_image = __toESM(require("node-html-to-image"));
function convertHtmlToImage(content, src) {
  return __async(this, null, function* () {
    const parse = import_cheerio.default.load(content);
    const imgTags = parse("img");
    yield Promise.all(
      imgTags.map((index, element) => __async(this, null, function* () {
        const imgElement = parse(element);
        const imgUrl = imgElement.attr("src");
        if (imgUrl) {
          try {
            const response = yield import_axios.default.get(imgUrl, {
              responseType: "arraybuffer"
            });
            const resizedImageBuffer = yield (0, import_sharp.default)(response.data).resize({ width: 600, height: 600, fit: "inside" }).jpeg({ quality: 70 }).toBuffer();
            const base64Image = `data:image/${(0, import_sharp.default)(response.data).metadata().format};base64,${resizedImageBuffer.toString("base64")}`;
            imgElement.attr("src", base64Image);
          } catch (error) {
            console.error(`Error processing image ${imgUrl}: ${error}`);
          }
        }
      }))
    );
    const update = parse.html();
    yield (0, import_node_html_to_image.default)({
      output: src,
      html: update
    });
    return true;
  });
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  convertHtmlToImage
});
//# sourceMappingURL=index.js.map