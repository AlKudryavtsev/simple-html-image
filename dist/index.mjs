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
import axios from "axios";
import sharp from "sharp";
import cheerio from "cheerio";
import createImage from "node-html-to-image";
function convertHtmlToImage(content, src) {
  return __async(this, null, function* () {
    const parse = cheerio.load(content);
    const imgTags = parse("img");
    yield Promise.all(
      imgTags.map((index, element) => __async(this, null, function* () {
        const imgElement = parse(element);
        const imgUrl = imgElement.attr("src");
        if (imgUrl) {
          try {
            const response = yield axios.get(imgUrl, {
              responseType: "arraybuffer"
            });
            const resizedImageBuffer = yield sharp(response.data).resize({ width: 600, height: 600, fit: "inside" }).jpeg({ quality: 70 }).toBuffer();
            const base64Image = `data:image/${sharp(response.data).metadata().format};base64,${resizedImageBuffer.toString("base64")}`;
            imgElement.attr("src", base64Image);
          } catch (error) {
            console.error(`Error processing image ${imgUrl}: ${error}`);
          }
        }
      }))
    );
    const update = parse.html();
    yield createImage({
      output: src,
      html: update
    });
    return true;
  });
}
export {
  convertHtmlToImage
};
//# sourceMappingURL=index.mjs.map