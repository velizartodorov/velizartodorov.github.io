export function isMinimalMode(): boolean {
    return process.env.MINIMAL_MODE === 'true';
}
