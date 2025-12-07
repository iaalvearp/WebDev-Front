"use client"

import { useEffect, useState } from "react"
import { Spinner } from "@/shared/components/ui/spinner"

export function GlobalLoader() {
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        setLoading(true)
        const timer = setTimeout(() => {
            setLoading(false)
        }, 1500)
        return () => clearTimeout(timer)
    }, [])

    if (!loading) return null

    return (
        <>
            <style dangerouslySetInnerHTML={{
                __html: `
                .global-loader-bg {
                    background-color: #FFFFFF;
                }
                html.dark .global-loader-bg {
                    background-color: hsl(220, 25%, 6%) !important;
                }
            `}} />

            <div className="global-loader-bg fixed inset-0 z-[9999] flex items-center justify-center h-screen w-screen transition-colors duration-300">
                <div className="flex flex-col items-center gap-4">
                    <Spinner
                        variant="bars"
                        className="h-24 w-24"
                        style={{ color: '#F5B041' }}
                    />
                </div>
            </div>
        </>
    )
}
