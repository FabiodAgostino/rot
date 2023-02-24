import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-bacheca',
  templateUrl: './bacheca.component.html',
  styleUrls: ['./bacheca.component.css']
})
export class BachecaComponent implements OnInit {

  shortLink: string = "";
  loading: boolean = false; // Flag variable
  bacheche = new Array<Array<string>>();

  ngOnInit(): void {
  }

  // On file Select
  async onChange(event: any) {
     var file= event.target.files[0];

     let text = await file.text();

     this.elabTextToBachecaMessage(text);
  }

  elabTextToBachecaMessage(text: string)
  {
    text=text.replace(/[\r\n]/g, " ");
    var frase = "";
    var frasi = new Array<string>();
    var parole = text.split(" ");
    var bacheche = new Array<Array<string>>();
    parole = parole.filter(x=> x!="");
    parole.forEach(x=>{
      if((frase.length+x.length)<=32)
      {
        frase+=x+" ";
      }
      else
      {
        frase = frase.substring(0,frase.lastIndexOf(" "));
        frasi.push(frase);
        frase = x+" ";
      }

      if(x==parole[parole.length-1])
      {
        frase = frase.substring(0,frase.lastIndexOf(" "));
        frasi.push(frase)
      }

      if(frasi.length==39)
      {
        bacheche.push(frasi);
        frasi = new Array<string>();
      }
    });
    bacheche.push(frasi);
    this.bacheche=bacheche;
    frasi.forEach(x=>{ console.log(x); console.log(x.length)})
  }


}
