export default function getGameKeyFromLocation(): string | undefined {
  const path = window.location.pathname;
  const gameKey = path.split("/")[2];
  const gameKeyIsInvalid = !gameKey || gameKey.length !== 6;
  if (gameKeyIsInvalid) {
    return undefined;
  } else {
    return gameKey;
  }
}
