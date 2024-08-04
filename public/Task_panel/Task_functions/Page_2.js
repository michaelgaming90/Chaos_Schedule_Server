import {Save,
    Build_Div, Build_Button, Build_H1, Build_Label, Build_Canvas, Build_Audio
} from "/Task_panel/Task_functions/Function_Tools.js";
import {Score} from "/Task_panel/Task_functions/Page_All.js"

export function Active_Tasks()
{
    let Timer_Id = 0; 
    let Update_Interval;
    let Button_Ids = [];
    let Button_Id_Count = -1;
    let Data = Filter();
    
    let Active_Tasks_Div = Build_Div(document.body, "Active_Tasks_Div");
    let Lock_Html = Lock(Active_Tasks_Div);
    Score(Active_Tasks_Div, "Bottom");
    
    Build_H1(Active_Tasks_Div, "Active Tasks Selection List", "Active_Tasks_Selection");
    let Grid_Div = Build_Div(Active_Tasks_Div, "Grid");
   
    Data.Tasks.forEach((Task, Index) =>
    {
        let Timer_Div = Build_Div(Grid_Div, `Divs_${Index}`, "Grid_Items");
        let Active_Task_Label = Build_Label(Timer_Div, "None", `Active_Task_${Index}`, "Active_Tasks");
        let Timer_Label = Build_Label(Timer_Div, "00:00:00", "Timer", "Timer_Labels");
        
        let Canvas = Build_Canvas(Timer_Div, `Timer_${Index}`, "Timer_Circles", 250, 250);
        let Canvas_Context = Canvas.getContext("2d");

        Canvas_Context.beginPath();
        Canvas_Context.arc(Canvas.width/2, Canvas.height/2, (Canvas.height + Canvas.width)/4 - 5, -Math.PI/2, Math.PI*3/2 - 0*Math.PI*2/2, false);
        Canvas_Context.lineWidth = 10;
        Canvas_Context.strokeStyle = "rgb(0, 4, 243)";
        Canvas_Context.stroke();

        let Button = Build_Button(Timer_Div, "Start", `Button_${Index}`, "", "Start_Buttons");
        
        Timer_Id = Index;
        let milliseconds = Data.Timers[Timer_Id] + 100;
        Active_Task_Label.New_Text(Data.Tasks[Timer_Id]);
        let Arguements = {Canvas, Canvas_Context, Timer_Div, Active_Task_Label, Timer_Label};
        Update(milliseconds, Timer_Id, Update_Interval, Data, Arguements);
        Button.addEventListener("click", () =>
        {
            if(Lock_Html.textContent === "🔏- Locked") return;     
            
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
                    milliseconds = Update(milliseconds, Timer_Id, Update_Interval, Data, Arguements);
                }, 1000);
        
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
            Timer_Div.Remove_Child(Audio);
        })
    })
}

function Update(milliseconds, Timer_Id, Update_Interval, Data, {Canvas, Canvas_Context, Timer_Div, Active_Task_Label, Timer_Label})
{
    if(milliseconds <= 0)
    {
        clearInterval(Update_Interval);
        Active_Task_Label.New_Background_Color("red");

        let audio = document.getElementById(`Audio_${Timer_Id}`);
        if(audio|| !Data.Active_Task[Timer_Id]) return;
            
        Speech_Function(Timer_Id);
        let Audio = Build_Audio(Timer_Div, `Audio_${Timer_Id}`, "Audios", "/Task_panel/audios/Alarm.mp3", true);
        Audio.play();

        let Task_Index;
        for(let i = 0; i < Data.Task_Completed.length; i++)
        {
            if(Data.Task_Completed[i].Task === Active_Task_Label.textContent) Task_Index = i;
        }
        Active_Task_Label.New_Text("Finished");

        Save((Data) =>
        {
            Data.Task_Completed[Task_Index].Minutes += Data.Original_Timers[Timer_Id]/(60*100);
            Data.Timers[Timer_Id] = milliseconds;
            Data.Original_Timers[Timer_Id] = milliseconds;
            Data.Tasks[Timer_Id] = "Finished";
            Data.Active_Task[Timer_Id] = false;
            Data.Meditation.Timer += 10*60*100;
            Data.Meditation.Original_Timer += 6*60*100;
            
            Data.Score += 2;
            let Score = document.getElementById("Score");
            let Points = Data.Score.toString().padStart(2, "0");
            Score.New_Text(`${Points} points`);

            let Week_Day = new Date().getDay();
            Data.Week_Score[Week_Day] += 2;
            return Data;
        })
        return;   
    }
        
    milliseconds -= 100;
    let seconds = Math.floor(milliseconds/100);
    let minutes = Math.floor(seconds/60);

    seconds = (seconds % 60).toString().padStart(2, 0);
    minutes = minutes.toString().padStart(2, 0);
    Save((Data) =>
    {
        Data.Timers[Timer_Id] = milliseconds;
        return Data;
    });

    let Fraction = milliseconds/Data.Original_Timers[Timer_Id];
    Timer_Label.New_Text(`${minutes}:${seconds}`);

    Canvas_Context.clearRect(0, 0, Canvas.width, Canvas.height);
    Canvas_Context.beginPath();
    Canvas_Context.arc(Canvas.width/2, Canvas.height/2, (Canvas.height + Canvas.width)/4 - 5, -Math.PI/2, Math.PI*(Fraction*2) - Math.PI/2, false);
    Canvas_Context.stroke();

    return milliseconds;
}

function Filter()
{
    let Data = JSON.parse(localStorage.getItem("Data"));

    if(Data.Tasks.length === 0 || Data.Timers.length === 0 || Data.Active_Task.length === 0) return;
    
    Data.Tasks = Data.Tasks.filter(Task => Task !== "Finished" && Task !== null);
    Data.Timers = Data.Timers.filter(Timer => Timer !== 0 && Timer !== null);
    Data.Original_Timers = Data.Original_Timers.filter(Timer => Timer!== 0 && Timer !== null)
    Data.Active_Task = Data.Active_Task.filter(Task => Task !== false && Task!== null);

    localStorage.setItem("Data", JSON.stringify(Data)); 
    return Data;
}

function Lock(Parent)
{
    let Lock = Build_Button(Parent, "🔏- Locked", "Lock");
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

function Speech_Function(Timer_Id)
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
        
        Speech.onend = () => Listening_State? Speech.start(): Speech.stop();

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
            if(Audio)
            {
                Audio.pause();
                Divs[Timer_Id].Remove_Child(Audio);
            }

            Speech.stop();
            Listening_State = false;
        };
    }
}

function Search_Timer_Id(Grid, Button, Timer_Id)
{
    for(let i = 0; i < Grid.children.length; i++)
    {
        if(Button.id === `Button_${i}`) Timer_Id = i;
    }
    return Timer_Id;
}

function Managing_The_Previous_Button_Timer(Button_Ids, Button_Id_Count, Update_Interval)
{
    if(Update_Interval === null) return;
    clearInterval(Update_Interval);

    let Previous_Button = document.getElementById(`Button_${Button_Ids[Button_Id_Count-1]}`);
    if(Previous_Button === null) return;
    Previous_Button.New_Text("Start");
    Previous_Button.New_Background_Color("cyan");

    let Audio = document.getElementById(`Audio_${Button_Ids[Button_Id_Count-1]}`);
    if(Audio === null) return;
    let Parent = document.getElementById(`Divs_${Button_Ids[Button_Id_Count-1]}`);
    Audio.pause();
    Audio, Parent.Remove_Child(Audio);
}