export const strapiErrorTranslator = (
  errorMessage: string,
  errorCode: number
) => {
  // if (error.response && error.response.data && error.response.data.error) {
  //   error = error.response.data.error;
  // } else {
  //   console.log(error);
  // }

  // const errorMessage = error.message;
  // const errorCode = error.status;

  const response = {
    msg: "Se ha producido un error",
    originalMsg: errorMessage,
    status: errorCode,
    field: "",
    internal: 0,
  };

  if (errorCode === 400) {
    if (errorMessage.includes("already taken")) {
      response.msg = `El "${errorMessage.split(" ")[0]}" ya esta en uso`;
      response.field = errorMessage?.split(" ")?.[0];
      response.internal = 1;
    }
    if (errorMessage.includes("This attribute must be unique")) {
      response.msg = `Uno de los valores ingresados ya esta en uso`;
      response.internal = 2;
    }
    if (errorMessage.includes("must be defined")) {
      response.msg = `El campo "${errorMessage.split(" ")[0]}" es requerido`;
      response.field = errorMessage?.split(" ")?.[0];
      response.internal = 3;
    }
    if (errorMessage.includes("must be at least")) {
      response.msg = `El campo "${errorMessage.split(" ")[0]}" es muy corto`;
      response.field = errorMessage?.split(" ")?.[0];
      response.internal = 4;
    }
  }

  if (response.internal === 0) {
    console.log("Error no manejado", response);
  }

  return response;
};
