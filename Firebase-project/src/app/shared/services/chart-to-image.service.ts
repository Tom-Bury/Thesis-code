import {
  Injectable
} from '@angular/core';
import {
  ChartComponent
} from 'ng-apexcharts';

@Injectable({
  providedIn: 'root'
})
export class ChartToImageService {

  constructor() {}

  public chartToFile(chart: ChartComponent): Promise < File > {
    return chart.dataURI().then((uri) => {
      const obj: any = uri;
      return this.dataUriToFile(obj.imgURI);
    });
  }

  public fileToSrc(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = e => {
        resolve(e.target.result as string);
      };
      reader.readAsDataURL(file);
    });
  }

  private dataUriToFile(dataurl: string): File {
    const arr = dataurl.split(',');
    const mime = arr[0].match(/:(.*?);/)[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    const blob = new Blob([u8arr], {
      type: mime
    });

    return this.blobToFile(blob);
  }

  private blobToFile = (theBlob: Blob, fileName = 'dummy'): File => {
    const b: any = theBlob;
    b.lastModifiedDate = new Date();
    b.name = fileName;
    return theBlob as File;
  }
}
