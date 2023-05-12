import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/service/user.service';
import { Utils } from 'src/app/utils/utility';

@Component({
  selector: 'app-bacheca',
  templateUrl: './bacheca.component.html',
  styleUrls: ['./bacheca.component.css']
})
export class BachecaComponent implements OnInit {

  bacheche = new Array<Array<string>>();
  isSmartphone: boolean = false;

  constructor(public utils: Utils, private service: UserService)
  {

  }

  ngOnInit(): void {
    this.isSmartphone=this.utils.isSmartphone();
  }



  // On file Select
  async onChange(event: any) {
     var file= event.target.files[0];

     let text = await file.text();

     this.elabTextToBachecaMessage(text);
  }

  elabTextToBachecaMessage(text: string)
  {
    var frase = "";
    var frasi = new Array<string>();
    var bacheche = new Array<Array<string>>();
    let parole = this.cleanArray(text);

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

      //ultima parola
      if(x==parole[parole.length-1])
      {
        frase = frase.substring(0,frase.lastIndexOf(" "));
        frasi.push(frase)
      }

      //new bacheca
      if(frasi.length==39)
      {
        bacheche.push(frasi);
        frasi = new Array<string>();
      }
    });
    bacheche.push(frasi);
    this.bacheche=bacheche;
  }


  // elabTextToBachecaMessage(text: string)
  // {
  //   //text=text.replace(/[\r\n]/g, " ");
  //   var frase = "";
  //   var frasi = new Array<string>();
  //   var parole = text.split(" ");
  //   parole = this.checkWords(parole);
  //   var bacheche = new Array<Array<string>>();
  //   parole = parole.filter(x=> x!="");
  //   for(let i=0;i<parole.length;i++)
  //   {


  //     if(parole[i].includes("undefined"))
  //     {
  //       var ind = parole[i].lastIndexOf("undefined");
  //       parole[i]=parole[i].substring(0,ind);
  //     }
  //     if(parole[i].includes("\r\n"))
  //     {
  //       var index=parole[i].lastIndexOf("\r\n");
  //       var subParola=parole[i].substring(0,index+1);
  //       frase+=subParola;
  //       frasi.push(frase);
  //       frase = "";
  //       var rimanenza = parole[i].substring(subParola.length,parole[i].length).replace(/[\r\n]/g, "");
  //       if(rimanenza!="")
  //         parole[i+1]=rimanenza+" "+parole[i+1];
  //     }
  //     else if((frase.length+parole[i].length)<=32)
  //     {
  //       frase+=parole[i]+" ";
  //     }
  //     else
  //     {
  //       frase = frase.substring(0,frase.lastIndexOf(" "));
  //       frasi.push(frase);
  //       frase = parole[i]+" ";
  //     }

  //     //ultima parola
  //     if(i==parole.length-1)
  //     {
  //       frase = frase.substring(0,frase.lastIndexOf(" "));
  //       frasi.push(frase)
  //     }

  //     //new bacheca
  //     if(frasi.length==39)
  //     {
  //       bacheche.push(frasi);
  //       frasi = new Array<string>();
  //     }
  //   };
  //   bacheche.push(frasi);
  //   this.bacheche=bacheche;
  // }

  checkWords(words: Array<string>)
  {
    for(let i=0;i<words.length;i++)
    {
      if(words[i].includes("\n\r"))
      {
        var newWords=words[i].split("\r\n");
        newWords = newWords.filter(x=> x!="");
        words.splice(i,newWords.length, ...newWords)
      }
    }
    return words;
  }

  cleanArray(text:string)
  {
    text=text.replace(/[\r\n]/g, " ");
    var parole = text.split(" ");
    parole = parole.filter(x=> x!="");
    let paroleCopy = new Array<string>().concat(parole);

    let i=0;
    while(parole.filter(x=> x.length>32).length>0)
    {
      if(paroleCopy[i]?.length>=32)
      {
        let newParole = new Array<string>();
        let z=0;
        for(let u=0; u<paroleCopy[i].length/32;u++)
        {
          newParole.push(paroleCopy[i].substring(z,z+31))
          z+=31;
        }
        paroleCopy=this.mergeArray(paroleCopy,newParole,i);
      }
      parole=paroleCopy;
      i++;
    }
    return parole;
  }


   mergeArray(a:Array<string>, b:Array<string>, i=0) {
    a=a.filter(x=> x!==a[i])
    return a.slice(0, i).concat(b, a.slice(i));
  }







}
