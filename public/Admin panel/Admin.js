import {Factory_Element, Server} from "../Task_panel/Task_functions/Function_Tools.js";

Start();
async function Start()
{
    let response = await fetch(`${Server}/data`);
    let data = await response.json();
    let Array_Data_Keys = Object.keys(data[0]);

    let Table = Factory_Element("table");
    Table.New_Id("Table");
    document.body.appendChild(Table);

    let thead = Factory_Element("thead");
    Table.New_Child(thead);

    let tr = Factory_Element("tr");
    tr.New_Text(Array_Data_Keys[0]);
    thead.New_Child(tr);

    for(let i = 1; i < Array_Data_Keys.length; i++)
    {
        let th = Factory_Element("th");
        th.New_Text(Array_Data_Keys[i]);
        tr.New_Child(th);
    }

    let tbody = Factory_Element("tbody");
    Table.New_Child(tbody);

    for(let i = 0; i < data.length; i++)
    {
        let Array_Data_Values = Object.values(data[i]);

        let tr_body = Factory_Element("tr");
        tr_body.New_Text(Array_Data_Values[0]);
        tbody.New_Child(tr_body);

        for(let i = 1; i < Array_Data_Keys.length; i++)
        {
            let th = Factory_Element("th");
            th.New_Text(Array_Data_Values[i]);
            tr_body.New_Child(th);
        }
    }
}