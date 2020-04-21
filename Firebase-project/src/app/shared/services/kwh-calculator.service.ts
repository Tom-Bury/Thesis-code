import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class KwhCalculatorService {

  constructor() { }


  public nextString(kwh: number, index: number): string {
    index = index % 5;
    let sentence = '';
    switch (index) {
      case 0:
        sentence = this.kwhToMircowaveMinutesAtString(kwh, 800);
        break;
      case 1:
        sentence = this.kwhToPhoneChargesString(kwh);
        break;
      case 2:
        sentence = this.kwhToSteamingIronMinutesString(kwh);
        break;
      case 3:
        sentence = this.kwhToMonitorHoursString(kwh);
        break;
      case 4:
        sentence = this.kwhToLitersBoiledWaterString(kwh);
        break;
    }
    return sentence;
  }

  public getCalculation(kwh: number, index: number): number {
    index = index % 5;
    let result = -1;
    switch (index) {
      case 0:
        result = this.kwhToMircowaveMinutesAt(kwh, 800);
        break;
      case 1:
        result = this.kwhToPhoneCharges(kwh);
        break;
      case 2:
        result = this.kwhToSteamingIronMinutes(kwh);
        break;
      case 3:
        result = this.kwhToMonitorHours(kwh);
        break;
      case 4:
        result = this.kwhToLitersBoiledWater(kwh);
        break;
    }
    return result;
  }

  public getCalcName(index: number): string {
    index = index % 5;
    let result = '';
    switch (index) {
      case 0:
        result = 'Microwave minutes';
        break;
      case 1:
        result = 'Phone charges';
        break;
      case 2:
        result = 'Steaming iron minutes';
        break;
      case 3:
        result = 'Computer monitor hours';
        break;
      case 4:
        result = 'Liters boiled water';
        break;
    }
    return result;
  }





  private kwhToMircowaveMinutesAt(kwh: number, atWatts: number): number {
    const kwhPerMinute = atWatts / 60000;
    return kwh / kwhPerMinute;
  }

  private kwhToMircowaveMinutesAtString(kwh: number, atWatts: number): string {
    return this.kwhToMircowaveMinutesAt(kwh, atWatts).toFixed(0) + ' minutes of using a microwave at ' + atWatts + ' Watts.';
  }



  private kwhToPhoneCharges(kwh: number): number {
    // https://www.quora.com/How-much-in-kwh-does-it-take-to-charge-a-typical-cell-phone
    // Assume approx 15Wh for a full charge.
    return 1000 * kwh / 15;
  }

  private kwhToPhoneChargesString(kwh: number): string {
    return 'Charging a smartphone ' + this.kwhToPhoneCharges(kwh).toFixed(0) + ' times.';
  }




  private kwhToSteamingIronMinutes(kwh: number): number {
    // https://www.daftlogic.com/information-appliance-power-consumption.htm
    // https://www.energids.be/nl/vraag-antwoord/wat-is-het-verbruik-van-mijn-huishoudtoestellen/71/
    // Assume approx 1100W steaming iron
    const kwhPerMinute = 1100 / 60000;
    return kwh / kwhPerMinute;
  }

  private kwhToSteamingIronMinutesString(kwh: number): string {
    return this.kwhToSteamingIronMinutes(kwh).toFixed(0) + ' minutes of using a steaming iron.';
  }




  private kwhToMonitorHours(kwh: number): number {
    // Assume 30W monitor
    const kwhPerHour = 30;
    return 1000 * kwh / kwhPerHour;
  }

  private kwhToMonitorHoursString(kwh: number): string {
    return this.kwhToMonitorHours(kwh).toFixed(1) + ' hours of using a 30 Watt computer monitor.';
  }




  private kwhToLitersBoiledWater(kwh: number): number {
    // https://www.quora.com/How-much-energy-is-needed-to-boil-water-How-much-energy-would-it-take-to-boil-1-liter-of-water
    // kWh to boil 1L of water from 20°C to 100°C = 0.093kWh
    return kwh / 0.093;
  }

  private kwhToLitersBoiledWaterString(kwh: number): string {
    return 'Boiling ' + this.kwhToLitersBoiledWater(kwh).toFixed(1) + ' liters of room-temperature water.';
  }



}
