import { useAuth } from "app/providers/auth/auth-provider";
import { authConfig } from "shared/auth-config";
import { useForm } from "react-hook-form";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "shared/ui/form";
import { Input } from "shared/ui/input";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "shared/ui/button";
import { useNavigate } from "react-router-dom";

const formSchema = z.object({
    username: z.string(),
    password: z.string(),
});

export const LoginForm = () => {
    const navigate = useNavigate();
    const { login: onLogin } = useAuth();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            username: "",
            password: "",
        },
    });

    const onSubmit = (values: z.infer<typeof formSchema>) => {
        if (values.username === authConfig.username && values.password === authConfig.password) {
            localStorage.setItem("user", values.username);
            onLogin(values.username);
            navigate("/music-generator");
        } else {
            form.setError("root", { message: "Неверное имя пользователя или пароль." });
        }
    };

    return (
        <Form {...form}>
            <form autoComplete="new-password" onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 w-full border rounded-xl p-6">
                <FormField
                    control={form.control}
                    name="username"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Логин</FormLabel>
                            <FormControl>
                                <Input autoComplete="new-password" type="text" placeholder="Введите логин" {...field} className="p-3" />
                            </FormControl>
                            <FormMessage className="text-red-600 text-xs" />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Пароль</FormLabel>
                            <FormControl>
                                <Input autoComplete="new-password" type="password" placeholder="*******" {...field} className="p-3" />
                            </FormControl>
                            <FormMessage className="text-red-600 text-xs" />
                        </FormItem>
                    )}
                />
                {form.formState.errors.root && (
                    <div className="text-red-600 text-xs">{form.formState.errors.root.message}</div>
                )}
                <Button className="w-full" size="lg" variant="secondary" type="submit">
                    Войти
                </Button>
            </form>
        </Form>
    );
};
