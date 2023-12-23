# HTML Converter

HTML to image/pdf converter based on [Chrome headless browser](https://github.com/puppeteer/puppeteer). Run as a separate microservice with JSON API.

## Features

* Custom query headers
* Javascript rendering support
* Multiple image formats: `png`, `jpeg`, `webp`
* Customizing image quality
* All current sizes pdf: `A0-A6`, `letter`, `legal`, `tabloid`, `ledger`

## Quick Setup

1. Install [Docker](https://docs.docker.com/get-docker/) and [Docker-Compose](https://docs.docker.com/compose/install/)
2. Create a docker-compose.yml file similar to this:

```yaml
version: '3.8'
services:
  html-converter:
    image: 'alteracs/html-converter:latest'
    restart: unless-stopped
    environment:
      - CONVERTER_BROWSER_VIEWPORT_WIDTH=1366
      - CONVERTER_BROWSER_VIEWPORT_HEIGHT=768
    ports:
      - '3000:3000'
```

3. Bring up your stack by running
```sh
docker compose up -d
```

4. All done, you can execute the first query

```sh
curl --location 'http://localhost:3000/api/convert/to-image' \
--header 'Content-Type: application/json' \
--output 'image.png' \
--data '{"url": "https://github.com/alteracs/html-converter"}'
```

###  Environment variables

| Variable                          | Default | Description                                                         |
|-----------------------------------|---------|---------------------------------------------------------------------|
| CONVERTER_BROWSER_CHROME_PATH     | -       | Path to a browser executable to use instead of the bundled Chromium |
| CONVERTER_BROWSER_VIEWPORT_WIDTH  | 800     | The page width in CSS pixels.                                       |
| CONVERTER_BROWSER_VIEWPORT_HEIGHT | 600     | The page height in CSS pixels.                                      |

## API

### Convert to image

`POST /api/convert/to-image`

#### Parameters

| Parameter         | Type    | Default | Description                                                                     |
|-------------------|---------|---------|---------------------------------------------------------------------------------|
| url               | string  | -       | Page URL                                                                        |
| html              | string  | -       | Page HTML                                                                       |
| options.type      | string  | `png`   | Image type.<br/> Variants: `png`, `jpeg`, `webp`                                |
| options.quality   | number  | `100`   | Quality of the image, between 0-100. Not applicable to `png` images.            |
| options.fullPage  | boolean | `false` | When `true`, takes a screenshot of the full page.                               |
| options.headers   | object  | -       | The extra HTTP headers                                                          |
| options.waitUntil | string  | `load`  | When to consider a wait successful.  <br/> Variants: `load`, `domcontentloaded` |

#### Example

```sh
curl --location 'http://localhost:3000/api/convert/to-image' \
--header 'Content-Type: application/json' \
--output 'image.png' \
--data '{"html": "<h1>HTML Convert</h1>"}'
```

### Convert to pdf

`POST /api/convert/to-pdf`

#### Parameters

| Parameter         | Type    | Default  | Description                                                                                                       |
|-------------------|---------|----------|-------------------------------------------------------------------------------------------------------------------|
| url               | string  | -        | Page URL                                                                                                          |
| html              | string  | -        | Page HTML                                                                                                         |
| options.landscape | boolean | `false`  | Whether to print in landscape orientation.                                                                        |
| options.format    | boolean | `letter` | PaperFormat type <br/> Variants: `letter`, `legal`, `tabloid`, `ledger`, `a0`, `a1`, `a2`, `a3`, `a4`, `a5`, `a6` |
| options.headers   | object  | -        | The extra HTTP headers                                                                                            |
| options.waitUntil | string  | `load`   | When to consider a wait successful.  <br/> Variants: `load`, `domcontentloaded`                                   |
#### Example

```sh
curl --location 'http://localhost:3000/api/convert/to-pdf' \
--header 'Content-Type: application/json' \
--output 'html.pdf' \
--data '{"html": "<h1>HTML Convert</h1>"}'
```

### Stats

`GET /api/stats`

Current service statistics

### Health

`GET /api/health`

Health Check endpoint
