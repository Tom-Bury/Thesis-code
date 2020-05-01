import { Injectable } from '@angular/core';
import { ApexAxisChartSeries } from 'ng-apexcharts';
import * as moment from 'moment';

@Injectable({
  providedIn: 'root'
})
export class HeatmapDataService {

  private currData: ApexAxisChartSeries;
  private currNbDatapoints = 0;
  private currCircuits: string[] = [];
  private currCircuitsData: number[][] = [];

  constructor() { }

  public setData(newData: ApexAxisChartSeries): void {
    this.currData = newData;
    this.currNbDatapoints = newData.length > 0 ? newData[0].data.length : 0;
    this.currCircuits = newData.map(d => d.name);
    this.currCircuitsData = [];
    this.currCircuits.forEach((c, i) => {
      const circuitData = (newData[i].data as {x: string, y: number}[]).map(point => point.y);
      this.currCircuitsData.push(circuitData);
    });
  }

  public getData(index: number, nbOfDatapoints: number): string {
    if (this.currNbDatapoints > 0) {
      const indexInThisData = Math.floor(this.numberMap(index, 0, nbOfDatapoints - 1, 0, this.currNbDatapoints - 1));
      const indexData = this.currCircuitsData.map(row => row[indexInThisData]);
      const maxCircuitIndex = this.indexOfMax(indexData);
      return this.currCircuits[maxCircuitIndex] + ': ' +  '<b style="font-weight: 700;">' + indexData[maxCircuitIndex] + ' kWh</b>';
    } else {
      return '';
    }
  }

  private numberMap(n: number, inMin: number, inMax: number, outMin: number, outMax: number): number {
    return (n - inMin) * (outMax - outMin) / (inMax - inMin) + outMin;
  }

  private indexOfMax(arr) {
    if (arr.length === 0) {
        return -1;
    }

    let max = arr[0];
    let maxIndex = 0;

    for (let i = 1; i < arr.length; i++) {
        if (arr[i] > max) {
            maxIndex = i;
            max = arr[i];
        }
    }

    return maxIndex;
}
}
