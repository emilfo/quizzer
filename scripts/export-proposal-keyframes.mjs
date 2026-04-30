#!/usr/bin/env node

import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { execFileSync } from 'node:child_process'
import { pathToFileURL } from 'node:url'

const repoRoot = '/Users/emilostensen/priv/projects/quizzer'
const proposalsRoot = path.join(repoRoot, 'docs/design/proposals')
const chromeCandidates = [
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  '/Applications/Chromium.app/Contents/MacOS/Chromium',
]

const chromePath = chromeCandidates.find((candidate) => fs.existsSync(candidate))

if (!chromePath) {
  console.error('No supported Chrome/Chromium binary found for keyframe export.')
  process.exit(1)
}

const laneDirs = fs
  .readdirSync(proposalsRoot, { withFileTypes: true })
  .filter((entry) => entry.isDirectory() && entry.name.startsWith('2026-04-29-lane-'))
  .map((entry) => entry.name)
  .sort()

const expectedExports = [
  '01-entry-sheet.png',
  '02-host-dashboard-sheet.png',
  '03-host-editor-sheet.png',
  '04-host-live-sheet.png',
  '05-player-join-sheet.png',
  '06-player-live-sheet.png',
  '07-projector-lobby.png',
  '08-projector-question.png',
  '09-projector-results.png',
  '10-projector-finished.png',
]

function fail(message) {
  console.error(message)
  process.exit(1)
}

function extractSheetBlocks(html) {
  const sectionBlocks = html.match(/<section\b[\s\S]*?<\/section>/g) ?? []
  const sheets = []

  for (const block of sectionBlocks) {
    const idMatch = block.match(/\bid="([^"]+)"/)
    const exportMatch = block.match(/\bdata-export="([^"]+)"/)

    if (!idMatch || !exportMatch) continue

    sheets.push({
      id: idMatch[1],
      file: exportMatch[1],
      block,
    })
  }

  return sheets
}

function buildStandaloneHtml({ title, keyframesDir, sheetBlock }) {
  const tokensHref = pathToFileURL(path.join(keyframesDir, 'tokens.css')).href
  const stylesHref = pathToFileURL(path.join(keyframesDir, 'styles.css')).href

  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${title}</title>
    <link rel="stylesheet" href="${tokensHref}" />
    <link rel="stylesheet" href="${stylesHref}" />
    <style>
      html, body {
        margin: 0;
        padding: 0;
      }

      body {
        min-height: 100vh;
      }

      .intro,
      [data-export-hidden] {
        display: none !important;
      }

      .sheet {
        margin: 0 !important;
        max-width: none !important;
        min-height: 100vh !important;
      }
    </style>
  </head>
  <body>
    ${sheetBlock}
  </body>
</html>
`
}

for (const laneDir of laneDirs) {
  const keyframesDir = path.join(proposalsRoot, laneDir, 'keyframes')
  const indexHtmlPath = path.join(keyframesDir, 'index.html')
  const exportsDir = path.join(keyframesDir, 'exports')

  if (!fs.existsSync(indexHtmlPath)) {
    fail(`Missing keyframe board: ${indexHtmlPath}`)
  }

  fs.mkdirSync(exportsDir, { recursive: true })

  const html = fs.readFileSync(indexHtmlPath, 'utf8')
  const sheets = extractSheetBlocks(html)

  if (sheets.length !== expectedExports.length) {
    fail(`${laneDir}: expected ${expectedExports.length} sheets, found ${sheets.length}`)
  }

  const foundExports = sheets.map((sheet) => sheet.file)
  const missingExports = expectedExports.filter((file) => !foundExports.includes(file))

  if (missingExports.length > 0) {
    fail(`${laneDir}: missing expected exports: ${missingExports.join(', ')}`)
  }

  for (const sheet of sheets) {
    const standaloneHtml = buildStandaloneHtml({
      title: `${laneDir} · ${sheet.file}`,
      keyframesDir,
      sheetBlock: sheet.block,
    })

    const tempHtmlPath = path.join(os.tmpdir(), `${laneDir}-${sheet.file.replace(/\.png$/, '.html')}`)
    const outputPath = path.join(exportsDir, sheet.file)

    fs.writeFileSync(tempHtmlPath, standaloneHtml)

    execFileSync(
      chromePath,
      [
        '--headless',
        '--disable-gpu',
        '--hide-scrollbars',
        '--no-first-run',
        '--disable-features=Translate,OptimizationHints',
        '--window-size=1600,900',
        `--screenshot=${outputPath}`,
        pathToFileURL(tempHtmlPath).href,
      ],
      { stdio: 'pipe' },
    )
  }

  console.log(`${laneDir}: exported ${sheets.length} styled keyframes`)
}
