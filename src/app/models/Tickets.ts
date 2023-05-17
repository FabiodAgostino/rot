export class Ticket
{
    id: string='';
    tipologia: string ="";
    tool: string = "";
    messaggio: string = "";
    user: string ="";
    data: any;
    corretto: boolean=false;
    constructor(_tipologia: string, _tool: string, _messaggio: string)
    {
        this.tipologia=_tipologia;
        this.tool=_tool;
        this.messaggio=_messaggio;
    }
}
