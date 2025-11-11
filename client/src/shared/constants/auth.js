/**
 * Mock de usuario autenticado
 * TODO: Reemplazar con contexto de autenticación real cuando se implemente login
 */

// UUID del usuario logueado (para testing)
// Este debe ser el UUID de un usuario existente en la BD
export const CURRENT_USER_ID = "eae1bcaf-fe77-4bfc-a68c-11c3d54bf3d3";

export const getCurrentUserId = () => {
  return CURRENT_USER_ID;
};
