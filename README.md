# Image Processing API

Image processing API that resizes and saves images according to user specifications.

## Usage

```
npm run build && node build/
```

or to run locally

```
npm start
```

For testing:
**For testing is requiered Node 14.14.0 or higher**

```
npm test
```

## Available Endpoints

```
/api/upload
```

Returns basic UI that allows the user to upload images to the server.

If you are not accessing from the browser, then the file must be attached at the **form-data** of the **body** with the key **image**.

```
/api/images
```

Returns basic UI showing all the available images with their names.

To request an image, the available query parameters are:

`fileName`: string, required, must include image extention.

- **width**: string, optional (in px).

- **height**: string, optional (in px).

Height and width must be sent together. If you dont send any of them, then the image will be returned with the original size.

- **fit**: string, optional. Default value: "cover". Must be one of: _`[contain, cover, fill, inside, outside]`_

"Fit" only works if width and height are set.

### Examples

```
/api/images?fileName=wallpaper.png
```

```
/api/images?fileName=wallpaper.png&width=1920&height=1080
```

```
/api/images?fileName=wallpaper.png&width=1080&height=1920&fit=contain
```
