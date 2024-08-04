import {Delay,
    Build_Div, Build_Hr, Build_Input, Build_Button, Build_Image, Build_H1, Build_Label, Build_Canvas, Build_Audio
} from "/Task_panel/Task_functions/Function_Tools.js";

export function Qr_Code_Generator()
{
    let QR_Div = Build_Div(document.body, "QR_Div");
    Build_Label(QR_Div, "QR Code Generator");
    Build_Hr(QR_Div);
    let Input = Build_Input(QR_Div, "", "", "Website URL");
    let Button = Build_Button(QR_Div, "Generate QR_Code");
    let QR_Code = Build_Image(QR_Div);

    Button.addEventListener("click", async () =>
    {
        if(Input.value.length > 0)
        {
            QR_Code.style.opacity = "0";
            QR_Code.src = `https://api.qrserver.com/v1/create-qr-code/?size=170x170&data=${Input.value}`;
            QR_Div.style.maxHeight = "300px";
            QR_Code.style.opacity = "100";
            return;
        }

        QR_Code.style.opacity = "0";
        await Delay(1000);
        QR_Div.style.maxHeight = "140px";
        Button.textContent = "Generate QR_Code";
    })

    Input.addEventListener("change", () => { if(Input.value.length === 0) Button.textContent = "Delete QR Code";})
}