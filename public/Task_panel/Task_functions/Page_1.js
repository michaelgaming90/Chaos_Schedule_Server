import {Check, Save, Factory_Element} from "/Task_panel/Task_functions/Function_Tools.js";

export function Challenge(Input, Parent){
    if(Input.id !== "New_Task_Input")
    {
        Check("Something is not Right");
        return;
    }
    
    if(Input.checked)
    {
        let Form = Factory_Element("form");
        Form.New_Id("Temp_Form");
        Form.New_Class("Forms");
        Parent.New_Child(Form);
    
        let Label = Factory_Element("label");
        Label.New_Text("New_Task");
        Label.New_Class("Selection");
        Form.New_Child(Label);

        let New_Checkboxs = 
        [
            Factory_Element("input"),
            Factory_Element("input"),
            Factory_Element("input"),
            Factory_Element("input"),
            Factory_Element("input"),
            Factory_Element("input")
        ]
    
        New_Checkboxs.forEach((New_Checkbox, Index) => 
        {
            let Div = Factory_Element("div");
            Form.New_Child(Div);
            let Texts = ["Bored", "School_Work", "Coding", "Workout", "cleaning", "business"];
            
            New_Checkbox.New_Id(Texts[Index]);
            New_Checkbox.New_Type("checkbox");
            New_Checkbox.New_Name("Tasks");
            Div.New_Child(New_Checkbox);

            let Label = Factory_Element("label");
            Label.New_Text(Texts[Index]);
            Label.New_For(Texts[Index]);
            Div.New_Child(Label);
        })
        return;
    } 
    try
    {
        let Forms = document.querySelectorAll(".Forms");
        Forms.forEach(Form => Parent.Remove_Child(Form));
    }
    catch(error){}
}

export function Choices(Task_Choice, Task_Choices, Parent)
{
    if(Task_Choice.checked)
    {
        Task_Choices.forEach(Other =>
        {
            if(Task_Choice.id === Other.id) return;
            
            if(Other.checked) 
            {
                let Sample_Form = document.getElementById(`Choices_Form`);
                Parent.Remove_Child(Sample_Form);
                Other.checked = false;
            }  
        })

        let Choices_Form = Factory_Element("form");
        Choices_Form.New_Id("Choices_Form");
        Choices_Form.New_Class("Forms");
        Parent.New_Child(Choices_Form);

        let Label = Factory_Element("label");
        Label.New_Text("Choices");
        Label.New_Class("Selection");
        Choices_Form.New_Child(Label);

        let P = Factory_Element("p");
        P.New_Text(`Are you Ready for Task: ${Task_Choice.id}`);
        Choices_Form.New_Child(P);
        
        let Inputs =
        [
            Factory_Element("input"),
            Factory_Element("input")
        ];

        Inputs.forEach((Input, Index) =>
        {
            let Div = Factory_Element("div");
            Choices_Form.New_Child(Div);

            let Texts = ["Yes", "No"];

            Input.New_Id(Texts[Index]);
            Input.New_Type("checkbox");
            Input.New_Name("Choices");
            Div.New_Child(Input);
        
            let Label = Factory_Element("label");
            Label.New_Text(Texts[Index]);
            Label.New_For(Texts[Index]);
            Div.New_Child(Label);
        })
        return;
    }
    let Sample = document.getElementById(`Choices_Form`);
    Parent.Remove_Child(Sample);
}

export function Answer(Pick, Picks, Task_Choice, Parent, Timer_Id, Data)
{
    if(!Pick.checked)
    {
        let p = document.getElementById(`label`);
        Parent.Remove_Child(p);
        return;
    }
    
    
    Picks.forEach(Sample =>
    {
        if(Pick.id === Sample.id) return;
        
        if(Sample.checked)
        {
            let Sample_Form = document.getElementById(`label`);
            Parent.Remove_Child(Sample_Form);
            Sample.checked = false;
        }  
    })

    if(Pick.id === "Yes")
    {
        let Random_Num = Math.floor(Math.random() * 30 +1)*60*100;

        let Label = Factory_Element("label");
        Label.New_Text(`You have to do ${Task_Choice.id} for ${Random_Num/(60*100)} minutes`);
        Label.New_Id("label");
        Label.New_Class("Forms");
        Parent.New_Child(Label);

        Save("Timer", Random_Num, Timer_Id, Data);
        Save("Original_Timer", Random_Num, Timer_Id, Data);
        Save("Current_Task", Task_Choice.id, Timer_Id, Data);
        Save("Active_Task", true, Timer_Id, Data);
        return;
    }
    
    let Label = Factory_Element("label");
    Label.New_Text("Come Back When You're Ready");
    Label.New_Id("label");
    Label.New_Class("Forms");
    Parent.New_Child(Label);
}

export function Day_Clock(Parent, Data)
{
    let H1 = Factory_Element("h1");
    H1.New_Text("Time Spent");
    H1.New_Id("Time Spent");
    Parent.New_Child(H1);
    
    let Day_Counter = Factory_Element("h2");
    Day_Counter.New_Text("Day: 1");
    Parent.New_Child(Day_Counter);
    
    let Day = Factory_Element("h2");
    Day.New_Text("00:00:00");
    Parent.New_Child(Day);
    Data = JSON.parse(localStorage.getItem("Data"));
    
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

        Seconds = Seconds.toString().padStart(2, "0");
        Minutes = Minutes.toString().padStart(2, "0");
        Hours = Hours.toString().padStart(2, "0");
        Days = Days.toString().padStart(2, "0");

        Day_Counter.New_Text(`Day: #${Days}`);
        Day.New_Text(`${Hours}hours: ${Minutes}mins: ${Seconds}sec`)
        
        if(milliseconds % (24*60*60*1000) === 0)
        {
            Data.Task_Completed.forEach(Task => Task.Minutes = 0)
            localStorage.setItem("Data", JSON.stringify(Data));
        }
    }, 1000);
}