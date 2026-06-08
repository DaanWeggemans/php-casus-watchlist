export async function fileToBase64(file: File): Promise<string | null> {
    return new Promise(resolve => {
        const reader = new FileReader();
        reader.onerror = () => resolve(null);
        reader.onload = () => resolve(typeof(reader.result) == 'string' ? reader.result : null);
        reader.readAsDataURL(file);
    });
}