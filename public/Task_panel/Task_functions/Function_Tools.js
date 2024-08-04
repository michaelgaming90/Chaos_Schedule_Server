export const Server = "https://chaos-schedule-server.onrender.com";

export function Delay(ms)
{
    return new Promise((resolve, reject) => setTimeout(resolve,ms));
}

export function Check(type)
{
    console.log(type);
}

export async function Save(Callback)
{
    let Data = JSON.parse(localStorage.getItem("Data"));
    Data = Callback(Data);
    localStorage.setItem("Data", JSON.stringify(Data));
}

export function Factory_Element(Type)
{
    let Element = document.createElement(Type);
    Element.New_Text = (Text) => Element.textContent = Text;
    Element.New_Id = (Id) => Element.id = Id;
    Element.New_Type = (Type) => Element.type = Type;
    Element.New_Place_Holder = (placeholder) => Element.placeholder = placeholder;
    Element.New_Required = (bool) => Element.required = bool;
    Element.New_Class = (Class) => Element.classList = Class;
    Element.New_For = (For) => Element.setAttribute("for", For);
    Element.New_Name = (Name) => Element.name = Name;
    Element.New_Background_Color = (Color) => Element.style.backgroundColor = Color;
    Element.New_Color = (Color) => Element.style.color = Color;
    Element.New_Loop = (Loop) => Element.loop = Loop;
    Element.New_Source = (Source) => Element.src = Source;
    Element.New_Height = (Height) => Element.height = Height;
    Element.New_Width = (Width) => Element.width = Width;
    Element.New_Child = (element) => Element.appendChild(element);
    Element.Remove_Child = (element) => Element.removeChild(element);
    return Element;
}





export function Build_Div(
    Parent = document.body,
    Id = "", 
    Class = "")
{
    let Div = Factory_Element("div");
    Div.New_Id(Id);
    Div.New_Class(Class);
    Parent.New_Child(Div);
    return Div;
}

export function Build_H1(
    Parent = document.body, 
    Text = "", 
    Id = "")
{
    let H1 = Factory_Element("h1");
    H1.New_Text(Text);
    H1.New_Id(Id);
    Parent.New_Child(H1);
    return H1;
}

export function Build_H2(
    Parent = document.body, 
    Text = "", 
    Id = "",
    Class = "")
{
    let H2 = Factory_Element("h2");
    H2.New_Text(Text);
    H2.New_Id(Id);
    H2.New_Class(Class);
    Parent.New_Child(H2);
    return H2;
}

export function Build_Input(
    Parent = document.body, 
    Id = "", 
    Type = "", 
    Placeholder = "", 
    Required = false, 
    Name = "")
{
    let Input = Factory_Element("input");
    Input.New_Id(Id);
    Input.New_Type(Type);
    Input.New_Place_Holder(Placeholder);
    Input.New_Required(Required);
    Input.New_Name(Name);
    Parent.New_Child(Input);
    return Input;
}

export function Build_Button(
    Parent = document.body, 
    Text = "", 
    Id = "", 
    Type = "", 
    Class = "")
{
    let Button = Factory_Element("button");
    Button.New_Text(Text);
    Button.New_Id(Id);
    Button.New_Type(Type);
    Button.New_Class(Class);
    Parent.New_Child(Button);
    return Button;
}

export function Build_Label(
    Parent = document.body, 
    Text = "", 
    Id = "", 
    Class = "", 
    For = "")
{
    let Label = Factory_Element("label");
    Label.New_Text(Text);
    Label.New_Id(Id);
    Label.New_Class(Class);
    Label.New_For(For);
    Parent.New_Child(Label);
    return Label;
}

export function Build_Hr(
    Parent = document.body)
{
    let Hr = Factory_Element("hr");
    Parent.New_Child(Hr);
    return Hr;
}

export function Build_Form(
    Parent = document.body, 
    Id = "", 
    Class = "")
{
    let Form = Factory_Element("form");
    Form.New_Id(Id);
    Form.New_Class(Class);
    Parent.New_Child(Form);
    return Form;
}

export function Build_Canvas(
    Parent = document.body, 
    Id = "", 
    Class = "", 
    Height = 100, 
    Width = 100)
{
    let Canvas = Factory_Element("canvas");
    Canvas.New_Id(Id);
    Canvas.New_Class(Class);
    Canvas.New_Height(Height);
    Canvas.New_Width(Width);
    Parent.New_Child(Canvas);
    return Canvas;
}

export function Build_Audio(
    Parent = document.body, 
    Id = "", 
    Class = "", 
    Source = "", 
    Loop = false)
{
    let Audio = Factory_Element("audio");
    Audio.New_Id(Id);
    Audio.New_Class(Class);
    Audio.New_Source(Source);
    Audio.New_Loop(Loop);
    Parent.New_Child(Audio);
    return Audio; 
}

export function Build_Image(
    Parent = document.body, 
    Source = "",
    Id = "",
    Class = "")
{
    let Image = Factory_Element("img");
    Image.New_Source(Source);
    Image.New_Id(Id);
    Image.New_Class(Class);
    Parent.New_Child(Image);
    return Image;
}