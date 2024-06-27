import {Build_Element, Delay} from "../function tools/Function_Tools.js";

document.addEventListener("DOMContentLoaded", async () =>
{
    Build_Element("h1", document.body, "Server", "Server", "kill");
    let Table = Build_Element("table", document.body, "", "Leader_Board", null);
    let Data;
    try
    {
        let Response = await fetch("https://localhost:5000/data");
        Data = await Response.json();
    }
    catch(error)
    {
        Build_Element("p", document.body, error, null, null);
    }
    
    let Head = Build_Element("thead", Table, "", null, "Head");
    Table_Head(Data, Head);
    let Body = Build_Element("tbody", Table, "", null, null);
    Table_Body(Data, Body);
})

function Table_Head(Data, Head)
{
    let tr = Build_Element("tr", Head, "", null, null);
    let Object_Array_Keys = Object.keys(Data[0]);
    for(let i = 0; i < Object_Array_Keys.length; i++)
    {
        Build_Element("th", tr, Object_Array_Keys[i], null, null);
    }
}

function Table_Body(Data, Body)
{
    for(let i = 0; i < Data.length; i++)
    {
        let tr = Build_Element("tr", Body, "", null, null);
        let Object_Array = Object.values(Data[i]);
        console.log(Object_Array);
        for(let j = 0; j < Object_Array.length; j++)
        {
            Build_Element("th", tr, Object_Array[j], null, null);
        }
    }
}

