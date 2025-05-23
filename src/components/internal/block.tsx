"use client"
import React, { forwardRef } from "react"
import { cn } from "@/lib/utils"

import { createPortal } from "react-dom"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { highlightCodeSync, type ShikiLang } from "@/lib/highlight-code"
import type { ImperativePanelHandle } from "react-resizable-panels"

import { ClipboardIcon, Monitor, Smartphone, Tablet } from "lucide-react"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable"

interface Block {
    source?: string
    code?: string
    className?: string
    lang?: ShikiLang
    component?: React.ElementType | React.LazyExoticComponent<() => React.JSX.Element>
}

export interface BlockPreviewProps extends
    React.ComponentProps<typeof Tabs> {
    label?: string
    block?: Block
    showPreviewCode?: boolean
    withIframe?: boolean
    classNames?: {
        wrapper?: string
    }
}

const BlockPreview = React.forwardRef<HTMLDivElement, BlockPreviewProps>(
    ({ label, block, showPreviewCode, className, classNames, withIframe, defaultValue, children, ...props }, ref) => {
        const Wrapper = withIframe ? BlockIFrame : 'div';
        const panelRef = React.useRef<ImperativePanelHandle>(null);

        return (
            <Tabs
                ref={ref}
                {...props}
                defaultValue={defaultValue ?? 'preview'}
                className={cn('relative grid w-full scroll-m-20', className)}
            >

                <div className="flex items-end gap-2">
                    <BlockLabel>
                        {label}
                    </BlockLabel>
                    <BlockToolbar
                        panelRef={panelRef}
                        showPreviewCode={
                            showPreviewCode && block?.code !== undefined
                        }
                    />
                </div>
                <TabsContent
                    value="preview"
                    className="relative after:absolute after:inset-0 after:right-3 after:z-0 after:rounded-lg after:bg-background after:border after:border-border"
                >
                    <ResizablePanelGroup direction="horizontal" className="relative z-10">
                        <ResizablePanel
                            ref={panelRef}
                            minSize={30}
                            defaultSize={100}
                            className={cn(
                                "relative rounded-lg border bg-background border-border",
                            )}
                        >
                            <Wrapper
                                className={cn(
                                    'chunk-mode relative z-20 w-full bg-background',
                                    classNames?.wrapper || 'min-h-[600px] xl:min-h-[800px]'
                                )}>
                                {block?.component ? (
                                    <block.component className={block.className} />
                                ) : children}
                            </Wrapper>
                        </ResizablePanel>
                        <ResizableHandle
                            className={cn(
                                "relative hidden w-3 bg-transparent p-0 after:absolute after:right-0 after:top-1/2 after:h-8 after:w-[6px] after:-translate-y-1/2 after:translate-x-[-1px] after:rounded-full after:bg-border after:transition-all hover:after:h-10 lg:block",
                            )}
                        />
                        <ResizablePanel defaultSize={0} minSize={0} />
                    </ResizablePanelGroup>
                </TabsContent>
                {showPreviewCode && block?.code && (
                    <TabsContent value="code" className="relative">
                        <Button
                            size="icon"
                            variant="outline"
                            onClick={() => {
                                if (block.code) {
                                    navigator.clipboard.writeText(block.code);
                                }
                            }}
                            className="absolute right-4 top-4 z-10 size-6 rounded-sm"
                        >
                            <ClipboardIcon className="size-3.5" />
                        </Button>
                        <div
                            data-rehype-pretty-code-fragment
                            dangerouslySetInnerHTML={{ __html: highlightCodeSync(block.code, block.lang) }}
                            className="w-full overflow-hidden rounded-md [&_pre]:my-0 [&_pre]:h-(--container-height) [&_pre]:overflow-auto [&_pre]:whitespace-break-spaces [&_pre]:p-6 [&_pre]:font-mono [&_pre]:text-sm [&_pre]:leading-relaxed"
                        />
                    </TabsContent>
                )}
            </Tabs>
        )
    }
)
BlockPreview.displayName = "BlockPreview"


const BlockLabel = React.forwardRef<
    HTMLHeadingElement,
    React.HtmlHTMLAttributes<HTMLHeadingElement>
>(
    ({ className, ...props }, ref) => (
        <h3
            {...props}
            ref={ref}
            className={cn('text-sm font-semibold', className)}
        />
    )
)
BlockLabel.displayName = "BlockLabel"

export interface BlockToolbarProps extends
    React.HtmlHTMLAttributes<HTMLDivElement> {
    panelRef: React.RefObject<ImperativePanelHandle | null>
    showPreviewCode?: boolean
}

const BlockToolbar = React.forwardRef<HTMLDivElement, BlockToolbarProps>(
    ({ panelRef, showPreviewCode, className, ...props }, ref) => {
        return (
            <div
                ref={ref}
                {...props}
                className={cn('ml-auto flex items-center gap-2', className)}
            >
                {showPreviewCode && (
                    <div className="flex items-center gap-2">
                        <TabsList className="hidden h-7 rounded-md p-0 px-[calc(--spacing(1)-2px)] py-[--spacing(1)] sm:flex">
                            <TabsTrigger
                                value="preview"
                                className="h-[1.45rem] rounded-sm px-2 text-xs"
                            >
                                Preview
                            </TabsTrigger>
                            <TabsTrigger
                                value="code"
                                className="h-[1.45rem] rounded-sm px-2 text-xs"
                            >
                                Code
                            </TabsTrigger>
                        </TabsList>
                        <Separator orientation="vertical" className="mx-2 hidden h-4 md:flex" />
                    </div>
                )}
                <div className="flex items-center gap-2 md:pr-[14px]">
                    <div className="hidden h-[28px] items-center gap-1.5 rounded-md border p-[2px] shadow-xs lg:flex">
                        <ToggleGroup
                            type="single"
                            defaultValue="100"
                            onValueChange={(value) => {
                                if (panelRef.current) {
                                    panelRef.current.resize(parseInt(value))
                                }
                            }}
                        >
                            <ToggleGroupItem
                                value="100"
                                className="h-[22px] w-[22px] rounded-sm p-0"
                            >
                                <Monitor className="h-3.5 w-3.5" />
                            </ToggleGroupItem>
                            <ToggleGroupItem
                                value="60"
                                className="h-[22px] w-[22px] rounded-sm p-0"
                            >
                                <Tablet className="h-3.5 w-3.5" />
                            </ToggleGroupItem>
                            <ToggleGroupItem
                                value="30"
                                className="h-[22px] w-[22px] rounded-sm p-0"
                            >
                                <Smartphone className="h-3.5 w-3.5" />
                            </ToggleGroupItem>
                        </ToggleGroup>
                    </div>
                </div>
            </div>
        )
    }
)
BlockToolbar.displayName = "BlockToolbar"

const BlockIFrame = React.forwardRef<
    HTMLIFrameElement,
    React.HtmlHTMLAttributes<HTMLIFrameElement>
>((props, ref) => {
    const iframeRef = React.useRef<HTMLIFrameElement | null>(null);
    const [mount, setMount] = React.useState<HTMLElement | null>(null);

    React.useEffect(() => {
        if (!iframeRef.current) return;

        const iframeDocument = iframeRef.current.contentWindow?.document;
        if (!iframeDocument) return;

        Array.from(document.querySelectorAll('link[rel="stylesheet"], style')).forEach((node) => {
            iframeDocument.head.appendChild(node.cloneNode(true));
        });

        iframeDocument.documentElement.className = document.documentElement.className;
        iframeDocument.body.className = document.body.className;

        const observer = new MutationObserver(() => {
            iframeDocument.documentElement.className = document.documentElement.className;
            iframeDocument.body.className = document.body.className;
        });

        const options = {
            attributes: true,
            attributeFilter: ["class"],
        }

        observer.observe(document.documentElement, options);
        observer.observe(document.body, options);

        setMount(iframeDocument.body);

        return () => observer.disconnect();
    }, []);

    return (
        <iframe
            {...props}
            ref={(el) => {
                iframeRef.current = el;
                if (typeof ref === "function") ref(el);
                else if (ref) (ref as React.RefObject<HTMLIFrameElement | null>).current = el;
            }}
        >
            {mount && createPortal(props.children, mount)}
        </iframe>
    );
});
BlockIFrame.displayName = "BlockIFrame";

interface BlockCodeProps extends
    React.ComponentPropsWithRef<'div'> {
    code: string
    lang?: ShikiLang
    full?: boolean
}

const BlockCode = forwardRef<HTMLDivElement, BlockCodeProps>(
    ({ code, full, lang, className, ...props }, ref) => {
        const [expanded, setExpanded] = React.useState(full);

        return (
            <div
                ref={ref}
                {...props}
                className={cn('relative flex-1 outline-none', className)}
            >
                <Button
                    size="icon"
                    variant="outline"
                    onClick={() => navigator.clipboard.writeText(code)}
                    className="absolute right-4 top-4 z-10 size-6 rounded-sm"
                >
                    <ClipboardIcon className="size-3.5" />
                </Button>
                <div
                    className={cn(
                        'w-full overflow-hidden rounded-md relative',
                        '[&_pre]:my-0 [&_pre]:overflow-auto [&_pre]:whitespace-break-spaces [&_pre]:p-6 [&_pre]:font-mono [&_pre]:text-sm [&_pre]:leading-relaxed',
                        !expanded && '[&_pre]:max-h-[200px] [&_pre]:overflow-hidden',
                        full && '[&_pre]:max-h-full'
                    )}
                >
                    <div
                        data-rehype-pretty-code-fragment
                        dangerouslySetInnerHTML={{ __html: highlightCodeSync(code, lang) }}
                    />
                    {!full && (
                        <div className="absolute bottom-0 left-0 right-0 flex justify-center z-10 pointer-events-none">
                            <div className={cn(
                                'w-full h-60 absolute bottom-0',
                                !expanded && 'bg-gradient-to-t from-accent/70 to-transparent'
                            )} />
                            <Button
                                size="sm"
                                variant="secondary"
                                onClick={() => setExpanded(!expanded)}
                                className="text-xs my-4 pointer-events-auto z-20"
                            >
                                {expanded ? 'Show less' : 'Show more'}
                            </Button>
                        </div>
                    )}
                </div>
            </div>
        )
    }
);
BlockCode.displayName = "BlockCode";


export {
    BlockLabel,
    BlockPreview,
    BlockToolbar,
    BlockIFrame,
    BlockCode,
}