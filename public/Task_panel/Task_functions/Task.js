import {Delay, Server,
    Build_Div, Build_Label, Build_Button, Build_Image
} from "/Task_panel/Task_functions/Function_Tools.js";

import {Register_ServiceWorker, Log_In_User} from "/Task_panel/Task_functions/Account_Manager.js";
import {Server_Save_Auto} from "/Task_panel/Task_functions/Page_All.js";
import {New_Task} from "/Task_panel/Task_functions/Page_1.js";
import {Active_Tasks} from "/Task_panel/Task_functions/Page_2.js";
import {Statistics} from "/Task_panel/Task_functions/Page_3.js";
import {Meditation} from "/Task_panel/Task_functions/Page_4.js"
import {Qr_Code_Generator} from "/Task_panel/Task_functions/Last_Page.js";

let Page_Ids = [];
let Page_Index = 0;

document.body.New_Child = (Child) => document.body.appendChild(Child);
document.body.Remove_Child = (Child) => document.body.removeChild(Child);

Register_ServiceWorker();
Log_In_User(Pages);

function Pages()
{
    document.body.innerHTML = "";
    Server_Save_Auto();

    Menu_Function();

    let Pages_Function = [New_Task, Active_Tasks, Statistics, Meditation, Qr_Code_Generator];
    let Pages = ["New_Task", "Active_Tasks", "Statistics", "Meditation", "QR_Code_Page"];

    let Default_Number = 0;
    Page_Ids.push(Pages[Default_Number]);
    Page_Index++;
    Pages_Function[Default_Number]();
}

function Menu_Function()
{
    let Toggle_Div = Build_Div(document.body, "Menu_Div");
    Build_Image(Toggle_Div, "/Task_panel/icons/New_Task.png", "", "Task_Menu");
    Build_Image(Toggle_Div, "/Task_panel/icons/Task.png", "", "Task_Menu");
    Build_Image(Toggle_Div, "/Task_panel/icons/Statistics.png", "", "Task_Menu");
    Build_Image(Toggle_Div, "/Task_panel/icons/Meditation.png", "", "Task_Menu");
    Build_Image(Toggle_Div, "/Task_panel/icons/Qr_Code.png", "", "Task_Menu");
    let Lock = Build_Image(Toggle_Div, "/Task_panel/icons/Lock.png", "Lock");
    
    let Buttons = document.querySelectorAll(".Task_Menu");
    Buttons.forEach(Button =>
    {
        Button.addEventListener("click", () =>
        {
            if(Lock.src === `${Server}/Task_panel/icons/Lock.png`) return;
            
            let Page_Id = "";
            if(Button.src === `${Server}/Task_panel/icons/New_Task.png`) Page_Id = "New_Task";
            else if(Button.src === `${Server}/Task_panel/icons/Task.png`) Page_Id = "Active_Tasks";
            else if(Button.src === `${Server}/Task_panel/icons/Statistics.png`) Page_Id = "Statistics";
            else if(Button.src === `${Server}/Task_panel/icons/Meditation.png`) Page_Id = "Meditation";
            else if(Button.src === `${Server}/Task_panel/icons/Qr_Code.png`) Page_Id = "QR_Code_Page";

            if(Page_Ids[Page_Index-1] === Page_Id) return;

            let Node_List_Divs = document.querySelectorAll("body > div");
            let Divs = Array.from(Node_List_Divs);
            Divs = Divs.filter(Div => Div.id !== "Menu_Div");
            Divs.forEach(Div => document.body.Remove_Child(Div))

            if(Page_Id === "New_Task") New_Task();
            else if(Page_Id === "Active_Tasks") Active_Tasks();
            else if(Page_Id === "Statistics") Statistics();
            else if(Page_Id === "Meditation") Meditation();
            else if(Page_Id === "QR_Code_Page") Qr_Code_Generator(); 
            
            Page_Ids.push(Page_Id);
            Page_Index++; 
        })
    })

    Lock.addEventListener("click", () =>
    {
        if(Lock.src === `${Server}/Task_panel/icons/Lock.png`) return Lock.src = `${Server}/Task_panel/icons/Unlock.png`;
        return Lock.src = `${Server}/Task_panel/icons/Lock.png`
    })
}