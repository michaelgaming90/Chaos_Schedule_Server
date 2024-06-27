const fs = require(`fs`);
const path = require(`path`);
const helmet = require(`helmet`);
const express = require(`express`);
const cors = require(`cors`);
const https = require(`https`);

const app = express();
const port = process.env.PORT || 5000;

const privateKey = fs.readFileSync(path.join(__dirname, "public", "ssl", "private.key"));
const certificate = fs.readFileSync(path.join(__dirname, "public", "ssl", "certificate.crt"), 'utf8');
const credentials = {key: privateKey, cert: certificate};

app.use(express.static(path.join(__dirname, "public")));
app.use(cors());
app.use(helmet());

app.get("/", (request, response) =>
{
    console.log("Server viewed");
    response.sendFile(path.join(__dirname, "public", "html", "Server_Page.html"));
})

app.get("/client", (request, response) =>
{
    response.sendFile(path.join(__dirname, "public", "html", "Client.html"));
    console.log("New User Joined");
})

app.get("/data", (request, response) =>
{
    response.sendFile(path.join(__dirname, "data", "Data.json"));
})

https.createServer(credentials, app).listen(port, "0.0.0.0", () =>
{
    console.log(`Server Running at https://localhost:${port}`);
})
