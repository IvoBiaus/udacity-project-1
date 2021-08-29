export const header = `
<hr>
  <div 
    style="display: flex;flex-wrap: wrap;justify-content: space-evenly;margin: 20px"
  >
    <a href="upload">Upload Image</a>
    <a href="images">Gallery</a>
  </div>
<hr>`;

export const successUpload = `
  <div style="display: flex;flex-direction: column;width: fit-content">
    <span>Success!</span>
    <input style="margin-top: 15px" type="button" value="Go back!" onclick="history.back()">
  </div>
`;

export const failedUpload = `
  <div style="display: flex;flex-direction: column;width: fit-content">
    <span>Failed</span>
    <input style="margin-top: 15px" type="button" value="Go back!" onclick="history.back()">
  </div>
`;

export const uploadPage = (state = ''): string => `
  ${header}
  <form
    method="POST"
    action="upload"
    style="display: flex;flex-direction: column;width: fit-content;"
    encType="multipart/form-data"
  >
    <input type="file" accept="image/*" id="imageInput" name="image" />
    <input style="margin-top: 15px" type="submit">
  </form>
  ${state}
`;
