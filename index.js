const fs = require('fs');
const AWS = require('aws-sdk');
const uuid = require('uuid/v4');
const express = require('express');
const bodyparser = require('body-parser');
const HTTPStatus = require('http-status');
const { execFile } = require('child_process');

const s3 = new AWS.S3({ region: 'ap-northeast-1' });
const params = {
  ACL: 'public-read-write',
  Bucket: `${process.env.S3_BUCKET}`,
};

const app = express();
app.use(bodyparser());

app.post('/mark', (req, res) => {
  const filename = `${uuid()}.jpg`;
  const { to, from, imageUrl } = req.body;
  params.Key = filename;

  try {
    execFile('./image-script.bash', [imageUrl, from, to, filename], (error) => {
      if (error) {
        throw new Error(error);
      }
      params.Body = fs.createReadStream(`./${filename}`);
      s3.upload(params, (err) => {
        if (err) {
          throw new Error(err);
        }
        res.status(HTTPStatus.OK).json({ url: `${process.env.IMAGE_URL}/${filename}` });
      });
    });
  } catch (error) {
    res.status(HTTPStatus.INTERNAL_SERVER_ERROR).json(error);
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.info('===========================================');
  console.info(`===== Server is running at port: ${port} =====`);
  console.info('===========================================');

  // Caught global exception error handle
  /* istanbul ignore next */
  process.on('uncaughtException', err => console.error('Caught exception: ', err.stack));
  /* istanbul ignore next */
  process.on('unhandledRejection', (reason, p) => console.error('Unhandled Rejection at: Promise ', p, ' reason: ', reason.stack));
});

module.exports = app;
