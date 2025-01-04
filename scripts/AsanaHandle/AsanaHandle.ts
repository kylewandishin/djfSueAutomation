// import type CheerioParser from '../CheerioParser/CheerioParser';
// import type { ElementHandle } from 'playwright';
import type BrowserClient from '../BrowserClient/BrowserClient';
import sleep, { randSleep } from '../util/sleep';
import type { Patient } from '../SheetsHandle/SheetHandle';
import { formatPhoneNumber } from '../util/standardize';
import { config } from 'dotenv';

export default class AsanaHandle {
  private browser: BrowserClient;
  #BaseURL = 'https://app.asana.com/';

  public constructor(browser: BrowserClient) {
    config();
    this.browser = browser;
  }

  public async setup(): Promise<void> {
    await this.browser.navigate(this.#BaseURL);

    await this.browser.waitForSelector('input[name="e"]');
    await randSleep(1000, 2000);
    const emailInput =
      await this.browser.getElementBySelector('input[name="e"]');
    await emailInput!.fill(process.env.ASANA_EMAIL!);
    await this.browser.click(
      '#Login-appRoot > div > div.LoginCardLayout-card > div > div > form > div.HighlightSol.HighlightSol--buildingBlock.ButtonThemeablePresentation--isEnabled.ButtonThemeablePresentation.ButtonThemeablePresentation--large.LoginButton.LoginEmailForm-continueButton.Stack.Stack--align-center.Stack--direction-row.Stack--display-inline.Stack--justify-center',
    );

    await this.browser.waitForSelector('input[name="p"]');
    await randSleep(1000, 2000);
    const passwordInput =
      await this.browser.getElementBySelector('input[name="p"]');
    await passwordInput!.fill(process.env.ASANA_PASSWORD!);
    await this.browser.click(
      '#Login-appRoot > div > div.LoginCardLayout-card > div.LoginCardLayout-card--content > form > div.HighlightSol.HighlightSol--buildingBlock.ButtonThemeablePresentation--isEnabled.ButtonThemeablePresentation.ButtonThemeablePresentation--large.LoginButton.LoginPasswordForm-loginButton.Stack.Stack--align-center.Stack--direction-row.Stack--display-inline.Stack--justify-center',
    );
  }

  public async createTask(patient: Patient): Promise<void> {
    await this.browser.navigate(
      `${this.#BaseURL}${process.env.ASANA_TEMPLATE!}`,
    );

    console.log(patient);
    //return;

    const optionsSelector =
      '#TaskPrintView > div.TaskPaneToolbar.TaskPane-header.Stack.Stack--align-center.Stack--direction-row.Stack--display-block.Stack--justify-space-between > div.HighlightSol.HighlightSol--buildingBlock.IconButtonThemeablePresentation--isEnabled.IconButtonThemeablePresentation.IconButtonThemeablePresentation--medium.HighlightSol.HighlightSol--core.SubtleIconButton--standardTheme.SubtleIconButton.TaskPaneExtraActionsButton.TaskPaneToolbar-button.Stack.Stack--align-center.Stack--direction-row.Stack--display-inline.Stack--justify-center > svg';
    await this.browser.waitForSelector(optionsSelector);
    console.log('Found optionsSelector');
    await this.browser.click(optionsSelector);

    console.log('Found duplicateSelector');
    await randSleep(500, 1000);
    const element = await this.browser.getByText('Duplicate task', 1);
    await element.click();

    await randSleep(500, 1000);
    const assigneeB = await this.browser.getByText('Assignee', 1);
    await assigneeB.click();
    console.log('updated assignee');

    await randSleep(500, 1000);
    const collabB = await this.browser.getByText('Collaborators', 1);
    await collabB.click();
    console.log('updated collaborators');

    //await randSleep(500, 1000);
    // const duedateB = await this.browser.getByText('Due date', 1);
    // await duedateB.click();

    const fullName = `${patient.firstName} ${patient.lastName}`;
    console.log('got full name');
    const taskNameSelector =
      'body > div:nth-child(14) > div > div > div.ModalBuffer--responsive.ModalBuffer.Stack.Stack--align-stretch.Stack--direction-column.Stack--display-block.Stack--justify-space-between > div.ModalBuffer-content.Stack.Stack--align-stretch.Stack--direction-row.Stack--display-block.Stack--justify-center > div > div > div > div.DuplicateObjectDialogStructure > div.Scrollable--withCompositingLayer.Scrollable.Scrollable--vertical.DuplicateObjectDialogStructure-formContents > div.FormRowStructure--labelPlacementTop.FormRowStructure.DuplicateObjectDialogStructure-name > div.FormRowStructure-contents > input';
    console.log('task name selector');
    await this.browser.waitForSelector(taskNameSelector);
    console.log('selected task name field');
    await this.browser.fill(taskNameSelector, fullName);
    console.log('filled in fullname');

    // submit button for duplicate task

    const submitSelector =
      'body > div:nth-child(14) > div > div > div.ModalBuffer--responsive.ModalBuffer.Stack.Stack--align-stretch.Stack--direction-column.Stack--display-block.Stack--justify-space-between > div.ModalBuffer-content.Stack.Stack--align-stretch.Stack--direction-row.Stack--display-block.Stack--justify-center > div > div > div > div.DuplicateObjectDialogStructure > div.DuplicateObjectDialogStructure-footer > div > div';
    await this.browser.waitForSelector(submitSelector);
    await this.browser.click(submitSelector);
    console.log('clicked submit selector');

    await this.browser.waitForSelector(
      '#TaskPrintView > div.TaskPaneToolbar.TaskPane-header.Stack.Stack--align-center.Stack--direction-row.Stack--display-block.Stack--justify-space-between > div:nth-child(11)',
    );
    console.log('found exit button');
    await this.browser.click(
      '#TaskPrintView > div.TaskPaneToolbar.TaskPane-header.Stack.Stack--align-center.Stack--direction-row.Stack--display-block.Stack--justify-space-between > div:nth-child(11)',
    );
    console.log('clicked exit button');

    await randSleep(300, 500);

    await this.browser.click(
      '#asana_main_page > div.FullWidthPageStructureWithDetailsOverlay > div.FullWidthPageStructureWithDetailsOverlay-fullWidth > div.FullWidthPageStructureWithDetailsOverlay-mainContent > div.ProjectPage > div.ProjectPage-list > div > div.PageToolbarStructure--withoutBottomBorder.PageToolbarStructure.PageToolbarStructure--large.ProjectSpreadsheetGridPageToolbar > div.PageToolbarStructure-rightChildren.ProjectSpreadsheetGridPageToolbar > div:nth-child(2) > div',
    );
    await randSleep(300, 500);
    await (await this.browser.getByText('Last modified on')).click();

    await sleep(8000);
    await this.browser.click(
      '#asana_main_page > div.FullWidthPageStructureWithDetailsOverlay > div.FullWidthPageStructureWithDetailsOverlay-fullWidth > div.FullWidthPageStructureWithDetailsOverlay-mainContent > div.ProjectPage > div.ProjectPage-list > div > div.SpreadsheetGridScroller-container > div.Scrollable--withCompositingLayer.Scrollable.Scrollable--vertical.SpreadsheetGridScroller-verticalScroller > div > div.SpreadsheetGridContents--canScrollHorizontally.SpreadsheetGridContents.SpreadsheetPotGridContents--hasComplete.SpreadsheetPotGridContents > div:nth-child(1) > div > div > div > div > div > div > div:nth-child(2) > div > div > div > div > div.SpreadsheetRow-stickyCell > div > div.SpreadsheetGridTaskNameAndDetailsCellGroup-detailsButtonClickArea',
    );
    await this.populateTask(patient);
  }

  private async populateField(selector: string, value: string): Promise<void> {
    await this.browser.waitForSelector(selector);
    await this.browser.fill(selector, value);
    await sleep(400);
  }

  private async populateEnumField(
    selector: string,
    value: string,
  ): Promise<void> {
    const pronounsSelector = selector;
    await this.browser.waitForSelector(pronounsSelector);
    await this.browser.click(pronounsSelector);

    await sleep(400);
    const pronouns = await this.browser.getByText(value);
    await pronouns.click();
    await sleep(400);
  }

  private async populateTask(patient: Patient): Promise<void> {
    const focus =
      '#TaskPrintView > div.UploadDropTargetAttachmentWrappingTextEditor.TaskPaneBody-attachmentDropTarget > div.DynamicBorderScrollable.DynamicBorderScrollable--canScrollDown.TaskPaneBody--scrollable > div > div > div.TaskPaneBody-main.Stack.Stack--align-stretch.Stack--direction-column.Stack--display-block.Stack--justify-start > div.TaskPane-premiumFeaturesSection > div > div.TaskPaneFields-customFieldTables > div > div.LabeledRowStructure-left > div > label > span';
    await this.browser.waitForSelector(focus);
    await this.browser.click(focus);
    await this.browser.scrollIntoView(focus);

    const expand =
      '#TaskPrintView > div.UploadDropTargetAttachmentWrappingTextEditor.TaskPaneBody-attachmentDropTarget > div.DynamicBorderScrollable.DynamicBorderScrollable--canScrollUp.DynamicBorderScrollable--canScrollDown.TaskPaneBody--scrollable > div > div > div.TaskPaneBody-main.Stack.Stack--align-stretch.Stack--direction-column.Stack--display-block.Stack--justify-start > div.TaskPane-premiumFeaturesSection > div > div.TaskPaneFields-customFieldTables > div > div.LabeledRowStructure-right.Stack.Stack--align-stretch.Stack--direction-row.Stack--display-block.Stack--justify-start > div > div > div > div.TaskPaneFields-showMoreCustomFieldsContainer > span > span';

    await this.browser.waitForSelector(expand);
    await this.browser.scrollIntoView(expand);
    const holdOn = await this.browser.getElementBySelector(expand);
    if ((await holdOn?.innerText())?.toLowerCase().includes('show')) {
      await this.browser.click(expand);
    }

    const bodSelector = '#CustomPropertyRow-field1209065162212480';
    await this.populateField(bodSelector, patient.dateOfBirth);

    const pronounsSelector = '#CustomPropertyEnumOptionsMultiPickerInput';
    await this.populateEnumField(pronounsSelector, patient.pronouns);

    const phone = '#CustomPropertyRow-field935876907465267';
    const phoneValue = formatPhoneNumber(patient.cellPhone);
    await this.populateField(phone, phoneValue);

    const email = '#CustomPropertyRow-field1206289516748371';
    await this.populateField(email, patient.email);

    const address = '#CustomPropertyRow-field1206289516748367';
    const structuredAddress = `${patient.address1}${patient.address2 ? ` ${patient.address2}` : ''}, ${patient.city}, ${patient.state}, ${patient.zip}`;
    await this.populateField(address, structuredAddress);

    const preferedContactMethod = '#CustomPropertyRow-field935876907465261';
    await this.browser.click(preferedContactMethod);
    await sleep(200);
    for (let i = 0; i < 3; i++) {
      await this.browser.pressKey(patient.preferedContactMethod[i]);
      await sleep(200);
    }
    await this.browser.pressKey('Enter');

    // console.log(`|${await contactMethod.innerHTML()}|${patient.preferedContactMethod}|${}`);

    const cgName = '#CustomPropertyRow-field1206289516748375';
    await this.populateField(cgName, patient.careTakerName);

    const cgRelation = '#CustomPropertyRow-field1206289516765353';
    await this.populateField(cgRelation, patient.careTakerRelationship);

    const cgPhone = '#CustomPropertyRow-field1209062685357763';
    const cgPhoneValue = formatPhoneNumber(patient.careTakerPhone);
    await this.populateField(cgPhone, cgPhoneValue);

    const cgContact = '#CustomPropertyRow-field1206289516765366';
    await this.populateField(cgContact, patient.careTakerEmail);

    const diagnosis = '#CustomPropertyRow-field1206289516765370';
    await this.populateField(diagnosis, patient.diagnosis);

    const treatmentHospital = '#CustomPropertyRow-field1206289516765374';
    await this.populateField(treatmentHospital, patient.treatmentHospital);
  }
}
