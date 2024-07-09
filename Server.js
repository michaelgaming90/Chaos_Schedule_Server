const express = require(`express`);
const https = require(`https`);
const fs = require(`fs`);
const path = require(`path`);
const cors = require(`cors`);
const bodyParser = require("body-parser");

const app = express();

app.use(cors(
    {
        origin: "*",
        methods: ["GET", "PUT", "POST"],
        credentials: true
    }
));
app.use(express.json());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

const Port = 5000;
const Options = 
{
    key: fs.readFileSync(path.join(__dirname, "Security", "private.key")),
    cert: fs.readFileSync(path.join(__dirname, "Security", "certificate.pem"))
}

app.get("/", (request, response) =>
{
    response.sendFile(path.join(__dirname, "public", "Task.html"));
})

app.get("/data", (request, response) =>
{
    response.sendFile(path.join(__dirname, "Data.json"));
})

app.put("/create_an_account", (request, response) =>
{
    fs.readFile(path.join(__dirname, "Data.json"), "utf-8", (error, data) =>
    {
        if(error)
        {
            response.send("Server Error Reading");
            return;
        }
        data = JSON.parse(data);
        let date =  new Date();
        date = date.setHours(date.getHours() + 8);
        let modified_date = new Date(date)

        data.push(
        {
            Username: request.body.Username,
            Password: request.body.Password,
            Age:15,
            Score: 0,
            Day_Registered: modified_date,
            Tasks: [],
            Timers: [],
            Active_Task:[]
        })
        
        fs.writeFile(path.join(__dirname, "Data.json"), JSON.stringify(data, null, 4), (error) =>
        {
            if(error)
            {
                response.send("Account Creation Failed");
                return;
            }
            response.send("Account Creation is Successful");
        })
    })
})

app.put("/Save", (request, response) =>
{
    fs.readFile(path.join(__dirname, "Data.json"), "utf-8", (error, data) =>
    {
        if(error)
        {
            response.send("Error Saving on the Server");
            return;
        }

        data = JSON.parse(data);
        data[request.body.User_Index] = request.body;

        fs.writeFile(path.join(__dirname,  "Data.json"), JSON.stringify(data, null, 4), (error) =>
        {
            if(error)
            {
                response.send("Error Saving on the Server");
                return;
            }
            response.send("Successfully Saved");
        })
    });
})

app.put("/login", (request, response) =>
{
    fs.readFile(path.join(__dirname, "Data.json"), "utf-8", (error, data) =>
    {
        if(error)
        {
            response.send("Server Error: Reading the Data base")
            return;
        }
        let User_Index;
        data = JSON.parse(data);
        for(let i = 0; i < data.length; i++)
        {
            if(data[i].Username === request.body.Username && data[i].Password === request.body.Password) User_Index = i;
        }

        if(User_Index === undefined)
        {
            response.send("Couldn't Find an Account");
            return;
        }

        data[User_Index].User_Index = User_Index;
        response.send(data[User_Index]);
    })
})

app.listen(Port);
