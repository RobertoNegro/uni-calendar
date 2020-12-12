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
import Course from '../models/Course';
import puppeteer from 'puppeteer';
import axios from 'axios';
import moment from 'moment';
import config from '../config';
import University from '../models/University';

export const getInfo: () => University = () => {
  return {
    slug: config.slug,
    fullName: config.fullName,
    shortName: config.shortName,
    serverURI: config.HOST,
  };
};

export const updateCache: (year: number) => Promise<void> = async (year) => {
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox'],
    executablePath: 'google-chrome-stable',
  });
  let result = [];
  let nextPage = `https://www.unibz.it/it/timetable/?fromDate=${year}-01-01&toDate=${year}-12-31`;

  try {
    const page = await browser.newPage();

    do {
      await page.goto(nextPage, {
        waitUntil: 'networkidle2',
      });

      page.on('console', (message) =>
        console.log(`${message.type().substr(0, 3).toUpperCase()} ${message.text()}`)
      );
      const [pageResult, pageNextPage] = await page.evaluate((year) => {
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

        const result: {
          name: string;
          professor: string;
          start: string;
          end: string;
        }[] = [];

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
                      const [startTime, endTime] = courseTime.childNodes[0].textContent.split(
                        ' - '
                      );
                      const day = dayTextMatches[2].trim().padStart(2, '0');
                      const month = `${
                        shortMonths.indexOf(dayTextMatches[3].trim().toLowerCase()) + 1
                      }`.padStart(2, '0');

                      result.push({
                        name: courseName.textContent.trim(),
                        professor: courseProfessor.textContent.trim(),
                        start: `${startTime.trim()} ${day}-${month}-${year}`,
                        end: `${endTime.trim()} ${day}-${month}-${year}`,
                      });
                    }
                  });
                }
              }
            }
          });
        }

        let nextPage = null;
        const nextPageSelector = document.querySelectorAll('.pagination .pagination_button');
        if (nextPageSelector && nextPageSelector.length >= 2 && nextPageSelector[1]) {
          nextPage = nextPageSelector[1].getAttribute('href');
        }

        return [result, nextPage];
      }, year);

      result = [...result, pageResult];
      nextPage = pageNextPage;
    } while (nextPage != null);
  } catch (e) {
    console.error(e);
  } finally {
    await browser.close();
  }

  console.log(result);
};
