import { 
    Build_Div, Build_H1, Build_H2, Build_Canvas
} from "/Task_panel/Task_functions/Function_Tools.js";

export function Statistics()
{
    let Data = JSON.parse(localStorage.getItem("Data"));
    let Registered_Date = new Date(Data.Day_Registered);

    const Statistics_Div = Build_Div(document.body, "Statistics");
    const Statistics_Labels_Div = Build_Div(Statistics_Div, "Labels")
    Build_H1(Statistics_Labels_Div, "Statistics");
    Build_H2(Statistics_Labels_Div, Data.Username);
    Build_H2(Statistics_Labels_Div, 
        `${Registered_Date.toDateString()} 
        ${(Registered_Date.getHours() - 8).toString().padStart(2, "0")}:
        ${Registered_Date.getMinutes().toString().padStart(2, "0")}:
        ${Registered_Date.getSeconds().toString().padStart(2, "0")}`);
    Build_H2(Statistics_Labels_Div, `Goal: ${Data.Goal_Score - Data.Score} more points!!!`, "Goal_Score");
    Dispay_Pie_Chart(Data);
    Display_Bar_Graph(Data);
}

function Display_Bar_Graph(Data)
{
    const Statistics_Div =  document.getElementById("Statistics");
    Build_H2(Statistics_Div, "Week Score", "", "Graph_H2");

    const canvas = Build_Canvas(Statistics_Div, "canvas", "", 200, 450);
    const Canvas_Context = canvas.getContext("2d");

    let Datas = Data.Week_Score.map(data => data);
    let labels = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    let Chart_Height = 100;
    let Chart_X = 50;
    let Chart_Y = 50;
    let Bar_Width = 45;
    let Bar_Space = 10;

    Canvas_Context.save();
    Canvas_Context.translate(Chart_X-10, Chart_Height/2 + Chart_Y);
    Canvas_Context.rotate(-Math.PI/2);
    Canvas_Context.fillStyle = "white";
    Canvas_Context.font = "20px Arial";
    Canvas_Context.textAlign = "center";
    Canvas_Context.fillText("Score", 0, 0);
    Canvas_Context.restore();

    Canvas_Context.beginPath();
    Canvas_Context.strokeStyle = "white";
    Canvas_Context.moveTo(50, 50);
    Canvas_Context.lineTo(50, 150);
    Canvas_Context.lineTo(425, 150);
    Canvas_Context.stroke();

    Datas.forEach((Data, Index) =>
    {
        const Bar_Hieght = (Data / Math.max(...Datas)) * Chart_Height;
        const x = Chart_X + (Bar_Width + Bar_Space) * Index;
        const y = Chart_Y + Chart_Height - Bar_Hieght;

        Canvas_Context.fillStyle = "cyan";
        Canvas_Context.fillRect(x, y, Bar_Width, Bar_Hieght);
        
        Canvas_Context.fillStyle = "white";
        Canvas_Context.textAlign = "center";
        Canvas_Context.font = "10px Arial";
        Canvas_Context.fillText(labels[Index], x + Bar_Width / 2, Chart_Y + Chart_Height + 20)

        Canvas_Context.fillStyle = "white";
        Canvas_Context.textAlign = "center";
        Canvas_Context.fillText(Data, x + Bar_Width/2, Chart_Y + Chart_Height + 30);
    })
}

function Dispay_Pie_Chart(Data)
{
    const Statistics_Div =  document.getElementById("Statistics");
    Build_H2(Statistics_Div, "Pie Chart", "", "Graph_H2");

    const Pie_Chart_Canvas = Build_Canvas(Statistics_Div, "", "", 200, 450);
    const Pie_Context = Pie_Chart_Canvas.getContext("2d");
    let Angles = [0];
    let Datas = Data.Task_Completed.map(data => data.Minutes);
    Datas.forEach((Data, Index) =>
    {
        let Total_Minutes = Datas.reduce((prev, curr) => prev + curr);
        let Angle = Number(((Data/Total_Minutes)*2*Math.PI).toFixed(2));
        let End_Angle = Angle + Angles[Index];
        Angles.push(End_Angle);
    })

    const Colors = ["red", "orange", "yellow", "green", "blue", "violet"];
    Pie_Context.lineWidth = 25;
    for(let i = 0; i < Angles.length-1; i++)
    {
        Pie_Context.beginPath();
        Pie_Context.strokeStyle = Colors[i];
        Pie_Context.arc(Pie_Chart_Canvas.width/4, Pie_Chart_Canvas.height/2, 50, Angles[i], Angles[i+1], false);
        Pie_Context.stroke();
    }

    for(let i = 0; i < Colors.length; i++)
    {
        let X_Pos = Pie_Chart_Canvas.width/2;
        let X_Offset = -10;
        let Y_Pos = Pie_Chart_Canvas.height/3 + (i*30);
        if(i >= 3) 
        {
            X_Pos = Pie_Chart_Canvas.width*3/4;
            Y_Pos = Pie_Chart_Canvas.height/3 + ((i - 3)*30);
        }

        Pie_Context.beginPath();
        Pie_Context.fillStyle = Colors[i];
        Pie_Context.fillRect(X_Pos + X_Offset, Y_Pos, 10, 10);
        Pie_Context.fillText(`${Data.Task_Completed[i].Task} - ${Data.Task_Completed[i].Minutes}`, X_Pos + X_Offset + 20,  Y_Pos + 8); 
    }

    let Minutes = Data.Task_Completed.map(Task => Task.Minutes)
    let Maximum_Minutes = Math.max(...Minutes);
    let Maximum_Index = Data.Task_Completed.findIndex(Task => Task.Minutes === Maximum_Minutes);
    
    Pie_Context.beginPath();
    Pie_Context.strokeStyle = Colors[Maximum_Index];
    Pie_Context.arc(Pie_Chart_Canvas.width/4, Pie_Chart_Canvas.height/2, 10, 0, Math.PI*2, false);
    Pie_Context.stroke();
}