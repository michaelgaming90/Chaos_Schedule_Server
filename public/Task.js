import {Hostname, Port, Delay, Check, Save, Factory_Element} from "../Task_functions/Function_Tools.js";
import {Score, Server_Save} from "../Task_functions/Page_All.js";
import {Challenge, Choices, Answer, Day_Clock} from "../Task_functions/Page_1.js";
import {Update, Filter, Lock, Speech_Function, Search_Timer_Id, Managing_The_Previous_Button_Timer} from "../Task_functions/Page_2.js";

let Update_Interval;
let Timer_Id = 0;
let Data;
let Page_Ids = [];
let Page_Index = 0;

Log_In();
function Log_In()
{   
    /*Log In Div*/
    let Log_In_Container = Factory_Element("div");
    Log_In_Container.New_Id("Log_In_Div");
    document.body.appendChild(Log_In_Container);

    /*Page Title*/
    let Page_Title = Factory_Element("h1");
    Page_Title.New_Text("Log in");
    Log_In_Container.New_Child(Page_Title);

    /*Inputs*/ 
    let Inputs = [ Factory_Element("input"), Factory_Element("input")]
    let Inputs_Index = 0;
    Inputs.forEach(Input =>
    {
        let Ids = ["Username", "Password"];
        let Types = ["username", "password"];
        let Placeholders = ["username", "password"];
        let Requireds = [true, true];

        Input.New_Id(Ids[Inputs_Index]);
        Input.New_Type(Types[Inputs_Index]);
        Input.New_Place_Holder(Placeholders[Inputs_Index]);
        Input.New_Required(Requireds[Inputs_Index]);
        Log_In_Container.New_Child(Input);
        Inputs_Index++;
    })
    let [Username_Input, Password_Input] = Inputs;

    /*Buttons*/
    let Buttons = [Factory_Element("button"), Factory_Element("button")];
    let Buttons_Index = 0;
    Buttons.forEach(Button => 
    {
        let Texts = ["Log In", "create an account"];
        let Ids = ["Submit_Button", "New_Account_Button"];
        let Types = ["submit", "submit"];

        Button.New_Text(Texts[Buttons_Index]);
        Button.New_Id(Ids[Buttons_Index]);
        Button.New_Type(Types[Buttons_Index]);
        Log_In_Container.New_Child(Button);
        Buttons_Index++;
    })
    let [Submit_Button, Create_Account_Button] = Buttons;

    /*Text*/
    let text = Factory_Element("p");
    text.New_Text("Don't have an account");
    text.New_Id("text");
    Log_In_Container.insertBefore(text, Create_Account_Button);
    
    /*Event Listeners*/
    Submit_Button.addEventListener("click", async () => 
    {
        Data = 
        {
            Username: Username_Input.value,
            Password: Password_Input.value
        }

        try
        {
            let request = new Request(`chaos-schedule-application.onrender.com/login`, 
            {
                method: "PUT",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify(Data)
            })
    
            let response = await fetch(request); 
            Data = await response.json();
            
            let Local_Storage = JSON.parse(localStorage.getItem("Data"));
            if(Local_Storage === null) localStorage.setItem("Data", JSON.stringify(Data)); 
            if(Local_Storage.Username !== Data.Username)
            {
                Log_In_Container.Remove_Child(Password_Input);
                Log_In_Container.Remove_Child(Username_Input);
                Log_In_Container.Remove_Child(text);
                Log_In_Container.Remove_Child(Create_Account_Button);
                Log_In_Container.Remove_Child(Submit_Button);
                
                let Element = document.getElementById("error");
                if(Element !== null) Log_In_Container.removeChild(Element);
                
                Page_Title.New_Text("Proceeding will overwrite Data");

                let Buttons = 
                [
                    Factory_Element("button"), 
                    Factory_Element("button")
                ]
                let Buttons_Index = 0;
                Buttons.forEach(Button => 
                {
                    let Texts = ["Proceed", "Go Back"];

                    Button.New_Text(Texts[Buttons_Index]);
                    Log_In_Container.New_Child(Button);
                    Buttons_Index++;
                })
                let [Proceed_Button, Go_Back_Button] = Buttons;
                
                Proceed_Button.addEventListener("click", () => 
                {
                    document.body.removeChild(Log_In_Container);
                    Pages();
                    localStorage.setItem("Data", JSON.stringify(Data));
                })

                Go_Back_Button.addEventListener("click", () => 
                {
                    document.body.removeChild(Log_In_Container);
                    Log_In();
                })
                return;
            }

            document.body.removeChild(Log_In_Container);
            Pages();
        }
        catch(error)
        {
            let Element = document.getElementById("error");
            if(Element !== null) Log_In_Container.removeChild(Element);

            let p = Factory_Element("p");
            p.New_Id("error");
            Log_In_Container.New_Child(p);

            if(error !== `SyntaxError: Unexpected token 'C', "Couldn't F"... is not valid JSON`) 
            p.New_Id(error);
        }
    })

    let Confirm_Password = Factory_Element("input");
    Create_Account_Button.addEventListener("click", () =>
    {
        Create_An_Account(Page_Title, Inputs, Confirm_Password, Log_In_Container, Create_Account_Button);
    }) 
}

async function Create_An_Account(Page_Title, [Username_Input, Password_Input], Confirm_Password, Log_In_Container, Create_Account_Button)
{
    let p = document.getElementById("error");
    if(p !== null) Log_In_Container.removeChild(p);
        
    if(Page_Title.textContent === "Log in")
    {
        Page_Title.New_Text("Create an Account");
        Username_Input.New_Place_Holder("new username");
        Password_Input.New_Place_Holder("new password");

        Confirm_Password.New_Id("Confirm_Password");
        Confirm_Password.New_Type("password");    
        Confirm_Password.New_Place_Holder("confirm password");
        Confirm_Password.New_Required(true);
        Log_In_Container.insertBefore(Confirm_Password, Create_Account_Button);

        Log_In_Container.removeChild(Submit_Button);
        Log_In_Container.removeChild(text);
        return;
    }

    debugger
    if(Username_Input.value.length === 0 || Password_Input.value.length === 0, Confirm_Password.value.length === 0)
    {
        let p = Factory_Element("p");
        p.New_Text("Username or Password can't be Blank");
        p.New_Id("error");
        Log_In_Container.New_Child(p);
        return;
    }

    if(Confirm_Password.value !== Password_Input.value)
    {
        let p = Factory_Element("p");
        p.New_Text("Passwords Don't Match");
        p.New_Id("error");
        Log_In_Container.New_Child(p);
        return;
    }
            
    Data = 
    {
        Username: Username_Input.value,
        Password: Password_Input.value
    }

    let request = new Request(`chaos-schedule-application.onrender.com/create_an_account`, 
    {
        method: "PUT",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(Data)
    })
    
    await fetch(request);
    Log_In(); 
}

function Pages()
{
    document.body.innerHTML = "";

    let Tabs = Factory_Element("div");
    Tabs.New_Id("Tabs")
    document.body.appendChild(Tabs);
    
    let Menu_Button_Entry = Factory_Element("label");
    Menu_Button_Entry.New_Text("≡")
    Menu_Button_Entry.New_Id("Menu_Button_Entry");
    Menu_Button_Entry.New_Class("Menu_Buttons");
    Tabs.New_Child(Menu_Button_Entry);

    Menu_Button_Entry.addEventListener("click", Menu_Function);

    let Pages = [New_Task, Active_Tasks, Qr_Code_Generator];
    //default Page
    Pages[0]();
}

//Toggle Page
function Menu_Function()
{
    let Menu_Div = Factory_Element("div");
    Menu_Div.New_Id("Menu_Div");
    Menu_Div.New_Class("Animate_Left");
    document.body.appendChild(Menu_Div);
    
    let Labels = [Factory_Element("label"), Factory_Element("label"), Factory_Element("label"), Factory_Element("label"), Factory_Element("label")]
    let Labels_Index = 0;
    Labels.forEach(Label =>
    {
        let Texts = ["≡", "Menu", "New_Task", "Active_Tasks", "QR Code Generator"]
        let Ids = ["Menu_Button", "Menu_Text"];
        let Classes = ["Menu_Buttons"];

        Labels_Index < 2? Label.New_Id(Ids[Labels_Index]): null;
        if (Labels_Index < 1) Label.New_Class(Classes[Labels_Index]);
        else if(Labels_Index > 1) Label.New_Class("Task_Menu");
        Label.New_Text(Texts[Labels_Index]);
        Menu_Div.New_Child(Label);
        Labels_Index++;
    })
    let [Menu_Button] = Labels;

    let hr = Factory_Element("hr");
    Menu_Div.insertBefore(hr, Labels[2]);
    
    let Buttons = document.querySelectorAll(".Task_Menu");

    Buttons.forEach(Button =>
    {
        Button.addEventListener("click", () =>
        {
            let Page_Id = "";
            if(Button.textContent === "New_Task") Page_Id = "New_Task";
            else if(Button.textContent === "Active_Tasks") Page_Id = "Active_Tasks";
            else if(Button.textContent === "QR Code Generator") Page_Id = "QR_Code_Page";

            if(Page_Ids[Page_Index-1] === Page_Id) return;

            document.body.innerHTML = 
            `<div id="Tabs" class="null">
                <h2 id="Menu_Button_Entry" class="Menu_Buttons">≡</h2>
            </div>`;

            let Menu_Button_Entry = document.getElementById("Menu_Button_Entry");
            Menu_Button_Entry.addEventListener("click", Menu_Function);

            if(Page_Id === "New_Task") New_Task();
            else if(Page_Id === "Active_Tasks") Active_Tasks();
            else if(Page_Id === "QR_Code_Page") Qr_Code_Generator();

            Page_Ids.push(Page_Id);
            Page_Index++;  
        })
    })
    
    Menu_Button.addEventListener("click", async () =>
    {
        if(Menu_Div !== null)
        {
            Menu_Div.New_Class("Animate_Right");
            await Delay(975);
            document.body.removeChild(Menu_Div);
        }   
    })
}

//Pages Structure
//Page 1
function New_Task()
{  
    let Divs = [Factory_Element("div"), Factory_Element("div")];
    let Divs_Index = 0;
    Divs.forEach(Div =>
    {
        let Ids = ["Stats_Div", "My_Div"];

        Div.New_Id(Ids[Divs_Index]);
        document.body.appendChild(Div);
        Divs_Index++;
    })
    let [Stats_Div, New_Task_Div] = Divs;

    Day_Clock(Stats_Div, Data);
    Score(Stats_Div, "Top_Right", Data);

    let H1 = Factory_Element("h1");
    H1.New_Text("New Task");
    H1.New_Id("New_Task");
    New_Task_Div.New_Child(H1);
    
    let Form = Factory_Element("form");
    Form.New_Id("Challenge");
    New_Task_Div.New_Child(Form);

    let Label = Factory_Element("label");
    Label.New_Text("Challenge");
    Label.New_Class("Selection");
    Label.New_Id("Label");
    Form.New_Child(Label);

    let Inputs = [Factory_Element("input")];
    let Inputs_Index = 0;
    Inputs.forEach(Input =>
    {
        let Types = ["checkbox"];
        let Ids = ["New_Task"];

        Input.New_Type(Types[Inputs_Index]);
        Input.New_Id(`${Ids[Inputs_Index]}_Input`);
        Form.New_Child(Input);

        let Label = Factory_Element("label");
        Label.New_Text(Ids[Inputs_Index]);
        Label.New_For(`${Ids[Inputs_Index]}_Input`);
        Form.New_Child(Label);
        Inputs_Index++;
    })

    Inputs.forEach(async Input =>
    {   
        Input.addEventListener("click", () =>
        {
            Challenge(Input, New_Task_Div);
            let Task_Choices = document.querySelectorAll("#Temp_Form input");
            Task_Choices.forEach(Task_Choice =>
            {
                Task_Choice.addEventListener("click", () =>
                {
                    Choices(Task_Choice, Task_Choices, New_Task_Div);
                    let Picks = document.querySelectorAll(`#Choices_Form input`);
                    Picks.forEach(Pick =>
                    {
                        Pick.addEventListener("click", () =>
                        {
                            Answer(Pick, Picks, Task_Choice, New_Task_Div, Timer_Id, Data);
                        })
                    })
                })
            })
        });
    })
}

//Page 2
function Active_Tasks()
{
    Data = JSON.parse(localStorage.getItem("Data")); 
    Filter(Data);

    let Lock_Content = Lock();
    Score(document.body, "Bottom_Center", Data);

    let Active_Tasks_Div = Factory_Element("div");
    Active_Tasks_Div.New_Id("Active_Tasks_Div");
    document.body.appendChild(Active_Tasks_Div);

    let H1 = Factory_Element("h1");
    H1.New_Text("Active Tasks Selection List");
    H1.New_Id("Active_Tasks_Selection");
    Active_Tasks_Div.New_Child(H1);
    
    let Grid = Factory_Element("div");
    Grid.New_Id("Grid");
    Active_Tasks_Div.New_Child(Grid);

    let Button_Ids = [];
    let Button_Id_Count = -1;

    for(let i = 0; i < Data.Tasks.length; i++)
    {
        let Div = Factory_Element("div");
        Div.New_Id(`Divs_${i}`);
        Div.New_Class("Grid_Items");
        Grid.New_Child(Div);
        
        let Labels = [Factory_Element("label"), Factory_Element("label")];
        let Labels_Index = 0;
        Labels.forEach(Label =>
        {
            let Ids = [`Active_Task_${i}`, `Timer_${i}`];
            let Texts = ["None", "00:00:00"];
            let Classes = ["Active_Tasks", "Timers"];

            Label.New_Id(Ids[Labels_Index]);
            Label.New_Text(Texts[Labels_Index]);
            Label.New_Class(Classes[Labels_Index]);
            Div.New_Child(Label);
            Labels_Index++;
        })
        let [Active_Task, Display] = Labels;
        
        let Button = Factory_Element("button");
        Button.New_Text("Start");
        Button.New_Id(`Button_${i}`);
        Button.New_Class("Start_Buttons");
        Div.New_Child(Button);
        
        Timer_Id = i;
        let milliseconds = Data.Timers[Timer_Id] + 1;
        Active_Task.New_Text(Data.Tasks[Timer_Id]);
        Update(Display, Div, Active_Task, milliseconds, Timer_Id, Update_Interval, Data);
        
        Button.addEventListener("click", () =>
        {
            if(Lock_Content.textContent === "🔏- Locked") return;     
            
            Timer_Id = Search_Timer_Id(Grid, Button, Timer_Id);
            Data = JSON.parse(localStorage.getItem("Data"));
            let milliseconds = Data.Timers[Timer_Id];
        
            if(Button.textContent === "Start")
            {
                Button_Ids.push(Timer_Id);
                Button_Id_Count++;
        
                Managing_The_Previous_Button_Timer(Button_Ids, Button_Id_Count, Update_Interval);
                        
                Update_Interval = setInterval(() =>
                {
                    milliseconds -= 1;
                    Update(Display, Div, Active_Task, milliseconds, Timer_Id, Update_Interval, Data);
                }, 10);
        
                if(milliseconds > 0)
                {
                    Button.New_Text("Stop");
                    Button.New_Background_Color("red");
                }
                return;
            }

            clearInterval(Update_Interval);
            Button.New_Text("Start");               
            Button.New_Background_Color("cyan");
            let Audio = document.getElementById(`Audio_${Timer_Id}`);
            if(Audio === null) return;
            Audio.pause();
            Div.Remove_Child(Audio);
        })
    }
    Server_Save(Data);
}

//Last Page
function Qr_Code_Generator()
{
    let QR_Div = Factory_Element("div");
    QR_Div.New_Id("QR_Div");
    document.body.appendChild(QR_Div);
    
    let Label = Factory_Element("label");
    Label.New_Text("QR Code Generator")
    QR_Div.New_Child(Label);
    
    let Hr = Factory_Element("hr");
    QR_Div.New_Child(Hr);

    let Input = Factory_Element("input");
    Input.New_Place_Holder("Website URL");
    QR_Div.New_Child(Input);
    
    let Button = Factory_Element("button");
    Button.New_Text("Generate QR_Code");
    QR_Div.New_Child(Button);
    
    let QR_Code = Factory_Element("img");
    QR_Div.New_Child(QR_Code);

    Button.addEventListener("click", async () =>
    {
        if(Input.value.length > 0)
        {
            QR_Code.style.opacity = "0";
            QR_Code.src = `https://api.qrserver.com/v1/create-qr-code/?size=170x170&data=${Input.value}`;
            QR_Div.style.maxHeight = "300px";
            await Delay(400);
            QR_Code.style.opacity = "100";
            return;
        }

        QR_Code.style.opacity = "0";
        await Delay(1000);
        QR_Div.style.maxHeight = "140px";
        Button.textContent = "Generate QR_Code";
    })

    Input.addEventListener("change", () =>
    {
        if(Input.value.length === 0) Button.textContent = "Delete QR Code";
    })
}
