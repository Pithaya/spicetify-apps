export async function wait(ms: number): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve, ms));
}
