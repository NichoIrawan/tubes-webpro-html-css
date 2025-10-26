function OnCardClicked(clickedCard) {
  const cardList = document.getElementById("ongoing-project-list").children;
  const indicatorList = document.getElementById(
    "ongoing-project-list-indicator"
  ).children;

  for (i = 0; i < cardList.length; i++) {
    cardList[i].className = "project-card";
    indicatorList[i].className = "indicator";

    if (cardList[i] == clickedCard) {
      clickedCard.className = "project-card active";
      indicatorList[i].className = "indicator active";
    }
  }
}
