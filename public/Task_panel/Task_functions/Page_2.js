import {Delay, Check, Save, Factory_Element} from "/Task_panel/Task_functions/Function_Tools.js";

export function Update(   
    Display, Container, Active_Tasks,
    milliseconds, Timer_Id, Update_Interval, 
    Data, Canvas_Context, Timer
    )
{
    if(milliseconds <= 0)
    {
        clearInterval(Update_Interval);
        Active_Tasks.New_Background_Color("red");

        let audio = document.getElementById(`Audio_${Timer_Id}`);
        if(audio !== null || !Data.Active_Task[Timer_Id]) return;
            
        Speech_Function(Timer_Id);
        Save("Score", 2, Timer_Id, Data);

        let Audio = Factory_Element("audio");
        Audio.New_Class("Audios");
        Audio.New_Id(`Audio_${Timer_Id}`);
        Audio.New_Loop(true);
        Audio.New_Source("/Task_panel/audios/civil-defense-siren-128262.mp3");
        Audio.play();
        Container.New_Child(Audio);

        let Task_Index;
        for(let i = 0; i < Data.Task_Completed.length; i++)
        {
            if(Data.Task_Completed[i].Task === Active_Tasks.textContent) Task_Index = i;
        }
        Data.Task_Completed[Task_Index].Minutes += Data.Original_Timers[Timer_Id]/(60*100);
        
        Data.Timers[Timer_Id] = milliseconds;
        localStorage.setItem("Data", JSON.stringify(Data));
        
        Active_Tasks.New_Text("Finished");
        Save("Current_Task_2", "Finished", Timer_Id, Data);
        Save("Active_Task_2", false, Timer_Id, Data);
        return;   
    }
        
    milliseconds -= 1;
    let seconds = Math.floor(milliseconds/100);
    let minutes = Math.floor(seconds/60);
    
    let sec = seconds % 60;
    let mil = milliseconds % 100;

    mil = mil.toString().padStart(2, 0);
    sec = sec.toString().padStart(2, 0);
    minutes = minutes.toString().padStart(2, 0);
    Save("Timer_2", milliseconds, Timer_Id, Data);

    Canvas_Context.clearRect(0, 0, Display.width, Display.height);

    let Fraction = milliseconds/Data.Original_Timers[Timer_Id];

    Canvas_Context.beginPath();
    Canvas_Context.arc(Display.width/2, Display.height/2, (Display.height + Display.width)/4 - 5, -Math.PI/2, Math.PI*(Fraction*2) - Math.PI/2, false);
    Canvas_Context.lineWidth = 10;
    Canvas_Context.strokeStyle = "rgb(0, 4, 243)";
    Canvas_Context.stroke();

    Timer.New_Text(`${minutes}:${sec}:${mil}`);
}

export function Filter(Data)
{
    if(Data.Tasks.length === 0 || Data.Timers.length === 0 || Data.Active_Task.length === 0) return;
    
    Data.Tasks = Data.Tasks.filter(Task => Task !== "Finished" && Task !== null);
    let Timer_Id = 0;
    Data.Timers = Data.Timers.filter(Timer => 
    {
        if(Timer === 0 || Timer === null)
        {
            Data.Original_Timers.splice(Timer_Id, 1);
        }
        Timer_Id++;
        return Timer !== 0 && Timer !== null;
    });
    Data.Active_Task = Data.Active_Task.filter(Task => Task !== false && Task!== null);

    localStorage.setItem("Data", JSON.stringify(Data)); 
}

export function Lock()
{
    let Lock = Factory_Element("button");
    Lock.New_Text("🔏- Locked");
    Lock.New_Id("Lock");
    document.body.appendChild(Lock);

    Lock.addEventListener("click", () =>
    {
        if(Lock.textContent === "🔏- Locked")
        {
            Lock.New_Text("🔓- Unlocked");
            Lock.New_Color("red");
            return;
        }
        
        Lock.New_Text("🔏- Locked");
        Lock.New_Color("chartreuse");    
    })
    return Lock;
}

export function Speech_Function(Timer_Id)
{
    window.SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

    if('SpeechRecognition' in window)
    {
        const Speech = new SpeechRecognition();
        
        Speech.lang = "en-US";
        Speech.interimResult = false;
        Speech.maxAlternatives = 1;
        
        let Listening_State = true;
        Speech.start();
        
        Speech.onend = () =>
        {
            Listening_State? Speech.start(): Speech.stop();
        }

        Speech.onresult = (event) => 
        {
            const transcript = event.results[0][0].transcript;
            
            let Button = document.querySelectorAll(".Start_Buttons");
            let Divs = document.querySelectorAll(".Grid_Items");
            if(Button[Timer_Id].textContent === "Start") 
            {
                Speech.stop();
                Listening_State = false;
                return;
            }

            if(!transcript.includes("stop")) return;

            Button[Timer_Id].New_Text("Start");               
            Button[Timer_Id].style.backgroundColor = "cyan";
            let Audio = document.getElementById(`Audio_${Timer_Id}`);
            if(Audio !== null)
            {
                Audio.pause();
                Divs[Timer_Id].Remove_Child(Audio);
            }

            Speech.stop();
            Listening_State = false;
        };
    }
}

export function Search_Timer_Id(Grid, Button, Timer_Id)
{
    for(let j = 0; j < Grid.children.length; j++)
    {
        if(Button.id === `Button_${j}`) Timer_Id = j;
    }
    return Timer_Id;
}

export function Managing_The_Previous_Button_Timer(Button_Ids, Button_Id_Count, Update_Interval)
{
    if(Update_Interval === null) return;

    clearInterval(Update_Interval);
    let Previous_Button = document.getElementById(`Button_${Button_Ids[Button_Id_Count-1]}`);

    if(Previous_Button === null) return;

    Previous_Button.New_Text("Start");
    Previous_Button.New_Background_Color("cyan");

    let Audio = document.getElementById(`Audio_${Button_Ids[Button_Id_Count-1]}`);
    let Parent = document.getElementById(`Divs_${Button_Ids[Button_Id_Count-1]}`);

    if(Audio === null) return;
    
    Audio.pause();
    Audio, Parent.Remove_Child(Audio);
    
}