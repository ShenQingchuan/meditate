import {Command}  from '@oclif/core'
import chalk from 'chalk'
import {loadCommandData} from '../../utils'
import {viewFooter, viewHeader} from './constants'

interface MergePot {
  value: number
  isMerged: boolean
}

function newGameBoard(): number[][] {
  return Array.from({length: 4}, () => {
    // NaN means this cell has not been used
    return Array.from({length: 4}).fill(Number.NaN)
  }) as number[][]
}

function newMergePot(value: number): MergePot {
  return {
    value,
    isMerged: false,
  }
}

function mergeForGroup(original: number[], isReversedTraverse = false): number[] {
  if (isReversedTraverse) {
    original = original.reverse()
  }

  let mergeStack: MergePot[] = []
  // Build a stack struct for merging
  for (const element of original) {
    const mergeItem = newMergePot(element)
    const stackTop = mergeStack[mergeStack.length - 1]
    if (stackTop.value === mergeItem.value && !stackTop.isMerged) {
      // This pot has not been merged, then merge with stack top
      mergeItem.value *= 2
      mergeStack.pop() // remove current top, waiting for the merged one
    }

    mergeStack.push(mergeItem)
  }

  // Should not reverse if original has already been reversed
  if (!isReversedTraverse) {
    // Reverse the result of `mergeStack` as stack-all-out
    mergeStack = mergeStack.reverse()
  }

  return mergeStack.map(item => item.value)
}

export default class Game2048 extends Command {
  static GAME_BOARD_SIZE = 4
  static description = '2048 Game in terminal'
  static flags = {}
  static args = []
  static colorsMap: Record<number, chalk.Chalk> = {
    2: chalk.hex('#03a9f4'),
    4: chalk.hex('#4caf50'),
    8: chalk.hex('#009688'),
    16: chalk.hex('#ffc107'),
    32: chalk.hex('#ff5722'),
    64: chalk.hex('#6cce9e'),
    128: chalk.hex('#e91e63'),
    256: chalk.hex('#9c27b0'),
    512: chalk.hex('#3f51b5'),
    1024: chalk.hex('#fbd324'),
    2048: chalk.hex('#00bcd4'),
  }

  gameBoard = newGameBoard()

  private initData = (): Game2048Data => {
    return {
      historyHighest: 0,
    }
  }

  getRandomPos = (): [number, number] => {
    // Generate a integer of (0,4]
    const randomX = Math.ceil(Math.random() * (Game2048.GAME_BOARD_SIZE - 1))
    const randomY = Math.ceil(Math.random() * (Game2048.GAME_BOARD_SIZE - 1))
    return [randomX, randomY]
  }

  initializeGameBoard = (): void => {
    // Random pick two cells in board
    // and generate '2' on those cells
    const [startPointOneX, startPointOneY] = this.getRandomPos()
    let [startPointTwoX, startPointTwoY] = this.getRandomPos()
    while (
      startPointTwoX === startPointOneX &&
      startPointTwoY === startPointOneY
    ) {
      // if the second point is the same as the first one
      // we should regenerate
      [startPointTwoX, startPointTwoY] = this.getRandomPos()
    }

    this.gameBoard[startPointOneX][startPointOneY] = 2
    this.gameBoard[startPointTwoX][startPointTwoY] = 2
  }

  printGameBoardView = (): void => {
    console.clear()
    console.log(chalk.cyan(viewHeader)) // Print header

    let linesString = ''
    for (let x = 0; x < this.gameBoard.length; x++) {
      linesString += '\t'
      for (let y = 0; y < this.gameBoard[x].length; y++) {
        const cellValue = this.gameBoard[x][y]
        const cellColorChalk = Game2048.colorsMap[cellValue]
        linesString += `  ${Number.isNaN(cellValue) ? chalk.white('.') : cellColorChalk(cellValue)}  `
      }

      linesString += '\n'
    }

    console.log(linesString)
    console.log(chalk.cyan(viewFooter))
  }

  // Tips: `this.gameBoard` is all lines

  swipeLeft = (): void => {
    // Take a horizontal perspective from right to left
    // Traverse by lines
    for (const [i, line] of this.gameBoard.entries()) {
      this.gameBoard[i] = mergeForGroup(line, true)
    }
  }

  swipeRight = (): void => {
    // Take a horizontal perspective from left to right
    // Traverse by lines
    for (const [i, line] of this.gameBoard.entries()) {
      this.gameBoard[i] = mergeForGroup(line)
    }
  }

  swipeUp = (): void => {
    // Take a vertical perspective from bottom to top
    // Traverse by columns

    // Todo
  }

  swipeDown = (): void => {
    // Take a vertical perspective from top to bottom
    // Traverse by columns

    // Todo
  }

  isGameNotOver = (): boolean => {
    if (this.gameBoard.some(group => group.includes(Number.NaN))) return true

    // When a game is over, whatever direction the player wanna go for next step,
    // the values on game board would never change

    // Todo: implement checking for an available next step

    return true
  }

  public async run(): Promise<void> {
    // load command data
    const {historyHighest} = loadCommandData('2048', this.initData)

    // Todo: load previous unfinished game progress

    // Start a new 2048 game:
    // Create a 4x4 game board, we use '.' to display one table cell here for simplicity
    // Every kind of score points has its own color
    this.initializeGameBoard()

    // Run the game loop!
  }
}
