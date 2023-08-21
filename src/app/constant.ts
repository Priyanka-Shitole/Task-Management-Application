export const PERCENT_MASK = {
    mask: 'VALUE%',
    lazy: true,  // make placeholder always visible

    blocks: {
        VALUE: {
            mask: Number,
        },
    }
}