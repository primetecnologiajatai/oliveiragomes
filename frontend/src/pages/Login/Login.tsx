import React, { useState } from "react";
import * as yup from "yup";
import { loginSchema } from "./LoginSchema"; // Só importa o schema, não o tipo
import "./Login.css";

// Define o tipo manualmente aqui mesmo
type LoginFormData = {
  email: string;
  senha: string;
};

const Login: React.FC = () => {
  // Estados para os campos do formulário
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");

  // Estados para validação
  const [errors, setErrors] = useState<Partial<LoginFormData>>({});
  const [touched, setTouched] = useState({
    email: false,
    senha: false,
  });

  // Estados de UI
  const [carregando, setCarregando] = useState(false);
  const [sucesso, setSucesso] = useState(false);
  const [erroGeral, setErroGeral] = useState("");

  // Função que valida um campo específico
  const validarCampo = async (campo: keyof LoginFormData, valor: string) => {
    try {
      const fieldSchema = yup.object({
        [campo]: loginSchema.fields[campo],
      });
      await fieldSchema.validate({ [campo]: valor });
      setErrors((prev) => ({ ...prev, [campo]: undefined }));
      return true;
    } catch (err) {
      if (err instanceof yup.ValidationError) {
        setErrors((prev) => ({ ...prev, [campo]: err.message }));
      }
      return false;
    }
  };

  // Função que valida o formulário inteiro
  const validarFormulario = async (): Promise<boolean> => {
    try {
      await loginSchema.validate({ email, senha }, { abortEarly: false });
      setErrors({});
      return true;
    } catch (err) {
      if (err instanceof yup.ValidationError) {
        const newErrors: Partial<LoginFormData> = {};
        err.inner.forEach((error) => {
          if (error.path) {
            newErrors[error.path as keyof LoginFormData] = error.message;
          }
        });
        setErrors(newErrors);
      }
      return false;
    }
  };

  // Quando o campo perde o foco (blur)
  const handleBlur = (campo: keyof LoginFormData, valor: string) => {
    setTouched((prev) => ({ ...prev, [campo]: true }));
    validarCampo(campo, valor);
  };

  // Quando o valor do campo muda
  const handleChange = (campo: keyof LoginFormData, valor: string) => {
    if (campo === "email") setEmail(valor);
    if (campo === "senha") setSenha(valor);

    if (touched[campo]) {
      validarCampo(campo, valor);
    }
  };

  // Submissão do formulário
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setCarregando(true);
    setErroGeral("");

    setTouched({ email: true, senha: true });

    const isValid = await validarFormulario();

    if (!isValid) {
      setCarregando(false);
      return;
    }

    setTimeout(() => {
      console.log("Login bem-sucedido:", { email, senha });
      setSucesso(true);
      setCarregando(false);
      setEmail("");
      setSenha("");
      setTimeout(() => setSucesso(false), 3000);
    }, 1500);
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="logo">
          <img
            src="https://www.oliveiragomesadvocacia.com.br/wp-content/themes/oliveira-gomes-2020/assets/images/logo-white.png"
            alt="Oliveira Gomes Advocacia"
            width={"100%"}
          />
        </div>

        <div id="content-login-oliveira">
          <h1>Oliveira Gomes Advocacia</h1>
          <p className="subtitle">Área de login</p>

          {sucesso && (
            <div className="success-message">
              ✅ Login realizado com sucesso!
            </div>
          )}

          {erroGeral && <div className="error-message">❌ {erroGeral}</div>}

          <form onSubmit={handleSubmit} noValidate>
            <div className="input-group">
              <label>E-mail</label>
              <input
                type="email"
                value={email}
                onChange={(e) => handleChange("email", e.target.value)}
                onBlur={(e) => handleBlur("email", e.target.value)}
                placeholder="seu@email.com"
                className={touched.email && errors.email ? "input-error" : ""}
              />
              {touched.email && errors.email && (
                <span className="error-text">{errors.email}</span>
              )}
            </div>

            <div className="input-group">
              <label>Senha</label>
              <input
                type="password"
                value={senha}
                onChange={(e) => handleChange("senha", e.target.value)}
                onBlur={(e) => handleBlur("senha", e.target.value)}
                placeholder="••••••••"
                className={touched.senha && errors.senha ? "input-error" : ""}
              />
              {touched.senha && errors.senha && (
                <span className="error-text">{errors.senha}</span>
              )}
            </div>

            <button type="submit" disabled={carregando}>
              {carregando ? "Entrando..." : "Entrar"}
            </button>

            <div className="register-link">
              Não tem uma conta? <a href="/cadastro">Cadastre-se</a>
            </div>

            <div className="forgot-link">
              <a href="/esqueci-senha">Esqueceu sua senha?</a>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
