import { LoginForm } from "features/login/login-form";
import { Logo } from "shared/ui/symformer-logo";

export const AuthPage = () => {
    return (
        <div className="flex md:flex-row flex-col-reverse items-center text-white h-screen justify-center gap-4 md:gap-8 px-4">
            <div className="w-full md:w-2/3 flex md:items-center justify-center h-full">
                <div className="w-full max-w-[400px] flex flex-col items-start gap-8">
                    <div>
                        <h5 className="text-md">Войдите</h5>
                        <h1 className="text-2xl font-extrabold uppercase">Symformer</h1>
                    </div>
                    <LoginForm />
                </div>
            </div>
            <div className="pt-12 z-10 flex items-center justify-center mb-8 md:w-full md:bg-stone-900 md:h-full">
                <Logo className="md:w-1/3" />
            </div>
        </div>
    );
};
