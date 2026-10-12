// User-facing server messages in the app's languages. The app sends its
// language in the Accept-Language header; Spanish is the default.
const messages = {
  allFieldsRequired: {
    es: 'Todos los campos son obligatorios.',
    en: 'All fields are required.',
    pt: 'Todos os campos são obrigatórios.',
  },
  nameRequired: {
    es: 'El nombre es obligatorio.',
    en: 'Name is required.',
    pt: 'O nome é obrigatório.',
  },
  usernameRequired: {
    es: 'El nombre de usuario es obligatorio.',
    en: 'Username is required.',
    pt: 'O nome de usuário é obrigatório.',
  },
  passwordRequired: {
    es: 'La contraseña es obligatoria.',
    en: 'Password is required.',
    pt: 'A senha é obrigatória.',
  },
  passwordTooShort: {
    es: 'La contraseña debe tener al menos 6 caracteres.',
    en: 'Password must be at least 6 characters.',
    pt: 'A senha deve ter pelo menos 6 caracteres.',
  },
  invalidRole: {
    es: 'Rol no válido.',
    en: 'Invalid role.',
    pt: 'Função inválida.',
  },
  emailTaken: {
    es: 'El correo {value} ya está registrado.',
    en: 'The email {value} is already registered.',
    pt: 'O e-mail {value} já está cadastrado.',
  },
  usernameTaken: {
    es: 'El usuario {value} ya está registrado.',
    en: 'The username {value} is already taken.',
    pt: 'O usuário {value} já está cadastrado.',
  },
  phoneTaken: {
    es: 'El teléfono {value} ya está registrado.',
    en: 'The phone {value} is already registered.',
    pt: 'O telefone {value} já está cadastrado.',
  },
  rucTaken: {
    es: 'El RUC {value} ya está registrado.',
    en: 'The RUC {value} is already registered.',
    pt: 'O RUC {value} já está cadastrado.',
  },
  companyCodeNotFound: {
    es: 'El código de empresa {value} no existe.',
    en: 'The company code {value} does not exist.',
    pt: 'O código de empresa {value} não existe.',
  },
  wrongCredentials: {
    es: 'Usuario o contraseña incorrectos.',
    en: 'Incorrect username or password.',
    pt: 'Usuário ou senha incorretos.',
  },
  serverError: {
    es: 'Error de servidor. Inténtalo de nuevo.',
    en: 'Server error. Please try again.',
    pt: 'Erro no servidor. Tente novamente.',
  },
}

export type MessageKey = keyof typeof messages

const lang = (req: any): 'es' | 'en' | 'pt' => {
  const header = String(req?.headers?.['accept-language'] ?? '').slice(0, 2).toLowerCase()
  return header === 'en' || header === 'pt' ? header : 'es'
}

export const tr = (req: any, key: MessageKey, value = '') =>
  messages[key][lang(req)].replace('{value}', value)
