# Browserazzi

[![Build Status](https://travis-ci.org/BideoWego/browserazzi.svg?branch=master)](https://travis-ci.org/BideoWego/browserazzi)

A paparazzi for your browser that takes screenshots of websites given a URL.



## Installation

To install `cd` to the project directory and run:

```bash
$ npm install
```

To run the app you'll need to create a `.env` file with a `SECRET` environment variable.

```bash
$ touch .env
$ echo "SECRET=$(md5 <<< 'Some secret value')" >> .env
```

## Getting Started

You can run the app with:

```bash
$ node app.js
```

If you wish to run the app on a different port you can do so with:

```bash
$ node app.js --port 4000
# or
$ node app.js --p 4000
```

## Running tests

If you wish to run the tests run them with:

```bash
$ npm test
```


