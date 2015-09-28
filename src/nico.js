import qs from 'querystring';

import Promise from 'bluebird';
import request from 'request';
import { parseString } from 'xml2js';
import cheerio from 'cheerio';
import he from 'he';

let xmlToJson = async xml =>
	await new Promise((res, rej) =>
		parseString(xml, (err, json) =>	err ? rej(err) : res(json))
	);

let r = Promise.promisifyAll(request.defaults({ jar: true }));

let login = o => r.postAsync('https://secure.nicovideo.jp/secure/login', { form: o });

let flv = async id => {
	let [{ body }] = await r.getAsync(`http://flapi.nicovideo.jp/api/getflv/${id}`);
	return qs.parse(body);
};

let info = async id => {
	let [{ body }] = await r.getAsync(`http://ext.nicovideo.jp/api/getthumbinfo/${id}`);
	return (await xmlToJson(body)).nicovideo_thumb_response.thumb[0];
};

let video = async id => {
	let [{ body }] = await r.getAsync(`http://www.nicovideo.jp/watch/${id}?watch_harmful=1`);
	return body;
};

let decodeDesc = html =>
	he.decode(html.replace(/\<br\s*\/?\>/g, '\n').replace(/\<.*?\>/g, ''));

let meta = async id => {
	let [v, i] = await* [video(id), info(id)];
	let $ = cheerio.load(v);
	let el = $('#topVideoInfo > p.videoDescription.description');
	i.description = decodeDesc(el.html());
	return i;
};

export default {
	login,
	flv,
	info,
	video,
	meta,
	r
};
