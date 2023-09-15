import React from "react";
import ReactDOM from "react-dom/client";
import { useEffect, useState } from "react";
import { CountdownCircleTimer } from "react-countdown-circle-timer";
import { useReward } from "react-rewards";
const root = ReactDOM.createRoot(document.getElementById("root"));
const checkWord = require("check-if-word"),
  validWords = checkWord("en");
function App() {
  const scoreThreshold = 20;
  const { reward: confettiReward } = useReward("confettiReward", "confetti", {
    lifetime: 5000,
    spread: 200,
    elementCount: 500,
  });
  const { reward: emojiReward } = useReward("emojiReward", "emoji", {
    lifetime: 5000,
    spread: 200,
    emoji: ["❌", "😢", "😭"],
    elementCount: 200,
  });
  const ALLCONSONANTS = "bcdfghjklmnpqrstvwxyz".split("");
  const ALLVOWELS = ["a", "e", "i", "o", "u"];
  const [word, setWord] = useState("");
  const [validationError, setValidationError] = useState("");
  const [wordList, setWordList] = useState([]);
  const [consonants, setConsonants] = useState([]);
  const [score, setScore] = useState(0);
  const [runTimer, setRunTimer] = useState(false);
  const [timeUp, setTimeUp] = useState(false);
  const [isNotFirstGame, setIsNotFirstGame] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [wordMakerText, setWordMakerText] = useState("W");
  const handleSubmit = (event) => {
    event.preventDefault();
    if (timeUp) return;
    var lowerWord = word.toLowerCase();
    if (lowerWord.length < 4)
      setValidationError("Word should be of length 4 or longer");
    else if (wordList.indexOf(lowerWord) >= 0)
      setValidationError("Word already created");
    else if (!validWords.check(lowerWord))
      setValidationError("Word is invalid");
    else {
      var bInvalidFound = false;
      lowerWord.split("").forEach((letter) => {
        if (
          !bInvalidFound &&
          ALLVOWELS.indexOf(letter) == -1 &&
          consonants.indexOf(letter) == -1
        ) {
          setValidationError(`Letter ${letter} is not allowed`);
          bInvalidFound = true;
        }
      });
      if (!bInvalidFound) {
        setWordList([lowerWord, ...wordList]);
        setScore(score + lowerWord.length);
        setValidationError("");
        setWord("");
      }
    }
  };
  const startGame = () => {
    var min = 0,
      max = 2;
    var consonants = [];
    while (max <= 20) {
      consonants.push(
        ALLCONSONANTS[Math.floor(Math.random() * (max - min + 1) + min)]
      );
      min = min + 3;
      max = max + 3;
    }
    setConsonants(consonants);
    setShowConfetti(false);
    setRunTimer(true);
    setWord("");
    setWordList([]);
    setScore(0);
    setTimeUp(false);
    setIsNotFirstGame(true);
  };
  const celebrate = () => {
    var localScore = score;
    while (Math.floor(localScore / (scoreThreshold / 2)) > 0) {
      setTimeout(
        () => confettiReward(),
        Math.floor(localScore / (scoreThreshold / 2)) * 500
      );
      localScore = localScore - scoreThreshold / 2;
    }
  };
  useEffect(() => {
    validWords.check("");
    setTimeout(() => setWordMakerText("Wo"), 700);
    setTimeout(() => setWordMakerText("Wor"), 1400);
    setTimeout(() => setWordMakerText("Word"), 2100);
    setTimeout(() => setWordMakerText("WordM"), 2800);
    setTimeout(() => setWordMakerText("WordMa"), 3500);
    setTimeout(() => setWordMakerText("WordMak"), 4200);
    setTimeout(() => setWordMakerText("WordMake"), 4900);
    setTimeout(() => setWordMakerText("WordMaker"), 5600);
  }, []);
  return (
    <div>
      <div>
        {showConfetti && (
          <span
            style={{
              zIndex: -1,
              position: "absolute",
              left: 0,
              right: 0,
              top: 0,
              bottom: 0,
              justifyContent: "center",
              alignItems: "center",
              display: "flex",
            }}
          >
            <span id="confettiReward" />
            <span id="emojiReward" />
          </span>
        )}
        <p style={{ fontSize: 40, width: "100%", textAlign: "center" }}>
          Welcome to {wordMakerText}
        </p>
        <div
          style={{
            display: "flex",
            flex: 2,
            flexDirection: "row",
            margin: 20,
          }}
        >
          <div
            style={{
              width: "60%",
              display: "flex",
              justifyContent: "center",
            }}
          >
            <div>
              <div style={{ display: "flex", justifyContent: "center" }}>
                <CountdownCircleTimer
                  isPlaying={runTimer}
                  duration={60}
                  size={60}
                  strokeWidth={8}
                  colors={["#449945", "#BB6767", "#A30000"]}
                  colorsTime={[60, 30, 0]}
                  onUpdate={(remainingTime) => {
                    remainingTime == 1 && setShowConfetti(true);
                  }}
                  onComplete={() => {
                    setTimeUp(true);
                    setValidationError("");
                    setWord("");
                    score > scoreThreshold - 1 ? celebrate() : emojiReward();
                    setTimeout(() => {
                      setRunTimer(false);
                    }, 1100);
                    return { shouldRepeat: true, delay: 1 };
                  }}
                >
                  {({ remainingTime }) => remainingTime}
                </CountdownCircleTimer>
              </div>
              <p>
                Create minimum 4 letter words using a set of letters.
                <ul>
                  <li>Each letter in the word will give 1 point.</li>
                  <li>Your score will be celebrated it is 20 or more.</li>
                  <li>Celebration will be louder for every 10 points.</li>
                </ul>
              </p>
              {!runTimer && (
                <button onClick={startGame}>
                  Click here to reveal new letters and start the game
                </button>
              )}
              {(runTimer || isNotFirstGame) && (
                <form onSubmit={handleSubmit} style={{ fontSize: 20 }}>
                  <p>
                    <div style={{ fontWeight: "bold" }}>
                      {consonants.join(", ")}
                    </div>
                    <div style={{ fontWeight: "bold" }}>
                      {ALLVOWELS.join(", ")}
                    </div>
                  </p>
                  <div>
                    <input
                      type="text"
                      value={word}
                      onChange={(e) => setWord(e.target.value)}
                    />
                    &nbsp;
                    {!timeUp ? (
                      <input type="submit" />
                    ) : (
                      <label>Time's up!!!</label>
                    )}
                    <p style={{ color: "red" }}>{validationError}</p>
                  </div>
                </form>
              )}
            </div>
          </div>
          <div style={{ width: "30%", marginLeft: "10%" }}>
            <div
              style={{
                color: timeUp
                  ? score > scoreThreshold - 1
                    ? "#449945"
                    : "#A30000"
                  : "black",
                fontSize: timeUp ? 30 : 20,
              }}
            >
              Score: {score}
            </div>
            <div
              style={{
                backgroundColor: "#efefef",
                border: "solid green",
                borderWidth: 5,
                borderRadius: 5,
                padding: 5,
                float: "left",
                minWidth: "40%",
              }}
            >
              Your words:
              <ol>
                {wordList.map((w) => (
                  <li>{w}</li>
                ))}
              </ol>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
); //252 lines here and 4 lines in public\index.html file. इति मम २५६ पङ्क्तयः
