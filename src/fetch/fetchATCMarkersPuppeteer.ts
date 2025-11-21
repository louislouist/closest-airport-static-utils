import { writeFileSync, mkdirSync, existsSync } from 'fs';
import puppeteer, { Browser, Puppeteer } from 'puppeteer';
import path = require('path');
import os from 'os';

interface LiveATCMarkers {
        name: string;
        url: string;
        lat: string;
        lng: string;
}

const MARKERS_URL = 'https://www.liveatc.net/map/markers.js';
const OUTPUT_FILE = path.join(
        __dirname,
        '..',
        '..',
        'data',
        'liveATCLocations.json'
);

// NOTE: Issue with Sectigo Public Server Authentication CA
// when using NodeJS fetch. fetchLiveATCMarkers() uses puppeteer
// and chromium for LiveATC supported airports.
//
export async function fetchATCMarkersPuppeteer() {
        const browser = await setBrowser();
        // const browser = await puppeteer.launch({ headless: true });

        const page = await browser.newPage();

        try {
                const response = await page.goto(MARKERS_URL, {
                        waitUntil: 'networkidle0',
                });

                //debug

                if (!response || !response.ok()) {
                        throw new Error(
                                `Failed to load markers.js: ${response?.status()}`
                        );
                }

                const jsReponse = await response.text();

                const atcMarkers = parseMarkers(jsReponse);
                if (!atcMarkers || !Array.isArray(atcMarkers)) {
                        throw new Error(
                                'ERROR: No LiveATC location markers available!'
                        );
                }
                // write LiveATC markers to disk.
                writeMarkers(atcMarkers);
        } catch (err) {
                // puppeteer errors
                throw new Error(
                        `ERROR: puppeteer unable to load LiveATC: ${err}`
                );
        }

        await browser.close();
}

function parseMarkers(atcData: string): LiveATCMarkers[] | null {
        const match = atcData.match(/markers\s*=\s*(\[[\s\S]*\])/);

        // check to see if match contains markers
        if (match) {
                const arrayString = match[1]; // this is the '[{...}]' part

                try {
                        const markersArray: LiveATCMarkers[] =
                                JSON.parse(arrayString);
                        // return LiveATC location markers array.
                        return markersArray;
                } catch (err) {
                        console.log('error parsing LiveATC json:', err);
                        return null;
                }
        } else {
                // unable to find markers
                console.log('Unable to find markers');
                return null;
        }
}

function writeMarkers(atcMarkers: LiveATCMarkers[]) {
        try {
                const dir = path.dirname(OUTPUT_FILE);
                if (!existsSync(dir)) {
                        mkdirSync(dir, { recursive: true });
                }

                writeFileSync(
                        OUTPUT_FILE,
                        JSON.stringify(atcMarkers, null, 2),
                        'utf8'
                );
                console.log(`✅ Markers saved to ${OUTPUT_FILE}`);
        } catch (error) {
                console.error('❌ Error fetching or saving markers:', error);
        }
}
async function setBrowser(): Promise<Browser> {
        switch (process.platform) {
                case 'win32':
                        console.log('Running on Windows');
                        console.log('WARNING: Windows support is experimental');
                        return await puppeteer.launch({ headless: true });
                case 'darwin':
                        console.log('Running on macOS');
                        return await puppeteer.launch({ headless: true });
                case 'linux':
                        console.log(
                                'Downloading on Linux using /usr/bin/chromium'
                        );
                        return await puppeteer.launch({
                                executablePath: '/usr/bin/chromium',
                                headless: true,
                        });
                default:
                        console.log(
                                'WARNING: Unknown OS... trying to lauch puppeteer'
                        );
                        return await puppeteer.launch({ headless: true });
        }
}
