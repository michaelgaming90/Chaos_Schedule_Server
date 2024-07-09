import {Delay,  Save, Factory_Element, Hostname, Port} from "./Function_Tools.js";

export function Score(Parent, Class, Data)
{
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
    let H2s_Index = 0;
    H2s.forEach(H2 => 
    {
        let Texts = [`Todays Score:`, `${Score} points`]
        let Ids = ["", "Score"];

        H2.New_Text(Texts[H2s_Index]);
        H2.New_Id(Ids[H2s_Index]);
        Score_Div.New_Child(H2);
        H2s_Index++;
    })
}

export function Server_Save(Data)
{
    let Div = Factory_Element("div");
    document.body.appendChild(Div);

    let Button = Factory_Element("button");
    Button.New_Text("Save");
    Div.New_Child(Button);

    Button.addEventListener("click", async () =>
    {
        Data = JSON.parse(localStorage.getItem("Data"));
        let Label = Factory_Element("label");
        Label.New_Text("Saving...");
        Div.New_Child(Label);

        let request = new Request(`https://chaos-schedule-application.onrender.com/Save`, 
        {
            method: "PUT",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(Data)
        })
        let response = await fetch(request);
        let Text = await response.text();
        Label.New_Text(Text);

        await Delay(10000);
        Div.Remove_Child(Label);
    })
}
