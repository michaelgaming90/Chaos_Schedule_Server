import {Delay, Check, Save, Factory_Element} from "./Function_Tools.js";

export function Update(Display, Container, Active_Tasks, milliseconds, Timer_Id, Update_Interval, Data)
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
        Audio.New_Source("../../audio/civil-defense-siren-128262.mp3");
        Audio.play();
        Container.New_Child(Audio);

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
    Display.New_Text(`${minutes}:${sec}:${mil}`);
}

export function Filter(Data)
{
    if(Data.Tasks.length === 0 || Data.Timers.length === 0 || Data.Active_Task.length === 0) return;
    
    Data.Tasks = Data.Tasks.filter(Task => Task !== "Finished" && Task !== null);
    Data.Timers = Data.Timers.filter(Timer => Timer !== 0 && Timer !== null);
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
            if(!transcript.includes("stop")) return;
            
            let Button = document.querySelectorAll(".Start_Buttons");
            let Divs = document.querySelectorAll(".Grid_Items");
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

    if(Audio !== null)
    {
        Audio.pause();
        Audio, Parent.Remove_Child(Audio);
    } 
}