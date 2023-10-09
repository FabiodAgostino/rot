import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, forkJoin, map, mergeMap, of, switchMap } from 'rxjs';
import { Monster, MonsterNode } from '../models/Monster';

@Injectable({
  providedIn: 'root'
})
export class MonsterDexService {

  private readonly apiKey = 'AIzaSyAJfDikAuPeNUj83TDO0Rt8xdAsQDHO68A'; 
  constructor(private http: HttpClient) { }
  public getFolderContent(folderId: string): Observable<MonsterNode[]> {
    const apiUrl = `https://www.googleapis.com/drive/v3/files?q='${folderId}' in parents&key=${this.apiKey}`;
  
    return this.http.get(apiUrl).pipe(
      switchMap((response: any) => {
        const files = response.files;
  
        const folderObservables = files
          .filter((file: { mimeType: string; }) => file.mimeType === 'application/vnd.google-apps.folder')
          .map((file: { id: string; mimeType: string; name: string; }) => this.getFolderContent(file.id).pipe(
            map(subFolders => new MonsterNode(file.id, file.mimeType, file.name, subFolders,`https://drive.google.com/uc?id=${file.id}`))
          ));
  
        const monsters = files
          .filter((file: { mimeType: string; }) => file.mimeType !== 'application/vnd.google-apps.folder')
          .map((file: { id: string; mimeType: string; name: string; }) => of(new Monster(file.id, file.mimeType, file.name)));
  
        return forkJoin([...folderObservables, ...monsters]);
      })
    );
  }


  uploadFile(fileBlob: Blob, folderId: string): Observable<any> {
    // Crea un oggetto FormData con il file da caricare
    const formData = new FormData();
    formData.append('file', fileBlob);

    // Effettua una richiesta HTTP POST per caricare il file
    return this.http.post<any>(
      `https://www.googleapis.com/upload/drive/v3/files?uploadType=media&key=${this.apiKey}&supportsAllDrives=true&parents=${folderId}`,
      formData
    );
  }
}