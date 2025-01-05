export interface JwtPayload {
    sub: number; // O id do usuário (geralmente a convenção é 'sub' para o campo 'subject')
    email: string;
    role: string; 
    // ... outras propriedades que você queira incluir no token, como 'name', 'roles', etc.
  }