const fetch = require('node-fetch');
const sharp = require('sharp');

exports.handler = async (event, context) => {
  if (event.httpMethod === 'GET') {
    const { url, format } = event.queryStringParameters;
    let { quality, lossless, width, height } = event.queryStringParameters;  
    quality = parseInt(quality) || 80;
    lossless = lossless === 'true' ? true : false;
    const options = { quality, lossless };
    const inputBuffer = await fetch(url).then((r) => r.buffer());
    const pipeline = await sharp(inputBuffer);
    const meta = await pipeline.metadata();
    const toFormat = format || meta.format;
    width = parseInt(width) || meta.width;
    height = parseInt(height) || meta.height;
    const outputBuffer = await pipeline.resize(width, height, { fit: 'inside' })[toFormat](options).toBuffer();
    const body = outputBuffer.toString('base64');
    return {
      statusCode: 200,
      headers: {
        "Content-Type": `image/${toFormat}`,
      },
      isBase64Encoded: true,
      body,
    };

  } else {
    return {
      statusCode: 405,
      body: 'Method Not Allowed'
    };
  }
};
