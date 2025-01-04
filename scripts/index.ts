/*
  #################################
  ###  DO NOT MODIFY THIS FILE  ###
  #################################
  *
  * Author: Kyle Wandishin
  * Date: 2024-AUG
  * Description: This file is a container for the main entry point of the application.
*/

import RunHandle from './RunHandle/RunHandle';
void (async () => {
  try {
    await RunHandle.run();
  } catch (e) {
    const error = e as Error;
    const message = error.message || 'An error occurred';
    if (message.includes('npx playwright install')) {
      console.log(`
╔═════════════════════════════════════════════════════════════════════════╗
║ Looks like Playwright Test or Playwright was just installed or updated. ║
║ Please run the following command to download new browsers:              ║
║                                                                         ║
║     bunx playwright install                                             ║
║                                                                         ║
║ <3 Playwright Team                                                      ║
╚═════════════════════════════════════════════════════════════════════════╝
`);
    }
  }
})();

/*
  #################################
  ###  DO NOT MODIFY THIS FILE  ###
  #################################
*/
