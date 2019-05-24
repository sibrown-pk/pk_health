
export class DataManipulators {
    constructor() { }
    public static groupBy = (array, key) => {
        if (array.length > 0) {
            return array.reduce((acc, curr) => {
                (acc[curr[key]] = acc[curr[key]] || []).push(curr);
                return acc;
            }, {});
        } else {
            return null;
        }
    }
    public static toMatrix = (arr, width) => {
        return arr.reduce((rows, key, index) => (index % width === 0 ? rows.push([key])
            : rows[rows.length - 1].push(key)) && rows, []);
    }
    public static valuesPolyfill = function values(object) {
        return Object.keys(object).map(key => object[key]);
    }; // For IE11

    public static objectKeysToCamelCase = (item) => {
        if (!item) { return; }
        Object.keys(item).forEach((key: string) => {
            const oldkey = key;
            key = key.trim().split(' ').map((k, i) => ((i === 0 ? k.charAt(0).toLowerCase() : k.charAt(0).toUpperCase()) + k.substr(1).toLowerCase())).join('');
            Object.defineProperty(item, key, Object.getOwnPropertyDescriptor(item, oldkey));
            delete item[oldkey];
        });
        return item;
    }
    public static camelCaseToSentenceCase = (text: string) => {
        if (!text) { return; }
        text = text.replace(/([A-Z])/g, ' $1');
        text = text.charAt(0).toUpperCase() + text.slice(1);
        return text;
    }
    public static numberWithCommas(x) {
        return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    }
}

