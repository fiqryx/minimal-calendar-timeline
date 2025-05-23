import { cn } from "@/lib/utils"
import { Moon, Sun } from "lucide-react"
import { Github } from "@/components/internal/icons"
import { Button } from "@/components/ui/button"
import { useTheme } from "@/components/providers/theme-provider"

export function Hero({ className, ...props }: React.ComponentProps<'div'>) {
    const { theme, setTheme } = useTheme()

    return (
        <div {...props} className={cn('text-center', className)}>
            <h1 className="mb-4 text-5xl font-extrabold tracking-tight">
                Minimal Calendar Timeline
            </h1>
            <p className="mb-6 text-xl">
                Calendar timeline components with&nbsp;
                <a href="https://react.dev/" className="font-semibold hover:underline">React</a> &&nbsp;
                <a href="https://ui.shadcn.com/" className="font-semibold hover:underline">shadcn UI</a>.
            </p>
            <div className="flex flex-col justify-center gap-x-2 space-y-4 sm:flex-row sm:space-y-0">
                <Button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>
                    <Sun className="h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100 hidden dark:block" />
                    <Moon className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0 dark:hidden" />
                    {theme === "dark" ? "Light" : "Dark"}
                </Button>
                <a href="https://github.com/fiqryx/minimal-calendar-timeline" target="_blank">
                    <Button variant="outline">
                        <Github className="size-5" />
                        GitHub
                    </Button>
                </a>
            </div>
        </div>
    )
}