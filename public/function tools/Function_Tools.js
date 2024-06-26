export function Build_Element(type, Parent, textContent, Id, Class)
{
    let Element = document.createElement(type);
    Element.textContent = textContent;
    Element.id = Id;
    Element.classList = Class;
    Parent.appendChild(Element);

    Element.Text = (textContent) =>
    {
        Element.textContent = textContent;
    }
    
    return Element;
}

export function Delay(ms)
{
    return new Promise((resolve, reject)=>
    {
        setTimeout(() =>
        {
            resolve();
        }, ms)
    })
}