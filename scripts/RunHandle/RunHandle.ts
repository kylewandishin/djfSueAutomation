/*
 * Author: Kyle Wandishin
 * Date: 2024-AUG
 * Description: This file contains logic for communication between other Modules.
 */

import BrowserClient from '../BrowserClient/BrowserClient';
import SheetHandle from '../SheetsHandle/SheetHandle';
import AsanaHandle from '../AsanaHandle/AsanaHandle';
import sleep from '../util/sleep';
import { config } from 'dotenv';
// import sleep from '../util/sleep';

export default class RunHandle {
  public static async run(): Promise<void> {
    /* BEGIN_CODE */
    config();
    const browser = await BrowserClient.init();
    const asanaHandle = new AsanaHandle(browser);
    const sheetHandle = new SheetHandle();
    await asanaHandle.setup();
    await sleep(2000);

    const patients = await sheetHandle.readSheet();
    for (const patient of patients) {
      await asanaHandle.createTask(patient);
    }
    await browser.close();
    /* END_CODE */
  }
}
