import * as yup from "yup";

// Define as regras de validação para o formulário de login
export const loginSchema = yup.object().shape({
  email: yup
    .string()
    .email("Digite um e-mail válido")
    .required("O e-mail é obrigatório"),

  senha: yup
    .string()
    .min(6, "A senha deve ter no mínimo 6 caracteres")
    .required("A senha é obrigatória"),
});

// Tipo inferido a partir do schema (para TypeScript)
export type LoginFormData = {
  email: string;
  senha: string;
};
