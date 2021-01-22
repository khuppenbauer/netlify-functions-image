const fetch = require('node-fetch');
const imagemin = require('imagemin');
const imageminWebp = require('imagemin-webp');

exports.handler = async (event, context) => {
  if (event.httpMethod === 'GET') {
    const { url, format, quality, width, height } = event.queryStringParameters;
    const inputBuffer = await fetch(url).then((r) => r.buffer());
    
    let options = {};
    if (quality) {
      options = {
        quality: parseInt(quality),
      };
    }
    if (width && height) {
      options = {
        ...options,
        resize: {
          width: parseInt(width),
          height: parseInt(height),
        },
      };
    }

    const outputBuffer = await imagemin.buffer(inputBuffer, {
      plugins: [imageminWebp(options)],
    });
    const body = outputBuffer.toString('base64');

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'image/webp',
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
