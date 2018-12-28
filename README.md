# MetFern Cemetery Data Manipulation (MFCDM)

MFCDM takes the data collected from the individuals' burials and compiles it into one monolithic database

[Click here][metfern-link] to learn more about the MetFern Cemetery and how you can help.

## More Info

The goal of this project is to take data entered manually by hand and data entered automatically by form submission, and to combine the data  through automated form submission so that the merged data forms a common schema for future analysis.

## Getting Started

### Prerequisites

This is a [Node.js](https://nodejs.org/en/) application.

Before installing, [download and install Node.js](https://nodejs.org/en/download/).

### Installing

1. Clone the repository

```bash
$ git clone https://github.com/jdtzmn/mfcdm
$ cd mfcdm
```

2. Install dependencies

```bash
$ npm install
```

3. Create `input` folder

```bash
$ mkdir input
```

### Usage

Create a `converter.js` file in the `input` folder

```js
const Mfcdm = require('../dist/mfcdm')
const mfcdm = new Mfcdm()

const converter = async (sheetName, sheetRow) => {
  ...
}

mfcdm.middleware('Sheet1', converter)
mfcdm.start() // starts the mfcdm cli
```

Run the file

```bash
node input/converter.js
```

## Authors

* **Jacob Daitzman** - *Initial work* - [jdtzmn][profile-link]

## License

This project is left unlicensed on purpose, which means [it is under exclusive copyright][license-info-link] at the moment.

[metfern-link]: http://metferncemetery.org
[profile-link]: https://github.com/jdtzmn
[license-info-link]: https://choosealicense.com/no-permission/
