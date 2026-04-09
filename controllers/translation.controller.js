const { findUser } = require('../helpers/findUser')
const { hourGenerate } = require('../helpers/hourGenerate')
const Translation = require('../models/translation')
const Usuario = require('../models/user')
const Chat = require('../models/chats');


const translationPOST = async(req, res = response) => {
  
  const { code } = req.body
  const JWT = req.headers.access_token
  const user = await findUser(JWT)

  const data = {
    code,
    chart: user.name,
    create_at: hourGenerate(),
    turist_name: user.name,
    turist_id: user._id,
    turist_IMG: user.profile_img
  }

  try {

    const translation = await new Translation( data )
    await translation.save()
    return res.json(translation)

    
  } catch (error) {
    console.log(error)
    res.status(500).json({
      msg: 'Error de Servidor'
    })
  }
}

const finishTranslate = async (req, res = response) => {
  const { id_translation } = req.body;

  try {
    // Actualizar el estado del traslado a "RESOLVED"
    const updatedTranslation = await Translation.findByIdAndUpdate(
      id_translation,
      { state: "RESOLVED" },
      { new: true }
    );

    if (!updatedTranslation) {
      return res.status(404).json({
        msg: 'Traslado no encontrado'
      });
    }

    res.json(updatedTranslation);
  } catch (error) {
    res.status(500).json({
      msg: 'Error al actualizar el estado del traslado',
      error
    });
  }
};

const acceptTourist = async (req, res) => {
  const { turist_id, transfer_id, origin, destination, date, hour, id_translation } = req.body;

  // Validar la existencia de turista y trasladista
  const turistValidation = await Usuario.findOne({ _id: turist_id, role: "TURIST" });
  const transferValidation = await Usuario.findOne({ _id: transfer_id, role: "OPERATOR" });
  

  if (!turistValidation || !transferValidation) {
    return res.status(400).json({
      msg: 'El Turista o el Trasladista no existen'
    });
  }

  try {
    // Crear un nuevo chat para este traslado
    const newChat = new Chat({
      turist_id,
      transfer_id
    });
    const savedChat = await newChat.save();

    // Actualizar el traslado con el ID del nuevo chat
    const data = {
      turist_id,
      transfer_id,
      origin,
      destination,
      date,
      hour,
      state: "PROCESS",
      operator_IMG: transferValidation.profile_img,
      chat_Id: savedChat._id // Asignar el ID del chat creado al traslado
    };

    console.log(data)


    const translation = await Translation.findByIdAndUpdate(id_translation, data, { new: true });
   
    res.json(translation);
  } catch (error) {
    res.status(500).json({
      msg: 'Error al procesar la solicitud',
      error
    });
  }
};


const getCompanies = async(req, res = response) => {
  const { type } = req.params; 
  
  const companies = await Usuario.find( { role: "COMPANY", type_company: type }, { uid: 1, code: 1, name: 1, type_company: 1  } );
  res.json( { companies } );
};

const getMyRequest = async(req, res = response) => {
  const JWT = req.headers.access_token
  const user = await findUser(JWT)
  
  const turistPending = await Translation.find( { code: user.code, state: "PENDING" } );
  const count = turistPending.length;

  res.json( { 
    turistPending,
    count 
  } );

};

const getMyTranslations = async(req, res) => {
  const JWT = req.headers.access_token;
  const user = await findUser(JWT);

  if (user) {
    const query = user.role === "OPERATOR" ?
                  { transfer_id: user._id, state: "PROCESS" } :
                  { turist_id: user._id, state: "PROCESS" };

    const translations = await Translation.find(query);

    // Convertir la fecha actual en un objeto Date
    const now = new Date();
    
    // Función para convertir la fecha del traslado a un objeto Date
    const parseDate = (dateStr, hourStr) => {
      const [day, month, year] = dateStr.split('/');
      const date = new Date(`${month}/${day}/${year} ${hourStr}:00`);
      return date;
    };

    // Encontrar el traslado más cercano que aún no ha ocurrido
    let closestTranslation = null;
    let minDiff = Infinity;
    translations.forEach(translation => {
      const translationDate = parseDate(translation.date, translation.hour);
      const diff = translationDate - now;
      if (diff > 0 && diff < minDiff) {
        closestTranslation = translation;
        minDiff = diff;
      }
    });

    // Agregar el campo `enCurso` al traslado más cercano
    const updatedTranslations = translations.map(translation => {
      const isClosest = translation === closestTranslation;
      return { ...translation._doc, enCurso: isClosest };
    });

    res.json({
      translations: updatedTranslations,
      count: updatedTranslations.length
    });

  } else {
    res.status(404).send('User not found');
  }
};

const editTranslation = async(req, res = response) => {
  let { id_translation, chart, operator_IMG, turist_IMG } = req.body

  const datosActualizados = {
    ...(chart && {chart}),
    ...(operator_IMG && {operator_IMG}),
    ...(turist_IMG && {turist_IMG}),
    ...(operator_IMG && {operator_IMG}),
  };

  try {
    const translate = await Translation.findByIdAndUpdate(id_translation, datosActualizados, { new: true });
    res.json(translate);
  } catch (error) {
    res.status(500).json({
      msg: 'Error al actualizar Traslado',
      error
    });
  }

}

const getMyHistory = async(req, res = response) => {
  const JWT = req.headers.access_token
  const user = await findUser(JWT)
  
  const history = await Translation.find( { code: user.code } );
  const count = history.length;

  res.json( { 
    history,
    count 
  } );

};

const getMyTuristProcess = async(req, res = response) => {
  const JWT = req.headers.access_token
  const user = await findUser(JWT)
  
  const turistProgress = await Translation.find( { code: user.code, state: "PROCESS" } );
  const count = turistProgress.length;

  res.json( { 
    turistProgress,
    count 
  } );

};

const getMyTranslate = async(req, res = response) => {
  const { id } = req.params;
  const turistProgress = await Translation.find( { _id: id  } );
 
  res.json( { 
    turistProgress
  } );

};


module.exports = {
  translationPOST,
  getCompanies,
  getMyRequest,
  acceptTourist,
  getMyTranslations,
  editTranslation,
  getMyHistory,
  getMyTuristProcess,
  getMyTranslate,
  finishTranslate
}