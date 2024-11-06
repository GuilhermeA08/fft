import { Jimp } from "jimp";
import { fft2D } from "./fft2d";
import { createFFTImage } from "./fftToImg";

type ComplexNumber = [number, number]; // [real, imaginário]

/**
 * Prepara uma imagem para a FFT.
 * @param {Jimp} image - A imagem a ser processada.
 * @returns {ComplexNumber[][]} - Matriz 2D de valores complexos [real, imaginário].
 */
function prepareImageForFFT(image: any): ComplexNumber[][] {
  const width = image.bitmap.width;
  const height = image.bitmap.height;

  const complexImage: ComplexNumber[][] = Array.from({ length: width }, () =>
    Array(height).fill([0, 0])
  );

  image.scan(0, 0, width, height, function (x: number, y: number, idx: number) {
    const grayscale = image.bitmap.data[idx]; // Usa o valor do canal vermelho como escala de cinza
    complexImage[x][y] = [grayscale, 0]; // Define parte real como valor do pixel e parte imaginária como 0
  });

  return complexImage;
}

async function main() {
  try {
    const image = await Jimp.read("teste3.jpg");

    const width = image.bitmap.width;
    const height = image.bitmap.height;

    // Prepara a imagem para FFT
    const complexImage = prepareImageForFFT(image);

    // Aplica a FFT 2D
    const fftResult = fft2D(complexImage);

    // Cria uma imagem de espectro a partir da FFT
    await createFFTImage(fftResult, width, height);

    console.log("FFT 2D realizada com sucesso.");
    console.log(fftResult); // Este é o resultado da FFT 2D da imagem
  } catch (error) {
    console.error("Erro ao processar a imagem:\n", error);
  }
}

main();
