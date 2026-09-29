# ccwc

A re-implementation of the classic Unix `wc` (word count) tool in Node.js, built with [Commander](https://github.com/tj/commander.js).

`ccwc` counts the bytes, lines, words and characters in a file or in text piped through standard input.

## Requirements

- Node.js 18+ (the project uses ES modules and `String.prototype.replaceAll`)
- [pnpm](https://pnpm.io/) (the project pins `pnpm@10.6.5`)

## Installation

```bash
git clone <repo-url> ccwc
cd ccwc
pnpm install
```

To make the `ccwc` command available globally:

```bash
pnpm link --global
```

You can also run it without linking:

```bash
node bin/index.js [options] [filepath]
```

## Usage

```
ccwc [options] [filepath]
```

| Option              | Description                  |
| ------------------- | ---------------------------- |
| `-c, --byte`        | Print the byte count         |
| `-l, --line`        | Print the newline count      |
| `-w, --word`        | Print the word count         |
| `-m, --character`   | Print the character count    |
| `-V, --version`     | Print the version number     |
| `-h, --help`        | Show help                    |

With no options, `ccwc` prints the line, word and byte counts, like `wc`.

If `filepath` is omitted, `ccwc` reads from standard input.

### Examples

```bash
$ ccwc -c test.txt
 24 test.txt

$ ccwc -l test.txt
2 test.txt

$ ccwc -w test.txt
	5 test.txt

$ ccwc -m test.txt
	24 test.txt

$ ccwc test.txt
2 5 24  test.txt

# Reading from standard input
$ cat test.txt | ccwc -l
2
```

Passing a directory instead of a file prints an error and exits with status `1`.

## How counts are calculated

- **Bytes** come from the file's size on disk (`fs.statSync`).
- **Lines** are the number of `\n` characters.
- **Words** are runs of non-whitespace characters (`/\S+/g`).
- **Characters** are the number of UTF-16 code units in the UTF-8 decoded text. Characters outside the Basic Multilingual Plane, such as most emoji, count as 2.

## Project structure

```
bin/
├── index.js   # CLI entry point: argument parsing and output
└── utils.js   # byteCount, lineCount and wordCount helpers
```

## Known limitations

- `-c` and the default (no-option) mode need a file path; they fail when reading from standard input.
- Combining `-m` with `-l` reports 0 characters, because both read the same stream and `-l` consumes it first.
- Output spacing differs slightly between options and from GNU/BSD `wc`.

## License

ISC
