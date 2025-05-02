//
import React, { createContext, useState } from 'react';

export const AuthContext = createContext({
  isUser: null,
  setUser: () => {},
});

export const AuthProvider = ({ children }) => {

  const [ isUser, setUser] = useState(null);

  return (
    <AuthContext.Provider value={{ isUser, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};
//isUser es la información que proporciona la autenticación de firebase la cual utilizamos para obtener los datos de correo y en un futuro la foto de perfil
//UserData es la información que se obtiene de la base de datos de mongo la cual utilizamos para obtener los datos de nombre, apellido, etc.

//Este contexto se usa para saber de forma global si hay un usuario autenticado y para establecer si un usuario está autenticado. 
//También se usa para obtener el objeto usuario y para establecer el objeto usuario.