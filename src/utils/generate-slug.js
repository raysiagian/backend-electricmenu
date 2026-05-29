export const generateShopSlugify = (text) => {

    return text.toLowerCase()
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9\s-]/g, '')  // hapus karakter spesial
        .replace(/\s+/g, '-')           // spasi jadi dash
        .replace(/-+/g, '-');           // hapus dash berulang

}

export const generateProductSlugify = (text) => {
    
    return text.toLowerCase()
        .trim()
        .replace(/\s+/g, "-")
        .replace(/[^\w-]/g, "")

}