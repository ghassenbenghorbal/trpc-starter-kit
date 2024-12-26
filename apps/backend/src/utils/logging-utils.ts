export const isUserInteraction = (path: string) => {
    return path.split(".")[1].includes("findOne")
}