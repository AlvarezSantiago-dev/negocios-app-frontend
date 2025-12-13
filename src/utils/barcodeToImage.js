function barcodeToImage(code) {
  const canvas = document.createElement("canvas");
  JsBarcode(canvas, code, {
    format: "CODE128",
    width: 2,
    height: 50,
    margin: 0,
    displayValue: false,
  });
  return canvas.toDataURL("image/png");
}

export default barcodeToImage;
