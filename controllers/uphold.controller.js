const { findUser } = require('../helpers/findUser')
const Translation = require('../models/translation')
const Usuario = require('../models/user')
const bodyParser = require('body-parser');
const cloudinary = require('../cloudinary');

const upholdImage = async(req, res = response) => {
  const JWT = req.headers.access_token
  const user = await findUser(JWT)
  
  try {
    const { image } = req.body; 

    // Opción con async/await
    const result = await cloudinary.uploader.upload(image, {
      folder: "profile" 
    });

    const userImage = await Usuario.findByIdAndUpdate(user._id, { profile_img: result.url }, { new: true });

    res.json(userImage);

  } catch (error) {
    res.status(500).send({ message: 'Error al subir la imagen', error });
  }

};
const editUpholdImage = async(req, res = response) => {
  const JWT = req.headers.access_token;
  const user = await findUser(JWT);
  
  try {
    const { image, id_translation } = req.body;

    const result = await cloudinary.uploader.upload(image, {
      folder: "profile" 
    });

    if (user.role === "TURIST") {
      const imgTranslate = await Translation.findByIdAndUpdate(id_translation, { turist_IMG: result.url }, { new: true });
      return res.json(imgTranslate);  // Agrega return para evitar ejecución posterior
    } else if (user.role === "OPERATOR") {
      const imgTranslate = await Translation.findByIdAndUpdate(id_translation, { operator_IMG: result.url }, { new: true });
      return res.json(imgTranslate);  // Agrega return para evitar ejecución posterior
    }

    return res.status(400).send({ message: 'ROL inválido' });  // Usa return aquí también

  } catch (error) {
    console.error(error);  // Mejor manejo de logging
    return res.status(500).send({ message: 'Error al subir la imagen', error: error.toString() });  // Usa error.toString() para una mejor descripción del error
  }
};

module.exports = {
  upholdImage,
  editUpholdImage
}