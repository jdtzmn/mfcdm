# MetFern Cemetery Data Manipulation (MFCDM)

MFCDM takes the data collected from the individuals' burials and compiles it into one monolithic database

[Click here](metfern-link) to learn more about the MetFern Cemetery project and how you can help.

## Getting Started

### Prerequisites

This is a [Node.js](https://nodejs.org/en/) application.

Before installing, [download and install Node.js](https://nodejs.org/en/download/).

### Installing

1. Clone the repository

```bash
$ git clone https://github.com/jdtzmn/jdtzmn.github.io
$ cd jdtzmn.github.io
```

2. Install dependencies

```bash
$ npm install
```

3. Create config file

Follow the directions inside [`example.form.config.js`](./example.form.config.js)

4. Create table.txt file

Open the table.txt file and paste the data from an excel spreadsheet

5. Create a substitutions.js file

The substitutions file is a JavaScript file that directs the code as to how to substitute data as needed in order to submit the form. 

It should follow the general outline of [`example.substitutions.js`](./example.substitutions.js)

The helper method `askQuestion` can be imported from [`substititutionHelpers.js`](./substitutionHelpers.js) to ask questions of the user.

6. Run MFCDM

```bash
$ npm start
```

## Authors

* **Jacob Daitzman** - *Initial work* - [jdtzmn](profile-link)

See also the list of [contributors](contributions-link) who participated in this project.

## License

This project is left unlicensed on purpose, which means [it is under exclusive copyright](license-info-link) at the moment.

[metfern-link]: http://metferncemetery.org
[profile-link]: https://github.com/jdtzmn
[contributions-link]: https://github.com/jdtzmn/mfcdm
[license-info-link]: https://choosealicense.com/no-permission/
