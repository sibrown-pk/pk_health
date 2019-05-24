
export const scrollToEl = (element: HTMLElement) => {
    setTimeout(() => {
        element.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'center' });
    }, 500);
};

