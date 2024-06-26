import {Build_Element, Delay} from "../function tools/Function_Tools.js"

Start();
async function Start()
{
    try
    {
        let response = await fetch("https://192.168.1.4:5000/data");
        let Json_File = await response.json();
        console.log(Json_File);
    }
    catch(error)
    {
        Build_Element("p", document.body, error, null, null);
    }
}
