export function stringAvatar(name) {
  return {
    sx: {
      backgroundColor: getRandomColor(),
    },
    children: `${name.split(" ")[0][0]}${name.split(" ")[1][0]}`,
  };
}
export function getRandomColor() {
  const colors = [
    "#bee5b0",
    "#b0e5cf",
    "#b0cde5",
    "#c0b0e5",
    "#e5b0dc",
    "#e5b1b0",
    "#e5deb0",
  ];
  const color = colors[Math.floor(Math.random() * colors.length)];
  console.log("Generated color:", color);
  return color;
}
