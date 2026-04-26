import 'next-auth'

declare module 'next-auth' {
  interface Session {
    user: {
      id: string
      email: string
      name: string
      role: string
      turno?: string
      dni?: string
      telefono?: string
    }
  }
  interface User {
    role: string
    turno?: string
    dni?: string
    telefono?: string
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    role: string
    id: string
    turno?: string
    dni?: string
    telefono?: string
  }
}
