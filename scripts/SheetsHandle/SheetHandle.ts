import axios from 'axios';

interface SheetRow {
  [key: string]: string | number | boolean | null;
}

export interface Patient {
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  pronouns: string;

  cellPhone: string;
  email: string;
  preferedContactMethod: string;

  address1: string;
  address2: string | null;
  city: string;
  state: string;
  zip: string;

  diagnosis: string;
  treatmentHospital: string;

  careTakerRelationship: string;
  careTakerName: string;
  careTakerPhone: string;
  careTakerEmail: string;
}

export default class SheetHandle {
  private baseUrl: string;
  private sheetId: string = process.env.SHEETS_ID!;
  private sheet: string = process.env.SHEETS_SHEET!;
  private apiKey: string = process.env.SHEETS_API_KEY!;

  public constructor() {
    this.baseUrl = 'https://sheets.googleapis.com/v4/spreadsheets';
  }

  public async readSheet(): Promise<Array<Patient>> {
    try {
      const url = `${this.baseUrl}/${this.sheetId}/values/${this.sheet}?key=${this.apiKey}`;
      console.log(url);
      const response: { data: { values: Array<SheetRow> } } =
        await axios.get(url);

      const rows = response.data.values;
      if (rows.length === 0) {
        console.log('No data found.');
        return [];
      }

      // Assuming the first row contains headers
      const headers: Array<string> = rows[0] as unknown as Array<string>;

      return rows.slice(1).map((row) => {
        const rowObject: SheetRow = {};
        headers.forEach((header: string, index: number) => {
          rowObject[header] = row[index] || null;
        });

        return {
          firstName: rowObject['Name (First)'] as string,
          lastName: rowObject['Name (Last)'] as string,
          dateOfBirth: rowObject['Birthdate'] as string,
          pronouns: rowObject[' preferred pronouns'] as string,

          cellPhone: rowObject['Cell Phone Number'] as string,
          email: rowObject['Email'] as string,
          preferedContactMethod: rowObject[
            'How do you prefer we contact you?'
          ] as string,

          address1: rowObject['Mailing Address (Address)'] as string,
          address2: rowObject['Mailing Address (Address2)'] as string | null,
          city: rowObject['Mailing Address (City)'] as string,
          state: rowObject['Mailing Address (State)'] as string,
          zip: rowObject['Mailing Address (Zip)'] as string,

          diagnosis: rowObject['Diagnosis'] as string,
          treatmentHospital: rowObject['Name of treating hospital'] as string,

          careTakerRelationship: rowObject['Relationship to You'] as string,
          careTakerName: `${rowObject['Alternate Contact (First)']} ${rowObject['Alternate Contact (Last)']}`,
          careTakerPhone: rowObject['Alternate Contact Phone Number'] as string,
          careTakerEmail: rowObject['Alternate Contact Email'] as string,
        };
      });
    } catch (error) {
      console.error('Error reading sheet:', error);
      throw error;
    }
  }
}
