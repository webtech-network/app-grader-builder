import React, { useState } from "react";
import { ArrowLeft, Mail, CheckCircle } from "lucide-react";
import { Link } from "react-router-dom";

const PasswordResetPage: React.FC = () => {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // logica de envio de email de recuperacao
    console.log("Reset password attempt:", { email });
    setIsSubmitted(true);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-900 p-4">
      <div className="w-full max-w-md space-y-8 rounded-xl bg-gray-800 p-8 shadow-lg border border-gray-700">
        <Link
          to="/login"
          className="inline-flex items-center text-sm text-indigo-400 hover:text-indigo-300 transition-colors mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Voltar para login
        </Link>

        <div className="text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-indigo-600 shadow-md">
            <Mail className="h-6 w-6 text-white" />
          </div>
          <h2 className="mt-6 text-3xl font-bold tracking-tight text-white">
            Recuperar Senha
          </h2>
          <p className="mt-2 text-sm text-gray-400">
            {isSubmitted
              ? "Verifique seu email"
              : "Digite seu email para receber um link de recuperação"}
          </p>
        </div>

        {!isSubmitted ? (
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div>
              <label className="text-sm font-medium text-gray-300">Email</label>
              <input
                type="email"
                required
                className="mt-1 block w-full rounded-md border border-gray-600 bg-gray-700 px-3 py-2 text-white placeholder-gray-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 sm:text-sm transition-all"
                placeholder="seu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 px-4 rounded-lg font-semibold text-white bg-indigo-600 hover:bg-indigo-700 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5"
            >
              Enviar Link de Recuperação
            </button>
          </form>
        ) : (
          <div className="mt-8 space-y-6">
            <div className="flex flex-col items-center justify-center space-y-4">
              <CheckCircle className="h-16 w-16 text-green-500" />
              <p className="text-center text-gray-300">
                Enviamos um link de recuperação para <span className="font-semibold">{email}</span>
              </p>
              <p className="text-center text-sm text-gray-400">
                Verifique sua caixa de entrada e clique no link para redefinir sua senha.
              </p>
            </div>

            <button
              onClick={() => {
                setEmail("");
                setIsSubmitted(false);
              }}
              className="w-full py-3 px-4 rounded-lg font-semibold text-white bg-indigo-600 hover:bg-indigo-700 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5"
            >
              Enviar outro email
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PasswordResetPage;
