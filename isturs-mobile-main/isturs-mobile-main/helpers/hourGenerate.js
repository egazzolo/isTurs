const moment = require('moment-timezone');

function hourGenerate() {
  // Define la zona horaria de Lima, Perú
  const zonaHorariaLima = 'America/Lima';
  
  // Obtiene la fecha y hora actual en la zona horaria de Lima
  const fechaHoraLima = moment().tz(zonaHorariaLima).format('YYYY-MM-DD HH:mm:ss');
  
  return fechaHoraLima;
}

module.exports = {
  hourGenerate
};
