import {Factory_Element, Server,
    Build_Div, Build_H1, Build_Input, Build_Button, Build_Label
} 
from "/Task_panel/Task_functions/Function_Tools.js"

export function Register_ServiceWorker()
{
    if ('serviceWorker' in navigator) 
    {
        window.addEventListener('load', async () => 
        {
            try
            {
                let registration = await navigator.serviceWorker.register("/service-worker.js");
                console.log(`Service Worker registered with scope: ${registration.scope}`);
                let a = Factory_Element("audio");
                a.New_Source("/Task_panel/audios/Alarm.mp3");   
            }
            catch(error)
            {
                console.log(`Service Worker registration failed ${error}`);
            }
        });
    }
}

export function Log_In_User(Pages)
{   
    let d = document.getElementById("Log_In_Div");
    if(d) document.body.removeChild(d);

    let Log_In_Div = Build_Div(document.body, "Log_In_Div");
    let {Page_Title_H1, Submit_Button, Create_Account_Button} = Create_Log_In_Elements();
    
    Submit_Button.addEventListener("click", async () => 
    {
        let response_text = await Get_User_Data_From_Server();
        
        if(response_text === "You're offline")
            return If_Offline(Pages);

        if(response_text === "Server Error: Reading the Data base" || response_text === "Couldn't Find the username" || response_text === "Wrong Password")
            return Display_Error_Server_Response(response_text);

        Log_In_Div.innerHTML = "";
        Page_Title_H1 = Build_H1(Log_In_Div, "Update?");

        let Data = JSON.parse(response_text);
        if(JSON.parse(localStorage.getItem("Data")) === null) localStorage.setItem("Data", JSON.stringify(Data)); 
            
        let error = document.getElementById("error");
        if(error) Log_In_Div.removeChild(error);
        
        if(JSON.parse(localStorage.getItem("Data")).Username === Data.Username) 
            return If_The_Same_Data_Stored_In_Local_Storage(Data, Pages);

        Page_Title_H1.New_Text("Proceeding will overwrite Data");
        If_Not_The_Same_Data_Stored_In_Local_Storage(Data, Pages);
    })

    Create_Account_Button.addEventListener("click", async () =>
    {
        await Create_An_Account(Pages);
    }) 
}

async function Create_An_Account(Pages)
{
    let Page_Title_H1 = document.getElementById("Page_Title");
    let Username_Input = document.getElementById("Username");
    let Password_Input = document.getElementById("Password");
    let Log_In_Div = document.getElementById("Log_In_Div");

    let error = document.getElementById("error");
    if(error) Log_In_Div.removeChild(error);
        
    if(Page_Title_H1.textContent === "Log in")
        return If_Page_Title_Is_Log_In(Pages);
    
    if(Username_Input.value.length === 0 || Password_Input.value.length === 0)
        return Build_Label(Log_In_Div, "Username or Password can't be Blank", "error");
    
    if(Confirm_Password.value !== Password_Input.value)
        return Build_Label(Log_In_Div, "Passwords Don't Match", "error");
                
    let Data_text = await Put_User_Data_From_Data();
    if(Data_text !== "Account Creation is Successful")
        return Build_Label(Log_In_Div, Data_text, "error");
    
    Log_In_User(Pages); 
}




//Log In Functions
function Create_Log_In_Elements()
{
    let Log_In_Div = document.getElementById("Log_In_Div");

    let Page_Title_H1 = Build_H1(Log_In_Div, "Log in", "Page_Title");

    Build_Input(Log_In_Div, "Username", "username", "username", true);
    Build_Input(Log_In_Div, "Password", "password", "password", true);

    let Submit_Button = Build_Button(Log_In_Div, "Log In", "Submit_Button", "submit");
    Build_Label(Log_In_Div, "Don't have an account", "text");
    let Create_Account_Button = Build_Button(Log_In_Div, "create an account", "New_Account_Button", "submit");

    return {
        Page_Title_H1,

        Submit_Button,
        Create_Account_Button,
    };
}

async function Get_User_Data_From_Server()
{
    let Username_Input = document.getElementById("Username");
    let Password_Input = document.getElementById("Password");

    let Data = 
    {
        Username: Username_Input.value,
        Password: Password_Input.value
    }

    try
    {
        let request = new Request(`${Server}/login`, 
        {
            method: "PUT",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(Data)
        })
    
        let response = await fetch(request);
        return await response.text();
    }
    catch(error)
    {}
}

function If_Offline(Pages)
{
    let Log_In_Div = document.getElementById("Log_In_Div");
    document.body.Remove_Child(Log_In_Div); 
    Pages();
}

function Display_Error_Server_Response(response_text)
{
    let Log_In_Div = document.getElementById("Log_In_Div");

    let error = document.getElementById("error");
    if(error) Log_In_Div.Remove_Child(error);

    Build_Label(Log_In_Div, response_text, "error");
}

function If_The_Same_Data_Stored_In_Local_Storage(Data, Pages)
{
    let Log_In_Div = document.getElementById("Log_In_Div")
    let Update_Button = Build_Button(Log_In_Div, "Update");
    let Keep_Button = Build_Button(Log_In_Div, "Keep");

    Update_Button.addEventListener("click", () =>
    {
        document.body.removeChild(Log_In_Div);
        localStorage.setItem("Data", JSON.stringify(Data)); 
        Pages();
    })

    Keep_Button.addEventListener("click", () =>
    {
        document.body.removeChild(Log_In_Div); 
        Pages();
    })
}

function If_Not_The_Same_Data_Stored_In_Local_Storage(Data, Pages)
{
    let Log_In_Div = document.getElementById("Log_In_Div");

    let Proceed_Button = Build_Button(Log_In_Div, "Proceed");
    let Go_Back_Button = Build_Button(Log_In_Div, "Go Back");
                
    Proceed_Button.addEventListener("click", () => 
    {
        document.body.removeChild(Log_In_Div);
        localStorage.setItem("Data", JSON.stringify(Data));
        Pages();
    })
    Go_Back_Button.addEventListener("click", Log_In_User);
}




//Create An Account Functions
function If_Page_Title_Is_Log_In(Pages)
{
    let Page_Title_H1 = document.getElementById("Page_Title");
    let Username_Input = document.getElementById("Username");
    let Password_Input = document.getElementById("Password");
    let Create_Account_Button = document.getElementById("New_Account_Button");
    let Log_In_Div = document.getElementById("Log_In_Div");
    let Submit_Button = document.getElementById("Submit_Button");
    let Text = document.getElementById("text");

    Page_Title_H1.New_Text("Create an Account");
    Username_Input.value = "";
    Password_Input.value = "";

    let Confirm_Password = Build_Input(Log_In_Div, "Confirm_Password", "password", "confirm password", true);
    Log_In_Div.insertBefore(Confirm_Password, Create_Account_Button);

    let Go_Back_Button = Build_Button(Log_In_Div, "Go Back", "Go Back");
    Go_Back_Button.addEventListener("click", () =>
    {
        let error = document.getElementById("error");
        if(error !== null) Log_In_Div.removeChild(error);
        Log_In_User(Pages);
    });

    Log_In_Div.Remove_Child(Submit_Button);
    Log_In_Div.Remove_Child(Text);
}

async function Put_User_Data_From_Data()
{
    let  Username_Input = document.getElementById("Username");
    let Password_Input = document.getElementById("Password");

    let Data = 
    {
        Username: Username_Input.value,
        Password: Password_Input.value
    }

    let request = new Request(`${Server}/create_an_account`, 
    {
        method: "PUT",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(Data)
    })

    let response = await fetch(request);
    return await response.text();
}