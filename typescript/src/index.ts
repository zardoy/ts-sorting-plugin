import type {} from 'typescript/lib/tsserverlibrary'

export = function () {
    return {
        create(info: ts.server.PluginCreateInfo) {
            const proxy: ts.LanguageService = Object.create(null)

            for (const k of Object.keys(info.languageService)) {
                const x = info.languageService[k]!
                //@ts-ignore
                proxy[k] = (...args: Array<Record<string, unknown>>) => x.apply(info.languageService, args)
            }

            proxy.getCompletionsAtPosition = (fileName, position, options) => {
                const prior = info.languageService.getCompletionsAtPosition(fileName, position, options)
                if (!prior) return

                prior.entries = prior.entries.map((entry, index) => ({ ...entry, sortText: `${entry.sortText ?? ''}${index}` }))
                return prior
            }

            return proxy
        },
        onConfigurationChanged() {},
    }
}
