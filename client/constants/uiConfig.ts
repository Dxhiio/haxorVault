// UI Configuration for Card Sizes and Dimensions
// Uncomment the section you want to use and comment out the others.

export const CARD_CONFIG = {
    // ========================================================================
    // OPTION 1: COMPACT (High Density)
    // Best for viewing many machines at once.
    // ========================================================================
    // gridCols: "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6",
    // imageHeight: "h-32", // 8rem / 128px
    // containerClass: "max-w-[98%]", // Wider container for more items

    // ========================================================================
    // OPTION 2: STANDARD (Balanced) - DEFAULT
    // Good balance between visibility and density.
    // ========================================================================
    gridCols: "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5",
    imageHeight: "h-48", // 12rem / 192px
    containerClass: "w-[95%]",

    // ========================================================================
    // OPTION 3: LARGE (Showcase)
    // Best for showcasing artwork and details.
    // ========================================================================
    // gridCols: "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4",
    // imageHeight: "h-64", // 16rem / 256px
    // containerClass: "max-w-7xl",

    // ========================================================================
    // OPTION 4: CINEMATIC (Ultra Large)
    // Very large cards, good for hero sections or featured lists.
    // ========================================================================
    // gridCols: "grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3",
    // imageHeight: "h-80", // 20rem / 320px
    // containerClass: "max-w-6xl",
};
