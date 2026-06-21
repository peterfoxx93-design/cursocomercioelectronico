export const QUORUM_TARGET = Number(process.env.QUORUM_TARGET) || 30;

export const CURSO = {
  nombre: "Comercio Electrónico",
  profesor: "Randy Bautista",
  institucion: "INFOTEP",
  pais: "República Dominicana",
} as const;

export const COMPROMISO_TEXT =
  "Declaro que estoy de acuerdo en completar el curso en su totalidad y no retirarme luego de iniciado.";

export const MENSAJES = {
  confirmacionRegistro:
    "Tu interés ha sido registrado. Te contactaremos cuando se complete el quórum.",
  quorumIncompleto: "Aún no se completa el quórum",
  quorumCompleto: "Quórum completado",
  quorumCompletoDescripcion:
    "¡Hemos alcanzado el quórum! Pronto nos pondremos en contacto contigo para iniciar el curso.",
  formularioDeshabilitado:
    "El quórum ya está completo. Gracias por tu interés.",
} as const;
