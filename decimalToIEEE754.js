document.getElementById('convertir').addEventListener('click', function (e) {
  var numero = document.getElementById('numero').value
  var ieee754 = ieee754aBinario(numero)
  // alert(valorHex)

  document.getElementById('ieee754').value = ieee754
})

var numeroBinario = ''
var binarioCientificio

function pasarBinarioEntera (numeroDecimal) { // Convierte la parte entera del numero en binario.

  var parteEnteraBinario = ''
  var parteEntera = parseInt(numeroDecimal); // parseInt devuelve solo la parte entera de un número.

  if (parteEntera == 0) {
    parteEnteraBinario = '0' // Si la parte entera es 0, el binario es 0, si es negativa, se convierte a positiva
  } else if (parteEntera < 0) {
    parteEntera = numeroDecimal * (-1)
  }

  while(parteEntera > 0) { // Mientras la parte entera sea mayor que 0, se divide entre 2 y se recoge el resto, concatenando el resto anterior.
    parteEnteraBinario = parseInt(parteEntera % 2) + parteEnteraBinario
    parteEntera = parseInt(parteEntera / 2)
  }

  return parteEnteraBinario; // Devuelve la parte entera en binario.
}

function pasarBinarioDecimal (numeroDecimal) { // Convierte la parte decimal del numero en binario.

  var numeroPositivo = numeroDecimal

  if (numeroPositivo < 0) { // Si el numero es negativo, lo convierte a positivo para poder usarlo.
    numeroPositivo = numeroDecimal * (-1)
  } else {
    numeroPositivo = numeroDecimal
  }

  // Para conseguir solo la parte decimal, restamos a la parte entera el numero completo y lo multiplicamos por (-1)
  var parteDecimal = (parseInt(numeroPositivo) - numeroPositivo) * (-1)
  var parteDecimalBinario = ''
  var resultadoMultiplicacion
  var contadorCantidadNumeros = 0

  // Mientras no tengamos 60 numeros binarios de la parte decimal, seguiremos multiplicando y recogiendo solo la parte entera.
  while(contadorCantidadNumeros <= 60){
    contadorCantidadNumeros++
    resultadoMultiplicacion = parteDecimal * 2
    parteDecimalBinario = parteDecimalBinario + parseInt(resultadoMultiplicacion)
    parteDecimal = (parseInt(resultadoMultiplicacion) - resultadoMultiplicacion) * (-1)
  }

  return parteDecimalBinario; // Devolvemos la parte decimal en binario.
}

function binarioCompleto (numeroDecimal) {
  numeroBinario = pasarBinarioEntera(numeroDecimal) + '.' + pasarBinarioDecimal(numeroDecimal)

  return numeroBinario
}

function pasarBinarioCientifica () { // Pasamos el binario obtenido a notación cientifica.

  var posicionUno = numeroBinario.indexOf('1'); // Guardamos la posicion del primer "1" del binario.
  var posicionPunto = numeroBinario.indexOf('.'); // Guardamos la posicion del primer "." del binario.
  var exponenteFinal = 0

  /*Si la parte entera del binario es 0, el binario cientifico será la concatenación del primer uno con el resto del binario.
  	El exponente será el numero de veces que hemos movido el punto, es decir, la posición del "1" menos la posición del "." */
  if (numeroBinario.substring(0, posicionPunto) == '0') {
    var inicio = numeroBinario.substring(posicionUno, posicionUno + 1)
    var final = '.' + numeroBinario.substring(posicionUno + 1, numeroBinario.length)
    binarioCientificio = inicio + final
    exponenteFinal = posicionUno - posicionPunto
  } else {

    /* En caso de que sea positiva, el binario cientifico será la concatenación desde el principio hasta la posicion del "1" y 
    	la posicion del "1" hasta el fina del binario, con posterior remplazamiento del "." por un string vacio.
    	El exponente será el numero de veces que hemos movido el punto, es decir, desde 1 a la posicion del "." con un bucle.*/

    var inicio = numeroBinario.substring(0, posicionUno)
    var final = numeroBinario.substring(posicionUno, numeroBinario.length)
    var definitivo = final.replace('.', '')
    binarioCientificio = inicio + '.' + definitivo

    for (var i = 1; i < posicionPunto;i++) {
      exponenteFinal = exponenteFinal + 1
    }
  }

  return exponenteFinal; // Devolvemos el exponente.
}

function ieee754aBinario (numeroDecimal) { // Por último teniendo todos los datos necesarios, pasamos el numero al estandar IEEE754

  binarioCompleto(numeroDecimal); // Llamamos a esta función, que a su vez llama a otras dos para obtener el numero binario completo.
  pasarBinarioCientifica(); // Pasamos ese numero a notación cientifica y lo guardamos en una variable declarada al principio.

  var numeroIEEE = ''
  var signo
  var exponente = pasarBinarioCientifica(numeroDecimal); // Para tener el exponente llamamos a esta función creada antes.
  // Para que la mantisa sean 23 caracteres, usamos substring  desde la 2º posicion del binario cientifico hasta la 25º.
  var mantisa = binarioCientificio.substring(2, 25)
  var binarioExponente = ''

  if (numeroDecimal >= 0) { // Para determinar el signo, tan simple como comprobar si el numero inicial es positivo o negativo.
    signo = '0'
  } else {
    signo = '1'
  }

  while(mantisa.length < 23){ // En caso de que la mantisa no llegue a 23 números, rellenaremos con "0" a la derecha hasta completarla.
    mantisa = mantisa + '0'
  }

  // En caso de que la parte entera sea 0, para obtener el binario del exponente se le restará a 127 el exponente, en caso contrario se suma.
  var comprobarSiCero = parseInt(numeroDecimal)

  if (comprobarSiCero == 0 || comprobarSiCero == 1) {
    binarioExponente = '0' + (pasarBinarioEntera(127 - exponente)).toString()
  } else {
    binarioExponente = (pasarBinarioEntera(127 + exponente)).toString()
  }

  // Por último se concatenan todos los resultados y tendriamos el numero convertido a IEEE754.
  numeroIEEE = signo + binarioExponente + mantisa

  return numeroIEEE
}
