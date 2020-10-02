const axios = require('axios');
const lame = require('lame');
const Speaker = require('speaker');

(async () => {
  try {
    const response = await axios({
      url: 'https://stream.bfmspb.ru:8000/live',
      method: 'GET',
      responseType: 'stream',
      timeout: 1000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 12_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/12.0 Mobile/15E148 Safari/604.1'
      }
    })
    // console.log({ response });
    response.data.pipe(new lame.Decoder())
      .on('format', function (format) {
        this.pipe(new Speaker(format));
      });
    } catch (e) {
      console.error(e);
    }
})();
