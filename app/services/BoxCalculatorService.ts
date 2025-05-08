export default class BoxCalculatorService {
  public error: Error | null = null;
  protected tareWeight: number;
  protected packagingType: string;
  protected albumType: string;
  protected realQuantity: number;
  protected recordSize: string;
  protected totalQuantity: number;
  public ouncesPerBox: number;
  public numberOfBoxes: number;
  public boxDimensions: { height: number; width: number; length: number };

  constructor(packagingType: string, recordSize: string, albumType: string, totalQuantity: number) {
    if (recordSize !== '12inch') {
      this.error = new Error('Record size not supported or defined');
    }
    if (totalQuantity < 100 || totalQuantity > 1000) {
      this.error = new Error('Total quantity must be between 100 and 1000');
    }
    if (albumType !== 'single' && albumType !== 'double') {
      this.error = new Error('Album type not supported or defined');
    }
    if (
      !['standardJacket', 'wideSpineJacket', 'gatefoldJacket', 'none', 'customerSupplied'].includes(packagingType)
    ) {
      this.error = new Error('Packaging type not supported or defined');
    }

    this.tareWeight = BoxCalculatorService.getTotalOunces(4, 2); // Hard coded tare weight for 12" records
    this.packagingType = packagingType;
    this.albumType = albumType;
    this.realQuantity = totalQuantity * (albumType === 'double' ? 2 : 1);
    this.totalQuantity = totalQuantity;
    this.recordSize = recordSize;
    this.ouncesPerBox = 0;
    this.numberOfBoxes = 0;
    this.boxDimensions = { height: 14, width: 14, length: 14 }; // Hard coded box dimensions for 12" records
    this.calculateBoxes = this.calculateBoxes.bind(this);
    this.calculateBoxes();
  }

  public calculateBoxes() {
    if (this.recordSize === '12inch') {
      if (this.albumType === 'single') {
        if (this.packagingType === 'standardJacket') {
          // 50 LPs per box w/ buffer = 32 lb 10 oz
          this.setWeightPerBox(32, 10);
          this.setNumberOfBoxes(Math.ceil(this.realQuantity / 50));
        } else if (['gatefoldJacket', 'wideSpineJacket', 'customerSupplied'].includes(this.packagingType)) {
          // 35 LPs per box w/ buffer = 29 lbs 2 oz
          this.setWeightPerBox(29, 2);
          this.setNumberOfBoxes(Math.ceil(this.realQuantity / 35));
        } else if (this.packagingType === 'none') {
          // 113 LPs per box w/ buffer = 48 lb 6 oz
          this.setWeightPerBox(48, 6);
          this.setNumberOfBoxes(Math.ceil(this.realQuantity / 113));
        } else {
          this.error = new Error('Packaging type not defined or supported');
        }
      } else if (this.albumType === 'double') {
        if (['gatefoldJacket', 'wideSpineJacket', 'customerSupplied'].includes(this.packagingType)) {
          // 32 DLPs per box w/ buffer = 37 lbs 6 oz
          this.setWeightPerBox(37, 6);
          this.setNumberOfBoxes(Math.ceil(this.totalQuantity / 32));
        } else if (this.packagingType === 'none') {
          // 113 single LPs per box w/ buffer = 48 lb 6 oz
          this.setWeightPerBox(48, 6);
          this.setNumberOfBoxes(Math.ceil(this.realQuantity / 113));
        } else {
          this.error = new Error('Packaging type not defined or supported');
        }
      } else {
        this.error = new Error('Album type not defined or supported');
      }
    } else {
      this.error = new Error('Record size not defined or supported');
    }

    if (this.error) {
      console.error('Error calculating boxes:', this.error.message);
    } else {
      console.log('Ounces per box:', this.ouncesPerBox);
      console.log('Number of boxes:', this.numberOfBoxes);
    }

    return this;
  }

  protected setWeightPerBox(pounds: number, ounces: number) {
    this.ouncesPerBox = BoxCalculatorService.getTotalOunces(pounds, ounces) + this.tareWeight;
  }

  protected setNumberOfBoxes(quantity: number) {
    this.numberOfBoxes = quantity;
  }

  public static getTotalOunces(pounds: number, ounces: number): number {
    return pounds * 16 + ounces;
  }

  public static getTotalPounds(ounces: number): string {
    return (ounces / 16).toFixed(2);
  }
}