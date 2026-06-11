import { login } from './actions'

type Props = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export default async function LoginPage(props: Props) {
  const searchParams = await props.searchParams;
  const error = searchParams?.error as string | undefined;

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#fbf9f8]">
      <div className="w-full max-w-md rounded-lg border border-[#e4e2e1] bg-white p-8 shadow-sm">
        <h1 className="mb-6 text-center text-2xl font-bold text-[#00254d]">Gestão Conecta</h1>
        
        {error && (
          <div className="mb-4 rounded-md bg-[#ffdad6] p-3 text-sm text-[#93000a]">
            {error === 'unauthorized' 
              ? 'Acesso negado. Apenas servidores podem acessar.' 
              : 'E-mail ou senha inválidos.'}
          </div>
        )}

        <form className="flex flex-col gap-4" action={login}>
          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-[#434750]" htmlFor="email">
              E-mail corporativo
            </label>
            <input
              className="rounded-md border border-[#c3c6d1] p-2 text-sm text-[#1b1c1c] focus:border-[#345f99] focus:outline-none"
              id="email"
              name="email"
              type="email"
              required
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-[#434750]" htmlFor="password">
              Senha
            </label>
            <input
              className="rounded-md border border-[#c3c6d1] p-2 text-sm text-[#1b1c1c] focus:border-[#345f99] focus:outline-none"
              id="password"
              name="password"
              type="password"
              required
            />
          </div>
          <button
            type="submit"
            className="mt-4 rounded-md bg-[#003b73] py-2 text-sm font-semibold tracking-wide text-white transition-colors hover:bg-[#00254d]"
          >
            Entrar no Portal
          </button>
        </form>
      </div>
    </div>
  )
}
