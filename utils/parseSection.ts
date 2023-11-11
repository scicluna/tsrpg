// Helper function to parse sections
export function parseSection(content: string, section: string): string {
    return content.split(`## ${section}:`)[1]?.split("##")[0].trim() || "";
}