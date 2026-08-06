"use client";

import { useEffect, useMemo, useRef, useState } from "react";

type Page = "achievements" | "hub" | "weather" | "blindbox" | "letter" | "story";
type StoryStep = "identity" | "mood" | "chase" | "meet" | "date" | "travel" | "final";

const achievements = [
  "顺利抵达北京",
  "平安接到茄茄",
  "帮茄茄找到满意住宿",
  "一人 carry 秦皇岛游玩计划",
  "可可爱爱",
];

const weatherMessages = [
  { label: "系统检测对象", value: "王XX × 茄茄" },
  { label: "旅行预测结果", value: "晴天概率：99%" },
  { label: "原因 01", value: "有人提前准备接送" },
  { label: "原因 02", value: "有人正在期待见面" },
];

const blindNotes = [
  { condition: "如果天气很好", action: "去海边散步", icon: "🌊" },
  { condition: "如果很累", action: "找一家店坐一小时", icon: "🫖" },
  { condition: "如果不知道干嘛", action: "随便走走", icon: "👣" },
  { condition: "如果看到好看的东西", action: "记录下来", icon: "📷" },
  { condition: "如果某个人突然开心", action: "获得隐藏奖励", icon: "🎁" },
  { condition: "如果赶海时发现第一只小螃蟹", action: "两个人一起给它取个名字，然后把它送回海里", icon: "🦀" },
  { condition: "如果王XX准备了一个没有提前告诉茄茄的地方", action: "给三个提示，让茄茄猜一次", icon: "🗺️" },
  { condition: "如果一天快要结束", action: "每个人说出一个今天最喜欢的瞬间", icon: "🌙" },
  { condition: "如果有人开始纠结", action: "把决定权交给另一个人", icon: "🧭" },
];

const moods = ["开心", "伤心", "难受", "失望", "想茄茄"];
const chasePositions = [
  { left: 22, top: 24 }, { left: 72, top: 20 }, { left: 28, top: 68 },
  { left: 76, top: 66 }, { left: 50, top: 48 },
];

export default function Home() {
  const [page, setPage] = useState<Page>("achievements");
  const cursorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const isLocalPreview = window.location.hostname === "127.0.0.1" || window.location.hostname === "localhost";
    if (isLocalPreview && new URLSearchParams(window.location.search).get("previewLetter") === "1") {
      setPage("letter");
    }
  }, []);

  return (
    <main
      className="site-shell"
      onPointerMove={(event) => {
        if (event.pointerType !== "mouse" || !cursorRef.current) return;
        cursorRef.current.style.transform = `translate3d(${event.clientX - 13}px, ${event.clientY - 13}px, 0)`;
        cursorRef.current.classList.add("visible");
      }}
      onPointerLeave={() => cursorRef.current?.classList.remove("visible")}
    >
      <div className="heart-cursor" ref={cursorRef} aria-hidden="true">
        <svg viewBox="0 0 32 30" role="presentation">
          <defs>
            <linearGradient id="cursor-heart-gradient" x1="2" y1="3" x2="29" y2="27" gradientUnits="userSpaceOnUse">
              <stop offset="0" stopColor="#f3c74d" />
              <stop offset="0.48" stopColor="#efad3a" />
              <stop offset="1" stopColor="#ed7fa7" />
            </linearGradient>
          </defs>
          <path d="M16 27.1C13.7 24.8 5.1 18.1 3.1 12.8C1.1 7.7 4.2 3.1 8.8 3.1C12 3.1 14.2 5 16 7.4C17.8 5 20 3.1 23.2 3.1C27.8 3.1 30.9 7.7 28.9 12.8C26.9 18.1 18.3 24.8 16 27.1Z" />
        </svg>
      </div>
      <div className="ambient ambient-one" />
      <div className="ambient ambient-two" />
      <div className="floating-doodle doodle-one">✦</div>
      <div className="floating-doodle doodle-two">♡</div>
      <div className="floating-doodle doodle-three">☀</div>

      <header className="site-header">
        <button className="brand-button" onClick={() => setPage("achievements")}>
          <span>🍆</span><b>茄茄与玄玄</b><span>☀️</span>
        </button>
        <nav>
          {page !== "achievements" && (
            <button className="nav-button" onClick={() => setPage("achievements")}>🏆 成就页</button>
          )}
          {page !== "hub" && (
            <button className="nav-button nav-primary" onClick={() => setPage("hub")}>打开专属收藏夹</button>
          )}
        </nav>
      </header>

      <section className={`page-card page-${page}`}>
        {page === "achievements" && <Achievements onOpenHub={() => setPage("hub")} />}
        {page === "hub" && <Hub onNavigate={setPage} />}
        {page === "weather" && <Weather />}
        {page === "blindbox" && <BlindBox />}
        {page === "letter" && <FutureLetter />}
        {page === "story" && <OriginalStory />}
      </section>

      <footer>王XX 专属收藏 · 这个夏天的好事情正在发生</footer>
    </main>
  );
}

function Achievements({ onOpenHub }: { onOpenHub: () => void }) {
  const [unlocked, setUnlocked] = useState<number[]>([]);
  const [bursts, setBursts] = useState<number[]>([]);

  function unlock(index: number) {
    if (!unlocked.includes(index)) setUnlocked((current) => [...current, index]);
    const id = Date.now();
    setBursts((current) => [...current, id]);
    window.setTimeout(() => setBursts((current) => current.filter((item) => item !== id)), 1900);
  }

  return (
    <div className="page-content achievements-page">
      <div className="trophy-stage" aria-hidden="true">
        <span className="trophy-glow" />
        <span className="trophy">🏆</span>
        <span className="tiny-star star-a">✦</span><span className="tiny-star star-b">✦</span>
      </div>
      <p className="eyebrow">QINHUANGDAO · SUMMER 2026</p>
      <h1>王XX 成就 get!</h1>
      <p className="lead">点击每一枚成就，把王XX的厉害一件一件点亮。</p>
      <div className="achievement-list">
        {achievements.map((item, index) => (
          <button
            className={`achievement-item ${unlocked.includes(index) ? "unlocked" : ""}`}
            key={item}
            onClick={() => unlock(index)}
          >
            <span className="achievement-number">0{index + 1}</span>
            <span className="achievement-check">{unlocked.includes(index) ? "✓" : "○"}</span>
            <strong>{item}</strong>
            <small>{unlocked.includes(index) ? "成就已点亮" : "点击解锁"}</small>
          </button>
        ))}
      </div>
      {unlocked.length === achievements.length && (
        <div className="all-unlocked">🎉 全部达成！王XX今日也是满分小太阳。</div>
      )}
      <button className="primary-button" onClick={onOpenHub}>继续打开王XX专属收藏夹</button>
      {bursts.map((burst) => (
        <div className="celebration-overlay" key={burst} aria-hidden="true">
          {[
            { left: "18%", top: "28%", delay: "0ms" },
            { left: "50%", top: "44%", delay: "120ms" },
            { left: "80%", top: "24%", delay: "230ms" },
            { left: "30%", top: "72%", delay: "320ms" },
            { left: "72%", top: "70%", delay: "400ms" },
          ].map((position, fireworkIndex) => (
            <span className="screen-firework" key={fireworkIndex} style={{ left: position.left, top: position.top, "--delay": position.delay } as React.CSSProperties}>
              {Array.from({ length: 14 }).map((_, particleIndex) => (
                <i
                  key={particleIndex}
                  style={{
                    "--angle": `${particleIndex * (360 / 14)}deg`,
                    "--distance": `${78 + (particleIndex % 3) * 24}px`,
                    "--particle-color": ["#f4c84d", "#ed82a7", "#a977cc", "#fff1a8"][particleIndex % 4],
                  } as React.CSSProperties}
                />
              ))}
              <b>✦</b>
            </span>
          ))}
          <div className="celebration-message">🎉 成就点亮！</div>
        </div>
      ))}
    </div>
  );
}

function Hub({ onNavigate }: { onNavigate: (page: Page) => void }) {
  const cards: { page: Page; icon: string; title: string; text: string; locked?: boolean }[] = [
    { page: "achievements", icon: "🏆", title: "王XX 成就 get", text: "五枚属于王XX的夏日勋章" },
    { page: "weather", icon: "☀️", title: "王XX专属天气预报", text: "检测今天的晴天概率" },
    { page: "blindbox", icon: "🎁", title: "秦皇岛旅行盲盒", text: "抽取一张今日随机事件" },
    { page: "letter", icon: "💌", title: "写给未来的王XX", text: "2026.08.15 · 17:21 查收", locked: true },
  ];
  return (
    <div className="page-content hub-page">
      <div className="hub-mascots"><span>🍆</span><i>♡</i><span>☀️</span></div>
      <p className="eyebrow">王XX专属收藏夹</p>
      <h1>这个夏天，收藏了好多好事情</h1>
      <p className="lead">这里不用按顺序闯关。想先打开哪一页，就点哪一页。</p>
      <div className="hub-grid">
        {cards.map((card) => (
          <button className="hub-card" key={card.page} onClick={() => onNavigate(card.page)}>
            <span className="hub-icon">{card.icon}</span>
            <span><strong>{card.title}</strong><small>{card.text}</small></span>
            {card.locked && <em>定时信件</em>}
            <b className="hub-arrow">↗</b>
          </button>
        ))}
      </div>
      <button className="old-story-link" onClick={() => onNavigate("story")}>
        <span>↩</span><span><strong>回到最初的故事</strong><small>身份确认、心情、见面日期和我们的约定都保存在这里</small></span>
      </button>
    </div>
  );
}

function Weather() {
  const [started, setStarted] = useState(false);
  const [visible, setVisible] = useState(0);
  const [finished, setFinished] = useState(false);

  useEffect(() => {
    if (!started || visible >= weatherMessages.length) return;
    const timer = window.setTimeout(() => setVisible((count) => count + 1), 720);
    return () => window.clearTimeout(timer);
  }, [started, visible]);

  return (
    <div className="page-content weather-page">
      <div className={`weather-orb ${started ? "scanning" : ""}`}><span>☀️</span><i /></div>
      <p className="eyebrow">QINHUANGDAO WEATHER STATION</p>
      <h1>王XX专属天气预报</h1>
      {!started ? (
        <div className="weather-start">
          <p className="lead">秦皇岛天气预测系统已准备好，请王XX亲自启动检测。</p>
          <button className="primary-button" onClick={() => setStarted(true)}>按一下，开始检测</button>
        </div>
      ) : (
        <div className="forecast-panel">
          <div className="scan-line" />
          {weatherMessages.slice(0, visible).map((message, index) => (
            <div className="forecast-row" key={message.label} style={{ animationDelay: `${index * 40}ms` }}>
              <span>{message.label}</span><strong>{message.value}</strong>
            </div>
          ))}
          {visible < weatherMessages.length && <div className="typing-dots"><i /><i /><i /></div>}
          {visible >= weatherMessages.length && !finished && (
            <button className="sunny-button" onClick={() => setFinished(true)}>接收系统备注</button>
          )}
        </div>
      )}
      {finished && (
        <div className="weather-note">
          <span>☂️ → ☀️</span>
          <p>“如果真的下雨，也判定为晴天。”</p>
          <strong>“因为今天有人来了。”</strong>
        </div>
      )}
    </div>
  );
}

function BlindBox() {
  const [drawing, setDrawing] = useState(false);
  const [picked, setPicked] = useState<number | null>(null);
  const [used, setUsed] = useState<number[]>([]);

  function draw() {
    if (drawing) return;
    setDrawing(true); setPicked(null);
    window.setTimeout(() => {
      const available = blindNotes.map((_, index) => index).filter((index) => !used.includes(index));
      const pool = available.length ? available : blindNotes.map((_, index) => index);
      const index = pool[Math.floor(Math.random() * pool.length)];
      setPicked(index); setUsed((current) => available.length ? [...current, index] : [index]); setDrawing(false);
    }, 1100);
  }

  return (
    <div className="page-content blindbox-page">
      <p className="eyebrow">TODAY'S RANDOM EVENT</p>
      <h1>秦皇岛旅行盲盒</h1>
      <p className="lead">计划之外，也给今天留一点随机。摇一摇纸条罐，抽出属于我们的今日事件。</p>
      <div className={`note-jar ${drawing ? "shaking" : ""}`} aria-hidden="true">
        <div className="jar-lid" /><div className="jar-body">
          {blindNotes.map((note, index) => <span key={note.condition} style={{ "--r": `${-16 + index * 8}deg`, "--x": `${12 + (index % 3) * 30}px` } as React.CSSProperties}>小纸条</span>)}
        </div>
      </div>
      <button className="primary-button" onClick={draw} disabled={drawing}>{drawing ? "正在摇一摇…" : picked === null ? "抽一张今日事件" : "再抽一张"}</button>
      {picked !== null && (
        <div className="drawn-note" key={`${picked}-${used.length}`}>
          <span className="note-pin">{blindNotes[picked].icon}</span>
          <small>今日随机事件</small>
          <p>{blindNotes[picked].condition}：</p>
          <strong>{blindNotes[picked].action}</strong>
          {picked === 4 && <em>隐藏奖励是什么，由茄茄保密解释 ♡</em>}
        </div>
      )}
      <p className="draw-count">已拆开 {used.length} / {blindNotes.length} 张小纸条</p>
    </div>
  );
}

function FutureLetter() {
  const unlockAt = useMemo(() => new Date("2026-08-15T17:21:00+08:00").getTime(), []);
  const [now, setNow] = useState(() => Date.now());
  const [localPreview, setLocalPreview] = useState(false);
  useEffect(() => {
    const isLocal = window.location.hostname === "127.0.0.1" || window.location.hostname === "localhost";
    setLocalPreview(isLocal && new URLSearchParams(window.location.search).get("previewLetter") === "1");
    const timer = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(timer);
  }, []);
  const unlocked = localPreview || now >= unlockAt;
  const remaining = Math.max(0, unlockAt - now);
  const days = Math.floor(remaining / 86400000);
  const hours = Math.floor((remaining % 86400000) / 3600000);
  const minutes = Math.floor((remaining % 3600000) / 60000);

  if (!unlocked) {
    return (
      <div className="page-content locked-letter-page">
        <div className="sealed-envelope"><span>💌</span><i>♡</i></div>
        <p className="eyebrow">A LETTER FOR THE FUTURE</p>
        <h1>写给未来的王XX</h1>
        <div className="lock-message">
          <span>🔒</span><strong>这封信还在认真保管中</strong>
          <p>请于 2026 年 8 月 15 日下午 17 点 21 分来查收。</p>
        </div>
        <div className="countdown"><span>{days}<small>天</small></span><i>:</i><span>{hours}<small>小时</small></span><i>:</i><span>{minutes}<small>分钟</small></span></div>
        <p className="tiny-note">到达约定时间后，这一页会自动打开。</p>
      </div>
    );
  }

  return (
    <div className="page-content open-letter-page">
      <div className="letter-celebration">🎉　🍆 ♡ ☀️　🎉</div>
      <p className="eyebrow">THE LETTER IS NOW OPEN</p>
      <h1>写给未来的王XX</h1>
      <div className="congratulations">
        <strong>恭喜王XX和茄茄一起完成了秦皇岛这个小计划！</strong>
        <p>在此大声感谢王XX的付出！！茄茄都有看到！</p>
      </div>
      <article className="letter-paper">
        <div className="letter-title">下面是给你的一封信</div>
        <p>其实我觉得很有意思，<br />明明认识时间没有特别长，<br />但你总是能记住一些很小很小的东西。</p>
        <p>比如奖状，<br />比如晴天，<br />比如一些我自己说完可能都忘记的话。</p>
        <p>我以前觉得，<br />想让一个人开心应该需要做很大的事情。<br />后来发现，<br />好像不是。</p>
        <p>记住一些小事情，<br />就已经可以让另一个人觉得很特别。</p>
        <p>所以偷偷记录一下：<br />2026年的这个夏天，<br />有一个秦皇岛计划，<br />还有一个很认真对待小事情的人。</p>
        <small>（记于2026年8月15日，此日志永久保存）</small>
        <blockquote>“请继续保持你奇奇怪怪的可爱”</blockquote>
      </article>
    </div>
  );
}

function OriginalStory() {
  const [step, setStep] = useState<StoryStep>("identity");
  const [failed, setFailed] = useState(false);
  const [selectedMoods, setSelectedMoods] = useState<string[]>([]);
  const [kiss, setKiss] = useState(false);
  const [dodges, setDodges] = useState(0);
  const [date, setDate] = useState<"8.7" | "8.8" | null>(null);
  const [idea, setIdea] = useState("");
  const [showIdea, setShowIdea] = useState(false);
  const [final, setFinal] = useState("");
  const wants = selectedMoods.includes("想茄茄");
  const position = chasePositions[Math.min(dodges, 4)];

  function reset() { setStep("identity"); setFailed(false); setSelectedMoods([]); setKiss(false); setDodges(0); setDate(null); setIdea(""); setShowIdea(false); setFinal(""); }
  function chooseDate(value: "8.7" | "8.8") { setDate(value); if (value === "8.7") setStep("travel"); else { setFinal("我们 8.8 日秦皇岛见！"); setStep("final"); } }

  return (
    <div className="page-content original-story">
      {step === "identity" && <><Mascots /><p className="eyebrow">暗号确认</p><h1>先告诉茄茄，你是谁呀？</h1><p className="lead">要认真选哦，只有真正的小太阳才知道答案。</p><div className="choice-grid">{["XX", "大玄", "茄茄的小太阳"].map((answer) => <button className="choice-button" key={answer} onClick={() => answer === "茄茄的小太阳" ? setStep("mood") : setFailed(true)}>{answer}</button>)}</div></>}
      {step === "mood" && <><div className="big-sun">☀️</div><p className="eyebrow">心情收集站</p><h1>小太阳今天心情怎么样？</h1><p className="lead">可以多选。所有心情，都可以放心交给茄茄。</p><div className="mood-grid">{moods.map((mood) => <button className={`mood-button ${selectedMoods.includes(mood) ? "selected" : ""}`} key={mood} onClick={() => setSelectedMoods((current) => current.includes(mood) ? current.filter((item) => item !== mood) : [...current, mood])}>{mood === "开心" ? "☀" : mood === "想茄茄" ? "♥" : "☁"}<strong>{mood}</strong></button>)}</div><button className="primary-button" disabled={!selectedMoods.length} onClick={() => wants ? setKiss(true) : setStep("chase")}>把心情交给茄茄</button></>}
      {step === "chase" && <><p className="eyebrow">抓住好消息</p><h1>{wants ? "那你想见茄茄吗？" : "那你猜有什么好消息？"}</h1><p className="lead">抓到这个有一点害羞的答案，就告诉你。</p><div className="chase-area"><button className="runaway-button" style={{ left: `${position.left}%`, top: `${position.top}%` }} onPointerEnter={() => dodges < 4 && setDodges((n) => n + 1)} onClick={() => dodges < 4 ? setDodges((n) => n + 1) : setStep("meet")}>{dodges < 4 ? "点到我呀" : "这次被你抓到啦！"}</button></div></>}
      {step === "meet" && <><p className="eyebrow">好消息揭晓</p><h1>那让我们见面吧！</h1><p className="lead">想把好多好多温柔的瞬间，都变成真的。</p><figure className="story-illustration"><img src="qiexuan-story.png" alt="茄茄和玄玄相互陪伴的温馨画面" /><figcaption>牵手 · 拥抱 · 肩并肩 · 靠在一起 · 亲亲 · 相互依偎</figcaption></figure><button className="primary-button" onClick={() => setStep("date")}>好呀，去选见面的日子</button></>}
      {step === "date" && <><Mascots /><p className="eyebrow">把期待圈起来</p><h1>我们什么时候见面？</h1><p className="lead">不管选哪一天，小太阳和茄茄都在向彼此靠近。</p><div className="date-grid"><button className="date-card" onClick={() => chooseDate("8.7")}><b>8.7</b><span>晚上见</span><small>一起出发的夜晚</small></button><button className="date-card" onClick={() => chooseDate("8.8")}><b>8.8</b><span>秦皇岛见</span><small>阳光刚刚好的日子</small></button></div></>}
      {step === "travel" && <><div className="route-line">广州　♡　北京　♡　秦皇岛</div><p className="eyebrow">一起回家</p><h1>那玄玄愿意来北京，带我一起回秦皇岛吗？</h1><p className="lead">茄茄从广州出发，跨过一座城去见小太阳，再一起奔向海边。</p>{!showIdea ? <div className="choice-grid"><button className="choice-button" onClick={() => { setFinal("那我们拉勾"); setStep("final"); }}>愿意</button><button className="choice-button" onClick={() => { setFinal("我们 8.8 日秦皇岛见！"); setStep("final"); }}>不愿意</button><button className="choice-button" onClick={() => setShowIdea(true)}>更好想法请告诉我</button></div> : <div className="idea-box"><textarea placeholder="把你的更好想法写在这里…" value={idea} onChange={(e) => setIdea(e.target.value)} /><button className="primary-button" disabled={!idea.trim()} onClick={() => { setFinal("好呀，就听小太阳的！"); setStep("final"); }}>悄悄告诉茄茄</button></div>}</>}
      {step === "final" && <><div className="happy-pair"><span>🍆</span><i>♡</i><span>☀️</span></div><p className="eyebrow">约定完成</p><h1>{final}</h1><p className="lead">{date === "8.7" ? "从广州出发，在北京相遇，再一起奔向秦皇岛——这一次，我们把期待走成真的。" : "倒数每一个日落，直到我们在秦皇岛见面。"}</p><button className="secondary-button" onClick={reset}>再走一遍我们的故事</button></>}
      {failed && <Modal title="很遗憾，闯关失败啦" text="再想一想，茄茄最喜欢怎么称呼你？" button="再来一次" onClose={() => setFailed(false)} />}
      {kiss && <Modal title="送给想茄茄的小太阳——" text="一个大大的亲亲！所有想念都被茄茄收到啦。" button="收好亲亲，继续" kiss onClose={() => { setKiss(false); setStep("chase"); }} />}
    </div>
  );
}

function Mascots() { return <div className="mascots"><span className="eggplant">🍆</span><i>♡</i><span className="sun">☀️</span></div>; }
function Modal({ title, text, button, onClose, kiss = false }: { title: string; text: string; button: string; onClose: () => void; kiss?: boolean }) { return <div className="modal-backdrop"><div className="modal"><span className="modal-icon">{kiss ? "💋" : "☁️"}</span><h2>{title}</h2><p>{text}</p><button className="primary-button" onClick={onClose}>{button}</button></div></div>; }
