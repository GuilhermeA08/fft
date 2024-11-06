import { Jimp, rgbaToInt } from "jimp";

type ComplexNumber = [number, number]; // [real, imaginário]

// Função para calcular a magnitude a partir do número complexo
function calculateMagnitude(value: ComplexNumber): number {
  return Math.sqrt(value[0] ** 2 + value[1] ** 2);
}

// Função para gerar uma imagem de espectro a partir da FFT
export async function createFFTImage(
  fftData: ComplexNumber[][],
  width: number,
  height: number
) {
  // Cria uma nova imagem com a largura e altura especificadas
  const image = await new Jimp({ width, height });

  // Encontrar a magnitude máxima para normalizar as intensidades
  let maxMagnitude = 0;
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const magnitude = calculateMagnitude(fftData[y][x]);
      if (magnitude > maxMagnitude) maxMagnitude = magnitude;
    }
  }

  // Define os pixels da imagem de acordo com a magnitude normalizada
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const magnitude = calculateMagnitude(fftData[y][x]);
      const intensity = Math.floor((magnitude / maxMagnitude) * 255);

      // Define o pixel na posição (x, y) como tons de cinza baseado na intensidade
      const color = rgbaToInt(intensity, intensity, intensity, 255);
      image.setPixelColor(color, x, y);
    }
  }

  // Salva a imagem como um arquivo
  image.write("fft_spectrum.png");
}
