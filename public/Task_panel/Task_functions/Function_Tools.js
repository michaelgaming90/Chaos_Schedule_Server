export const Server = "https://chaos-schedule-application.onrender.com";

export function Delay(ms)
{
    return new Promise((resolve, reject) => setTimeout(resolve,ms));
}

export function Check(type)
{
    console.log(type);
}

export async function Save(property, value, Timer_Id, Data)
{
    Data = JSON.parse(localStorage.getItem("Data"));
    if(property === "Current_Task") Data.Tasks.push(value);
    else if(property === "Current_Task_2") Data.Tasks[Timer_Id] = value;
    else if(property === "Original_Timer") Data.Original_Timers.push(value);
    else if(property === "Timer") Data.Timers.push(value);
    else if(property === "Timer_2") Data.Timers[Timer_Id] = value;
    else if(property === "Active_Task") Data.Active_Task.push(value);
    else if(property === "Active_Task_2") Data.Active_Task[Timer_Id] = value;
    else if(property === "Score")
    {
        Data.Score += value;
        let Score = document.getElementById("Score");
        let Points = Data.Score.toString().padStart(2, "0");
        Score.New_Text(`${Points} points`);
    }
    localStorage.setItem("Data", JSON.stringify(Data));
}

export function Factory_Element(Type)
{
    let Element = document.createElement(Type);
    Element.New_Text = (Text) => Element.textContent = Text;
    Element.New_Id = (Id) => Element.id = Id;
    Element.New_Type = (Type) => Element.type = Type;
    Element.New_Place_Holder = (placeholder) => Element.placeholder = placeholder;
    Element.New_Required = (bool) => Element.required = bool;
    Element.New_Class = (Class) => Element.classList = Class;
    Element.New_For = (For) => Element.setAttribute("for", For);
    Element.New_Name = (Name) => Element.name = Name;
    Element.New_Background_Color = (Color) => Element.style.backgroundColor = Color;
    Element.New_Color = (Color) => Element.style.color = Color;
    Element.New_Loop = (Loop) => Element.loop = Loop;
    Element.New_Source = (Source) => Element.src = Source;
    Element.New_Child = (element) => Element.appendChild(element);
    Element.Remove_Child = (element) => Element.removeChild(element);
    return Element;
}