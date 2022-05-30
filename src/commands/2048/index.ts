/* eslint-disable max-statements-per-line */
import {Command}  from '@oclif/core'
import chalk from 'chalk'
import {keyIn} from 'readline-sync'
import {loadCommandData} from '../../utils'

type MoveDirection = 'LEFT' | 'RIGHT' | 'UP' | 'DOWN';
type GameStatus = 'WIN' | 'GOING' | 'END';

const viewHeader = '————————————— 2048 Game ——————————————'
const viewFooter = '————————————— Meditate ———————————————'

export default class Game2048 extends Command {
  static GAME_BOARD_SIZE = 4
  static WIN_VALUE = 2048
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

  // gameBoard = this.newGameBoard()
  gameBoard = [
    [2,  4,  8,  16],
    [4,  8,  2,  8],
    [2,  4,  2,  8],
    [16, 2, 4, 16],
  ]

  score = 0
  status: GameStatus = 'GOING'

  private initData = (): Game2048Data => {
    return {
      historyHighest: 0,
      currentScore: 0,
    }
  }

  newGameBoard(): number[][] {
    return Array.from({length: 4}, () => {
      // NaN means this cell has not been used
      return Array.from({length: 4}).fill(Number.NaN)
    }) as number[][]
  }

  initializeGameBoard = (): void => {
    // generate two start points (value is 2 or 4)
    this.spawn().spawn()
  }

  private _inverse(gameBoard: number[][] = this.gameBoard): number[][] {
    return gameBoard.map(row => [...row].reverse())
  }

  inverseGameBoard(): Game2048 {
    this.gameBoard = this._inverse(this.gameBoard)
    return this
  }

  private _transpose(gameBoard: number[][] = this.gameBoard): number[][] {
    return gameBoard[0].map((_, i) => gameBoard.map(row => {
      return row[i]
    }))
  }

  transposeGameBoard(): Game2048 {
    this.gameBoard = this._transpose(this.gameBoard)
    return this
  }

  spawn(): Game2048 {
    const newItemValue = Math.round(Math.random() * 100) > 89 ? 4 : 2
    const availablePoints: [number, number][] = []
    for (let i = 0; i < this.gameBoard.length; i++) {
      for (let j = 0; j < this.gameBoard[i].length; j++) {
        if (Number.isNaN(this.gameBoard[i][j])) {
          availablePoints.push([i, j])
        }
      }
    }

    if (availablePoints.length === 0) {
      return this
    }

    const [pickedX, pickedY] = availablePoints[Math.floor(Math.random() * availablePoints.length)]
    this.gameBoard[pickedX][pickedY] = newItemValue
    return this
  }

  tighten(row: number[]): number[] {
    const notNaNItems = row.filter(item => !Number.isNaN(item))
    const newRow = [
      ...notNaNItems,
      ...Array.from<number>(
        {length: row.length - notNaNItems.length},
      ).fill(Number.NaN),
    ]
    return newRow
  }

  merge(row: number[]): number[] {
    let isPair = false // two numbers equal
    const newRow: number[] = []
    for (let i = 0; i < row.length; i++) {
      if (isPair) {
        newRow.push(2 * row[i])
        this.score += 2 * row[i]
        isPair = false
      } else if (i + 1 < row.length && row[i] === row[i + 1]) {
        isPair = true
        newRow.push(Number.NaN)
      } else {
        newRow.push(row[i])
      }
    }

    if (newRow.length !== row.length) {
      this.log(chalk.red('Error: Merge error occured'))
      this.exit(-1)
    }

    return newRow
  }

  swipeForRow(): Game2048 {
    for (let i = 0; i < this.gameBoard.length; i++) {
      this.gameBoard[i] = this.tighten(
        this.merge(
          this.tighten(this.gameBoard[i]),
        ),
      )
    }

    return this
  }

  swipeLeft(): Game2048 {
    this.swipeForRow().spawn()
    return this
  }

  swipeRight(): Game2048 {
    this.inverseGameBoard()
    .swipeForRow()
    .inverseGameBoard()
    .spawn()
    return this
  }

  swipeUp(): Game2048 {
    this.transposeGameBoard()
    .swipeLeft()
    .transposeGameBoard()
    .spawn()
    return this
  }

  swipeDown(): Game2048 {
    this.transposeGameBoard()
    .swipeRight()
    .transposeGameBoard()
    .spawn()
    return this
  }

  isRowsMovable(gameBoard: number[][]): boolean {
    for (const row of gameBoard) {
      for (let i = 0; i < row.length; i++) {
        if (Number.isNaN(row[i]) && !Number.isNaN(row[i + 1])) return true // move
        if (!Number.isNaN(row[i]) && row[i + 1] === row[i]) return true // merge
      }
    }

    return false
  }

  isMovePossible(direction: MoveDirection): boolean {
    let checkResult = false
    switch (direction) {
    case 'LEFT':
      checkResult = this.isRowsMovable(this.gameBoard)
      break
    case 'RIGHT':
      checkResult = this.isRowsMovable(this._inverse())
      break
    case 'UP':
      checkResult = this.isRowsMovable(this._transpose())
      break
    case 'DOWN':
      checkResult = this.isRowsMovable(this._inverse(this._transpose()))
      break
    }

    return checkResult
  }

  isWin(): boolean {
    for (const row of this.gameBoard) {
      for (const item of row) {
        if (!Number.isNaN(item) && item >= Game2048.WIN_VALUE) {
          return true
        }
      }
    }

    return false
  }

  isGameOver = (): boolean => {
    for (const direction of ['LEFT', 'RIGHT', 'UP', 'DOWN'] as MoveDirection[]) {
      if (this.isMovePossible(direction)) {
        return false
      }
    }

    return true
  }

  isGameWillContinue(): boolean {
    let isWillContinue = true
    if (this.isWin()) {
      console.log(chalk.yellow('🎉 You win!'))
      this.status = 'WIN'
      isWillContinue = false
    } else if (this.isGameOver()) {
      console.log(chalk.yellow('🤔 Game over!'))
      this.status = 'END'
      isWillContinue = false
    }

    return isWillContinue
  }

  printGameBoardView = (): void => {
    console.clear()
    console.log(chalk.cyan(viewHeader)) // Print header
    console.log(`${chalk.blue('SCORE: ')} ${this.score}`) // Print scroe

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

  public async run(): Promise<void> {
    // load command data
    const {historyHighest} = loadCommandData('2048', this.initData)

    // Todo: load previous unfinished game progress

    // Start a new 2048 game:
    // Create a 4x4 game board, we use '.' to display one table cell here for simplicity
    // Every kind of score points has its own color
    this.initializeGameBoard()

    // Run the game loop!
    try {
      while (this.isGameWillContinue()) {
        this.printGameBoardView()

        const actionKey = keyIn('', {hideEchoBack: true, mask: '', limit: 'qrjkhl'})
        switch (actionKey) {
        case 'j': this.swipeDown(); break
        case 'k': this.swipeUp(); break
        case 'h': this.swipeLeft(); break
        case 'l': this.swipeRight(); break
        case 'q': {
        // Todo: save game process if necessary
          this.exit()
          break
        }
        }
      }
    } catch (error) {
      console.log(chalk.red(`2048 Error: ${error}`))
    }
  }
}
