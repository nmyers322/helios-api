import axios from 'axios';

export default class ShipStationService {
  private apiKey: string;
  private apiSecret: string;
  private apiUrl: string;

  constructor() {
    this.apiKey = process.env.SHIPSTATION_API_KEY || '';
    this.apiSecret = process.env.SHIPSTATION_API_SECRET || '';
    this.apiUrl = 'https://ssapi.shipstation.com';
  }

  async getRatesFromShipStationAPI(
    fromPostalCode: string,
    toState: string,
    toCountry: string,
    toPostalCode: string,
    toCity: string,
    weight: { value: number; unit: string },
    dimensions: { height: number; length: number; width: number; units: string },
    confirmation: string,
    residential: boolean
  ) {
    const endpoint = '/shipments/getrates';
    const url = `${this.apiUrl}${endpoint}`;

    const data = {
      carrierCode: 'ups_walleted',
      serviceCode: null,
      packageCode: null,
      fromPostalCode,
      toState,
      toCountry,
      toPostalCode,
      toCity,
      weight,
      dimensions,
      confirmation,
      residential,
    };

    try {
      const response = await axios.post(url, data, {
        headers: {
          Authorization: `Basic ${Buffer.from(`${this.apiKey}:${this.apiSecret}`).toString('base64')}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.status !== 200) {
        console.error(`Error getting ShipStation rates: HTTP ${response.status} - ${response.data}`);
        return null;
      }

      console.log('ShipStation rates response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching rates from ShipStation API:', error.message);
      return null;
    }
  }
}