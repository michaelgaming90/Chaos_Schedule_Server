import {Delay, Server,
    Build_Div, Build_H2, Build_Label
} from "/Task_panel/Task_functions/Function_Tools.js";

export function Score(Parent, Class)
{
    let Data = JSON.parse(localStorage.getItem("Data"));
    let Score = Data.Score.toString().padStart(2, "0");

    const Score_Div = Build_Div(Parent, "Score_Div", Class);
    Build_H2(Score_Div, `Todays Score:`);
    Build_H2(Score_Div, `${Score} points`, "Score");
    Build_H2(Score_Div, `Goal: ${Data.Goal_Score - Data.Score} more points!!!`, "Goal_Score");
}

export function Server_Save_Auto()
{
    setInterval(async () =>
    {
        let Data = JSON.parse(localStorage.getItem("Data"));
        let Server_Save_Auto_Div = Build_Div(document.body);
        
        let Response_Label = Build_Label(Server_Save_Auto_Div, "Saving...");

        let request = new Request(`${Server}/Save`, 
        {
            method: "PUT",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(Data)
        })
        let response = await fetch(request);
        let Text = await response.text();
        if(Text === "Successfully Saved" || Text === "You're offline") Response_Label.New_Text(Text);

        await Delay(10000);
        try
        {
            document.body.removeChild(Server_Save_Auto_Div);
        }
        catch(error){}
    }, 30000) 
}