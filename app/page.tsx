"use client";

import { useMemo, useState } from "react";

type Step =
  | "identity"
  | "mood"
  | "chase"
  | "meet"
  | "date"
  | "travel"
  | "final";

const moods = ["开心", "伤心", "难受", "失望", "想茄茄"];
const chasePositions = [
  { left: 22, top: 24 },
  { left: 72, top: 20 },
  { left: 28, top: 68 },
  { left: 76, top: 66 },
  { left: 50, top: 48 },
];

export default function Home() {
  const [step, setStep] = useState<Step>("identity");
  const [identityFailed, setIdentityFailed] = useState(false);
  const [selectedMoods, setSelectedMoods] = useState<string[]>([]);
  const [showKiss, setShowKiss] = useState(false);
  const [dodges, setDodges] = useState(0);
  const [dateChoice, setDateChoice] = useState<"8.7" | "8.8" | null>(null);
  const [betterIdea, setBetterIdea] = useState(false);
  const [ideaText, setIdeaText] = useState("");
  const [finalMessage, setFinalMessage] = useState("");

  const progress = useMemo(() => {
    const order: Step[] = [
      "identity",
      "mood",
      "chase",
      "meet",
      "date",
      "travel",
      "final",
    ];
    return order.indexOf(step);
  }, [step]);

  const wantsQieqie = selectedMoods.includes("想茄茄");
  const chasePosition = chasePositions[Math.min(dodges, 4)];

  function toggleMood(mood: string) {
    setSelectedMoods((current) =>
      current.includes(mood)
        ? current.filter((item) => item !== mood)
        : [...current, mood],
    );
  }

  function finishMood() {
    if (wantsQieqie) {
      setShowKiss(true);
      return;
    }
    setStep("chase");
  }

  function dodgeOrContinue() {
    if (dodges < 4) {
      setDodges((count) => count + 1);
      return;
    }
    setStep("meet");
  }

  function chooseDate(choice: "8.7" | "8.8") {
    setDateChoice(choice);
    if (choice === "8.7") {
      setStep("travel");
      return;
    }
    setFinalMessage("我们 8.8 日秦皇岛见！");
    setStep("final");
  }

  function finishTravel(choice: "yes" | "no") {
    setFinalMessage(choice === "yes" ? "那我们拉勾！" : "我们 8.8 日秦皇岛见！");
    setStep("final");
  }

  function restart() {
    setStep("identity");
    setIdentityFailed(false);
    setSelectedMoods([]);
    setShowKiss(false);
    setDodges(0);
    setDateChoice(null);
    setBetterIdea(false);
    setIdeaText("");
    setFinalMessage("");
  }

  return (
    <main className="story-shell">
      <div className="ambient ambient-one" />
      <div className="ambient ambient-two" />
      <div className="floating-symbol symbol-one">✦</div>
      <div className="floating-symbol symbol-two">♡</div>
      <div className="floating-symbol symbol-three">✿</div>

      <header className="story-header">
        <div className="brand">
          <span className="brand-mark" aria-hidden="true">
            🍆
          </span>
          <span>茄茄与玄玄</span>
          <span className="brand-mark sun-mark" aria-hidden="true">
            ☀
          </span>
        </div>
        <div className="progress" aria-label={`故事进度 ${progress + 1}/7`}>
          {Array.from({ length: 7 }).map((_, index) => (
            <span
              className={index <= progress ? "progress-dot active" : "progress-dot"}
              key={index}
            />
          ))}
        </div>
      </header>

      <section className={`story-card step-${step}`}>
        {step === "identity" && (
          <div className="step-content">
            <MascotPair />
            <p className="eyebrow">第一关 · 暗号确认</p>
            <h1>先告诉茄茄，你是谁呀？</h1>
            <p className="lead">要认真选哦，只有真正的小太阳才知道答案。</p>
            <div className="choice-grid">
              {["XX", "大玄", "茄茄的小太阳"].map((answer) => (
                <button
                  className="choice-button"
                  key={answer}
                  onClick={() => {
                    if (answer === "茄茄的小太阳") {
                      setStep("mood");
                    } else {
                      setIdentityFailed(true);
                    }
                  }}
                >
                  {answer}
                </button>
              ))}
            </div>
          </div>
        )}

        {step === "mood" && (
          <div className="step-content">
            <div className="mini-sun" aria-hidden="true">
              ☀
            </div>
            <p className="eyebrow">第二关 · 心情收集站</p>
            <h1>小太阳今天心情怎么样？</h1>
            <p className="lead">可以多选。所有心情，都可以放心交给茄茄。</p>
            <div className="mood-grid">
              {moods.map((mood) => (
                <button
                  aria-pressed={selectedMoods.includes(mood)}
                  className={`mood-button ${
                    selectedMoods.includes(mood) ? "selected" : ""
                  }`}
                  key={mood}
                  onClick={() => toggleMood(mood)}
                >
                  <span aria-hidden="true">
                    {mood === "开心"
                      ? "☺"
                      : mood === "想茄茄"
                        ? "♡"
                        : "☁"}
                  </span>
                  {mood}
                </button>
              ))}
            </div>
            <button
              className="primary-button"
              disabled={selectedMoods.length === 0}
              onClick={finishMood}
            >
              把心情交给茄茄
            </button>
          </div>
        )}

        {step === "chase" && (
          <div className="step-content chase-content">
            <p className="eyebrow">第三关 · 抓住好消息</p>
            <h1>{wantsQieqie ? "那你想见茄茄吗？" : "那你猜有什么好消息？"}</h1>
            <p className="lead">
              这个答案有一点害羞，抓到它就告诉你。
              <span className="dodge-count"> 已经靠近 {dodges}/4 次</span>
            </p>
            <div className="chase-area">
              <div className="chase-trail trail-one">♡</div>
              <div className="chase-trail trail-two">✦</div>
              <button
                className="runaway-button"
                style={{
                  left: `${chasePosition.left}%`,
                  top: `${chasePosition.top}%`,
                }}
                onPointerEnter={() => {
                  if (dodges < 4) setDodges((count) => count + 1);
                }}
                onClick={dodgeOrContinue}
              >
                {dodges < 4 ? "点到我呀" : "这次被你抓到啦！"}
              </button>
            </div>
          </div>
        )}

        {step === "meet" && (
          <div className="step-content meet-content">
            <p className="eyebrow">好消息揭晓</p>
            <h1>那让我们见面吧！</h1>
            <p className="lead">想把好多好多温柔的瞬间，都变成真的。</p>
            <figure className="story-illustration">
              <img
                src="/qiexuan-story.png"
                alt="茄子形象的茄茄和小太阳形象的玄玄牵手、拥抱、依偎和亲亲"
              />
              <figcaption>
                牵手 · 拥抱 · 肩并肩 · 靠在一起 · 亲亲 · 抱在怀里
              </figcaption>
            </figure>
            <button className="primary-button" onClick={() => setStep("date")}>
              好呀，去选见面的日子
            </button>
          </div>
        )}

        {step === "date" && (
          <div className="step-content">
            <MascotPair />
            <p className="eyebrow">第四关 · 把期待圈起来</p>
            <h1>我们什么时候见面？</h1>
            <p className="lead">不管选哪一天，小太阳都在朝茄茄靠近。</p>
            <div className="date-grid">
              <button className="date-card" onClick={() => chooseDate("8.7")}>
                <span className="date-day">8.7</span>
                <span>晚上见</span>
                <small>一起出发的夜晚</small>
              </button>
              <button className="date-card" onClick={() => chooseDate("8.8")}>
                <span className="date-day">8.8</span>
                <span>秦皇岛见</span>
                <small>阳光刚刚好的日子</small>
              </button>
            </div>
          </div>
        )}

        {step === "travel" && (
          <div className="step-content">
            <div className="route-line" aria-hidden="true">
              <span>北京</span>
              <span className="route-heart">♡</span>
              <span>秦皇岛</span>
            </div>
            <p className="eyebrow">第五关 · 一起回家</p>
            <h1>那玄玄愿意来北京，带我一起回秦皇岛吗？</h1>
            <p className="lead">这是属于 8.7 晚的小小约定。</p>
            {!betterIdea ? (
              <div className="choice-grid travel-grid">
                <button className="choice-button" onClick={() => finishTravel("yes")}>
                  愿意
                </button>
                <button className="choice-button" onClick={() => finishTravel("no")}>
                  不愿意
                </button>
                <button className="choice-button" onClick={() => setBetterIdea(true)}>
                  更好想法请告诉我
                </button>
              </div>
            ) : (
              <div className="idea-box">
                <label htmlFor="better-idea">茄茄在认真听：</label>
                <textarea
                  id="better-idea"
                  placeholder="把你的更好想法写在这里……"
                  value={ideaText}
                  onChange={(event) => setIdeaText(event.target.value)}
                />
                <button
                  className="primary-button"
                  disabled={!ideaText.trim()}
                  onClick={() => {
                    setFinalMessage("好呀，就听小太阳的！");
                    setStep("final");
                  }}
                >
                  悄悄告诉茄茄
                </button>
              </div>
            )}
          </div>
        )}

        {step === "final" && (
          <div className="step-content final-content">
            <div className="confetti" aria-hidden="true">
              <span>♡</span>
              <span>✦</span>
              <span>♡</span>
              <span>✿</span>
              <span>✦</span>
            </div>
            <div className="happy-pair" aria-label="开心微笑的茄茄和玄玄">
              <div className="happy-character eggplant-happy">
                <span>🍆</span>
                <b>˘ᴗ˘</b>
              </div>
              <div className="pink-heart">♥</div>
              <div className="happy-character sun-happy">
                <span>☀️</span>
                <b>˘ᴗ˘</b>
              </div>
            </div>
            <p className="eyebrow">约定完成</p>
            <h1>{finalMessage}</h1>
            <p className="lead">
              {dateChoice === "8.7"
                ? "从北京到秦皇岛，茄茄和玄玄要一起笑着出发。"
                : "倒数每一个日落，直到我们在秦皇岛见面。"}
            </p>
            <div className="promise-note">今天也要做茄茄最最可爱的小太阳 ☀</div>
            <button className="secondary-button" onClick={restart}>
              再走一遍我们的故事
            </button>
          </div>
        )}
      </section>

      <footer>给茄茄的小太阳 · 一份只属于我们的见面邀请</footer>

      {identityFailed && (
        <div className="modal-backdrop" role="dialog" aria-modal="true">
          <div className="failure-modal">
            <span className="modal-cloud" aria-hidden="true">
              ☁
            </span>
            <h2>很遗憾，闯关失败啦</h2>
            <p>再想一想，茄茄最喜欢怎么称呼你？</p>
            <button
              className="primary-button"
              onClick={() => setIdentityFailed(false)}
            >
              再来一次
            </button>
          </div>
        </div>
      )}

      {showKiss && (
        <div className="modal-backdrop kiss-backdrop" role="dialog" aria-modal="true">
          <div className="kiss-modal">
            <div className="kiss-burst" aria-hidden="true">
              <span>啵！</span>
              <i>♥</i>
            </div>
            <h2>送给想茄茄的小太阳——</h2>
            <p>一个大大的亲亲！所有想念都被茄茄收到啦。</p>
            <button
              className="primary-button"
              onClick={() => {
                setShowKiss(false);
                setStep("chase");
              }}
            >
              收好亲亲，继续
            </button>
          </div>
        </div>
      )}
    </main>
  );
}

function MascotPair() {
  return (
    <div className="mascot-pair" aria-label="茄茄和玄玄">
      <div className="mascot eggplant-mascot">
        <span className="mascot-emoji" aria-hidden="true">
          🍆
        </span>
        <span className="mascot-face">•ᴗ•</span>
        <small>茄茄</small>
      </div>
      <span className="pair-heart" aria-hidden="true">
        ♡
      </span>
      <div className="mascot sun-mascot">
        <span className="mascot-emoji" aria-hidden="true">
          ☀️
        </span>
        <span className="mascot-face">•ᴗ•</span>
        <small>玄玄</small>
      </div>
    </div>
  );
}
