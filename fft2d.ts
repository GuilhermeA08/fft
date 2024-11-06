type ComplexNumber = [number, number]; // [real, imaginário]

/**
 * Verifica se um número é uma potência de 2.
 * @param {number} n - O número a ser verificado.
 * @returns {boolean} - Verdadeiro se for uma potência de 2, falso caso contrário.
 */
function isPowerOf2(n: number): boolean {
  return (n & (n - 1)) === 0;
}

/**
 * Preenche o array de entrada com zeros até o próximo comprimento que seja uma potência de 2.
 * @param {ComplexNumber[]} input - Array de números complexos.
 * @returns {ComplexNumber[]} - O array com padding.
 */
function padToPowerOf2(input: ComplexNumber[]): ComplexNumber[] {
  const nextPowerOf2 = 1 << (Math.ceil(Math.log2(input.length)));
  return [...input, ...Array(nextPowerOf2 - input.length).fill([0, 0])];
}

/**
 * Realiza a FFT de uma sequência complexa 1D.
 * @param {ComplexNumber[]} input - Array de números complexos.
 * @returns {ComplexNumber[]} - A transformada rápida de Fourier do input.
 */
function fft1D(input: ComplexNumber[]): ComplexNumber[] {
  const N = input.length;
  if (N <= 1) return input;

  // Garante que o array de entrada tenha comprimento potência de 2
  const paddedInput = isPowerOf2(N) ? input : padToPowerOf2(input);

  // Divide: Calcula FFT das partes par e ímpar
  const even = fft1D(paddedInput.filter((_, index) => index % 2 === 0));
  const odd = fft1D(paddedInput.filter((_, index) => index % 2 !== 0));

  // Combina
  const result: ComplexNumber[] = Array(N).fill([0, 0]);
  for (let k = 0; k < N / 2; k++) {
    const expTerm: ComplexNumber = [
      Math.cos((-2 * Math.PI * k) / N),
      Math.sin((-2 * Math.PI * k) / N),
    ];

    const oddPart: ComplexNumber = [
      expTerm[0] * odd[k][0] - expTerm[1] * odd[k][1],
      expTerm[0] * odd[k][1] + expTerm[1] * odd[k][0],
    ];

    result[k] = [even[k][0] + oddPart[0], even[k][1] + oddPart[1]];
    result[k + N / 2] = [even[k][0] - oddPart[0], even[k][1] - oddPart[1]];
  }

  return result;
}

/**
 * Realiza a FFT 2D em uma imagem.
 * @param {ComplexNumber[][]} image - Matriz 2D de pixels como números complexos.
 * @returns {ComplexNumber[][]} - A FFT 2D da imagem.
 */
export function fft2D(image: ComplexNumber[][]): ComplexNumber[][] {
    const width = image.length;
    const height = image[0].length;
  
    // Aplica FFT 1D nas linhas
    const rowTransformed = image.map(row => fft1D(row));
  
    // Aplica FFT 1D nas colunas
    const colTransformed = Array.from({ length: width }, (_, x) =>
      fft1D(rowTransformed.map(row => row[x]))
    );
  
    // Transforma colTransformed para matriz de saída 2D
    const result: ComplexNumber[][] = Array.from({ length: width }, (_, x) =>
      Array.from({ length: height }, (_, y) => colTransformed[x][y])
    );
  
    return result;
  }
