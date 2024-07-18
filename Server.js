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
const Hostname = "0.0.0.0";
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

app.get("/admin", (request, response) =>
{
    response.sendFile(path.join(__dirname, "public", "Admin panel", "Admin.html"));
})
    
app.put("/create_an_account", (request, response) =>
{
    fs.readFile(path.join(__dirname, "Data.json"), "utf-8", (error, data) =>
    {
        if(error) return response.send("Server Error Reading");
        
        data = JSON.parse(data);

        for(let i = 0; i < data.length; i++)
        {
            if(data[i].Username === request.body.Username) return response.send("Username Taken!!!");
        }
        
        let date =  new Date();
        date = date.setHours(date.getHours() + 8);
        let modified_date = new Date(date);

        let Task_Completed = 
        [   
            "Bored",
            "School_Work", 
            "Coding", 
            "Workout", 
            "cleaning", 
            "business"
        ];

        let Array_Objects = [];
        Task_Completed.forEach(Task_Complete =>
        {
            let Object =
            {
                Task: Task_Complete,
                Minutes: 0
            };

            Array_Objects.push(Object);
        })

        data.push(
        {
            Username: request.body.Username,
            Password: request.body.Password,
            Age:15,
            Score: 0,
            Day_Registered: modified_date,
            Tasks: [],
            Day_Task: 0,
            Timers: [],
            Original_Timers: [],
            Active_Task:[],
            Task_Completed: Array_Objects,
            User_Index: data.length
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
        let Username;
        let Password;

        data = JSON.parse(data);
        for(let i = 0; i < data.length; i++)
        {
            if(data[i].Username !== request.body.Username) continue;
            Username = request.body.Username;

            if(data[i].Password !== request.body.Password) continue;
            Password = request.body.Password;
            User_Index = i;        
        }

        if(Username === undefined)
        {
            response.send("Couldn't Find the username");
            return;
        }

        if(Password === undefined)
        {
            response.send("Wrong Password");
            return;
        }

        if(User_Index === null) return;

        data[User_Index].User_Index = User_Index;
        response.send(data[User_Index]);
    })
})

app.listen(Port, Hostname, () =>
{
    console.log(`Server is listening at http:${Hostname}:${Port}`)
})