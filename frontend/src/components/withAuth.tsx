import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

const withAuth = (WrappedComponent: any, allowedRoles: string[] = []) => {
  const AuthenticatedComponent = (props: any) => {
    const router = useRouter();
    const [verified, setVerified] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem('token');
        const userRole = localStorage.getItem('userRole') || '';
    
        if (!token) {
          router.replace('/login');
        } else {
          // Aqui você pode adicionar uma verificação de validade do token, se necessário
          // e também verificar a role do usuário
          if (allowedRoles.length > 0 && !allowedRoles.includes(userRole)) {
            // Usuário não tem permissão
            router.replace('/'); // Redireciona para a home, por exemplo
          } else {
            setVerified(true);
          }
        }
      }, [router]);

    if (!verified) {
      return null; // Ou um componente de carregamento, se preferir
    }

    return <WrappedComponent {...props} />;
  };

  return AuthenticatedComponent;
};

export default withAuth;