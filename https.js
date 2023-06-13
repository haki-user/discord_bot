const http = require('http');

let flag = true;
http.createServer((req, res) => {
    if (req.url === '/') {
        if(flag) {
            flag = false;
            ping('http://' + req.headers.host);
        }
        res.end(`Home Page, server working directory: ${ process.cwd() }`);
        return;
    }
    if (req.url === '/ping') {
        res.end("Ping...");
        return;
    }
}).listen(4000, ()=> {
    console.log("server started");
});

function ping(pingUrl) {
    setInterval(() => {
        http.get(pingUrl);
    }, 5 * 60 * 1000);
}