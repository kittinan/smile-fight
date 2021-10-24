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

    const token = uuidv4();

    const data = { name: name, country: country, maxScore: 0, scores: [] };

    USER.put(token, JSON.stringify(data));

    res.body = { token: token, name: name, country: country };
})


router.get('/score/board', async (req, res) => {
    const raw_score_boards = await USER.get('score_boards');

    const score_boards = JSON.parse(raw_score_boards)
    res.body = score_boards;
})


router.post('/score/submit', async (req, res) => {

    const { token, payload } = req.body;
    const country = req.event.request.cf.country

    if (!token) {
        res.body = { error: true, err_msg: "Invalid token" };
        return;
    }

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

    // TODO: check parse json


    const info = await USER.get(token);
    const raw_score_boards = await USER.get('score_boards');
    let user_info = JSON.parse(info)
    let score_boards = JSON.parse(raw_score_boards)

    user_info.scores.push({ createAt: serverCreateTime, score: data.score })

    USER.put(token, JSON.stringify(user_info));

    const min_score = Math.min(...score_boards.flatMap(r => r.score))

    if (parseFloat(data.score) > parseFloat(min_score)) {
        console.log("update scoreboard")
        // Update score board
        score_boards.push({
            name: user_info.name,
            country: user_info.country,
            score: parseFloat(data.score),
            createAt: Date.now(),
        })
        score_boards.sort((a, b) => (a.score > b.score) ? -1 : 1).slice(0, 100)
        USER.put('score_boards', JSON.stringify(score_boards));
    }

    //console.log(`min_score: ${min_score}`)
    res.body = { user_info };
})

addEventListener('fetch', event => {
    event.respondWith(router.handle(event))
})
