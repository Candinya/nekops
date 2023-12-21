const runes = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

export const randomString = (len: number) => {
  const result = [];
  while (result.length < len) {
    result.push(runes.charAt(Math.floor(Math.random() * runes.length)));
  }
  return result.join("");
};
