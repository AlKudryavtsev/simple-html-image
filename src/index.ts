import axios from 'axios';
import sharp from 'sharp';
import cheerio from 'cheerio';
import createImage from 'node-html-to-image';

export async function convertHtmlToImage(content: string, src: string) {
  const parse = cheerio.load(content);
  const imgTags = parse('img');

  await Promise.all(
    imgTags.map(async (index, element) => {
      const imgElement = parse(element);
      const imgUrl = imgElement.attr('src');

      if (imgUrl) {
        try {
          // Скачиваем изображение
          const response = await axios.get(imgUrl, {
            responseType: 'arraybuffer',
          });

          // Изменяем размер изображения с помощью sharp
          const resizedImageBuffer = await sharp(response.data)
            .resize({ width: 600, height: 600, fit: 'inside' }) // Можно также задать ширину или другие параметры
            .jpeg({ quality: 70 })
            .toBuffer();

          // Конвертируем изображение в base64

          // @ts-ignore
          const base64Image = `data:image/${sharp(response.data).metadata().format};base64,${resizedImageBuffer.toString('base64')}`;

          // Заменяем src в теге <img> на base64 строку
          imgElement.attr('src', base64Image);
        } catch (error) {
          console.error(`Error processing image ${imgUrl}: ${error}`);
        }
      }
    }),
  );
  const update = parse.html();
  await createImage({
    output: src,
    html: update,
  });

  return true;
}
