export const successUpload = `
  <body>
    <div style="display: flex;flex-direction: column;width: fit-content">
      <span>Success!</span>
      <input style="margin-top: 15px" type="button" value="Go back!" onclick="history.back()">
    </div>
  </body>`;

export const failedUpload = `
  <body>
    <div style="display: flex;flex-direction: column;width: fit-content">
      <span>Failed</span>
      <input style="margin-top: 15px" type="button" value="Go back!" onclick="history.back()">
    </div>
  </body>`;

export const uploadPage = `
  <body>
    <form
      method="POST"
      action="upload"
      style="display: flex;flex-direction: column;width: fit-content"
      encType="multipart/form-data"
    >
      <input type="file" accept="image/*" id="imageInput" name="image" />
      <input style="margin-top: 15px" type="submit">
    </form>
  </body>`;
