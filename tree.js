window.DECISION_TREE = {
  start: "age",
  nodes: {
    age: {
      type: "single",
      question: "相談者は18歳以上？（不明なら“不明”）",
      options: [
        { label: "はい（18歳以上）", value: "adult", next: "topic" },
        { label: "いいえ/不明", value: "minor_unknown", next: "finish_minor" }
      ]
    },

    topic: {
      type: "single",
      question: "相談のジャンルは？",
      options: [
        { label: "恋愛/人間関係", value: "relationship", next: "goal" },
        { label: "体調/からだ", value: "health", next: "urgency_health" },
        { label: "メンタル/不安", value: "mental", next: "urgency_mental" },
        { label: "性（センシティブ）", value: "sensitive", next: "urgency_sensitive" },
        { label: "その他", value: "other", next: "goal" }
      ]
    },

    goal: {
      type: "single",
      question: "相手が一番求めてそうなのは？",
      options: [
        { label: "とにかく話を聞いてほしい（共感）", value: "listen", next: "tone" },
        { label: "アドバイスがほしい（方針）", value: "advice", next: "tone" },
        { label: "具体的な手順/プランがほしい", value: "plan", next: "tone" },
        { label: "よく分からない", value: "unknown", next: "tone" }
      ]
    },

    tone: {
      type: "single",
      question: "あなたの返答の雰囲気は？（普段のあなたでOK）",
      options: [
        { label: "やわらかく安心感", value: "soft", next: "context" },
        { label: "普通（丁寧だけど軽い）", value: "normal", next: "context" },
        { label: "短く要点だけ", value: "short", next: "context" }
      ]
    },

    context: {
      type: "text",
      question: "相手の文面を短く要約して貼って（コピペでもOK）",
      key: "message",
      next: "finish"
    },

    urgency_health: {
      type: "single",
      question: "体調系：強い痛み/出血/発熱/急激な悪化など、受診レベルの可能性は？",
      options: [
        { label: "ありそう", value: "red", next: "goal" },
        { label: "たぶんない", value: "green", next: "goal" }
      ]
    },

    urgency_mental: {
      type: "single",
      question: "メンタル系：自傷/希死念慮/危険行動っぽい匂いは？",
      options: [
        { label: "ありそう", value: "red", next: "finish_crisis" },
        { label: "たぶんない", value: "green", next: "goal" }
      ]
    },

    urgency_sensitive: {
      type: "single",
      question: "センシティブ：痛み/炎症/無理してる/同意が曖昧 みたいな要素は？",
      options: [
        { label: "ありそう", value: "red", next: "goal" },
        { label: "たぶんない", value: "green", next: "goal" }
      ]
    },

    finish_minor: { type: "finish", reason: "minor_unknown" },
    finish_crisis: { type: "finish", reason: "crisis" },
    finish: { type: "finish", reason: "normal" }
  }
};
