import jwt from 'npm:jsonwebtoken@9.0.2'

const secret = () => Deno.env.get('SECRETORPRIVATEKEY')!

export const generarJWT = (uid = '') => {
  return new Promise<string>((resolve, reject) => {
    jwt.sign({ uid }, secret(), { expiresIn: '16h' }, (err: any, token: any) => {
      if (err) {
        console.log(err)
        reject('No se pudo generar el JWT')
      } else {
        resolve(token as string)
      }
    })
  })
}

export const verificarJWT = (token: string) => {
  return new Promise<any>((resolve, reject) => {
    jwt.verify(token, secret(), (err: any, decoded: any) => {
      if (err) {
        reject('Token no válido')
      } else {
        resolve(decoded)
      }
    })
  })
}

export const verifySync = (token: string): any => jwt.verify(token, secret())
