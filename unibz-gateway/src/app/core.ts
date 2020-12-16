/*********
 * Core functionalities
 *   All the processing logics are defined here. In this way, we leave in the
 *   controller all the input/output filtering and selection, and here we write
 *   the "raw" logics. In this way they're also re-usable! :)
 *   Obviously, in a real project, those functionalities should be divided as well.
 *   "Core" is not a fixed word for this type of file, sometimes
 *   people put those functions in a Utils file, sometimes in a Helper
 *   file, sometimes in a Services folder with different files for every service..
 *   It really depends on your project, style and personal preference :)
 */
import puppeteer from 'puppeteer';
import config from '../config';
import { CachedEvent } from './models';
import UniversityCreation from '../models/UniversityCreation';

export const getInfo: () => UniversityCreation = () => {
  return {
    slug: config.slug,
    fullName: config.fullName,
    shortName: config.shortName,
    serverURI: config.HOST,
  };
};

const innerPageFunction: (year: number) => [CachedEvent[], string | undefined] = (year: number) => {
  const shortMonths = [
    'gen',
    'feb',
    'mar',
    'apr',
    'mag',
    'giu',
    'lug',
    'ago',
    'set',
    'ott',
    'nov',
    'dic',
  ];

  const result: CachedEvent[] = [];

  const daysContainer = document.querySelectorAll('article.u-cf');
  if (daysContainer) {
    daysContainer.forEach((dayContainer) => {
      let dayTextContainer = dayContainer.querySelector('h2');
      if (dayTextContainer && dayTextContainer.textContent) {
        const dayText = dayTextContainer.textContent.trim().toLowerCase();
        if (dayText.length > 0) {
          const dayTextMatches = dayText.match(/([^,]+),\s+(\d+)\s+(\w+)/i);
          if (dayTextMatches && dayTextMatches.length == 4) {
            const courseContainers = dayContainer.querySelectorAll('.u-of-hidden');
            courseContainers.forEach((courseContainer) => {
              const courseName = courseContainer.querySelector('h3');
              const courseTime = courseContainer.querySelector('.u-fw-bold');
              const courseProfessor = courseContainer.querySelector('.u-ls-1 span');

              if (
                courseName &&
                courseName.textContent &&
                courseTime &&
                courseTime.childNodes[0] &&
                courseTime.childNodes[0].textContent &&
                courseProfessor &&
                courseProfessor.textContent
              ) {
                let [startTime, endTime] = courseTime.childNodes[0].textContent.split(' - ');
                if (!endTime) {
                  endTime = startTime;
                }
                if (startTime && endTime) {
                  const day = dayTextMatches[2].trim().padStart(2, '0');
                  const month = `${
                    shortMonths.indexOf(dayTextMatches[3].trim().toLowerCase()) + 1
                  }`.padStart(2, '0');

                  result.push({
                    name: courseName.textContent.trim(),
                    professor: courseProfessor.textContent.trim(),
                    start: `${year}-${month}-${day} ${startTime.trim()}`,
                    end: `${year}-${month}-${day} ${endTime.trim()}`,
                  });
                }
              }
            });
          }
        }
      }
    });
  }

  let nextPage: string | undefined = undefined;
  const nextPageSelector = document.querySelectorAll('.pagination .pagination_button');
  if (nextPageSelector && nextPageSelector.length >= 2 && nextPageSelector[1]) {
    const href = nextPageSelector[1].getAttribute('href');
    if (href) {
      const matches = href.match(/[&?]page=(\d+)/i);
      nextPage = matches && matches.length >= 2 ? matches[1] : undefined;
    }
  }

  return [result, nextPage];
};

export const updateCache: (
  year: number,
  page?: string
) => Promise<[CachedEvent[], string | undefined]> = async (year, page) => {
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox'],
  });

  page = `https://www.unibz.it/it/timetable/?fromDate=${year}-01-01&toDate=${year}-12-31&page=${
    page ? page : '1'
  }`;

  let result: CachedEvent[] = [];
  let nextPage: string | undefined = undefined;

  try {
    const browserPage = await browser.newPage();

    console.log(`Navigating to ${page} ...`);

    await browserPage.goto(page, {
      waitUntil: 'networkidle2',
    });
    browserPage.on('console', (message) =>
      console.log(`${message.type().substr(0, 3).toUpperCase()} ${message.text()}`)
    );

    console.log('Page loaded. Scraping data...');

    [result, nextPage] = await browserPage.evaluate(innerPageFunction, year);

    await browserPage.close();
  } catch (e) {
    console.error('Puppeteer error:', e);
  } finally {
    await browser.close();
  }

  return [result, nextPage];
};
