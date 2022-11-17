// export function register(myVar)
// {
//     let newVar = "";
//     for (var i = 0; i < myVar.length; i++)
//     {
//         let a = myVar.charCodeAt(i);
//         a = ((a*2)+8)/2;
//         newVar = newVar.concat(String.fromCharCode(a));
//     }
//     return newVar;
// }

export function unRegister(myVar)
{
    let newVar = "";
    for (var i = 0; i < myVar.length; i++)
    {
        let a = myVar.charCodeAt(i);
        a = ((a*2)-8)/2;
        newVar = newVar.concat(String.fromCharCode(a));
    }
    return newVar;
}