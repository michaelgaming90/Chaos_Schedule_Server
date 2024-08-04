import {Save,
    Build_Div, Build_Label, Build_H1, Build_H2, Build_Form, Build_Input
} from "/Task_panel/Task_functions/Function_Tools.js";
import {Score} from "/Task_panel/Task_functions/Page_All.js";

export function New_Task()
{  
    let Statistics_Div = Build_Div(document.body, "Statistics_Div");
    Day_Clock();
    Score(Statistics_Div, "Top_Right");

    let New_Task_Div = Build_Div(document.body, "New_Task_Div");
    Build_H1(New_Task_Div, "New Task", "New_Task");
    
    let Challenge_Form = Build_Form(New_Task_Div, "Challenge");
    Build_Label(Challenge_Form, "Challenge", "Label", "Selection");
    let Challenge_Input = Build_Input(Challenge_Form, "New_Task_Input", "checkbox");
    Build_Label(Challenge_Form, "New_Task", "", "", "New_Task_Input");

    Challenge_Input.addEventListener("click", () =>
    {
        Challenge();
        let Task_Choice_Inputs = document.querySelectorAll("#New_Task_Form input");
        Task_Choice_Inputs.forEach(Task_Choice_Input =>
        {
            Task_Choice_Input.addEventListener("click", () =>
            {
                Choices(Task_Choice_Input);
                let Confirmations = document.querySelectorAll(`#Choices_Form input`);
                Confirmations.forEach(Confirmation =>
                {
                    Confirmation.addEventListener("click", () =>
                    {
                        Answer(Confirmation, Task_Choice_Input);
                    })
                })
            })
        })
    });   
}

function Challenge(){
    let Challenge_Input = document.getElementById("New_Task_Input");
    let New_Task_Div = document.getElementById("New_Task_Div");

    if(Challenge_Input.id !== "New_Task_Input")
        return console.log("Something is not Right");
        
    if(!Challenge_Input.checked)
    {
        let Forms = document.querySelectorAll(".Forms");
        try {Forms.forEach(Form => New_Task_Div.Remove_Child(Form));}
        catch(error){}
        return;
    } 

    let New_Task_Form = Build_Form(New_Task_Div, "New_Task_Form", "Forms");
    Build_Label(New_Task_Form, "New_Task", "", "Selection");

    let Tasks = ["Bored", "School_Work", "Coding", "Workout", "cleaning", "business"]
    Tasks.forEach(Task =>
    {
        Build_Input(New_Task_Form, Task, "checkbox", "", false, "Tasks");
        Build_Label(New_Task_Form, Task, "", "", Task);
    })
}

function Choices(Task_Choice_Input)
{
    let Task_Choice_Inputs = document.querySelectorAll("#New_Task_Form input");
    let New_Task_Div = document.getElementById("New_Task_Div")

    if(!Task_Choice_Input.checked)
    {
        let Old_Choices_Form = document.getElementById(`Choices_Form`);
        New_Task_Div.Remove_Child(Old_Choices_Form);
        return;
    }

    Task_Choice_Inputs.forEach(Other_Input =>
    {
        if(Task_Choice_Input.id === Other_Input.id) return;
        if(!Other_Input.checked) return;
            
        let Old_Choices_Form = document.getElementById(`Choices_Form`);
        New_Task_Div.Remove_Child(Old_Choices_Form);
        Other_Input.checked = false; 
    })

    let Choices_Form = Build_Form(New_Task_Div, "Choices_Form", "Forms");
    Build_Label(Choices_Form, "Choices", "", "Selection");
    Build_Label(Choices_Form, `Are you Ready for Task: ${Task_Choice_Input.id}`, "Confirmation")
        
    let Choices = ["Yes", "No"];
    Choices.forEach(Choice =>
    {
        Build_Input(Choices_Form, Choice, "checkbox", "", false, "Choices");
        Build_Label(Choices_Form, Choice, "", "", Choice);
    })
}

function Answer(Confirmation_Input, Task_Choice_Input)
{
    let Confirmations_Input = document.querySelectorAll(`#Choices_Form input`);
    let New_Task_Div = document.getElementById("New_Task_Div");
    
    if(!Confirmation_Input.checked)
    {
        let Message = document.getElementById(`Message`);
        New_Task_Div.Remove_Child(Message);
        return;
    }
    
    Confirmations_Input.forEach(Other_Conformation =>
    {
        if(Confirmation_Input.id === Other_Conformation.id) return;
        if(!Other_Conformation.checked) return;
        
        let Message = document.getElementById(`Message`);
        New_Task_Div.Remove_Child(Message);
        Other_Conformation.checked = false;
    })

    if(Confirmation_Input.id === "No")
        return Build_Label(New_Task_Div, "Come Back When You're Ready", "Message", "Forms");
    
    let Minute_Formula = 60*100;
    let Random_Num = Math.floor(Math.random() * 30 +1)*Minute_Formula;

    Build_Label(New_Task_Div, `You have to do ${Task_Choice_Input.id} for ${Random_Num/Minute_Formula} minutes`, "Message", "Forms");

    Save((Data) =>
    {
        Data.Timers.push(Random_Num);
        Data.Original_Timers.push(Random_Num);
        Data.Tasks.push(Task_Choice_Input.id);
        Data.Active_Task.push(true);
        return Data;
    })
}

function Day_Clock()
{
    let Statistics_Div = document.getElementById("Statistics_Div");
    Build_H1(Statistics_Div, "Time Spent", "Time Spent")
    
    let Day_Counter_H2 = Build_H2(Statistics_Div, "Day: 1");
    let Time_Since_H2 = Build_H2(Statistics_Div, "00:00:00");
    
    let Data = JSON.parse(localStorage.getItem("Data"));
    
    setInterval(() =>
    {
        let Then = new Date(Data.Day_Registered);
        Then.setHours(Then.getHours() - 8);

        let Now = new Date();
        let milliseconds = Now - Then;

        let Seconds = Math.floor(milliseconds/1000) % 60;
        let Minutes = Math.floor(milliseconds/(60*1000)) % 60;
        let Hours = Math.floor(milliseconds/(60*60*1000));
        let Days = Math.floor(milliseconds/(24*60*60*1000));

        if(Data.Day_Task < Days)
        {
            Data.Day_Task++;
            if(Data.Week_Score[Now.getDay()] !== 0) 
                Data.Week_Score[Now.getDay()] = 0;

            Data.Goal_Score += 20;
            Data.Meditation.Timer = 0;
            Data.Meditation.Original_Timer = 0;
            Data.Task_Completed.forEach(Task => Task.Minutes = 0)
            localStorage.setItem("Data", JSON.stringify(Data));
        }

        Seconds = Seconds.toString().padStart(2, "0");
        Minutes = Minutes.toString().padStart(2, "0");
        Hours = Hours.toString().padStart(2, "0");
        Days = Days.toString().padStart(2, "0");

        Day_Counter_H2.New_Text(`Day: #${Days}`);
        Time_Since_H2.New_Text(`${Hours}hours: ${Minutes}mins: ${Seconds}sec`) 
    }, 1000);
}