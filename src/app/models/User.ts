import { Timestamp } from "firebase/firestore";

// export class User
// {
//     username: string ="";
//     password: string = "";
//     regno: string = "";
//     nomePg: string= "";
//     usernameNoMd5: string = "";

//     constructor(username?: string, password?: string)
//     {
//         if(username)
//         this.username=username;
//         if(password)
//         this.password=password;
//     }
// }

export class SessioneAttiva
{
    id: number = 0;
    username: string = "";
    attiva: boolean = false;
    data = new Timestamp(0,0);
}
