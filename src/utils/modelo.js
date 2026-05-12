import * as tf from "@tensorflow/tfjs";

function centrarImagen(ctx, size = 28) {
  const img = ctx.getImageData(0, 0, size, size);
  const data = img.data;

  let minX = size,
    minY = size,
    maxX = 0,
    maxY = 0;

  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const i = (y * size + x) * 4;
      const pixel = data[i];
      if (pixel > 20) {
        if (x < minX) minX = x;
        if (x > maxX) maxX = x;
        if (y < minY) minY = y;
        if (y > maxY) maxY = y;
      }
    }
  }

  if (minX > maxX || minY > maxY) return;

  const width = maxX - minX + 1;
  const height = maxY - minY + 1;

  const tempCanvas = document.createElement("canvas");
  tempCanvas.width = width;
  tempCanvas.height = height;
  const tempCtx = tempCanvas.getContext("2d");
  tempCtx.putImageData(ctx.getImageData(minX, minY, width, height), 0, 0);

  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, size, size);

  const scale = Math.min((size - 8) / width, (size - 8) / height);
  const newW = Math.round(width * scale);
  const newH = Math.round(height * scale);
  const offsetX = Math.round((size - newW) / 2);
  const offsetY = Math.round((size - newH) / 2);

  ctx.imageSmoothingEnabled = false;
  ctx.drawImage(tempCanvas, offsetX, offsetY, newW, newH);

  const img2 = ctx.getImageData(0, 0, size, size);
  for (let p = 0; p < img2.data.length; p += 4) {
    const gris = img2.data[p] > 20 ? 255 : 0;
    img2.data[p] = gris;
    img2.data[p + 1] = gris;
    img2.data[p + 2] = gris;
    img2.data[p + 3] = 255;
  }
  ctx.putImageData(img2, 0, 0);
}

function resample_single(canvas, width, height, resize_canvas) {
  var width_source = canvas.width;
  var height_source = canvas.height;
  width = Math.round(width);
  height = Math.round(height);

  var ratio_w = width_source / width;
  var ratio_h = height_source / height;
  var ratio_w_half = Math.ceil(ratio_w / 2);
  var ratio_h_half = Math.ceil(ratio_h / 2);

  var ctx = canvas.getContext("2d");
  var ctx2 = resize_canvas.getContext("2d");
  var img = ctx.getImageData(0, 0, width_source, height_source);
  var img2 = ctx2.createImageData(width, height);
  var data = img.data;
  var data2 = img2.data;

  for (var j = 0; j < height; j++) {
    for (var i = 0; i < width; i++) {
      var x2 = (i + j * width) * 4;
      var weight = 0;
      var weights = 0;
      var weights_alpha = 0;
      var gx_r = 0;
      var gx_g = 0;
      var gx_b = 0;
      var gx_a = 0;
      var center_y = (j + 0.5) * ratio_h;
      var yy_start = Math.floor(j * ratio_h);
      var yy_stop = Math.ceil((j + 1) * ratio_h);
      for (var yy = yy_start; yy < yy_stop; yy++) {
        var dy = Math.abs(center_y - (yy + 0.5)) / ratio_h_half;
        var center_x = (i + 0.5) * ratio_w;
        var w0 = dy * dy; //pre-calc part of w
        var xx_start = Math.floor(i * ratio_w);
        var xx_stop = Math.ceil((i + 1) * ratio_w);
        for (var xx = xx_start; xx < xx_stop; xx++) {
          var dx = Math.abs(center_x - (xx + 0.5)) / ratio_w_half;
          var w = Math.sqrt(w0 + dx * dx);
          if (w >= 1) {
            continue;
          }

          weight = 2 * w * w * w - 3 * w * w + 1;
          var pos_x = 4 * (xx + yy * width_source);

          gx_a += weight * data[pos_x + 3];
          weights_alpha += weight;

          if (data[pos_x + 3] < 255) weight = (weight * data[pos_x + 3]) / 250;
          gx_r += weight * data[pos_x];
          gx_g += weight * data[pos_x + 1];
          gx_b += weight * data[pos_x + 2];
          weights += weight;
        }
      }
      data2[x2] = gx_r / weights;
      data2[x2 + 1] = gx_g / weights;
      data2[x2 + 2] = gx_b / weights;
      data2[x2 + 3] = gx_a / weights_alpha;
    }
  }

  for (var p = 0; p < data2.length; p += 4) {
    var gris = data2[p + 3];

    if (gris > 50) {
      gris = 255;
    } else {
      gris = 0;
    }

    data2[p] = gris;
    data2[p + 1] = gris;
    data2[p + 2] = gris;
    data2[p + 3] = 255;
  }

  ctx2.putImageData(img2, 0, 0);
}

export function dividirCanvas(canvas) {
  const ctx = canvas.getContext("2d");
  const { width, height } = canvas;
  const img = ctx.getImageData(0, 0, width, height).data;

  let columnas = [];
  for (let x = 0; x < width; x++) {
    let pixel = false;
    for (let y = 0; y < height; y++) {
      const i = (y * width + x) * 4;
      if (img[i] > 20 || img[i + 3] > 20) {
        pixel = true;
        break;
      }
    }
    columnas.push(pixel);
  }

  const inicio = columnas.indexOf(true);
  const final = columnas.lastIndexOf(true);
  const margen = Math.round((final - inicio) / 2);

  let division = Math.round((final + inicio) / 2);

  for (let i = 0; i < margen; i++) {
    if (!columnas[division + i]) {
      division = division + i;
      break;
    }

    if (!columnas[division - i]) {
      division = division - i;
      break;
    }
  }

  const letraIzq = procesar(canvas, 0, division, height);
  const letraDer = procesar(canvas, division, width - division, height);

  return [letraIzq, letraDer];
}

export function dividirCanvasPorCantidad(canvas, cantidad = 2) {
  const total = Math.max(1, Number(cantidad || 1));
  const ctx = canvas.getContext("2d");
  const { width, height } = canvas;
  const img = ctx.getImageData(0, 0, width, height).data;

  const columnas = [];

  for (let x = 0; x < width; x++) {
    let pixel = false;

    for (let y = 0; y < height; y++) {
      const i = (y * width + x) * 4;

      if (img[i] > 20 || img[i + 3] > 20) {
        pixel = true;
        break;
      }
    }

    columnas.push(pixel);
  }

  const inicioReal = columnas.indexOf(true);
  const finalReal = columnas.lastIndexOf(true);

  if (inicioReal === -1 || finalReal === -1) {
    return [];
  }

  const inicio = Math.max(0, inicioReal - 8);
  const final = Math.min(width, finalReal + 8);
  const anchoUtil = final - inicio;
  const anchoSegmento = anchoUtil / total;

  const tensores = [];

  for (let i = 0; i < total; i++) {
    const x = Math.round(inicio + i * anchoSegmento);
    const siguienteX =
      i === total - 1 ? final : Math.round(inicio + (i + 1) * anchoSegmento);

    const ancho = Math.max(1, siguienteX - x);

    tensores.push(procesar(canvas, x, ancho, height));
  }

  return tensores;
}

function procesar(canvas, x, width, height) {
  const tempCanvas = document.createElement("canvas");
  tempCanvas.width = width;
  tempCanvas.height = height;

  const tempCtx = tempCanvas.getContext("2d");
  tempCtx.drawImage(canvas, x, 0, width, height, 0, 0, width, height);

  const canvasLetra = document.getElementById("canvas28");
  resample_single(tempCanvas, 28, 28, canvasLetra);
  centrarImagen(canvasLetra.getContext("2d"));

  return generarTensor(canvasLetra);
}

function generarTensor(canvas) {
  return tf.tidy(() => {
    let tensor = tf.browser.fromPixels(canvas, 1);
    tensor = tensor.cast("float32").div(tf.scalar(255.0));
    return tensor.expandDims(0);
  });
}

export function predecir(modelo, tensor) {
  return tf.tidy(() => {
    const prediccion = modelo.predict(tensor);
    const probabilidades = Array.from(prediccion.dataSync());

    const mayorIndice = probabilidades.indexOf(Math.max(...probabilidades));

    const letra = String.fromCharCode(97 + mayorIndice);
    const porcentaje = probabilidades[mayorIndice] * 100;


    return {
      letra,
      porcentaje,
    };
  });
}
