const CryptoJS = require("crypto-js");
const Router = require('@tsndr/cloudflare-worker-router')
const { v4: uuidv4 } = require('uuid');

const router = new Router()
router.cors()

router.get('/', (req, res) => {
    res.body = 'Hello World!'
})

router.post('/user/create', (req, res) => {

    const { name } = req.body;
    const { country } = req.event.request.cf;

    console.log(name)
    const token = uuidv4();
    console.log(token);

    const data = { name: name, country: country, maxScore: 0, scores: [] };

    USER.put(token, JSON.stringify(data));

    res.body = { token: token, name: name, country: country };
})


router.post('/score/submit', async (req, res) => {

    const { token, payload } = req.body;
    const country = req.event.request.cf.country

    if (!token) {
        res.body = { error: true, err_msg: "Invalid token" };
        return;
    }

    console.log(payload)
    console.log(token)

    const bytes = CryptoJS.AES.decrypt(payload, token);
    const payloadText = bytes.toString(CryptoJS.enc.Utf8);

    if (!payloadText) {
        res.body = { error: true, err_msg: "Invalid payload" };
        return;
    }

    const data = JSON.parse(payloadText)
    const clientCreateTime = data.t;
    const serverCreateTime = Date.now()
    const diffTime = serverCreateTime - clientCreateTime

    console.log(serverCreateTime, clientCreateTime, diffTime)

    if (diffTime > 60000) {
        // 1 minute
        res.body = { error: true, err_msg: "Invalid payload" };
        return;
    }

    console.log(data)
    // TODO: check parse json

    console.log(country)

    const info = await USER.get(token);
    console.log(info);
    let user_info = JSON.parse(info)

    user_info.scores.push({ createAt: serverCreateTime, score: data.score })

    console.log(user_info.scores)
    console.log(user_info)

    USER.put(token, JSON.stringify(user_info));

    //DB.put(country, parseInt(value) + 1)


    res.body = { user_info };

})

router.get('/test', async (req, res) => {

    console.log(req.query)
    const { token, cipher } = req.query
    //const cipherx = cipher.replace(" ", "+")
    const cipherx = 'U2FsdGVkX1+8/PAvCvvbSpNIK9D7Bwr69+kzXPpYy2E='
    console.log(token, cipherx)

    // Decrypt
    var bytes = CryptoJS.AES.decrypt(cipherx, token);
    var originalText = bytes.toString(CryptoJS.enc.Utf8);

    console.log(originalText)

    res.body = { originalText }

})

addEventListener('fetch', event => {
    event.respondWith(router.handle(event))
})
