export const Directions = {
  none: "none",
  top: "top",
  bottom: "bottom",
  left: "left",
  right: "right",

  inverse: function (direction) {
    return direction === Directions.top
      ? Directions.bottom
      : direction === Directions.bottom
        ? Directions.top
        : direction === Directions.left
          ? Directions.right
          : direction === Directions.right
            ? Directions.left
            : Directions.none;
  },

  left_neighbour: function (direction) {
    return direction === Directions.top
      ? Directions.left
      : direction === Directions.bottom
        ? Directions.right
        : direction === Directions.left
          ? Directions.bottom
          : direction === Directions.right
            ? Directions.top
            : Directions.none;
  },

  right_neighbour: function (direction) {
    return direction === Directions.top
      ? Directions.right
      : direction === Directions.bottom
        ? Directions.left
        : direction === Directions.left
          ? Directions.top
          : direction === Directions.right
            ? Directions.bottom
            : Directions.none;
  },
};
