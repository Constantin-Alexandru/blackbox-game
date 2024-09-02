Object.defineProperty(String.prototype, "capitalize", {
  value: function () {
    return this.charAt(0).toUpperCase() + this.slice(1);
  },
  enumerable: false,
});

Object.defineProperty(Array.prototype, "intersection", {
  value: function (other_array) {
    return this.filter((value) => {
      return (
        other_array.filter((_value) => {
          return JSON.stringify(_value) === JSON.stringify(value);
        }).length > 0
      );
    });
  },
});

Object.defineProperty(Array.prototype, "difference", {
  value: function (other_array) {
    return this.filter((value) => {
      return (
        other_array.filter(
          (_value) => JSON.stringify(_value) === JSON.stringify(value),
        ).length === 0
      );
    });
  },
});
