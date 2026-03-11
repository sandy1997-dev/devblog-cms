export function buildMDXFile(fm: Record<string, unknown>, content: string): string {
    const lines = ["---"];
    const addField = (key: string, val: unknown) => {
        if (val === undefined || val === null || val === "") return;
        if (typeof val === "string") lines.push(`${key}: "${val.replace(/"/g, "'")}"`);
        else if (typeof val === "boolean") lines.push(`${key}: ${val}`);
        else if (typeof val === "number") lines.push(`${key}: ${val}`);
        else if (Array.isArray(val) && val.length > 0) {
            lines.push(`${key}:`);
            val.forEach((v) => lines.push(`  - "${String(v).replace(/"/g, "'")}"`));
        }
    };
    addField("title", fm.title); addField("description", fm.description);
    addField("date", fm.date); addField("updatedAt", fm.updatedAt);
    addField("author", fm.author); addField("authorBio", fm.authorBio);
    addField("authorGithub", fm.authorGithub); addField("authorTwitter", fm.authorTwitter);
    addField("tags", fm.tags); addField("series", fm.series);
    addField("seriesOrder", fm.seriesOrder); addField("image", fm.image);
    addField("imageAlt", fm.imageAlt); addField("featured", fm.featured);
    addField("draft", fm.draft); addField("toc", fm.toc);
    lines.push("---"); lines.push(""); lines.push(content);
    return lines.join("\n");
}