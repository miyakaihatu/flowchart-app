(function () {
  const tree = window.DECISION_TREE;

  const el = (id) => document.getElementById(id);
  const qa = el("qa");
  const result = el("result");
  const qEl = el("question");
  const optsEl = el("options");
  const textWrap = el("textwrap");
  const textEl = el("text");
  const textNextBtn = el("textNext");
  const bar = el("bar");

  const summaryEl = el("summary");
  const nextQsEl = el("nextQs");
  const replySoftEl = el("replySoft");
  const replyShortEl = el("replyShort");
  const promptEl = el("prompt");

  const backBtn = el("back");
  const resetBtn = el("reset");
  const restartBtn = el("restart");
  const copyAllBtn = el("copyAll");

  let history = [];
  let state = {};
  let currentId = tree.start;

  const labelOf = (nodeId, value) => {
    const node = tree.nodes[nodeId];
    if (!node || !node.options) return String(value ?? "");
    const hit = node.options.find(o => o.value === value);
    return hit ? hit.label : String(value ?? "");
  };

  const progressPct = () => {
    const steps = Math.min(10, Math.max(1, history.length + 1));
    return Math.min(100, (steps / 10) * 100);
  };

  const setProgress = () => {
    bar.style.width = `${progressPct()}%`;
  };

  const render = () => {
    setProgress();
    const node = tree.nodes[currentId];
    if (!node) throw new Error("Unknown node: " + currentId);

    if (node.type === "finish") {
      showResult(node.reason);
      return;
    }

    qEl.textContent = node.question;
    optsEl.innerHTML = "";
    textWrap.classList.add("hidden");

    if (node.type === "single") {
      node.options.forEach(opt => {
        const b = document.createElement("button");
        b.className = "opt";
        b.textContent = opt.label;
        b.onclick = () => {
          history.push(currentId);
          state[currentId] = opt.value;
          currentId = opt.next;
          render();
        };
        optsEl.appendChild(b);
      });
    }

    if (node.type === "text") {
      textWrap.classList.remove("hidden");
      textEl.value = state[node.key] || "";
      textNextBtn.onclick = () => {
        const v = (textEl.value || "").trim();
        history.push(currentId);
        state[node.key] = v;
        currentId = node.next;
        render();
      };
    }
  };

  const showResult = (reason) => {
    qa.classList.add("hidden");
    result.classList.remove("hidden");

    const topic = labelOf("topic", state["topic"]);
    const goal = labelOf("goal", state["goal"]);
    const tone = labelOf("tone", state["tone"]);
    const msg = (state.message || "").trim();

    const lines = [];
    lines.push(`ジャンル: ${topic || "未選択"}`);
    lines.push(`相手の求め: ${goal || "未選択"}`);
    lines.push(`返答トーン: ${tone || "未選択"}`);
    if (state["urgency_health"]) lines.push(`体調系の緊急度: ${labelOf("urgency_health", state["urgency_health"])}`);
    if (state["urgency_mental"]) lines.push(`メンタル系の緊急度: ${labelOf("urgency_mental", state["urgency_mental"])}`);
    if (state["urgency_sensitive"]) lines.push(`センシティブ注意: ${labelOf("urgency_sensitive", state["urgency_sensitive"])}`);
    lines.push("");
    lines.push("相手文面要約/原文:");
    lines.push(msg || "（未入力）");

    summaryEl.textContent = lines.join("\n");

    const nextQs = buildNextQuestions();
    nextQsEl.textContent = nextQs.map(q => "・" + q).join("\n");

    const replies = buildReplies(reason);
    replySoftEl.textContent = replies.soft;
    replyShortEl.textContent = replies.short;

    promptEl.textContent = buildPrompt(reason, nextQs);
  };

  const buildNextQuestions = () => {
    const topic = state.topic;
    const goal = state.goal;

    const common = [
      "いま一番つらいのは「出来事」？それとも「気持ち」？",
      "どうなったら少し楽になる？（理想のゴール）",
      "今日は“聞いてほしい日”か、“方針がほしい日”かどっち？"
    ];

    const byTopic = {
      relationship: [
        "相手との関係性（彼氏/友達/職場/家族）は？",
        "いま起きてる問題は、頻度どれくらい？（一回だけ/繰り返し）",
        "相手に何を伝えたい？逆に、何は言いにくい？"
      ],
      health: [
        "症状はいつから？悪化してる？",
        "痛み/発熱/出血などの“赤信号”はある？",
        "受診できそう？不安のポイントはどこ？"
      ],
      mental: [
        "眠れてる？食べれてる？（最低限）",
        "不安が強くなるタイミングは？",
        "一人で抱えてない？相談できる人いる？"
      ],
      sensitive: [
        "無理してる感じや痛みはある？（あるなら最優先で止める）",
        "相手のペースと同意は明確？",
        "“気持ちよさ”より先に“安心”が足りてる？"
      ],
      other: [
        "何が起点でそうなった？（きっかけ）",
        "選べる選択肢は何がある？",
        "最短で楽になる一手は何だと思う？"
      ]
    };

    let qs = [...common];
    qs = qs.concat(byTopic[topic] || byTopic.other);

    if (goal === "listen") qs.unshift("まず共感してほしい？解決策ほしい？どっちが近い？");
    if (goal === "plan") qs.unshift("理想の状態を0〜10で言うと今どれくらい？次は何点を目指す？");

    return Array.from(new Set(qs)).slice(0, 6);
  };

  const buildReplies = (reason) => {
    if (reason === "minor_unknown") {
      return {
        soft: "年齢が不明なので、踏み込みすぎない範囲でしか返せないです。安全のため、まずは「年齢（18歳以上か）」と「相談のジャンル」を確認させてください。",
        short: "年齢が不明なので、まず18歳以上か教えて。安全のため確認したい。"
      };
    }
    if (reason === "crisis") {
      return {
        soft: "いまの文面だと、あなたの安全が一番大事に見えます。ひとりで抱えないで、今すぐ信頼できる人か、地域の相談窓口/医療に繋がってほしい。もし差し支えなければ「いま一人？」「安全な場所にいる？」だけ教えて。",
        short: "安全が最優先。今すぐ身近な人/相談窓口に繋がって。いま一人？安全な場所？"
      };
    }

    const goal = state.goal;
    const topic = state.topic;

    const opener =
      goal === "listen"
        ? "話してくれてありがとう。まず、しんどかったよね。"
        : "話してくれてありがとう。状況整理しつつ、次の一手を一緒に考えるね。";

    const caution =
      (topic === "health" && state.urgency_health === "red")
        ? "文面だけだと判断しきれないけど、受診レベルの可能性もあるから無理せず医療に繋ぐのが安全。"
        : (topic === "sensitive" && state.urgency_sensitive === "red")
        ? "無理や痛みがあるなら“気持ちよさ”以前に、いったん止めて安全確保が最優先。"
        : "";

    const ask =
      goal === "listen"
        ? "今は、解決策より「聞いてほしい」感じ？それとも「どうしたらいいか」も欲しい？"
        : "まず確認したい。いま一番困ってるのは、どの部分？（出来事/気持ち/相手の反応 どれが大きい？）";

    const soft = [
      opener,
      caution && (" " + caution),
      "",
      "よかったら、これだけ教えて。",
      "・いま一番つらいのは「出来事」？それとも「気持ち」？",
      "・どうなったら少し楽になる？（理想のゴール）",
      ask
    ].filter(Boolean).join("\n");

    const short = [
      "ありがとう。まず状況整理させて。",
      caution && ("※" + caution),
      "いま一番つらいのは「出来事/気持ち」どっち？",
      "今日は聞いてほしい日？方針ほしい日？"
    ].filter(Boolean).join("\n");

    return { soft, short };
  };

  const buildPrompt = (reason, nextQs) => {
    const topic = labelOf("topic", state.topic);
    const goal = labelOf("goal", state.goal);
    const tone = labelOf("tone", state.tone);
    const msg = (state.message || "").trim();

    return [
      "あなたは女性向け相談対応のプロのカウンセラー兼コミュニケーションコーチ。",
      "目的：相手の温度感（共感 or 方針）を外さず、安心感と具体性のある返信文を作る。",
      "",
      "【前提】",
      `- ジャンル: ${topic}`,
      `- 相手の求め: ${goal}`,
      `- 返信トーン: ${tone}`,
      `- 終了理由: ${reason}`,
      "",
      "【相手の文面（要約/原文）】",
      msg || "（未入力）",
      "",
      "【次に確認すべき質問（優先順）】",
      nextQs.map(q => "- " + q).join("\n"),
      "",
      "【出力して】",
      "1) まず一言の共感（短い）",
      "2) 相手を責めない状況整理（2〜3行）",
      "3) 次に聞く質問を2つ（多すぎない）",
      "4) 返信文を3パターン：優しめ/普通/短め",
      "",
      "禁止：断定診断、説教、性的同意が曖昧なときの踏み込み、医療の決めつけ"
    ].join("\n");
  };

  const resetAll = () => {
    history = [];
    state = {};
    currentId = tree.start;
    result.classList.add("hidden");
    qa.classList.remove("hidden");
    render();
  };

  backBtn.onclick = () => {
    if (!history.length) return;
    currentId = history.pop();
    render();
  };

  resetBtn.onclick = resetAll;
  restartBtn && (restartBtn.onclick = resetAll);

  copyAllBtn.onclick = async () => {
    const txt = [
      "【要約】",
      summaryEl.textContent,
      "",
      "【次に聞く質問】",
      nextQsEl.textContent,
      "",
      "【返信（優しめ）】",
      replySoftEl.textContent,
      "",
      "【返信（短め）】",
      replyShortEl.textContent,
      "",
      "【ChatGPTプロンプト】",
      promptEl.textContent
    ].join("\n");
    try {
      await navigator.clipboard.writeText(txt);
      copyAllBtn.textContent = "コピーした";
      setTimeout(() => (copyAllBtn.textContent = "全部コピー"), 1200);
    } catch {
      alert("クリップボード権限がないっぽい。手動でコピペして。");
    }
  };

  render();
})();
