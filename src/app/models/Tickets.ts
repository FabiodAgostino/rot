export class Ticket
{
    tipologia: string ="";
    tool: string = "";
    messaggio: string = "";
    user: string ="";
    constructor(_tipologia: string, _tool: string, _messaggio: string)
    {
        this.tipologia=_tipologia;
        this.tool=_tool;
        this.messaggio=_messaggio;
    }
}
