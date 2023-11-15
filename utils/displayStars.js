import { AntDesign } from "@expo/vector-icons";

export const displayStars = (rate) => {
  const tab = [];

  for (let i = 1; i <= 5; i++) {
    if (i <= rate) {
      tab.push(<AntDesign name="star" size={24} color="yellow" key={i} />);
    } else {
      tab.push(<AntDesign name="staro" size={24} color="yellow" key={i} />);
    }
  }

  return tab;
};
