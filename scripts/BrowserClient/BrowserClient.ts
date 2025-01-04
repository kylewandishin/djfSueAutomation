import type { Browser, Page, ElementHandle, BrowserContext } from 'playwright';
import stealth from 'puppeteer-extra-plugin-stealth';
import { chromium } from 'playwright-extra';

export default class BrowserClient {
  private browser: Browser;
  private page: Page;
  private context: BrowserContext;

  public static async init(): Promise<BrowserClient> {
    chromium.use(stealth());
    const browser = await chromium.launch({
      headless: false,
      args: ['--start-maximized'],
    });
    const context = await browser.newContext({ viewport: null });
    const page = await context.newPage();
    const instance = new BrowserClient(browser, page, context);
    return instance;
  }

  public constructor(browser: Browser, page: Page, context: BrowserContext) {
    this.browser = browser;
    this.page = page;
    this.context = context;
  }

  public async close(): Promise<void> {
    await this.browser.close();
  }

  public async navigate(url: string): Promise<void> {
    await this.page.goto(url);
  }

  public async click(selector: string): Promise<void> {
    await this.page.click(selector);
  }

  public async fill(selector: string, text: string): Promise<void> {
    await this.page.fill(selector, text);
  }

  public async waitForSelector(selector: string): Promise<void> {
    await this.page.waitForSelector(selector);
  }

  public async waitForNewWindow(): Promise<void> {
    await this.context.waitForEvent('page');
  }

  public async scrollIntoView(selector: string): Promise<void> {
    await this.page.evaluate((s: string) => {
      const element = document.querySelector(s);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, selector);
  }

  public async pressKey(key: string): Promise<void> {
    await this.page.keyboard.press(key);
  }

  public async getByText(
    text: string,
    index: number = 0,
  ): Promise<ElementHandle<Element>> {
    const elements = await this.page.$$(`text=${text}`);
    return elements[index];
  }

  public switchToWindow(index: number): void {
    const pages = this.context.pages();
    this.page = pages[index];
  }

  public async getElementBySelector(
    selector: string,
  ): Promise<ElementHandle<Element> | null> {
    const element = await this.page.$(selector);
    return element;
  }

  public async getElementsBySelector(
    selector: string,
  ): Promise<Array<ElementHandle<Element>>> {
    await this.page.waitForSelector(selector);
    const elements = await this.page.$$(selector);
    return elements;
  }
}
