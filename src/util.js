
export const min = (a, i) => !i || a < i ? a : i;
export const max = (a, i) => !i || a > i ? a : i;
export const exists = x => !!x;
export const sum = (a, i) => a + i;
export const avg = (l = []) => l.length > 0 ? l.reduce(sum, 0) / l.length : undefined;
export const median = (l = []) => {
    if (l.length === 0) {
        return undefined
    }
    else {
        const s = l.sort((a, b) => a - b);
        if (s.length % 2 === 0) {
            return (s[(s.length / 2) - 1] + s[s.length / 2]) / 2
        } else {
            return s[(s.length-1)/2]
        }
    }
};
