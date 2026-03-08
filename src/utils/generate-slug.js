export const generateShopSlugify = (text) => {

    return text.toLowerCase()
        .trim()
        .replace(/\s+/g, "-")
        .replace(/[^\w-]/g, "")

}
