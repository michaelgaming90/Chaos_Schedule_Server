import {Delay,  Save, Factory_Element, Server} from "/Task_panel/Task_functions/Function_Tools.js";

export function Score(Parent, Class, Data)
{
    Data = JSON.parse(localStorage.getItem("Data"));
    let Score = Data.Score.toString().padStart(2, "0");

    let Score_Div = Factory_Element("div");
    Score_Div.New_Id("Score_Div");
    Score_Div.New_Class(Class);
    Parent.appendChild(Score_Div);

    let H2s = 
    [
        Factory_Element("h2"), 
        Factory_Element("h2")
    ];
    H2s.forEach((H2, Index) => 
    {
        let Texts = [`Todays Score:`, `${Score} points`]
        let Ids = ["", "Score"];

        H2.New_Text(Texts[Index]);
        H2.New_Id(Ids[Index]);
        Score_Div.New_Child(H2);
    })
}

export function Server_Save_Auto()
{
    setInterval(async () =>
    {
        let Div = Factory_Element("div");
        document.body.appendChild(Div);

        let Data = JSON.parse(localStorage.getItem("Data"));
        let Label = Factory_Element("label");
        Label.New_Text("Saving...");
        Div.New_Child(Label);

        let request = new Request(`${Server}/Save`, 
        {
            method: "PUT",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(Data)
        })
        let response = await fetch(request);
        let Text = await response.text();
        if(Text === "Successfully Saved" || Text === "You're offline") Label.New_Text(Text);

        await Delay(10000);
        try
        {
            Div.Remove_Child(Label);
            document.body.removeChild(Div);
        }
        catch(error){}
    }, 30000) 
}