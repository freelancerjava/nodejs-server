const http = require('http')
const port = 8080;
const host = 'localhost';

const https = require('https')

let xmlParser = require('xml2js');




var options = {
    host: 'news.google.com',
    path: '/rss?hl=en-US&gl=US&ceid=US:en',
    port: 443,
    protocol: 'https:',
    method: 'GET'
}

let xml = '';
let json;
let items = [];
let request = https.request(options, function (res) {
    let data = '';
    res.on('data', function (chunk) {
        data += chunk;
    });
    res.on('end', function () {

        xml = data;

        xmlParser.parseString(xml, { explicitArray: false }, function (err, result) {

            json = JSON.stringify(result);

            console.dir(result);
        });



        items = JSON.parse(json).rss.channel.item;

    });
});
request.on('error', function (e) {
    console.log(e.message);
});
request.end();

// let title = json.
const news = () => {
    let newsTags = '';

    items.forEach((item, i) => {
        newsTags += `<li class='list-group-item list-group-item-action item'>
        <a href='${item.link}'>${item.title}</a> 
        <div class='hidden card'>${item.description}</img></div>
        <li>`
    })

    return newsTags;


}


const requestHandler = (req, res) => {
    console.log(req.url);

    res.writeHead(200, { 'Content-type': 'text/html' })

    let html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <meta http-equiv="X-UA-Compatible" content="ie=edge">
        <title>${JSON.parse(json).rss.channel.description}</title>

        <link href="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T" crossorigin="anonymous">


        <style>
            .title {
                display: flex;
                justify-content: center;
                align-items: center;
            }

            ul {
                list-style: none;
            }

            a, a:hover {
                text-decoration: none;
            }

            .item {
                position: relative;

            }

            .item:hover .card {
                display: block;
            }

            .card {
                display: none;
                position: absolute;
                width: 300;
                height: 300;
                right: 150;
                top: 150;
            }
        </style>
    </head>
    <body>
        <div class='h1 title'><h1>The data retrived from \'Google News\' service </h1></div>
        <div class='jumbotron'>
        <ul class='list-group'>
        ${
        news()
        }
        </ul>
        </div>
    </body>
    </html>
    `
    res.end(html);

}

const server = http.createServer(requestHandler)
server.listen(port, host, (err) => {
    if (err) {
        return console.log('something bad happened', err)
    }
    console.log(`server is listening on ${port}`)
})