import { Save,
    Build_Div, Build_H1, Build_Canvas, Build_Label, Build_Button
} from "/Task_panel/Task_functions/Function_Tools.js";


export function Meditation()
{
    const Meditation_Div = Build_Div(document.body, "Meditation_Div");
    Save((Data) =>
    {
        Data.Meditation.Original_Timer = Data.Meditation.Timer;
        return Data;
    })

    let Data = JSON.parse(localStorage.getItem("Data"));
    let Interval;

    Build_H1(Meditation_Div, "Meditation");
    let Timer_Label = Build_Label(Meditation_Div, "00:00");
    let Hours = (Math.floor(Data.Meditation.Timer/(60*60*100)) % 24).toString().padStart(2, 0);
    let Minutes = (Math.floor(Data.Meditation.Timer/(60*100)) % 60).toString().padStart(2, 0);
    Timer_Label.New_Text(`${Hours}:${Minutes}`);
    
    let Meditation_Canvas = Build_Canvas(Meditation_Div, "", "", 200, 200);
    let Meditation_Context = Meditation_Canvas.getContext("2d");

    let Fraction = Data.Meditation.Timer/Data.Meditation.Original_Timer;
    Meditation_Context.beginPath();
    Meditation_Context.strokeStyle = "blue";
    Meditation_Context.lineWidth = 5;
    Meditation_Context.arc(Meditation_Canvas.width/2, Meditation_Canvas.height/2, (Meditation_Canvas.height + Meditation_Canvas.width)/8 - 5, -Math.PI/2, Math.PI*(Fraction*2) - Math.PI/2, false);
    Meditation_Context.stroke();

    let Start_Button = Build_Button(Meditation_Div, "Start");
    Start_Button.addEventListener("click", () =>
    {
        if(Start_Button.textContent === "Start")
        {
            Data = JSON.parse(localStorage.getItem("Data"));
            Interval = setInterval(() => 
            {
                Data = JSON.parse(localStorage.getItem("Data"));
                let Fraction = Data.Meditation.Timer/Data.Meditation.Original_Timer;
                if(Data.Meditation.Timer <= 0) 
                {
                    Meditation_Context.clearRect(0, 0, Meditation_Canvas.width, Meditation_Canvas.height);
                    Meditation_Context.beginPath();
                    Meditation_Context.arc(Meditation_Canvas.width/2, Meditation_Canvas.height/2, (Meditation_Canvas.height + Meditation_Canvas.width)/8 - 5, -Math.PI/2, Math.PI*(Fraction*2) - Math.PI/2, false);
                    Meditation_Context.stroke();
                    clearInterval(Interval);
                    return;
                }

                Meditation_Context.clearRect(0, 0, Meditation_Canvas.width, Meditation_Canvas.height);
                Meditation_Context.beginPath();
                Meditation_Context.arc(Meditation_Canvas.width/2, Meditation_Canvas.height/2, (Meditation_Canvas.height + Meditation_Canvas.width)/8 - 5, -Math.PI/2, Math.PI*(Fraction*2) - Math.PI/2, false);
                Meditation_Context.stroke();
                
                let Hours = (Math.floor(Data.Meditation.Timer/(60*60*100)) % 24).toString().padStart(2, 0);
                let Minutes = (Math.floor(Data.Meditation.Timer/(60*100)) % 60).toString().padStart(2, 0);
                Timer_Label.New_Text(`${Hours}:${Minutes}`);

                Save((Data) =>
                {
                    Data.Meditation.Timer -= 100;
                    return Data;
                })
            },1000);

            if(Data.Meditation.Timer > 0)
            {
                Start_Button.New_Text("Stop");
                Start_Button.New_Background_Color("red");
            }
            return;
        }

        Start_Button.New_Text("Start");
        Start_Button.New_Background_Color("cyan");
        clearInterval(Interval);
    })
}